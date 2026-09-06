using WeeklyReportGenerator.Application.Common.Interfaces;
using WeeklyReportGenerator.Application.DTOs.Projects;
using WeeklyReportGenerator.Domain.Entities;

namespace WeeklyReportGenerator.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProjectService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<ProjectDto>> GetAllAsync()
    {
        var projects = await _unitOfWork.Projects.GetAllAsync();
        return projects
            .OrderBy(p => p.Name)
            .Select(MapToDto);
    }

    public async Task<ProjectDto> GetByIdAsync(Guid id)
    {
        var project = await _unitOfWork.Projects.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Project not found.");
        return MapToDto(project);
    }

    public async Task<ProjectDto> CreateAsync(SaveProjectDto dto, Guid createdBy)
    {
        var existing = await _unitOfWork.Projects.FindAsync(p => p.Name == dto.Name);
        if (existing.Any())
            throw new InvalidOperationException("A project with this name already exists.");

        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            IsActive = dto.IsActive,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };

        await _unitOfWork.Projects.AddAsync(project);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(project);
    }

    public async Task<ProjectDto> UpdateAsync(Guid id, SaveProjectDto dto, Guid updatedBy)
    {
        var project = await _unitOfWork.Projects.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Project not found.");

        var duplicate = await _unitOfWork.Projects.FindAsync(p => p.Name == dto.Name && p.Id != id);
        if (duplicate.Any())
            throw new InvalidOperationException("A project with this name already exists.");

        project.Name = dto.Name;
        project.Description = dto.Description;
        project.IsActive = dto.IsActive;
        project.UpdatedAt = DateTime.UtcNow;
        project.UpdatedBy = updatedBy;

        _unitOfWork.Projects.Update(project);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(project);
    }

    public async Task DeleteAsync(Guid id, Guid deletedBy)
    {
        var project = await _unitOfWork.Projects.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Project not found.");

        // Soft delete — preserves history for any reports already linked to this project
        project.IsDeleted = true;
        project.UpdatedAt = DateTime.UtcNow;
        project.UpdatedBy = deletedBy;

        _unitOfWork.Projects.Update(project);
        await _unitOfWork.SaveChangesAsync();
    }

    private static ProjectDto MapToDto(Project project) => new()
    {
        Id = project.Id,
        Name = project.Name,
        Description = project.Description,
        IsActive = project.IsActive
    };
}
