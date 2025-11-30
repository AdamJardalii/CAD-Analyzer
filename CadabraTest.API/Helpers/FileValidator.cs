using CadabraTest.API.Helpers;

namespace CadabraTest.API.Helpers;

public class FileValidator
{
    private readonly FileValidationOptions _options;

    public FileValidator(FileValidationOptions options)
    {
        _options = options;
    }

    public (bool IsValid, string? Error) Validate(IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return (false, "No file uploaded.");

        if (file.Length > _options.MaxSize)
            return (false, $"File too large. Max allowed size: {_options.MaxSize / (1024 * 1024)}MB.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_options.AllowedExtensions.Contains(ext))
            return (false, "Only .json and .csv files are allowed.");

        if (!_options.AllowedMimeTypes.Contains(file.ContentType))
            return (false, "Invalid file MIME type. Only JSON or CSV allowed.");

        return (true, null);
    }
}
