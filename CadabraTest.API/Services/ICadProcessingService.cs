using CadabraTest.API.Models;

namespace CadabraTest.API.Services;

public interface ICadProcessingService
{
    Task<PartMetadata> ExtractMetadataAsync(Stream fileStream, string fileName);
}

