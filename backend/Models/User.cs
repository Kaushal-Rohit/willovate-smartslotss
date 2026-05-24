namespace WillovateSmartSlot.Api.Models;

public sealed class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public UserRole Role { get; set; }
    public Guid? BusinessId { get; set; }
    public Business? Business { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
