using Microsoft.EntityFrameworkCore;
using WeeklyReportGenerator.Application.Common.Interfaces.Repositories;
using WeeklyReportGenerator.Domain.Entities;
using WeeklyReportGenerator.Infrastructure.Data;

namespace WeeklyReportGenerator.Infrastructure.Repositories;

public class WeeklyReportRepository : IWeeklyReportRepository
{
    private readonly AppDbContext _context;

    public WeeklyReportRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<WeeklyReport?> GetByIdWithDetailsAsync(Guid id)
    {
        return await _context.WeeklyReports
            .Include(r => r.Tasks)
            .Include(r => r.NextWeekTasks)
            .Include(r => r.Blockers)
            .Include(r => r.Achievements)
            .Include(r => r.HoursByTaskTypes)
            .Include(r => r.User)
            .Include(r => r.Project)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<WeeklyReport?> GetByUserAndWeekAsync(Guid userId, DateTime weekStartDate)
    {
        return await _context.WeeklyReports
            .FirstOrDefaultAsync(r => r.UserId == userId && r.WeekStartDate == weekStartDate);
    }

    public async Task<IEnumerable<WeeklyReport>> GetByUserAsync(Guid userId)
    {
        return await _context.WeeklyReports
            .Include(r => r.Project)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.WeekStartDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<WeeklyReport>> GetAllAsync()
    {
        return await _context.WeeklyReports
            .Include(r => r.User)
            .Include(r => r.Project)
            .OrderByDescending(r => r.WeekStartDate)
            .ToListAsync();
    }

    public async Task AddAsync(WeeklyReport report) =>
        await _context.WeeklyReports.AddAsync(report);

    public void Update(WeeklyReport report) =>
        _context.WeeklyReports.Update(report);

    public void Delete(WeeklyReport report) =>
        _context.WeeklyReports.Remove(report);
}