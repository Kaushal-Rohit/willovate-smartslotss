namespace WillovateSmartSlot.Api.Models;

public sealed class Business
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public BusinessType BusinessType { get; set; } = BusinessType.Other;
    public string OwnerName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string OpeningTime { get; set; } = "09:00";
    public string ClosingTime { get; set; } = "18:00";
    public string? LogoUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
}
