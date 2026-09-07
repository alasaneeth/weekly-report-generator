using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WeeklyReportGenerator.Domain.Entities;
using WeeklyReportGenerator.Domain.Enums;

namespace WeeklyReportGenerator.Infrastructure.Data;

public static class DbSeeder
{
    // Bootstraps the very first Manager account — needed because only Managers
    // can create new users, so at least one must exist before the app is usable.
    public static async Task SeedDefaultManagerAsync(AppDbContext context)
    {
        var managerExists = await context.Users.AnyAsync(u => u.Role == UserRole.Manager);
        if (managerExists)
            return;

        var hasher = new PasswordHasher<User>();

        var manager = new User
        {
            Id = Guid.NewGuid(),
            FirstName = "Admin",
            LastName = "Manager",
            Email = "admin@weeklyreport.com",
            Role = UserRole.Manager,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        manager.PasswordHash = hasher.HashPassword(manager, "Admin@12345");

        context.Users.Add(manager);
        await context.SaveChangesAsync();
    }
}