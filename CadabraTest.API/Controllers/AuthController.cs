using Microsoft.AspNetCore.Mvc;
using CadabraTest.API.Services;
using Microsoft.EntityFrameworkCore;

namespace CadabraTest.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try{
            var user = await _authService.RegisterAsync(dto.Email, dto.Password,dto.UserName);
            return Ok(new { status = 201, message = "User registered successfully.",user.Id, user.Email });
        }
         catch (DbUpdateException dbEx) when (dbEx.InnerException != null &&
        dbEx.InnerException.Message.Contains("duplicate key value"))
    {
        return Conflict(new
        {
            status = 409,
            error = "Email already exists",
            message = "A user with this email already exists. Please use another email."
        });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new
        {
            status = 500,
            error = "Server error",
            message = ex.Message
        });
    }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
            var token = await _authService.LoginAsync(dto.Email, dto.Password);
            if (token == null) {
                return Unauthorized(new { status = 401,error = "Invalid credentials",  message = "Invalid email or password. Please try again." });
            }
            return Ok(new {status = 200,token,  message = "Login successful! Welcome back." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 500,
                error = "Server error",
                        message = ex.Message,                  // main exception message
        exceptionType = ex.GetType().Name,     // type of exception
        innerException = ex.InnerException?.Message, // optional inner exception
        stackTrace = ex.StackTrace 
            });
        }
    }
}


public record RegisterDto(string Email, string Password,string UserName);
public record LoginDto(string Email, string Password);
