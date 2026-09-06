using Microsoft.EntityFrameworkCore;
using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<WeeklyReport> WeeklyReports => Set<WeeklyReport>();
    public DbSet<ReportTask> ReportTasks => Set<ReportTask>();
    public DbSet<NextWeekTask> NextWeekTasks => Set<NextWeekTask>();
    public DbSet<Blocker> Blockers => Set<Blocker>();
    public DbSet<Achievement> Achievements => Set<Achievement>();
    public DbSet<HoursByTaskType> HoursByTaskTypes => Set<HoursByTaskType>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}