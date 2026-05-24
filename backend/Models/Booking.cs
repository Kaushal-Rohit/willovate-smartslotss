namespace WillovateSmartSlot.Api.Models;

public sealed class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BusinessId { get; set; }
    public Guid OfferId { get; set; }
    public Offer? Offer { get; set; }
    public Guid SlotId { get; set; }
    public OfferSlot? Slot { get; set; }
    public Guid? CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string ConfirmationCode { get; set; } = string.Empty;
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string SlotLabel { get; set; } = string.Empty;
    public int People { get; set; } = 1;
    public decimal Amount { get; set; }
    public string? SpecialNote { get; set; }
    public string TimelineJson { get; set; } = "[]";
}
