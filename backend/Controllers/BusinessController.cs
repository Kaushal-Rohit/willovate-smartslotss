using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WillovateSmartSlot.Api.Data;
using WillovateSmartSlot.Api.DTOs;
using WillovateSmartSlot.Api.Models;

namespace WillovateSmartSlot.Api.Controllers;

[ApiController]
[Route("api/business")]
public sealed class BusinessController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BusinessDto>>> GetBusinesses()
    {
        var businesses = await db.Businesses
            .OrderBy(business => business.Name)
            .Select(business => business.ToDto())
            .ToListAsync();

        return Ok(businesses);
    }

    [HttpPost]
    public async Task<ActionResult<BusinessDto>> CreateBusiness(BusinessUpsertDto request)
    {
        var validation = Validate(request);
        if (validation is not null)
        {
            return BadRequest(new { message = validation });
        }

        var business = new Business();
        Apply(request, business);
        db.Businesses.Add(business);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBusinesses), new { id = business.Id }, business.ToDto());
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<BusinessDto>> UpdateBusiness(Guid id, BusinessUpsertDto request)
    {
        var validation = Validate(request);
        if (validation is not null)
        {
            return BadRequest(new { message = validation });
        }

        var business = await db.Businesses.FindAsync(id);
        if (business is null)
        {
            return NotFound(new { message = "Business was not found." });
        }

        Apply(request, business);
        await db.SaveChangesAsync();

        return Ok(business.ToDto());
    }

    private static string? Validate(BusinessUpsertDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return "Business name is required.";
        }

        if (string.IsNullOrWhiteSpace(request.OwnerName))
        {
            return "Owner name is required.";
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return "Business email is required.";
        }

        if (string.IsNullOrWhiteSpace(request.Phone))
        {
            return "Business phone is required.";
        }

        return null;
    }

    private static void Apply(BusinessUpsertDto request, Business business)
    {
        business.Name = request.Name.Trim();
        business.BusinessType = DtoMapping.ParseBusinessType(request.BusinessType);
        business.OwnerName = request.OwnerName.Trim();
        business.Phone = request.Phone.Trim();
        business.Email = request.Email.Trim();
        business.Address = request.Address.Trim();
        business.City = request.City.Trim();
        business.OpeningTime = string.IsNullOrWhiteSpace(request.OpeningTime) ? "09:00" : request.OpeningTime;
        business.ClosingTime = string.IsNullOrWhiteSpace(request.ClosingTime) ? "18:00" : request.ClosingTime;
        business.LogoUrl = string.IsNullOrWhiteSpace(request.LogoUrl) ? null : request.LogoUrl.Trim();
    }
}
