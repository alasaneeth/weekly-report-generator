using WeeklyReportGenerator.Application.DTOs.Users;

namespace WeeklyReportGenerator.Application.Common.Interfaces;

public interface IAccountSettingsService
{
    Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto);
}
