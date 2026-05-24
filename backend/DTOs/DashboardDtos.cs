namespace WillovateSmartSlot.Api.DTOs;

public sealed record DashboardMetricDto(string Label, decimal Value, string DisplayValue);

public sealed record DashboardSummaryDto(
    Guid BusinessId,
    string BusinessName,
    int TotalOffers,
    int ActiveOffers,
    int TotalBookings,
    int TodayBookings,
    decimal Revenue,
    int TotalCapacity,
    int BookedSeats,
    int AvailableSeats,
    int OccupancyPercentage,
    IReadOnlyList<OfferDto> ExpiringOffers,
    IReadOnlyList<BookingDto> RecentBookings,
    IReadOnlyList<DashboardMetricDto> CategoryAnalytics);
