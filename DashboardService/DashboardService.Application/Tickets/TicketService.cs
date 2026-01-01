using DashboardService.Application.Realtime;
using DashboardService.Contracts.Tickets;
using DashboardService.Dal;
using DashboardService.Dal.Entities;
using Microsoft.EntityFrameworkCore;

namespace DashboardService.Application.Tickets;

public sealed class TicketService(DashboardDbContext db, ITicketsNotifier notifier) : ITicketService
{
    public async Task<TicketDto> CreateAsync(CreateTicketRequest request, CancellationToken cancellationToken)
    {
        var now = DateTimeOffset.UtcNow;

        var entity = new TicketEntity
        {
            Id = Guid.NewGuid(),
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Priority = MapPriority(request.Priority),
            Status = DashboardService.Dal.Models.TicketStatus.Open,
            AssignedAgentId = string.IsNullOrWhiteSpace(request.AssignedAgentId) ? null : request.AssignedAgentId.Trim(),
            CreatedAt = now,
            UpdatedAt = now
        };

        db.Tickets.Add(entity);
        await db.SaveChangesAsync(cancellationToken);

        var dto = ToDto(entity);
        await notifier.TicketCreatedAsync(dto, cancellationToken);

        return dto;
    }

    public async Task<IReadOnlyList<TicketDto>> GetAllAsync(TicketQuery query, CancellationToken cancellationToken)
    {
        IQueryable<TicketEntity> q = db.Tickets.AsNoTracking();

        if (query.Status is not null)
            q = q.Where(x => x.Status == MapStatus(query.Status.Value));

        if (query.Priority is not null)
            q = q.Where(x => x.Priority == MapPriority(query.Priority.Value));

        var items = await q
            .OrderByDescending(x => x.UpdatedAt)
            .ThenByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);

        return items.Select(ToDto).ToList();
    }

    public async Task<TicketDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await db.Tickets.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        return entity is null ? null : ToDto(entity);
    }

    public async Task<TicketDto?> UpdateStatusAsync(Guid id, UpdateTicketStatusRequest request, CancellationToken cancellationToken)
    {
        var entity = await db.Tickets.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (entity is null)
            return null;

        entity.Status = MapStatus(request.Status);
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        var dto = ToDto(entity);
        await notifier.TicketUpdatedAsync(dto, cancellationToken);

        return dto;
    }

    public async Task<TicketDto?> AssignAsync(Guid id, AssignTicketRequest request, CancellationToken cancellationToken)
    {
        var entity = await db.Tickets.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (entity is null)
            return null;

        entity.AssignedAgentId = request.AssignedAgentId.Trim();
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        await db.SaveChangesAsync(cancellationToken);

        var dto = ToDto(entity);
        await notifier.TicketUpdatedAsync(dto, cancellationToken);

        return dto;
    }

    private static TicketDto ToDto(TicketEntity entity)
        => new(
            entity.Id,
            entity.Title,
            entity.Description,
            MapPriority(entity.Priority),
            MapStatus(entity.Status),
            entity.AssignedAgentId,
            entity.CreatedAt,
            entity.UpdatedAt);

    private static DashboardService.Dal.Models.TicketPriority MapPriority(TicketPriority priority)
        => priority switch
        {
            TicketPriority.Low => DashboardService.Dal.Models.TicketPriority.Low,
            TicketPriority.Medium => DashboardService.Dal.Models.TicketPriority.Medium,
            TicketPriority.High => DashboardService.Dal.Models.TicketPriority.High,
            TicketPriority.Critical => DashboardService.Dal.Models.TicketPriority.Critical,
            _ => throw new ArgumentOutOfRangeException(nameof(priority), priority, null)
        };

    private static TicketPriority MapPriority(DashboardService.Dal.Models.TicketPriority priority)
        => priority switch
        {
            DashboardService.Dal.Models.TicketPriority.Low => TicketPriority.Low,
            DashboardService.Dal.Models.TicketPriority.Medium => TicketPriority.Medium,
            DashboardService.Dal.Models.TicketPriority.High => TicketPriority.High,
            DashboardService.Dal.Models.TicketPriority.Critical => TicketPriority.Critical,
            _ => throw new ArgumentOutOfRangeException(nameof(priority), priority, null)
        };

    private static DashboardService.Dal.Models.TicketStatus MapStatus(TicketStatus status)
        => status switch
        {
            TicketStatus.Open => DashboardService.Dal.Models.TicketStatus.Open,
            TicketStatus.InProgress => DashboardService.Dal.Models.TicketStatus.InProgress,
            TicketStatus.Resolved => DashboardService.Dal.Models.TicketStatus.Resolved,
            _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
        };

    private static TicketStatus MapStatus(DashboardService.Dal.Models.TicketStatus status)
        => status switch
        {
            DashboardService.Dal.Models.TicketStatus.Open => TicketStatus.Open,
            DashboardService.Dal.Models.TicketStatus.InProgress => TicketStatus.InProgress,
            DashboardService.Dal.Models.TicketStatus.Resolved => TicketStatus.Resolved,
            _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
        };
}
