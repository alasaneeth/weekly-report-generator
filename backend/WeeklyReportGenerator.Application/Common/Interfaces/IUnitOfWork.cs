using WeeklyReportGenerator.Application.Common.Interfaces.Repositories;
using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Application.Common.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<User> Users { get; }
    IRepository<Project> Projects { get; }
    IRefreshTokenRepository RefreshTokens { get; }
    IWeeklyReportRepository WeeklyReports { get; }

    Task<int> SaveChangesAsync();
}
