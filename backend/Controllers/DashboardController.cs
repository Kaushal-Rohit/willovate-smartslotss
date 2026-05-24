using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WillovateSmartSlot.Api.Data;
using WillovateSmartSlot.Api.DTOs;
using WillovateSmartSlot.Api.Models;

namespace WillovateSmartSlot.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public sealed class DashboardController(AppDbContext db) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary([FromQuery] Guid businessId)
    {
        var business = await db.Businesses.FindAsync(businessId);
        if (business is null)
        {
            return NotFound(new { message = "Business was not found." });
        }

        var today = DateTime.UtcNow.Date;
        var offers = await db.Offers
            .Include(offer => offer.Slots)
            .Where(offer => offer.BusinessId == businessId)
            .ToListAsync();
        var bookings = await db.Bookings
            .Include(booking => booking.Offer)
            .Where(booking => booking.BusinessId == businessId)
            .OrderByDescending(booking => booking.CreatedAt)
            .ToListAsync();
        var slots = await db.OfferSlots
            .Where(slot => slot.BusinessId == businessId)
            .ToListAsync();

        var activeOffers = offers.Count(offer => offer.Status == OfferStatus.Active);
        var confirmedBookings = bookings.Where(booking => booking.Status is BookingStatus.Confirmed or BookingStatus.Completed).ToList();
        var revenue = confirmedBookings.Sum(booking => booking.Amount);
        var totalCapacity = slots.Sum(slot => slot.Capacity);
        var bookedSeats = slots.Sum(slot => slot.BookedCount);
        var availableSeats = Math.Max(totalCapacity - bookedSeats, 0);
        var occupancy = totalCapacity > 0 ? (int)Math.Round((bookedSeats / (double)totalCapacity) * 100) : 0;
        var expiringOffers = offers
            .Where(offer => offer.Status == OfferStatus.Active)
            .OrderBy(offer => offer.EndDate)
            .Take(5)
            .Select(offer => offer.ToDto())
            .ToList();
        var recentBookings = bookings
            .Take(8)
            .Select(booking => booking.ToDto())
            .ToList();
        var categoryAnalytics = offers
            .GroupBy(offer => offer.Category)
            .Select(group => new DashboardMetricDto(group.Key, group.Count(), group.Count().ToString()))
            .OrderByDescending(metric => metric.Value)
            .ToList();

        return Ok(new DashboardSummaryDto(
            business.Id,
            business.Name,
            offers.Count,
            activeOffers,
            bookings.Count,
            bookings.Count(booking => booking.CreatedAt.Date == today),
            revenue,
            totalCapacity,
            bookedSeats,
            availableSeats,
            occupancy,
            expiringOffers,
            recentBookings,
            categoryAnalytics));
    }
}
