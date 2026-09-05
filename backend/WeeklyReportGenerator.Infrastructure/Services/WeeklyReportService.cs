using WeeklyReportGenerator.Application.Common.Interfaces;
using WeeklyReportGenerator.Application.DTOs.Reports;
using WeeklyReportGenerator.Domain.Entities;
using WeeklyReportGenerator.Domain.Enums;

namespace WeeklyReportGenerator.Infrastructure.Services;

public class WeeklyReportService : IWeeklyReportService
{
    private readonly IUnitOfWork _unitOfWork;

    public WeeklyReportService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<WeeklyReportResponseDto> CreateDraftAsync(Guid userId, SaveWeeklyReportDto dto)
    {
        var existing = await _unitOfWork.WeeklyReports.GetByUserAndWeekAsync(userId, dto.WeekStartDate);
        if (existing is not null)
            throw new InvalidOperationException("A report for this week already exists.");

        var report = new WeeklyReport
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ProjectId = dto.ProjectId,
            WeekStartDate = dto.WeekStartDate,
            WeekEndDate = dto.WeekEndDate,
            Notes = dto.Notes,
            Links = dto.Links,
            Status = ReportStatus.Draft,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = userId
        };

        MapChildCollections(report, dto);

        await _unitOfWork.WeeklyReports.AddAsync(report);
        await _unitOfWork.SaveChangesAsync();

        return await GetByIdAsync(userId, report.Id, isManager: false);
    }

    public async Task<WeeklyReportResponseDto> UpdateAsync(Guid userId, Guid reportId, SaveWeeklyReportDto dto)
    {
        var report = await _unitOfWork.WeeklyReports.GetByIdWithDetailsAsync(reportId)
            ?? throw new KeyNotFoundException("Report not found.");

        if (report.UserId != userId)
            throw new UnauthorizedAccessException("You can only edit your own reports.");

        if (report.Status != ReportStatus.Draft && report.Status != ReportStatus.NeedsCorrection)
            throw new InvalidOperationException("Only Draft or Needs Correction reports can be edited.");

        report.ProjectId = dto.ProjectId;
        report.WeekStartDate = dto.WeekStartDate;
        report.WeekEndDate = dto.WeekEndDate;
        report.Notes = dto.Notes;
        report.Links = dto.Links;
        report.UpdatedAt = DateTime.UtcNow;
        report.UpdatedBy = userId;

        report.Tasks.Clear();
        report.NextWeekTasks.Clear();
        report.Blockers.Clear();
        report.Achievements.Clear();
        report.HoursByTaskTypes.Clear();

        MapChildCollections(report, dto);

        _unitOfWork.WeeklyReports.Update(report);
        await _unitOfWork.SaveChangesAsync();

        return await GetByIdAsync(userId, reportId, isManager: false);
    }

    public async Task<WeeklyReportResponseDto> SubmitAsync(Guid userId, Guid reportId)
    {
        var report = await _unitOfWork.WeeklyReports.GetByIdWithDetailsAsync(reportId)
            ?? throw new KeyNotFoundException("Report not found.");

        if (report.UserId != userId)
            throw new UnauthorizedAccessException("You can only submit your own reports.");

        if (report.Status != ReportStatus.Draft && report.Status != ReportStatus.NeedsCorrection)
            throw new InvalidOperationException("Only Draft or Needs Correction reports can be submitted.");

        report.Status = ReportStatus.Submitted;
        report.SubmittedAt = DateTime.UtcNow;
        report.ManagerComment = null;

        _unitOfWork.WeeklyReports.Update(report);
        await _unitOfWork.SaveChangesAsync();

        return await GetByIdAsync(userId, reportId, isManager: false);
    }

    public async Task<WeeklyReportResponseDto> GetByIdAsync(Guid userId, Guid reportId, bool isManager)
    {
        var report = await _unitOfWork.WeeklyReports.GetByIdWithDetailsAsync(reportId)
            ?? throw new KeyNotFoundException("Report not found.");

        if (!isManager && report.UserId != userId)
            throw new UnauthorizedAccessException("You can only view your own reports.");

        return MapToResponseDto(report);
    }

    public async Task<IEnumerable<WeeklyReportSummaryDto>> GetMyHistoryAsync(Guid userId)
    {
        var reports = await _unitOfWork.WeeklyReports.GetByUserAsync(userId);

        return reports.Select(r => new WeeklyReportSummaryDto
        {
            Id = r.Id,
            WeekStartDate = r.WeekStartDate,
            WeekEndDate = r.WeekEndDate,
            Status = r.Status.ToString(),
            ProjectName = r.Project?.Name
        });
    }

    private static void MapChildCollections(WeeklyReport report, SaveWeeklyReportDto dto)
    {
        foreach (var t in dto.Tasks)
        {
            report.Tasks.Add(new ReportTask
            {
                Id = Guid.NewGuid(),
                WeeklyReportId = report.Id,
                TaskName = t.TaskName,
                Priority = Enum.Parse<TaskPriority>(t.Priority, true),
                PlannedPercentage = t.PlannedPercentage,
                ActualPercentage = t.ActualPercentage,
                Status = Enum.Parse<ReportTaskStatus>(t.Status, true),
                TimePlannedHours = t.TimePlannedHours,
                TimeSpentHours = t.TimeSpentHours,
                Deliverable = t.Deliverable
            });
        }

        foreach (var n in dto.NextWeekTasks)
        {
            report.NextWeekTasks.Add(new NextWeekTask
            {
                Id = Guid.NewGuid(),
                WeeklyReportId = report.Id,
                TaskName = n.TaskName,
                Description = n.Description
            });
        }

        foreach (var b in dto.Blockers)
        {
            report.Blockers.Add(new Blocker
            {
                Id = Guid.NewGuid(),
                WeeklyReportId = report.Id,
                Description = b.Description,
                IsKeyIssue = b.IsKeyIssue
            });
        }

        foreach (var a in dto.Achievements)
        {
            report.Achievements.Add(new Achievement
            {
                Id = Guid.NewGuid(),
                WeeklyReportId = report.Id,
                Description = a.Description,
                IsKeyAchievement = a.IsKeyAchievement
            });
        }

        foreach (var h in dto.HoursByTaskTypes)
        {
            report.HoursByTaskTypes.Add(new HoursByTaskType
            {
                Id = Guid.NewGuid(),
                WeeklyReportId = report.Id,
                TaskType = h.TaskType,
                Hours = h.Hours
            });
        }
    }

    private static WeeklyReportResponseDto MapToResponseDto(WeeklyReport report)
    {
        return new WeeklyReportResponseDto
        {
            Id = report.Id,
            UserId = report.UserId,
            UserName = report.User?.Name ?? string.Empty,
            ProjectId = report.ProjectId,
            ProjectName = report.Project?.Name,
            WeekStartDate = report.WeekStartDate,
            WeekEndDate = report.WeekEndDate,
            Status = report.Status.ToString(),
            ManagerComment = report.ManagerComment,
            SubmittedAt = report.SubmittedAt,
            ReviewedAt = report.ReviewedAt,
            Notes = report.Notes,
            Links = report.Links,
            Tasks = report.Tasks.Select(t => new ReportTaskDto
            {
                TaskName = t.TaskName,
                Priority = t.Priority.ToString(),
                PlannedPercentage = t.PlannedPercentage,
                ActualPercentage = t.ActualPercentage,
                Status = t.Status.ToString(),
                TimePlannedHours = t.TimePlannedHours,
                TimeSpentHours = t.TimeSpentHours,
                Deliverable = t.Deliverable
            }).ToList(),
            NextWeekTasks = report.NextWeekTasks.Select(n => new NextWeekTaskDto
            {
                TaskName = n.TaskName,
                Description = n.Description
            }).ToList(),
            Blockers = report.Blockers.Select(b => new BlockerDto
            {
                Description = b.Description,
                IsKeyIssue = b.IsKeyIssue
            }).ToList(),
            Achievements = report.Achievements.Select(a => new AchievementDto
            {
                Description = a.Description,
                IsKeyAchievement = a.IsKeyAchievement
            }).ToList(),
            HoursByTaskTypes = report.HoursByTaskTypes.Select(h => new HoursByTaskTypeDto
            {
                TaskType = h.TaskType,
                Hours = h.Hours
            }).ToList()
        };
    }
}