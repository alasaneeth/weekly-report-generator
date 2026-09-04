using WeeklyReportGenerator.Application.Common.Interfaces;
using WeeklyReportGenerator.Application.Common.Interfaces.Repositories;
using WeeklyReportGenerator.Domain.Entities;
using WeeklyReportGenerator.Infrastructure.Data;
using WeeklyReportGenerator.Infrastructure.Repositories;

namespace WeeklyReportGenerator.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IRepository<User>? _users;
    private IRefreshTokenRepository? _refreshTokens;
    private IWeeklyReportRepository? _weeklyReports;


    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IRepository<User> Users => _users ??= new Repository<User>(_context);
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