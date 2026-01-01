using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace DashboardService.Dal;

public sealed class DashboardDbContextFactory : IDesignTimeDbContextFactory<DashboardDbContext>
{
    public DashboardDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("DASHBOARDDB_CONNECTION")
            ?? "Host=localhost;Port=5432;Database=dashboard;Username=postgres;Password=postgres";

        var optionsBuilder = new DbContextOptionsBuilder<DashboardDbContext>()
            .UseNpgsql(connectionString);

        return new DashboardDbContext(optionsBuilder.Options);
    }
}
