using WeeklyReportGenerator.Domain.Enums;

namespace WeeklyReportGenerator.Domain.Entities;

public class ReportTask
{
    public Guid Id { get; set; }
    public Guid WeeklyReportId { get; set; }
    public WeeklyReport WeeklyReport { get; set; } = null!;

    public string TaskName { get; set; } = string.Empty;
    public TaskPriority Priority { get; set; }
    public int PlannedPercentage { get; set; }
    public int ActualPercentage { get; set; }
    public ReportTaskStatus Status { get; set; }
    public decimal TimePlannedHours { get; set; }
    public decimal TimeSpentHours { get; set; }
    public string? Deliverable { get; set; }
}