using Microsoft.AspNetCore.Mvc;
using WillovateSmartSlot.Api.DTOs;
using WillovateSmartSlot.Api.Services;

namespace WillovateSmartSlot.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        var user = await authService.ValidateAsync(request.Email, request.Password, request.Role);
        if (user is null)
        {
            return Unauthorized(new { message = "Invalid email, password, or login role." });
        }

        return Ok(new LoginResponseDto(authService.CreateDemoToken(user), user.ToAuthDto()));
    }
}
