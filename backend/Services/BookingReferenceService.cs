using Microsoft.EntityFrameworkCore;
using WillovateSmartSlot.Api.Data;

namespace WillovateSmartSlot.Api.Services;

public sealed class BookingReferenceService(AppDbContext db)
{
    public async Task<string> CreateUniqueAsync(CancellationToken cancellationToken = default)
    {
        for (var attempt = 0; attempt < 8; attempt++)
        {
            var reference = $"WSL-{DateTime.UtcNow:yyMMdd}-{Random.Shared.Next(1000, 9999)}";
            var exists = await db.Bookings.AnyAsync(booking => booking.ConfirmationCode == reference, cancellationToken);
            if (!exists)
            {
                return reference;
            }
        }

        return ($"WSL-{Guid.NewGuid():N}")[..18].ToUpperInvariant();
    }
}
