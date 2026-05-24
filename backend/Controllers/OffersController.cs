using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WillovateSmartSlot.Api.Data;
using WillovateSmartSlot.Api.DTOs;
using WillovateSmartSlot.Api.Models;

namespace WillovateSmartSlot.Api.Controllers;

[ApiController]
[Route("api/offers")]
public sealed class OffersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OfferDto>>> GetOffers(
        [FromQuery] Guid? businessId,
        [FromQuery] bool includeInactive = false)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow.Date);
        var query = db.Offers
            .Include(offer => offer.Slots)
            .AsQueryable();

        if (businessId.HasValue)
        {
            query = query.Where(offer => offer.BusinessId == businessId.Value);
        }

        if (!includeInactive)
        {
            query = query.Where(offer =>
                offer.Status == OfferStatus.Active
                && offer.EndDate >= today);
        }

        var offers = await query
            .OrderByDescending(offer => offer.CreatedAt)
            .ToListAsync();

        return Ok(offers.Select(offer => offer.ToDto()));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OfferDto>> GetOffer(Guid id)
    {
        var offer = await db.Offers
            .Include(item => item.Slots)
            .FirstOrDefaultAsync(item => item.Id == id);

        return offer is null
            ? NotFound(new { message = "Offer was not found." })
            : Ok(offer.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<OfferDto>> CreateOffer(OfferCreateDto request)
    {
        var validation = await ValidateCreateAsync(request);
        if (validation is not null)
        {
            return BadRequest(new { message = validation });
        }

        var offer = new Offer
        {
            BusinessId = request.BusinessId,
            CreatedAt = DateTime.UtcNow
        };

        ApplyCreate(request, offer);
        db.Offers.Add(offer);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOffer), new { id = offer.Id }, offer.ToDto());
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<OfferDto>> UpdateOffer(Guid id, OfferUpdateDto request)
    {
        var offer = await db.Offers.Include(item => item.Slots).FirstOrDefaultAsync(item => item.Id == id);
        if (offer is null)
        {
            return NotFound(new { message = "Offer was not found." });
        }

        var validation = Validate(request);
        if (validation is not null)
        {
            return BadRequest(new { message = validation });
        }

        ApplyUpdate(request, offer);
        await db.SaveChangesAsync();

        return Ok(offer.ToDto());
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteOffer(Guid id)
    {
        var offer = await db.Offers
            .Include(item => item.Bookings)
            .FirstOrDefaultAsync(item => item.Id == id);

        if (offer is null)
        {
            return NotFound(new { message = "Offer was not found." });
        }

        if (offer.Bookings.Any())
        {
            offer.Status = OfferStatus.Cancelled;
            offer.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            db.Offers.Remove(offer);
        }

        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task<string?> ValidateCreateAsync(OfferCreateDto request)
    {
        if (!await db.Businesses.AnyAsync(business => business.Id == request.BusinessId))
        {
            return "Business was not found.";
        }

        return ValidateCommon(
            request.Title,
            request.Category,
            request.OriginalPrice,
            request.OfferPrice,
            request.StartDate,
            request.EndDate,
            request.TotalCapacity,
            request.MaxBookingPerCustomer,
            request.Status);
    }

    private static string? Validate(OfferUpdateDto request) => ValidateCommon(
        request.Title,
        request.Category,
        request.OriginalPrice,
        request.OfferPrice,
        request.StartDate,
        request.EndDate,
        request.TotalCapacity,
        request.MaxBookingPerCustomer,
        request.Status);

    private static string? ValidateCommon(
        string title,
        string category,
        decimal originalPrice,
        decimal offerPrice,
        DateOnly startDate,
        DateOnly endDate,
        int totalCapacity,
        int maxBookingPerCustomer,
        string status)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return "Offer title is required.";
        }

        if (string.IsNullOrWhiteSpace(category))
        {
            return "Category is required.";
        }

        if (offerPrice <= 0)
        {
            return "Offer price must be positive.";
        }

        if (originalPrice <= offerPrice)
        {
            return "Offer price must be less than original price.";
        }

        if (endDate < startDate.AddDays(1))
        {
            return "End date must be at least 1 full day after start date.";
        }

        if (totalCapacity <= 0)
        {
            return "Total capacity must be greater than 0.";
        }

        if (maxBookingPerCustomer <= 0)
        {
            return "Max booking per customer must be greater than 0.";
        }

        return Enum.TryParse<OfferStatus>(status, ignoreCase: true, out _)
            ? null
            : "Offer status is invalid.";
    }

    private static void ApplyCreate(OfferCreateDto request, Offer offer)
    {
        offer.Title = request.Title.Trim();
        offer.Description = request.Description?.Trim() ?? string.Empty;
        offer.Category = request.Category.Trim();
        offer.OriginalPrice = request.OriginalPrice;
        offer.OfferPrice = request.OfferPrice;
        offer.DiscountPercentage = DtoMapping.CalculateDiscount(request.OriginalPrice, request.OfferPrice);
        offer.StartDate = request.StartDate;
        offer.EndDate = request.EndDate;
        offer.StartTime = string.IsNullOrWhiteSpace(request.StartTime) ? "09:00" : request.StartTime;
        offer.EndTime = string.IsNullOrWhiteSpace(request.EndTime) ? "18:00" : request.EndTime;
        offer.TotalCapacity = request.TotalCapacity;
        offer.MaxBookingPerCustomer = request.MaxBookingPerCustomer;
        offer.TermsAndConditions = request.TermsAndConditions?.Trim() ?? string.Empty;
        offer.Status = Enum.Parse<OfferStatus>(request.Status, ignoreCase: true);
        offer.ImageUrl = request.ImageUrl;
        offer.ThumbnailUrl = request.ThumbnailUrl ?? request.AmbientAsset?.Url ?? request.ImageUrl;
        offer.Popularity = request.Popularity ?? 0;
        offer.UpdatedAt = DateTime.UtcNow;
        ApplyAmbient(request.AmbientAsset, offer);
    }

    private static void ApplyUpdate(OfferUpdateDto request, Offer offer)
    {
        offer.Title = request.Title.Trim();
        offer.Description = request.Description?.Trim() ?? string.Empty;
        offer.Category = request.Category.Trim();
        offer.OriginalPrice = request.OriginalPrice;
        offer.OfferPrice = request.OfferPrice;
        offer.DiscountPercentage = DtoMapping.CalculateDiscount(request.OriginalPrice, request.OfferPrice);
        offer.StartDate = request.StartDate;
        offer.EndDate = request.EndDate;
        offer.StartTime = string.IsNullOrWhiteSpace(request.StartTime) ? "09:00" : request.StartTime;
        offer.EndTime = string.IsNullOrWhiteSpace(request.EndTime) ? "18:00" : request.EndTime;
        offer.TotalCapacity = request.TotalCapacity;
        offer.MaxBookingPerCustomer = request.MaxBookingPerCustomer;
        offer.TermsAndConditions = request.TermsAndConditions?.Trim() ?? string.Empty;
        offer.Status = Enum.Parse<OfferStatus>(request.Status, ignoreCase: true);
        offer.ImageUrl = request.ImageUrl;
        offer.ThumbnailUrl = request.ThumbnailUrl ?? request.AmbientAsset?.Url ?? request.ImageUrl;
        offer.Popularity = request.Popularity ?? offer.Popularity;
        offer.UpdatedAt = DateTime.UtcNow;
        ApplyAmbient(request.AmbientAsset, offer);
    }

    private static void ApplyAmbient(AmbientAssetDto? ambient, Offer offer)
    {
        offer.AmbientAssetUrl = ambient?.Url;
        offer.AmbientAssetName = ambient?.Name;
        offer.AmbientAssetType = ambient?.Type;
        offer.AmbientAssetSize = ambient?.Size;
        offer.AmbientAssetUploadedAt = ambient?.UploadedAt;
    }
}
