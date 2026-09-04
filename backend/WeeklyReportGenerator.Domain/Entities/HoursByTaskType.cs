namespace WeeklyReportGenerator.Domain.Entities;

public class HoursByTaskType
{
    public Guid Id { get; set; }
    public Guid WeeklyReportId { get; set; }
    public WeeklyReport WeeklyReport { get; set; } = null!;

    public string TaskType { get; set; } = string.Empty;
    public decimal Hours { get; set; }
}