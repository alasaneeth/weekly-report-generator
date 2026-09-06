using WeeklyReportGenerator.Application.DTOs.Dashboard;

namespace WeeklyReportGenerator.Application.Common.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync();
    Task<DashboardChartsDto> GetChartsAsync();
}
