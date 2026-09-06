namespace WeeklyReportGenerator.Application.DTOs.Reports;

public class WeeklyReportResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid? ProjectId { get; set; }
    public string? ProjectName { get; set; }

    public DateTime WeekStartDate { get; set; }
    public DateTime WeekEndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ManagerComment { get; set; }

    public DateTime? SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? Notes { get; set; }
    public string? Links { get; set; }

    public List<ReportTaskDto> Tasks { get; set; } = new();
    public List<NextWeekTaskDto> NextWeekTasks { get; set; } = new();
    public List<BlockerDto> Blockers { get; set; } = new();
    public List<AchievementDto> Achievements { get; set; } = new();
    public List<HoursByTaskTypeDto> HoursByTaskTypes { get; set; } = new();
}

public class WeeklyReportSummaryDto
{
    public Guid Id { get; set; }
    public DateTime WeekStartDate { get; set; }
    public DateTime WeekEndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ProjectName { get; set; }
}