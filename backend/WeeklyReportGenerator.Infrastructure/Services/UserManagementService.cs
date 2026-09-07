using Microsoft.AspNetCore.Identity;
using WeeklyReportGenerator.Application.Common.Interfaces;
using WeeklyReportGenerator.Application.DTOs.Users;
using WeeklyReportGenerator.Domain.Entities;
using WeeklyReportGenerator.Domain.Enums;

namespace WeeklyReportGenerator.Infrastructure.Services;

public class UserManagementService : IUserManagementService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly PasswordHasher<User> _passwordHasher;

    public UserManagementService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<IEnumerable<UserSummaryDto>> GetAllAsync()
    {
        var users = await _unitOfWork.Users.GetAllAsync();
        return users.OrderBy(u => u.FirstName).Select(MapToDto);
    }

    public async Task<UserSummaryDto> CreateAsync(CreateUserDto dto, Guid createdBy)
    {
        var existing = await _unitOfWork.Users.FindAsync(u => u.Email == dto.Email);
        if (existing.Any())
            throw new InvalidOperationException("A user with this email already exists.");

        if (!Enum.TryParse<UserRole>(dto.Role, true, out var parsedRole))
            throw new InvalidOperationException("Invalid role specified.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Role = parsedRole,
            DateOfBirth = dto.DateOfBirth,
            Mobile = dto.Mobile,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<UserSummaryDto> UpdateAsync(Guid id, UpdateUserDto dto, Guid updatedBy)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("User not found.");

        var duplicate = await _unitOfWork.Users.FindAsync(u => u.Email == dto.Email && u.Id != id);
        if (duplicate.Any())
            throw new InvalidOperationException("Another user with this email already exists.");

        if (!Enum.TryParse<UserRole>(dto.Role, true, out var parsedRole))
            throw new InvalidOperationException("Invalid role specified.");

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Email = dto.Email;
        user.Role = parsedRole;
        user.IsActive = dto.IsActive;
        user.DateOfBirth = dto.DateOfBirth;
        user.Mobile = dto.Mobile;
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = updatedBy;

        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(user);
    }

    private static UserSummaryDto MapToDto(User user) => new()
    {
        Id = user.Id,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Email = user.Email,
        Role = user.Role.ToString(),
        IsActive = user.IsActive,
        DateOfBirth = user.DateOfBirth,
        Mobile = user.Mobile
    };
}
