namespace WillovateSmartSlot.Api.DTOs;

public sealed record LoginRequestDto(string Email, string Password, string? Role);

public sealed record AuthAccountDto(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    string Role,
    Guid? BusinessId,
    string? BusinessName,
    string? BusinessType);

public sealed record LoginResponseDto(string Token, AuthAccountDto Account);
