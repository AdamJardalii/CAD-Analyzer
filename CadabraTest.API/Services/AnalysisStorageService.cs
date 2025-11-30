using CadabraTest.API.Models;
using CadabraTest.API.Data;
using Microsoft.EntityFrameworkCore;


namespace CadabraTest.API.Services;

public class AnalysisStorageService : IAnalysisStorageService
{
    private readonly ILogger<AnalysisStorageService> _logger;
    private readonly AppDbContext _dbContext;

    public AnalysisStorageService(ILogger<AnalysisStorageService> logger,AppDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    public async Task<AnalysisResponse> SaveAnalysisAsync(AnalysisResponse analysis)
    {
        if (!_dbContext.Analyses.Any(a => a.AnalysisId == analysis.AnalysisId))
        {
            analysis.Id = Guid.NewGuid();
            analysis.CreatedAt = DateTime.UtcNow;

            _dbContext.Analyses.Add(analysis);
            await _dbContext.SaveChangesAsync();
        }
        else
        {
            _dbContext.Analyses.Update(analysis);
            await _dbContext.SaveChangesAsync();
        }

        return analysis;
    }

    public async Task<AnalysisResponse?> GetAnalysisAsync(Guid analysisId)
    {
        return await _dbContext.Analyses
            .Include(a => a.AIAnalysis)
            .FirstOrDefaultAsync(a => a.AnalysisId == analysisId);
    }

    public async Task<bool> DeleteAnalysisAsync(Guid analysisId)
    {
        var analysis = await _dbContext.Analyses.FirstOrDefaultAsync(a => a.AnalysisId == analysisId);
        if (analysis == null) return false;

        _dbContext.Analyses.Remove(analysis);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<List<AnalysisResponse>> GetAllAnalysesAsync(string userId)
    {
        return await _dbContext.Analyses
            .Include(a => a.AIAnalysis)
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }
}
