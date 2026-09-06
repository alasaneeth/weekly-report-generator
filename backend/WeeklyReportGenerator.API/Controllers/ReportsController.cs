using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeeklyReportGenerator.Application.Common.Interfaces;
using WeeklyReportGenerator.Application.DTOs.Reports;

namespace WeeklyReportGenerator.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IWeeklyReportService _reportService;

    public ReportsController(IWeeklyReportService reportService)
    {
        _reportService = reportService;
    }

    private Guid CurrentUserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private bool IsManager =>
        User.IsInRole("Manager");

    [HttpPost]
    public async Task<IActionResult> CreateDraft([FromBody] SaveWeeklyReportDto dto)
    {
        try
        {
            var result = await _reportService.CreateDraftAsync(CurrentUserId, dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (FormatException)
        {
            return BadRequest(new { message = "Invalid priority or status value provided." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] SaveWeeklyReportDto dto)
    {
        try
        {
            var result = await _reportService.UpdateAsync(CurrentUserId, id, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/submit")]
    public async Task<IActionResult> Submit(Guid id)
    {
        try
        {
            var result = await _reportService.SubmitAsync(CurrentUserId, id);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var result = await _reportService.GetByIdAsync(CurrentUserId, id, IsManager);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("mine")]
    public async Task<IActionResult> GetMyHistory()
    {
        var result = await _reportService.GetMyHistoryAsync(CurrentUserId);
        return Ok(result);
    }
}