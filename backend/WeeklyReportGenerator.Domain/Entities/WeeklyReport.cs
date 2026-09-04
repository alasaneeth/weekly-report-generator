using WeeklyReportGenerator.Domain.Common;
using WeeklyReportGenerator.Domain.Enums;

namespace WeeklyReportGenerator.Domain.Entities;

public class WeeklyReport : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid? ProjectId { get; set; }
    public Project? Project { get; set; }

    public DateTime WeekStartDate { get; set; }
    public DateTime WeekEndDate { get; set; }

    public ReportStatus Status { get; set; } = ReportStatus.Draft;
    public string? ManagerComment { get; set; }

    public DateTime? SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }

    public string? Notes { get; set; }
    public string? Links { get; set; }

    public ICollection<ReportTask> Tasks { get; set; } = new List<ReportTask>();
    public ICollection<NextWeekTask> NextWeekTasks { get; set; } = new List<NextWeekTask>();
    public ICollection<Blocker> Blockers { get; set; } = new List<Blocker>();
    public ICollection<Achievement> Achievements { get; set; } = new List<Achievement>();
    public ICollection<HoursByTaskType> HoursByTaskTypes { get; set; } = new List<HoursByTaskType>();
}