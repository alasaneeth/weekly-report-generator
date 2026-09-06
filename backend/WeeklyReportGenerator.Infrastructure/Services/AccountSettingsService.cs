using Microsoft.AspNetCore.Identity;
using WeeklyReportGenerator.Application.Common.Interfaces;
using WeeklyReportGenerator.Application.DTOs.Users;
using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Infrastructure.Services;

public class AccountSettingsService : IAccountSettingsService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly PasswordHasher<User> _passwordHasher;

    public AccountSettingsService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");

        var verification = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.CurrentPassword);
        if (verification == PasswordVerificationResult.Failed)
            throw new InvalidOperationException("Current password is incorrect.");

        if (string.IsNullOrWhiteSpace(dto.NewPassword) || dto.NewPassword.Length < 6)
            throw new InvalidOperationException("New password must be at least 6 characters.");

        user.PasswordHash = _passwordHasher.HashPassword(user, dto.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = userId;

        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();
    }
}
