using DashboardService.Dal.Models;

namespace DashboardService.Dal.Entities;

public sealed class TicketEntity
{
    public Guid Id { get; set; }

    public required string Title { get; set; }

    public required string Description { get; set; }

    public TicketPriority Priority { get; set; }

    public TicketStatus Status { get; set; }

    public string? AssignedAgentId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }
}
