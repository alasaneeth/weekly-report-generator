using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WeeklyReportGenerator.Application.Common.Interfaces;

namespace WeeklyReportGenerator.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var result = await _dashboardService.GetSummaryAsync();
        return Ok(result);
    }

    [HttpGet("charts")]
    public async Task<IActionResult> GetCharts()
    {
        var result = await _dashboardService.GetChartsAsync();
        return Ok(result);
    }
}
