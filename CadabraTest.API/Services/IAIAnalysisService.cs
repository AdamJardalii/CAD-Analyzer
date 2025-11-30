using CadabraTest.API.Models;

namespace CadabraTest.API.Services;

public interface IAIAnalysisService
{

    Task<AIAnalysis> GenerateAnalysisAsync(PartMetadata partMetadata);
    Task<AIAnalysis> GenerateAdvanceAnalysisAsync(PartMetadata partMetadata);
}

