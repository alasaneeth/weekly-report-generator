using WeeklyReportGenerator.Application.Common.Interfaces;
using WeeklyReportGenerator.Application.Common.Interfaces.Repositories;
using WeeklyReportGenerator.Domain.Entities;
using WeeklyReportGenerator.Infrastructure.Data;

namespace WeeklyReportGenerator.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IRepository<User>? _users;
    private IRepository<Project>? _projects;
    private IRefreshTokenRepository? _refreshTokens;
    private IWeeklyReportRepository? _weeklyReports;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IRepository<User> Users => _users ??= new Repository<User>(_context);
    public IRepository<Project> Projects => _projects ??= new Repository<Project>(_context);
    public IRefreshTokenRepository RefreshTokens => _refreshTokens ??= new RefreshTokenRepository(_context);
    public IWeeklyReportRepository WeeklyReports => _weeklyReports ??= new WeeklyReportRepository(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
