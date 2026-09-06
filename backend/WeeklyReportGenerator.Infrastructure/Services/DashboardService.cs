using WeeklyReportGenerator.Application.Common.Interfaces;
using WeeklyReportGenerator.Application.DTOs.Dashboard;
using WeeklyReportGenerator.Domain.Enums;

namespace WeeklyReportGenerator.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public DashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    private static DateTime GetCurrentWeekStart()
    {
        var today = DateTime.UtcNow.Date;
        var diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
        return today.AddDays(-diff);
    }

    public async Task<DashboardSummaryDto> GetSummaryAsync()
    {
        var weekStart = GetCurrentWeekStart();
        var allReports = (await _unitOfWork.WeeklyReports.GetAllWithDetailsAsync()).ToList();

        var reportsThisWeek = allReports.Count(r =>
            r.WeekStartDate.Date == weekStart && r.Status != ReportStatus.Draft);

        var activeTeamMembers = (await _unitOfWork.Users.FindAsync(
            u => u.Role == UserRole.TeamMember && u.IsActive)).Count();

        var complianceRate = activeTeamMembers == 0
            ? 0
            : Math.Round((decimal)reportsThisWeek / activeTeamMembers * 100, 1);

        var needsCorrectionCount = allReports.Count(r => r.Status == ReportStatus.NeedsCorrection);

        var openBlockersCount = allReports
            .Where(r => r.Status == ReportStatus.Submitted || r.Status == ReportStatus.NeedsCorrection)
            .SelectMany(r => r.Blockers)
            .Count();

        return new DashboardSummaryDto
        {
            ReportsThisWeek = reportsThisWeek,
            ComplianceRatePercent = complianceRate,
            NeedsCorrectionCount = needsCorrectionCount,
            OpenBlockersCount = openBlockersCount
        };
    }

    public async Task<DashboardChartsDto> GetChartsAsync()
    {
        var weekStart = GetCurrentWeekStart();
        var allReports = (await _unitOfWork.WeeklyReports.GetAllWithDetailsAsync()).ToList();
        var teamMembers = (await _unitOfWork.Users.FindAsync(
            u => u.Role == UserRole.TeamMember && u.IsActive)).ToList();

        var thisWeekReports = allReports.Where(r => r.WeekStartDate.Date == weekStart).ToList();

        // Status by member (current week) — shows "No Report" for members who haven't submitted
        var statusByMember = teamMembers.Select(m =>
        {
            var report = thisWeekReports.FirstOrDefault(r => r.UserId == m.Id);
            return new MemberStatusDto
            {
                UserName = m.Name,
                Status = report?.Status.ToString() ?? "No Report"
            };
        }).ToList();

        // Workload by project (current week)
        var workloadByProject = thisWeekReports
            .GroupBy(r => r.Project?.Name ?? "Unassigned")
            .Select(g => new ProjectWorkloadDto { ProjectName = g.Key, ReportCount = g.Count() })
            .OrderByDescending(p => p.ReportCount)
            .ToList();

        // Time spent by task type (all-time, from the optional HoursByTaskType breakdown)
        var timeByTaskType = allReports
            .SelectMany(r => r.HoursByTaskTypes)
            .GroupBy(h => h.TaskType)
            .Select(g => new TaskTypeHoursDto { TaskType = g.Key, Hours = g.Sum(h => h.Hours) })
            .OrderByDescending(t => t.Hours)
            .ToList();

        // Recent activity — last 10 reports by most recent meaningful timestamp
        var recentActivity = allReports
            .OrderByDescending(r => r.ReviewedAt ?? r.SubmittedAt ?? r.UpdatedAt ?? r.CreatedAt)
            .Take(10)
            .Select(r => new RecentActivityDto
            {
                UserName = r.User?.Name ?? string.Empty,
                Status = r.Status.ToString(),
                Timestamp = r.ReviewedAt ?? r.SubmittedAt ?? r.UpdatedAt ?? r.CreatedAt
            })
            .ToList();

        return new DashboardChartsDto
        {
            StatusByMember = statusByMember,
            WorkloadByProject = workloadByProject,
            TimeByTaskType = timeByTaskType,
            RecentActivity = recentActivity
        };
    }
}
