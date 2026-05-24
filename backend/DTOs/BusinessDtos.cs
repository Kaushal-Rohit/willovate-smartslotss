namespace WillovateSmartSlot.Api.DTOs;

public sealed record BusinessDto(
    Guid Id,
    string Name,
    string BusinessType,
    string OwnerName,
    string Phone,
    string Email,
    string Address,
    string City,
    string OpeningTime,
    string ClosingTime,
    string? LogoUrl,
    DateTime CreatedAt);

public sealed record BusinessUpsertDto(
    string Name,
    string BusinessType,
    string OwnerName,
    string Phone,
    string Email,
    string Address,
    string City,
    string OpeningTime,
    string ClosingTime,
    string? LogoUrl);
