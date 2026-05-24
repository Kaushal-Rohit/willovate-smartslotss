namespace WillovateSmartSlot.Api.Models;

public sealed class OfferSlot
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BusinessId { get; set; }
    public Guid OfferId { get; set; }
    public Offer? Offer { get; set; }
    public DateOnly SlotDate { get; set; }
    public string StartTime { get; set; } = "09:00";
    public string EndTime { get; set; } = "10:00";
    public int Capacity { get; set; } = 1;
    public int BookedCount { get; set; }
    public SlotStatus Status { get; set; } = SlotStatus.Available;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
