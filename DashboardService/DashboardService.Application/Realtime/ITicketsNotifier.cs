using DashboardService.Contracts.Tickets;

namespace DashboardService.Application.Realtime;

public interface ITicketsNotifier
{
    Task TicketCreatedAsync(TicketDto ticket, CancellationToken cancellationToken);

    Task TicketUpdatedAsync(TicketDto ticket, CancellationToken cancellationToken);
}
