namespace DashboardService.Contracts.Tickets;

public interface ITicketService
{
    Task<TicketDto> CreateAsync(CreateTicketRequest request, CancellationToken cancellationToken);

    Task<IReadOnlyList<TicketDto>> GetAllAsync(TicketQuery query, CancellationToken cancellationToken);

    Task<TicketDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);

    Task<TicketDto?> UpdateStatusAsync(Guid id, UpdateTicketStatusRequest request, CancellationToken cancellationToken);

    Task<TicketDto?> AssignAsync(Guid id, AssignTicketRequest request, CancellationToken cancellationToken);
}
