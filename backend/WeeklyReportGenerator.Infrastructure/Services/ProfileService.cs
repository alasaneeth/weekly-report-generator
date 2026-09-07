using WeeklyReportGenerator.Application.Common.Interfaces;
using WeeklyReportGenerator.Application.DTOs.Users;
using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Infrastructure.Services;

public class ProfileService : IProfileService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProfileService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<ProfileDto> GetMyProfileAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        return MapToDto(user);
    }

    public async Task<ProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FirstName) || string.IsNullOrWhiteSpace(dto.LastName))
            throw new InvalidOperationException("First name and last name cannot be empty.");

        var user = await _unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.DateOfBirth = dto.DateOfBirth;
        user.Mobile = dto.Mobile;
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = userId;

        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(user);
    }

    private static ProfileDto MapToDto(User user) => new()
    {
        Id = user.Id,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Email = user.Email,
        Role = user.Role.ToString(),
        DateOfBirth = user.DateOfBirth,
        Mobile = user.Mobile
    };
}
