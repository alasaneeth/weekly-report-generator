namespace WeeklyReportGenerator.Application.DTOs.Dashboard;

public class DashboardSummaryDto
{
    public int ReportsThisWeek { get; set; }
    public decimal ComplianceRatePercent { get; set; }
    public int NeedsCorrectionCount { get; set; }
    public int OpenBlockersCount { get; set; }
}

public class MemberStatusDto
{
    public string UserName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // includes "No Report"
}

public class ProjectWorkloadDto
{
    public string ProjectName { get; set; } = string.Empty;
    public int ReportCount { get; set; }
}

public class TaskTypeHoursDto
{
    public string TaskType { get; set; } = string.Empty;
    public decimal Hours { get; set; }
}

public class RecentActivityDto
{
    public string UserName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class DashboardChartsDto
{
    public List<MemberStatusDto> StatusByMember { get; set; } = new();
    public List<ProjectWorkloadDto> WorkloadByProject { get; set; } = new();
    public List<TaskTypeHoursDto> TimeByTaskType { get; set; } = new();
    public List<RecentActivityDto> RecentActivity { get; set; } = new();
}
