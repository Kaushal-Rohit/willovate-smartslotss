using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using WillovateSmartSlot.Api.Data;
using WillovateSmartSlot.Api.Models;

namespace WillovateSmartSlot.Api.Services;

public interface IAuthService
{
    Task<User?> ValidateAsync(string email, string password, string? role);
    string CreateDemoToken(User user);
}

public sealed class AuthService(AppDbContext db) : IAuthService
{
    public async Task<User?> ValidateAsync(string email, string password, string? role)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var query = db.Users.Include(user => user.Business).Where(user => user.Email.ToLower() == normalizedEmail);

        if (!string.IsNullOrWhiteSpace(role) && Enum.TryParse<UserRole>(role, ignoreCase: true, out var parsedRole))
        {
            query = query.Where(user => user.Role == parsedRole);
        }

        var user = await query.FirstOrDefaultAsync();
        if (user is null)
        {
            return null;
        }

        return user.PasswordHash == HashPassword(password) ? user : null;
    }

    public string CreateDemoToken(User user)
    {
        var payload = $"{user.Id}:{user.Role}:{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(payload));
    }

    public static string HashPassword(string password)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes);
    }
}
