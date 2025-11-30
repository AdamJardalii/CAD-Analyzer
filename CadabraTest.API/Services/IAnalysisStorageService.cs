using CadabraTest.API.Models;

namespace CadabraTest.API.Services;

public interface IAnalysisStorageService
{
    Task<AnalysisResponse> SaveAnalysisAsync(AnalysisResponse analysis);
    Task<AnalysisResponse?> GetAnalysisAsync(Guid analysisId);
    Task<bool> DeleteAnalysisAsync(Guid analysisId);
    Task<List<AnalysisResponse>> GetAllAnalysesAsync(string userId);
}

