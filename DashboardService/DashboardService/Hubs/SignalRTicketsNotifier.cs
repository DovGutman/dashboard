using DashboardService.Application.Realtime;
using DashboardService.Contracts.Tickets;
using Microsoft.AspNetCore.SignalR;

namespace DashboardService.Hubs;

public sealed class SignalRTicketsNotifier(IHubContext<TicketsHub> hubContext) : ITicketsNotifier
{
    public Task TicketCreatedAsync(TicketDto ticket, CancellationToken cancellationToken)
        => hubContext.Clients.All.SendAsync(TicketsHub.Events.TicketCreated, ticket, cancellationToken);

    public Task TicketUpdatedAsync(TicketDto ticket, CancellationToken cancellationToken)
        => hubContext.Clients.All.SendAsync(TicketsHub.Events.TicketUpdated, ticket, cancellationToken);
}
