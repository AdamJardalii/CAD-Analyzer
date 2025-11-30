using System.Text.Json;
using CadabraTest.API.Models;
namespace CadabraTest.API.Services;
public class CadProcessingService : ICadProcessingService
{
    private readonly ILogger<CadProcessingService> _logger;
    private readonly IConfiguration _configuration;

    public CadProcessingService(ILogger<CadProcessingService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task<PartMetadata> ExtractMetadataAsync(Stream fileStream, string fileName)
    {
        try
        {
            if (fileStream.CanSeek)
                fileStream.Position = 0;

            using var doc = await JsonDocument.ParseAsync(fileStream);
            var root = doc.RootElement;

            var metadata = MapJsonToPartMetadata(root);

            metadata.FileName = fileName;

            var jsonString = JsonSerializer.Serialize(metadata, new JsonSerializerOptions { WriteIndented = true });

            return metadata;
        }
        catch (JsonException ex)
        {
            throw new Exception("Invalid JSON format or missing fields.", ex);
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to extract metadata from CAD JSON.", ex);
        }
    }


    public static PartMetadata MapJsonToPartMetadata(JsonElement root)
    {
        var metadata = new PartMetadata
        {
            FileName = root.TryGetProperty("fileName", out var fn) ? fn.GetString() ?? "" : "",
            PartName = root.TryGetProperty("partName", out var pn) ? pn.GetString() ?? "" : "",
            Dimensions = new Dimensions(), 
            CustomProperties = new Dictionary<string, string>()
        };

        if (root.TryGetProperty("dimensions", out var dim))
        {
            metadata.Dimensions = new Dimensions
            {
                Length = dim.TryGetProperty("length", out var l) ? l.GetDouble() : 0,
                Width = dim.TryGetProperty("width", out var w) ? w.GetDouble() : 0,
                Height = dim.TryGetProperty("height", out var h) ? h.GetDouble() : 0,
                Units = dim.TryGetProperty("units", out var u) ? u.GetString() ?? "mm" : "mm"
            };
        }

        if (root.TryGetProperty("material", out var mat))
            metadata.Material = mat.TryGetProperty("name", out var name) ? name.GetString() ?? string.Empty : string.Empty;

        if (root.TryGetProperty("massProperties", out var mass))
        {
            metadata.Mass = mass.TryGetProperty("mass", out var m) ? m.GetDouble() : 0;
            metadata.Volume = mass.TryGetProperty("volume", out var v) ? v.GetDouble() : 0;
        }

        if (root.TryGetProperty("customProperties", out var customProps))
        {
            foreach (var prop in customProps.EnumerateObject())
                metadata.CustomProperties[prop.Name] = prop.Value.ToString() ?? string.Empty;
        }

        return metadata;
    }

}

