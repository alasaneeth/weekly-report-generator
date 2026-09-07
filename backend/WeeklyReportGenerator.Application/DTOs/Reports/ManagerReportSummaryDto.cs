namespace WeeklyReportGenerator.Application.DTOs.Reports;

public class ManagerReportSummaryDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime WeekStartDate { get; set; }
    public DateTime WeekEndDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ProjectName { get; set; }
    public DateTime? SubmittedAt { get; set; }
}

public class RequestChangesDto
{
    public string Comment { get; set; } = string.Empty;
}
