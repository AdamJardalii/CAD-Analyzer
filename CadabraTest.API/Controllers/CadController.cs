using Microsoft.AspNetCore.Mvc;
using CadabraTest.API.Models;
using CadabraTest.API.Services;
using CadabraTest.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Text.Json;


namespace CadabraTest.API.Controllers;

[ApiController]
[Route("api/cad")]
public class CadController : ControllerBase
{
    private readonly ILogger<CadController> _logger;
    // TODO: Inject your services here
    private readonly ICadProcessingService _cadProcessingService;
    private readonly IAIAnalysisService _aiAnalysisService;
    private readonly IAnalysisStorageService _storageService;
    // private readonly IConfiguration _configuration;

    public CadController(ILogger<CadController> logger,ICadProcessingService CadProcessingService,IAIAnalysisService AIAnalysisService,IAnalysisStorageService AnalysisStorageService)
    {
        _logger = logger;
        _cadProcessingService = CadProcessingService;
        _aiAnalysisService = AIAnalysisService;
        _storageService = AnalysisStorageService;
    }


    [HttpPost("analyze")]
    [Authorize]
    [ProducesResponseType(typeof(AnalysisResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AnalyzePart(
        IFormFile? file,
        [FromForm] string? analysisType = "standard")
    {
        if (file == null || file.Length == 0){
            return BadRequest(new { 
                error = "No file uploaded", 
                message = "Please select a valid CAD JSON file to analyze." 
            });
        }
        var validator = new FileValidator(new FileValidationOptions());
        var result = validator.Validate(file);

        if (!result.IsValid){
            return BadRequest(new { 
                error = "Invalid file", 
                message = result.Error 
            }); 
        }
        try{       
            using var stream = file!.OpenReadStream();

            var partMetadata = await _cadProcessingService.ExtractMetadataAsync(stream, file.FileName);
            AIAnalysis? aiAnalysis;

            switch (analysisType?.ToLower())
            {
                case "standard":
                    aiAnalysis = await _aiAnalysisService.GenerateAnalysisAsync(partMetadata);
                    break;
                case "ai":
                    aiAnalysis = await _aiAnalysisService.GenerateAdvanceAnalysisAsync(partMetadata);
                    break;
                default:
                    return BadRequest(new { error = "Invalid analysis type" });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var analysisResponse = new AnalysisResponse
            {
                AnalysisId = Guid.NewGuid(),
                Status = "completed",
                PartMetadata = partMetadata,
                AIAnalysis = aiAnalysis,
                CreatedAt = DateTime.UtcNow,
                CompletedAt = DateTime.UtcNow,
                UserId = userId!
            };

            await _storageService.SaveAnalysisAsync(analysisResponse);

            return Ok(analysisResponse);
        }
        catch (JsonException ex)
        {
            return BadRequest(new 
            { 
                error = "Invalid JSON", 
                message = "The uploaded file is not a valid JSON document." 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new 
            { 
                error = "Server error", 
                message = "An unexpected error occurred while processing the file." ,
                detail = ex.Message,
                stackTrace = ex.StackTrace 
            });
        }
    }

    [HttpGet("analysis/{analysisId}")]
    [Authorize] 
    [ProducesResponseType(typeof(AnalysisResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAnalysis(Guid analysisId)
    {
        var analysis = await _storageService.GetAnalysisAsync(analysisId);

        if (analysis == null)
        {
            return NotFound(new { error = $"Analysis with ID {analysisId} not found." });
        }
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (analysis.UserId != userId)
            return Forbid(); 

        return Ok(analysis);
    }

    [HttpGet("all")]
    [Authorize]
    public async Task<IActionResult> GetAllAnalyses()
    {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();
        var analyses = await _storageService.GetAllAnalysesAsync(userId);
        return Ok(new
        {
            count = analyses.Count,
            items = analyses
        });
    }

    [HttpDelete("analysis/{analysisId}")]
    [Authorize] 
    [ProducesResponseType(typeof(AnalysisResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteAnalysis(Guid analysisId)
    {

        var analysis = await _storageService.GetAnalysisAsync(analysisId);

        if (analysis == null)
            return NotFound(new { error = "Analysis not found", analysisId });

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
            return Unauthorized();

        if (analysis.UserId != userId)
            return Forbid(); 

        var deleted = await _storageService.DeleteAnalysisAsync(analysisId);        

        return Ok(new { message = "Analysis deleted successfully", analysisId});
    }


    [HttpGet("health")]
    [ProducesResponseType(typeof(HealthResponse), StatusCodes.Status200OK)]
    public IActionResult HealthCheck()
    {
        
        return Ok(new HealthResponse
        {
            Status = "healthy",
            Timestamp = DateTime.UtcNow,
            Version = "1.0.0"
        });
    }
}

