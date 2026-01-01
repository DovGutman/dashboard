using Microsoft.AspNetCore.SignalR;

namespace DashboardService.Hubs;

public sealed class TicketsHub : Hub
{
    public const string HubPath = "/hubs/tickets";

    public static class Events
    {
        public const string TicketCreated = "tickets.created";
        public const string TicketUpdated = "tickets.updated";
    }
}
