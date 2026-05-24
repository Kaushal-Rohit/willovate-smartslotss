using Microsoft.EntityFrameworkCore;
using WillovateSmartSlot.Api.Models;

namespace WillovateSmartSlot.Api.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Business> Businesses => Set<Business>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<OfferSlot> OfferSlots => Set<OfferSlot>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(user => user.Email).IsUnique();
            entity.Property(user => user.Email).HasMaxLength(160).IsRequired();
            entity.Property(user => user.Name).HasMaxLength(120).IsRequired();
            entity.Property(user => user.PasswordHash).HasMaxLength(128).IsRequired();
            entity.Property(user => user.Role).HasConversion<string>().HasMaxLength(24);
            entity.HasOne(user => user.Business)
                .WithMany(business => business.Users)
                .HasForeignKey(user => user.BusinessId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Business>(entity =>
        {
            entity.Property(business => business.Name).HasMaxLength(160).IsRequired();
            entity.Property(business => business.BusinessType).HasConversion<string>().HasMaxLength(40);
            entity.Property(business => business.OwnerName).HasMaxLength(120).IsRequired();
            entity.Property(business => business.Phone).HasMaxLength(40).IsRequired();
            entity.Property(business => business.Email).HasMaxLength(160).IsRequired();
            entity.Property(business => business.City).HasMaxLength(80).IsRequired();
        });

        modelBuilder.Entity<Offer>(entity =>
        {
            entity.Property(offer => offer.Title).HasMaxLength(180).IsRequired();
            entity.Property(offer => offer.Category).HasMaxLength(100).IsRequired();
            entity.Property(offer => offer.OriginalPrice).HasPrecision(12, 2);
            entity.Property(offer => offer.OfferPrice).HasPrecision(12, 2);
            entity.Property(offer => offer.Status).HasConversion<string>().HasMaxLength(24);
            entity.HasOne(offer => offer.Business)
                .WithMany(business => business.Offers)
                .HasForeignKey(offer => offer.BusinessId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OfferSlot>(entity =>
        {
            entity.Property(slot => slot.Status).HasConversion<string>().HasMaxLength(24);
            entity.HasOne(slot => slot.Offer)
                .WithMany(offer => offer.Slots)
                .HasForeignKey(slot => slot.OfferId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasIndex(booking => booking.ConfirmationCode).IsUnique();
            entity.Property(booking => booking.ConfirmationCode).HasMaxLength(40).IsRequired();
            entity.Property(booking => booking.CustomerName).HasMaxLength(140).IsRequired();
            entity.Property(booking => booking.CustomerPhone).HasMaxLength(40).IsRequired();
            entity.Property(booking => booking.CustomerEmail).HasMaxLength(160);
            entity.Property(booking => booking.Amount).HasPrecision(12, 2);
            entity.Property(booking => booking.Status).HasConversion<string>().HasMaxLength(24);
            entity.Property(booking => booking.PaymentStatus).HasConversion<string>().HasMaxLength(24);
            entity.HasOne(booking => booking.Offer)
                .WithMany(offer => offer.Bookings)
                .HasForeignKey(booking => booking.OfferId)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(booking => booking.Slot)
                .WithMany(slot => slot.Bookings)
                .HasForeignKey(booking => booking.SlotId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
