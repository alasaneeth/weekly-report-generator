namespace WeeklyReportGenerator.Application.DTOs.Reports;

public class ReportTaskDto
{
    public string TaskName { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public int PlannedPercentage { get; set; }
    public int ActualPercentage { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal TimePlannedHours { get; set; }
    public decimal TimeSpentHours { get; set; }
    public string? Deliverable { get; set; }
}

public class NextWeekTaskDto
{
    public string TaskName { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class BlockerDto
{
    public string Description { get; set; } = string.Empty;
    public bool IsKeyIssue { get; set; }
}

public class AchievementDto
{
    public string Description { get; set; } = string.Empty;
    public bool IsKeyAchievement { get; set; }
}

public class HoursByTaskTypeDto
{
    public string TaskType { get; set; } = string.Empty;
    public decimal Hours { get; set; }
}

public class SaveWeeklyReportDto
{
    public Guid? ProjectId { get; set; }
    public DateTime WeekStartDate { get; set; }
    public DateTime WeekEndDate { get; set; }
    public string? Notes { get; set; }
    public string? Links { get; set; }

    public List<ReportTaskDto> Tasks { get; set; } = new();
    public List<NextWeekTaskDto> NextWeekTasks { get; set; } = new();
    public List<BlockerDto> Blockers { get; set; } = new();
    public List<AchievementDto> Achievements { get; set; } = new();
    public List<HoursByTaskTypeDto> HoursByTaskTypes { get; set; } = new();
}