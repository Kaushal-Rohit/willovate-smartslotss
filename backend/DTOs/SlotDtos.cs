namespace WillovateSmartSlot.Api.DTOs;

public sealed record OfferSlotDto(
    Guid Id,
    Guid BusinessId,
    Guid OfferId,
    DateOnly SlotDate,
    string StartTime,
    string EndTime,
    int Capacity,
    int BookedCount,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int RemainingSeats,
    int BookingPercentage);

public sealed record SlotCreateDto(
    Guid BusinessId,
    Guid OfferId,
    DateOnly SlotDate,
    string StartTime,
    string EndTime,
    int Capacity,
    int? BookedCount,
    string? Status);

public sealed record SlotUpdateDto(
    DateOnly SlotDate,
    string StartTime,
    string EndTime,
    int Capacity,
    int? BookedCount,
    string Status);
