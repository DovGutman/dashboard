using DashboardService.Application.Realtime;
using DashboardService.Application.Tickets;
using DashboardService.Contracts.Tickets;
using DashboardService.Dal;
using DashboardService.Hubs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
        policy
            .SetIsOriginAllowed(_ => true)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

builder.Services.AddSignalR();

builder.Services.AddDbContext<DashboardDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DashboardDb")));

builder.Services.AddHealthChecks().AddDbContextCheck<DashboardDbContext>();

builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddSingleton<ITicketsNotifier, SignalRTicketsNotifier>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors("DevCors");

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHealthChecks("/health");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHub<TicketsHub>(TicketsHub.HubPath);

app.Run();
