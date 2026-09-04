using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Application.Common.Interfaces.Repositories;

public interface IWeeklyReportRepository
{
    Task<WeeklyReport?> GetByIdWithDetailsAsync(Guid id);
    Task<WeeklyReport?> GetByUserAndWeekAsync(Guid userId, DateTime weekStartDate);
    Task<IEnumerable<WeeklyReport>> GetByUserAsync(Guid userId);
    Task<IEnumerable<WeeklyReport>> GetAllAsync();
    Task AddAsync(WeeklyReport report);
    void Update(WeeklyReport report);
    void Delete(WeeklyReport report);
}