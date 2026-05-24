using System.Text.Json;
using WillovateSmartSlot.Api.Models;

namespace WillovateSmartSlot.Api.DTOs;

public static class DtoMapping
{
    public static string FormatBusinessType(BusinessType type) => type switch
    {
        BusinessType.MassageSpa => "Massage/Spa",
        BusinessType.GamingZone => "Gaming Zone",
        BusinessType.ActivityCenter => "Activity Center",
        _ => type.ToString()
    };

    public static BusinessType ParseBusinessType(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return BusinessType.Other;
        }

        var normalized = value.Replace("/", string.Empty).Replace(" ", string.Empty);
        return Enum.TryParse<BusinessType>(normalized, ignoreCase: true, out var parsed)
            ? parsed
            : BusinessType.Other;
    }

    public static BusinessDto ToDto(this Business business) => new(
        business.Id,
        business.Name,
        FormatBusinessType(business.BusinessType),
        business.OwnerName,
        business.Phone,
        business.Email,
        business.Address,
        business.City,
        business.OpeningTime,
        business.ClosingTime,
        business.LogoUrl,
        business.CreatedAt);

    public static AuthAccountDto ToAuthDto(this User user) => new(
        user.Id,
        user.Name,
        user.Email,
        user.Phone,
        user.Role.ToString(),
        user.BusinessId,
        user.Business?.Name,
        user.Business is null ? null : FormatBusinessType(user.Business.BusinessType));

    public static OfferDto ToDto(this Offer offer)
    {
        var totalCapacity = offer.Slots.Any() ? offer.Slots.Sum(slot => slot.Capacity) : offer.TotalCapacity;
        var bookedSeats = offer.Slots.Sum(slot => slot.BookedCount);
        var slotCount = offer.Slots.Count;

        return new OfferDto(
            offer.Id,
            offer.BusinessId,
            offer.Title,
            offer.Description,
            offer.Category,
            offer.OriginalPrice,
            offer.OfferPrice,
            offer.DiscountPercentage,
            offer.StartDate,
            offer.EndDate,
            offer.StartTime,
            offer.EndTime,
            offer.TotalCapacity,
            offer.MaxBookingPerCustomer,
            offer.TermsAndConditions,
            offer.Status.ToString(),
            offer.ImageUrl,
            offer.ThumbnailUrl,
            ToAmbientDto(offer),
            offer.CreatedAt,
            offer.UpdatedAt,
            offer.Popularity,
            slotCount,
            bookedSeats,
            Math.Max(totalCapacity - bookedSeats, 0));
    }

    public static OfferSlotDto ToDto(this OfferSlot slot)
    {
        var remaining = Math.Max(slot.Capacity - slot.BookedCount, 0);
        var bookingPercentage = slot.Capacity > 0 ? (int)Math.Round((slot.BookedCount / (double)slot.Capacity) * 100) : 0;

        return new OfferSlotDto(
            slot.Id,
            slot.BusinessId,
            slot.OfferId,
            slot.SlotDate,
            slot.StartTime,
            slot.EndTime,
            slot.Capacity,
            slot.BookedCount,
            slot.Status.ToString(),
            slot.CreatedAt,
            slot.UpdatedAt,
            remaining,
            bookingPercentage);
    }

    public static BookingDto ToDto(this Booking booking) => new(
        booking.Id,
        booking.BusinessId,
        booking.OfferId,
        booking.Offer?.Title ?? string.Empty,
        booking.CustomerId,
        booking.CustomerName,
        booking.CustomerPhone,
        booking.CustomerEmail,
        booking.SlotId,
        booking.ConfirmationCode,
        booking.Status.ToString(),
        booking.PaymentStatus.ToString(),
        booking.CreatedAt,
        booking.SlotLabel,
        booking.People,
        booking.Amount,
        booking.SpecialNote,
        ParseTimeline(booking.TimelineJson));

    public static int CalculateDiscount(decimal originalPrice, decimal offerPrice)
    {
        if (originalPrice <= 0 || offerPrice <= 0 || offerPrice >= originalPrice)
        {
            return 0;
        }

        return (int)Math.Round(((originalPrice - offerPrice) / originalPrice) * 100, MidpointRounding.AwayFromZero);
    }

    public static string Timeline(params BookingTimelineEventDto[] events) =>
        JsonSerializer.Serialize(events);

    private static AmbientAssetDto? ToAmbientDto(Offer offer)
    {
        if (string.IsNullOrWhiteSpace(offer.AmbientAssetUrl))
        {
            return null;
        }

        return new AmbientAssetDto(
            offer.AmbientAssetUrl,
            offer.AmbientAssetName ?? "Uploaded ambient asset",
            offer.AmbientAssetType ?? "image",
            offer.AmbientAssetSize ?? 0,
            offer.AmbientAssetUploadedAt ?? offer.UpdatedAt);
    }

    private static IReadOnlyList<BookingTimelineEventDto> ParseTimeline(string timelineJson)
    {
        if (string.IsNullOrWhiteSpace(timelineJson))
        {
            return Array.Empty<BookingTimelineEventDto>();
        }

        try
        {
            return JsonSerializer.Deserialize<List<BookingTimelineEventDto>>(timelineJson) ?? Array.Empty<BookingTimelineEventDto>();
        }
        catch
        {
            return Array.Empty<BookingTimelineEventDto>();
        }
    }
}
