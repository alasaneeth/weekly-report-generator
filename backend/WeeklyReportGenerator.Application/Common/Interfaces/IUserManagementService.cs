using WeeklyReportGenerator.Application.DTOs.Users;

namespace WeeklyReportGenerator.Application.Common.Interfaces;

public interface IUserManagementService
{
    Task<IEnumerable<UserSummaryDto>> GetAllAsync();
    Task<UserSummaryDto> CreateAsync(CreateUserDto dto, Guid createdBy);
    Task<UserSummaryDto> UpdateAsync(Guid id, UpdateUserDto dto, Guid updatedBy);
}
