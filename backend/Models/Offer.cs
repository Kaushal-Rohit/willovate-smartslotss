namespace WillovateSmartSlot.Api.Models;

public sealed class Offer
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BusinessId { get; set; }
    public Business? Business { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal OfferPrice { get; set; }
    public int DiscountPercentage { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string StartTime { get; set; } = "09:00";
    public string EndTime { get; set; } = "18:00";
    public int TotalCapacity { get; set; } = 1;
    public int MaxBookingPerCustomer { get; set; } = 1;
    public string TermsAndConditions { get; set; } = string.Empty;
    public OfferStatus Status { get; set; } = OfferStatus.Active;
    public string? ImageUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? AmbientAssetUrl { get; set; }
    public string? AmbientAssetName { get; set; }
    public string? AmbientAssetType { get; set; }
    public long? AmbientAssetSize { get; set; }
    public DateTime? AmbientAssetUploadedAt { get; set; }
    public int Popularity { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<OfferSlot> Slots { get; set; } = new List<OfferSlot>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
