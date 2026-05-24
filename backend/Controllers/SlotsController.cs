using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WillovateSmartSlot.Api.Data;
using WillovateSmartSlot.Api.DTOs;
using WillovateSmartSlot.Api.Models;

namespace WillovateSmartSlot.Api.Controllers;

[ApiController]
public sealed class SlotsController(AppDbContext db) : ControllerBase
{
    [HttpPost("api/slots")]
    public async Task<ActionResult<OfferSlotDto>> CreateSlot(SlotCreateDto request)
    {
        var offer = await db.Offers.FindAsync(request.OfferId);
        if (offer is null)
        {
            return BadRequest(new { message = "Offer was not found." });
        }

        if (offer.BusinessId != request.BusinessId)
        {
            return BadRequest(new { message = "Slot business must match offer business." });
        }

        var validation = Validate(request.Capacity, request.BookedCount ?? 0, request.Status);
        if (validation is not null)
        {
            return BadRequest(new { message = validation });
        }

        var bookedCount = Math.Max(0, request.BookedCount ?? 0);
        var slot = new OfferSlot
        {
            BusinessId = request.BusinessId,
            OfferId = request.OfferId,
            SlotDate = request.SlotDate,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            Capacity = request.Capacity,
            BookedCount = bookedCount,
            Status = bookedCount >= request.Capacity ? SlotStatus.Full : ParseStatus(request.Status),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        db.OfferSlots.Add(slot);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSlots), new { id = slot.Id }, slot.ToDto());
    }

    [HttpGet("api/slots")]
    public async Task<ActionResult<IEnumerable<OfferSlotDto>>> GetSlots([FromQuery] Guid? businessId, [FromQuery] Guid? offerId)
    {
        var query = db.OfferSlots.AsQueryable();

        if (businessId.HasValue)
        {
            query = query.Where(slot => slot.BusinessId == businessId.Value);
        }

        if (offerId.HasValue)
        {
            query = query.Where(slot => slot.OfferId == offerId.Value);
        }

        var slots = await query
            .OrderBy(slot => slot.SlotDate)
            .ThenBy(slot => slot.StartTime)
            .ToListAsync();

        return Ok(slots.Select(slot => slot.ToDto()));
    }

    [HttpGet("api/offers/{offerId:guid}/slots")]
    public async Task<ActionResult<IEnumerable<OfferSlotDto>>> GetOfferSlots(Guid offerId)
    {
        var slots = await db.OfferSlots
            .Where(slot => slot.OfferId == offerId)
            .OrderBy(slot => slot.SlotDate)
            .ThenBy(slot => slot.StartTime)
            .ToListAsync();

        return Ok(slots.Select(slot => slot.ToDto()));
    }

    [HttpPut("api/slots/{id:guid}")]
    public async Task<ActionResult<OfferSlotDto>> UpdateSlot(Guid id, SlotUpdateDto request)
    {
        var slot = await db.OfferSlots.FindAsync(id);
        if (slot is null)
        {
            return NotFound(new { message = "Slot was not found." });
        }

        var bookedCount = request.BookedCount ?? slot.BookedCount;
        var validation = Validate(request.Capacity, bookedCount, request.Status);
        if (validation is not null)
        {
            return BadRequest(new { message = validation });
        }

        slot.SlotDate = request.SlotDate;
        slot.StartTime = request.StartTime;
        slot.EndTime = request.EndTime;
        slot.Capacity = request.Capacity;
        slot.BookedCount = bookedCount;
        slot.Status = bookedCount >= request.Capacity ? SlotStatus.Full : ParseStatus(request.Status);
        slot.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return Ok(slot.ToDto());
    }

    [HttpDelete("api/slots/{id:guid}")]
    public async Task<IActionResult> DeleteSlot(Guid id)
    {
        var slot = await db.OfferSlots
            .Include(item => item.Bookings)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (slot is null)
        {
            return NotFound(new { message = "Slot was not found." });
        }

        if (slot.Bookings.Any())
        {
            slot.Status = SlotStatus.Cancelled;
            slot.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            db.OfferSlots.Remove(slot);
        }

        await db.SaveChangesAsync();
        return NoContent();
    }

    private static string? Validate(int capacity, int bookedCount, string? status)
    {
        if (capacity <= 0)
        {
            return "Slot capacity must be greater than 0.";
        }

        if (bookedCount < 0)
        {
            return "Booked count cannot be negative.";
        }

        if (bookedCount > capacity)
        {
            return "Booked count cannot exceed slot capacity.";
        }

        if (!string.IsNullOrWhiteSpace(status) && !Enum.TryParse<SlotStatus>(status, ignoreCase: true, out _))
        {
            return "Slot status is invalid.";
        }

        return null;
    }

    private static SlotStatus ParseStatus(string? status) =>
        Enum.TryParse<SlotStatus>(status, ignoreCase: true, out var parsed) ? parsed : SlotStatus.Available;
}
