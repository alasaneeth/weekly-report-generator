namespace WeeklyReportGenerator.Domain.Entities;

public class Achievement
{
    public Guid Id { get; set; }
    public Guid WeeklyReportId { get; set; }
    public WeeklyReport WeeklyReport { get; set; } = null!;

    public string Description { get; set; } = string.Empty;
    public bool IsKeyAchievement { get; set; }
}