namespace WillovateSmartSlot.Api.Models;

public enum UserRole
{
    Admin,
    Customer
}

public enum BusinessType
{
    Gym,
    Restaurant,
    Salon,
    Clinic,
    Coaching,
    Turf,
    Cosmetics,
    MassageSpa,
    GamingZone,
    ActivityCenter,
    Other
}

public enum OfferStatus
{
    Draft,
    Active,
    Paused,
    Expired,
    Cancelled
}

public enum SlotStatus
{
    Available,
    Full,
    Closed,
    Expired,
    Cancelled
}

public enum BookingStatus
{
    Pending,
    Confirmed,
    Cancelled,
    Completed,
    NoShow
}

public enum PaymentStatus
{
    Pending,
    Paid,
    Refunded,
    Failed
}
