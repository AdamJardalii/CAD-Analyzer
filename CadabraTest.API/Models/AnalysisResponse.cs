using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CadabraTest.API.Models;

/// <summary>
/// Response model for CAD part analysis
/// </summary>
public class AnalysisResponse
{
    [Key]
    public Guid Id { get; set; }
    public Guid AnalysisId { get; set; }
    public string Status { get; set; } = "processing"; // processing, completed, failed
    public string UserId { get; set; } = default!;
    public PartMetadata? PartMetadata { get; set; }
    public AIAnalysis? AIAnalysis { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
}

/// <summary>
/// Part metadata extracted from CAD file
/// </summary>
public class PartMetadata
{
    public string FileName { get; set; } = string.Empty;
    public string PartName { get; set; } = string.Empty;
    public Dimensions? Dimensions { get; set; }
    public string? Material { get; set; }
    public double? Mass { get; set; }
    public double? Volume { get; set; }
    public Dictionary<string, string>? CustomProperties { get; set; }
}

/// <summary>
/// Part dimensions
/// </summary>
public class Dimensions
{
    public double Length { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }
    public string Units { get; set; } = "mm";
}

/// <summary>
/// AI-generated analysis of the part
/// </summary>
public class AIAnalysis
{
    public Guid Id { get; set; }
    public string Summary { get; set; } = string.Empty;
    public List<string> Insights { get; set; } = new();
    public List<string> Recommendations { get; set; } = new();
}

/// <summary>
/// Health check response
/// </summary>
public class HealthResponse
{
    public string Status { get; set; } = "healthy";
    public DateTime Timestamp { get; set; }
    public string Version { get; set; } = "1.0.0";
}

