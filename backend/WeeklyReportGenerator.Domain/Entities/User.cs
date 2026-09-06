using System.ComponentModel.DataAnnotations.Schema;
using WeeklyReportGenerator.Domain.Common;
using WeeklyReportGenerator.Domain.Enums;

namespace WeeklyReportGenerator.Domain.Entities;

public class User : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? DateOfBirth { get; set; }
    public string? Mobile { get; set; }

    [NotMapped]
    public string FullName => $"{FirstName} {LastName}".Trim();
}
