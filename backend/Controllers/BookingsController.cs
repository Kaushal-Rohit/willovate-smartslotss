using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WillovateSmartSlot.Api.Data;
using WillovateSmartSlot.Api.DTOs;
using WillovateSmartSlot.Api.Models;
using WillovateSmartSlot.Api.Services;

namespace WillovateSmartSlot.Api.Controllers;

[ApiController]
[Route("api/bookings")]
public sealed class BookingsController(AppDbContext db, BookingReferenceService referenceService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<BookingDto>> CreateBooking(BookingCreateDto request)
    {
        if (request.People <= 0)
        {
            return BadRequest(new { message = "Number of people must be greater than 0." });
        }

        if (string.IsNullOrWhiteSpace(request.CustomerName) || string.IsNullOrWhiteSpace(request.CustomerPhone))
        {
            return BadRequest(new { message = "Customer name and phone number are required." });
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow.Date);
        var offer = await db.Offers
            .Include(item => item.Slots)
            .FirstOrDefaultAsync(item => item.Id == request.OfferId);

        if (offer is null)
        {
            return NotFound(new { message = "Offer was not found." });
        }

        if (offer.Status != OfferStatus.Active)
        {
            return BadRequest(new { message = "Only active offers can be booked." });
        }

        if (offer.EndDate < today)
        {
            offer.Status = OfferStatus.Expired;
            await db.SaveChangesAsync();
            return BadRequest(new { message = "Expired offers cannot be booked." });
        }

        var slot = offer.Slots.FirstOrDefault(item => item.Id == request.SlotId);
        if (slot is null)
        {
            return BadRequest(new { message = "Selected slot was not found for this offer." });
        }

        if (slot.Status != SlotStatus.Available || slot.BookedCount >= slot.Capacity)
        {
            return BadRequest(new { message = "This slot is full or not available." });
        }

        var remaining = slot.Capacity - slot.BookedCount;
        if (request.People > remaining)
        {
            return BadRequest(new { message = $"Only {remaining} seats are available for this slot." });
        }

        var normalizedPhone = request.CustomerPhone.Trim();
        var existingSeatsForPhone = await db.Bookings
            .Where(booking =>
                booking.OfferId == offer.Id
                && booking.CustomerPhone == normalizedPhone
                && booking.Status != BookingStatus.Cancelled)
            .SumAsync(booking => booking.People);

        if (existingSeatsForPhone + request.People > offer.MaxBookingPerCustomer)
        {
            return BadRequest(new { message = $"This phone number can book a maximum of {offer.MaxBookingPerCustomer} seats for this offer." });
        }

        var createdAt = DateTime.UtcNow;
        var booking = new Booking
        {
            BusinessId = offer.BusinessId,
            OfferId = offer.Id,
            SlotId = slot.Id,
            CustomerId = request.CustomerId,
            CustomerName = request.CustomerName.Trim(),
            CustomerPhone = normalizedPhone,
            CustomerEmail = request.CustomerEmail?.Trim() ?? string.Empty,
            ConfirmationCode = await referenceService.CreateUniqueAsync(HttpContext.RequestAborted),
            Status = BookingStatus.Pending,
            PaymentStatus = PaymentStatus.Pending,
            CreatedAt = createdAt,
            SlotLabel = $"{slot.SlotDate:yyyy-MM-dd} {slot.StartTime}-{slot.EndTime}",
            People = request.People,
            Amount = offer.OfferPrice * request.People,
            SpecialNote = request.SpecialNote?.Trim(),
            TimelineJson = DtoMapping.Timeline(
                new BookingTimelineEventDto(Guid.NewGuid(), BookingStatus.Pending.ToString(), "Booking created", createdAt))
        };

        slot.BookedCount += request.People;
        if (slot.BookedCount >= slot.Capacity)
        {
            slot.Status = SlotStatus.Full;
        }
        slot.UpdatedAt = DateTime.UtcNow;

        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        booking.Offer = offer;
        booking.Slot = slot;
        return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking.ToDto());
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetBookings(
        [FromQuery] Guid? businessId,
        [FromQuery] Guid? offerId,
        [FromQuery] string? customerEmail)
    {
        var query = db.Bookings
            .Include(booking => booking.Offer)
            .Include(booking => booking.Slot)
            .AsQueryable();

        if (businessId.HasValue)
        {
            query = query.Where(booking => booking.BusinessId == businessId.Value);
        }

        if (offerId.HasValue)
        {
            query = query.Where(booking => booking.OfferId == offerId.Value);
        }

        if (!string.IsNullOrWhiteSpace(customerEmail))
        {
            var normalizedEmail = customerEmail.Trim().ToLowerInvariant();
            query = query.Where(booking => booking.CustomerEmail.ToLower() == normalizedEmail);
        }

        var bookings = await query
            .OrderByDescending(booking => booking.CreatedAt)
            .ToListAsync();

        return Ok(bookings.Select(booking => booking.ToDto()));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BookingDto>> GetBooking(Guid id)
    {
        var booking = await db.Bookings
            .Include(item => item.Offer)
            .Include(item => item.Slot)
            .FirstOrDefaultAsync(item => item.Id == id);

        return booking is null
            ? NotFound(new { message = "Booking was not found." })
            : Ok(booking.ToDto());
    }

    [HttpPut("{id:guid}/status")]
    public async Task<ActionResult<BookingDto>> UpdateBookingStatus(Guid id, BookingStatusUpdateDto request)
    {
        if (!Enum.TryParse<BookingStatus>(request.Status, ignoreCase: true, out var nextStatus))
        {
            return BadRequest(new { message = "Booking status is invalid." });
        }

        var booking = await db.Bookings
            .Include(item => item.Offer)
            .Include(item => item.Slot)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (booking is null)
        {
            return NotFound(new { message = "Booking was not found." });
        }

        var previousStatus = booking.Status;
        if (previousStatus == nextStatus)
        {
            return Ok(booking.ToDto());
        }

        if (booking.Slot is not null)
        {
            var previousConsumesCapacity = previousStatus != BookingStatus.Cancelled;
            var nextConsumesCapacity = nextStatus != BookingStatus.Cancelled;

            if (previousConsumesCapacity && !nextConsumesCapacity)
            {
                booking.Slot.BookedCount = Math.Max(booking.Slot.BookedCount - booking.People, 0);
                if (booking.Slot.Status == SlotStatus.Full)
                {
                    booking.Slot.Status = SlotStatus.Available;
                }
                booking.Slot.UpdatedAt = DateTime.UtcNow;
            }
            else if (!previousConsumesCapacity && nextConsumesCapacity)
            {
                var remaining = booking.Slot.Capacity - booking.Slot.BookedCount;
                if (booking.People > remaining)
                {
                    return BadRequest(new { message = "This booking cannot be reactivated because the slot no longer has enough capacity." });
                }

                booking.Slot.BookedCount += booking.People;
                booking.Slot.Status = booking.Slot.BookedCount >= booking.Slot.Capacity ? SlotStatus.Full : SlotStatus.Available;
                booking.Slot.UpdatedAt = DateTime.UtcNow;
            }
        }

        booking.Status = nextStatus;
        booking.TimelineJson = AppendTimeline(
            booking.TimelineJson,
            new BookingTimelineEventDto(Guid.NewGuid(), nextStatus.ToString(), $"Booking marked {nextStatus}", DateTime.UtcNow));

        await db.SaveChangesAsync();
        return Ok(booking.ToDto());
    }

    private static string AppendTimeline(string timelineJson, BookingTimelineEventDto nextEvent)
    {
        var events = new List<BookingTimelineEventDto>();
        if (!string.IsNullOrWhiteSpace(timelineJson))
        {
            try
            {
                events = JsonSerializer.Deserialize<List<BookingTimelineEventDto>>(timelineJson) ?? new List<BookingTimelineEventDto>();
            }
            catch
            {
                events = new List<BookingTimelineEventDto>();
            }
        }

        events.Add(nextEvent);
        return JsonSerializer.Serialize(events);
    }
}
