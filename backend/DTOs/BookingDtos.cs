namespace WillovateSmartSlot.Api.DTOs;

public sealed record BookingTimelineEventDto(
    Guid Id,
    string Status,
    string Label,
    DateTime CreatedAt);

public sealed record BookingDto(
    Guid Id,
    Guid BusinessId,
    Guid OfferId,
    string OfferTitle,
    Guid? CustomerId,
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    Guid SlotId,
    string ConfirmationCode,
    string Status,
    string PaymentStatus,
    DateTime CreatedAt,
    string SlotLabel,
    int People,
    decimal Amount,
    string? SpecialNote,
    IReadOnlyList<BookingTimelineEventDto> Timeline);

public sealed record BookingCreateDto(
    Guid OfferId,
    Guid SlotId,
    Guid? CustomerId,
    string CustomerName,
    string CustomerPhone,
    string? CustomerEmail,
    int People,
    string? SpecialNote);

public sealed record BookingStatusUpdateDto(string Status);
