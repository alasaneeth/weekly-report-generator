using WeeklyReportGenerator.Application.DTOs.Projects;

namespace WeeklyReportGenerator.Application.Common.Interfaces;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetAllAsync();
    Task<ProjectDto> GetByIdAsync(Guid id);
    Task<ProjectDto> CreateAsync(SaveProjectDto dto, Guid createdBy);
    Task<ProjectDto> UpdateAsync(Guid id, SaveProjectDto dto, Guid updatedBy);
    Task DeleteAsync(Guid id, Guid deletedBy);
}
