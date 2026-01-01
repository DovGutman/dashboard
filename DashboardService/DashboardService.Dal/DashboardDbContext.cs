using DashboardService.Dal.Entities;
using Microsoft.EntityFrameworkCore;

namespace DashboardService.Dal;

public sealed class DashboardDbContext(DbContextOptions<DashboardDbContext> options) : DbContext(options)
{
    public DbSet<TicketEntity> Tickets => Set<TicketEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var tickets = modelBuilder.Entity<TicketEntity>();

        tickets.HasKey(x => x.Id);

        tickets.Property(x => x.Title)
            .HasMaxLength(200)
            .IsRequired();

        tickets.Property(x => x.Description)
            .HasMaxLength(4000)
            .IsRequired();

        tickets.Property(x => x.AssignedAgentId)
            .HasMaxLength(100);

        tickets.Property(x => x.Priority)
            .HasConversion<int>()
            .IsRequired();

        tickets.Property(x => x.Status)
            .HasConversion<int>()
            .IsRequired();

        tickets.Property(x => x.CreatedAt)
            .IsRequired();

        tickets.Property(x => x.UpdatedAt)
            .IsRequired();

        tickets.HasIndex(x => x.Status);
        tickets.HasIndex(x => x.Priority);

        base.OnModelCreating(modelBuilder);
    }
}
