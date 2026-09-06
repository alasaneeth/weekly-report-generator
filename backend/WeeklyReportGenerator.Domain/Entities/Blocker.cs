namespace WeeklyReportGenerator.Domain.Entities;

public class Blocker
{
    public Guid Id { get; set; }
    public Guid WeeklyReportId { get; set; }
    public WeeklyReport WeeklyReport { get; set; } = null!;

    public string Description { get; set; } = string.Empty;
    public bool IsKeyIssue { get; set; }
}