using WeeklyReportGenerator.Domain.Entities;
using WeeklyReportGenerator.Domain.Enums;

namespace WeeklyReportGenerator.Application.Common.Interfaces.Repositories;

public interface IWeeklyReportRepository
{
    Task<WeeklyReport?> GetByIdWithDetailsAsync(Guid id);
    Task<WeeklyReport?> GetByUserAndWeekAsync(Guid userId, DateTime weekStartDate);
    Task<IEnumerable<WeeklyReport>> GetByUserAsync(Guid userId);
    Task<IEnumerable<WeeklyReport>> GetAllAsync();
    Task<IEnumerable<WeeklyReport>> GetFilteredAsync(Guid? userId, ReportStatus? status);
    Task AddAsync(WeeklyReport report);
    void Update(WeeklyReport report);
    void Delete(WeeklyReport report);
}
