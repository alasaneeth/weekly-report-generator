namespace WeeklyReportGenerator.Domain.Entities;

public class NextWeekTask
{
    public Guid Id { get; set; }
    public Guid WeeklyReportId { get; set; }
    public WeeklyReport WeeklyReport { get; set; } = null!;

    public string TaskName { get; set; } = string.Empty;
    public string? Description { get; set; }
}