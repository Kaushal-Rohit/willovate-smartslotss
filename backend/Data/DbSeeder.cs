using Microsoft.EntityFrameworkCore;
using WillovateSmartSlot.Api.DTOs;
using WillovateSmartSlot.Api.Models;
using WillovateSmartSlot.Api.Services;

namespace WillovateSmartSlot.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await db.Database.EnsureCreatedAsync();

        if (await db.Users.AnyAsync())
        {
            return;
        }

        var gymId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var restaurantId = Guid.Parse("22222222-2222-2222-2222-222222222222");
        var salonId = Guid.Parse("33333333-3333-3333-3333-333333333333");
        var clinicId = Guid.Parse("44444444-4444-4444-4444-444444444444");

        var businesses = new[]
        {
            new Business
            {
                Id = gymId,
                Name = "PulseFit Studio",
                BusinessType = BusinessType.Gym,
                OwnerName = "Aarav Mehta",
                Phone = "+91 98765 11111",
                Email = "hello@pulsefit.test",
                Address = "Sector 21, Fitness Plaza",
                City = "Gurugram",
                OpeningTime = "06:00",
                ClosingTime = "22:00",
                LogoUrl = "/images/218fc872735831.5bf1e45999c40.gif"
            },
            new Business
            {
                Id = restaurantId,
                Name = "Urban Spice Table",
                BusinessType = BusinessType.Restaurant,
                OwnerName = "Nisha Rao",
                Phone = "+91 98765 22222",
                Email = "bookings@urbanspice.test",
                Address = "MG Road Dining Street",
                City = "Bengaluru",
                OpeningTime = "11:00",
                ClosingTime = "23:30",
                LogoUrl = "/images/NOT3bRt5u3.gif"
            },
            new Business
            {
                Id = salonId,
                Name = "Aura Salon Lounge",
                BusinessType = BusinessType.Salon,
                OwnerName = "Meera Kapoor",
                Phone = "+91 98765 33333",
                Email = "care@aurasalon.test",
                Address = "Linking Road, Studio 4",
                City = "Mumbai",
                OpeningTime = "10:00",
                ClosingTime = "20:00",
                LogoUrl = "/images/salon-motion.gif"
            },
            new Business
            {
                Id = clinicId,
                Name = "CareWell Clinic",
                BusinessType = BusinessType.Clinic,
                OwnerName = "Dr. Kavya Sharma",
                Phone = "+91 98765 44444",
                Email = "desk@carewell.test",
                Address = "Park View Medical Lane",
                City = "Pune",
                OpeningTime = "09:00",
                ClosingTime = "18:00",
                LogoUrl = "/images/personal-trainer-gives-instruction-woman-squat-exercise-illustration_166119-18.avif"
            }
        };

        db.Businesses.AddRange(businesses);

        db.Users.AddRange(
            Admin("PulseFit Admin", "admin.gym@smartslot.test", "Gym@12345", gymId),
            Admin("Urban Spice Admin", "admin.restaurant@smartslot.test", "Dine@12345", restaurantId),
            Admin("Aura Salon Admin", "admin.salon@smartslot.test", "Salon@12345", salonId),
            Admin("CareWell Admin", "admin.clinic@smartslot.test", "Clinic@12345", clinicId),
            new User
            {
                Id = Guid.Parse("90000000-0000-0000-0000-000000000001"),
                Name = "Demo Customer",
                Email = "customer@smartslot.test",
                PasswordHash = AuthService.HashPassword("User@12345"),
                Phone = "+91 90000 00000",
                Role = UserRole.Customer
            });

        var today = DateOnly.FromDateTime(DateTime.UtcNow.Date);
        var gymOfferId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1");
        var restaurantOfferId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2");
        var salonOfferId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3");
        var clinicOfferId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4");

        var offers = new[]
        {
            Offer(gymOfferId, gymId, "7-Day Strength Kickstart", "Trial access with coach-guided workout slots for new members.", "Fitness", 2499, 699, today, today.AddDays(12), "06:00", "21:00", "/images/218fc872735831.5bf1e45999c40.gif"),
            Offer(restaurantOfferId, restaurantId, "Chef's Table Lunch Rush", "Limited lunch reservations with a curated seasonal platter.", "Dining", 1499, 899, today, today.AddDays(6), "12:00", "15:30", "/images/NOT3bRt5u3.gif"),
            Offer(salonOfferId, salonId, "Glow Makeover Slot", "Hair spa, styling consultation, and express skincare appointment.", "Beauty", 3199, 1399, today, today.AddDays(9), "10:00", "19:00", "/images/salon-motion.gif"),
            Offer(clinicOfferId, clinicId, "Preventive Health Check", "Doctor consultation and basic vitals screening with reserved slots.", "Wellness", 1999, 799, today, today.AddDays(15), "09:00", "17:00", "/images/personal-trainer-gives-instruction-woman-squat-exercise-illustration_166119-18.avif")
        };

        db.Offers.AddRange(offers);

        var gymSlotId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1");
        var restaurantSlotId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2");
        var salonSlotId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3");
        var clinicSlotId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4");

        db.OfferSlots.AddRange(
            Slot(gymSlotId, gymId, gymOfferId, today.AddDays(1), "07:00", "08:00", 15, 3),
            Slot(Guid.NewGuid(), gymId, gymOfferId, today.AddDays(2), "18:00", "19:00", 12, 4),
            Slot(restaurantSlotId, restaurantId, restaurantOfferId, today.AddDays(1), "12:30", "13:30", 20, 8),
            Slot(salonSlotId, salonId, salonOfferId, today.AddDays(2), "16:00", "17:30", 6, 2),
            Slot(clinicSlotId, clinicId, clinicOfferId, today.AddDays(3), "10:30", "11:00", 10, 1));

        var bookingCreatedAt = DateTime.UtcNow.AddHours(-6);
        db.Bookings.Add(new Booking
        {
            Id = Guid.Parse("cccccccc-cccc-cccc-cccc-ccccccccccc1"),
            BusinessId = gymId,
            OfferId = gymOfferId,
            SlotId = gymSlotId,
            CustomerId = Guid.Parse("90000000-0000-0000-0000-000000000001"),
            CustomerName = "Demo Customer",
            CustomerPhone = "+91 90000 00000",
            CustomerEmail = "customer@smartslot.test",
            ConfirmationCode = "WSL-DEMO-1001",
            Status = BookingStatus.Confirmed,
            PaymentStatus = PaymentStatus.Pending,
            CreatedAt = bookingCreatedAt,
            SlotLabel = $"{today.AddDays(1):yyyy-MM-dd} 07:00-08:00",
            People = 1,
            Amount = 699,
            SpecialNote = "Demo booking created by seed data.",
            TimelineJson = DtoMapping.Timeline(
                new BookingTimelineEventDto(Guid.NewGuid(), BookingStatus.Pending.ToString(), "Booking created", bookingCreatedAt),
                new BookingTimelineEventDto(Guid.NewGuid(), BookingStatus.Confirmed.ToString(), "Booking confirmed", bookingCreatedAt.AddMinutes(12)))
        });

        await db.SaveChangesAsync();
    }

    private static User Admin(string name, string email, string password, Guid businessId) => new()
    {
        Id = Guid.NewGuid(),
        Name = name,
        Email = email,
        PasswordHash = AuthService.HashPassword(password),
        Role = UserRole.Admin,
        BusinessId = businessId
    };

    private static Offer Offer(
        Guid id,
        Guid businessId,
        string title,
        string description,
        string category,
        decimal originalPrice,
        decimal offerPrice,
        DateOnly startDate,
        DateOnly endDate,
        string startTime,
        string endTime,
        string imageUrl) => new()
    {
        Id = id,
        BusinessId = businessId,
        Title = title,
        Description = description,
        Category = category,
        OriginalPrice = originalPrice,
        OfferPrice = offerPrice,
        DiscountPercentage = DtoMapping.CalculateDiscount(originalPrice, offerPrice),
        StartDate = startDate,
        EndDate = endDate,
        StartTime = startTime,
        EndTime = endTime,
        TotalCapacity = 40,
        MaxBookingPerCustomer = 2,
        TermsAndConditions = "Valid only for reserved smart slots. Business approval may be required.",
        Status = OfferStatus.Active,
        ImageUrl = imageUrl,
        ThumbnailUrl = imageUrl,
        CreatedAt = DateTime.UtcNow.AddDays(-2),
        UpdatedAt = DateTime.UtcNow.AddDays(-1),
        Popularity = 8
    };

    private static OfferSlot Slot(Guid id, Guid businessId, Guid offerId, DateOnly slotDate, string startTime, string endTime, int capacity, int bookedCount) => new()
    {
        Id = id,
        BusinessId = businessId,
        OfferId = offerId,
        SlotDate = slotDate,
        StartTime = startTime,
        EndTime = endTime,
        Capacity = capacity,
        BookedCount = bookedCount,
        Status = bookedCount >= capacity ? SlotStatus.Full : SlotStatus.Available,
        CreatedAt = DateTime.UtcNow.AddDays(-1),
        UpdatedAt = DateTime.UtcNow.AddHours(-3)
    };
}
