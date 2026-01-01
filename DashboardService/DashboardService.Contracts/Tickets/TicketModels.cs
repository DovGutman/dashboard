namespace DashboardService.Contracts.Tickets;

public enum TicketPriority
{
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}

public enum TicketStatus
{
    Open = 0,
    InProgress = 1,
    Resolved = 2
}

public sealed record TicketDto(
    Guid Id,
    string Title,
    string Description,
    TicketPriority Priority,
    TicketStatus Status,
    string? AssignedAgentId,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt);

public sealed record CreateTicketRequest(
    string Title,
    string Description,
    TicketPriority Priority,
    string? AssignedAgentId);

public sealed record UpdateTicketStatusRequest(TicketStatus Status);

public sealed record AssignTicketRequest(string AssignedAgentId);

public sealed record TicketQuery(
    TicketStatus? Status,
    TicketPriority? Priority);
