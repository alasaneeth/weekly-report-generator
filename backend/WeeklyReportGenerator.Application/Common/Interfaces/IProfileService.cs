using WeeklyReportGenerator.Application.DTOs.Users;

namespace WeeklyReportGenerator.Application.Common.Interfaces;

public interface IProfileService
{
    Task<ProfileDto> GetMyProfileAsync(Guid userId);
    Task<ProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto);
}
