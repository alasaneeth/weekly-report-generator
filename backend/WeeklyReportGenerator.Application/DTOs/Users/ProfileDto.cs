namespace WeeklyReportGenerator.Application.DTOs.Users;

public class ProfileDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class UpdateProfileDto
{
    public string Name { get; set; } = string.Empty;
}
