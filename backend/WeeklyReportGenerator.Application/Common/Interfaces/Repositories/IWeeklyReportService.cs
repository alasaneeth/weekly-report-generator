using WeeklyReportGenerator.Application.DTOs.Reports;

namespace WeeklyReportGenerator.Application.Common.Interfaces;

public interface IWeeklyReportService
{
    Task<WeeklyReportResponseDto> CreateDraftAsync(Guid userId, SaveWeeklyReportDto dto);
    Task<WeeklyReportResponseDto> UpdateAsync(Guid userId, Guid reportId, SaveWeeklyReportDto dto);
    Task<WeeklyReportResponseDto> SubmitAsync(Guid userId, Guid reportId);
    Task<WeeklyReportResponseDto> GetByIdAsync(Guid userId, Guid reportId, bool isManager);
    Task<IEnumerable<WeeklyReportSummaryDto>> GetMyHistoryAsync(Guid userId);
}