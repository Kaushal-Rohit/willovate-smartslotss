# Willovate Smart Slot

Full-stack Smart Offer Slot Booking System for businesses to create limited-time offer slots and customers to reserve them online.

## Problem Statement Summary

Willovate Smart Slot is based on the hackathon problem statement for a service-business offer booking platform. A business owner can create limited-time offers with one or more bookable slots. Customers can browse active offers, view details, choose an available slot, and create a booking. Admins manage business profile data, offers, slots, bookings, and dashboard analytics.

The platform is designed for restaurants, gyms, salons, clinics, coaching classes, gaming zones, turfs, spas, activity centers, and similar service businesses.

## Current Implementation Note

This repository now contains both required project parts:

- `frontend/`: React + TypeScript + Tailwind marketplace/admin panel.
- `backend/`: .NET 8 Web API with EF Core, SQL Server configuration, DTO-based controllers, Swagger/OpenAPI, seeded demo credentials, and required booking business rules.

The frontend still keeps a localStorage demo fallback. Set `VITE_USE_MOCK_DATA=false` to connect it to the Web API.

## Features

- Admin login with fixed demo business-owner accounts.
- Customer login with fixed demo customer account.
- Business profile management.
- Offer creation and editing with validation.
- Offer price validation and automatic discount calculation.
- Date validation requiring end date to be at least one full day after start date.
- Per-business category management.
- Offer management with search, category/status/date filters, sorting, duplicate, expire, pause/activate, delete, analytics, and ambient preview.
- Slot management with create, edit, delete, close/reopen, capacity, booked count, remaining seats, and utilization bars.
- Booking management with status updates, payment status placeholder, timeline history, customer search, date/status filters, and CSV export.
- Public marketplace with search, filters, sorting, premium animated offer cards, countdown indicators, and availability indicators.
- Public offer detail and booking flow.
- Booking confirmation page.
- Admin dashboard with revenue, offers, bookings, capacity, conversion, charts, top offers, category analytics, expiring offers, and recent activity.
- Dark/light mode.
- Responsive admin navigation.
- Custom ambient asset upload for offer cards with preview, validation, and fallback rendering.

## Tech Stack

- Frontend: React + TypeScript/TSX
- Styling: Tailwind CSS
- Motion/UI: Framer Motion, Lucide React
- Charts: Recharts
- Backend: .NET 8 Web API
- Database: SQL Server through Entity Framework Core
- API Docs: Swagger/OpenAPI

## User Roles

### Admin / Business Owner

Can log in, manage a business profile, create and manage offers, manage slots, review bookings, update booking statuses, and view dashboard analytics.

### Customer

Can view active public offers, inspect offer details, select an available slot, submit booking details, and view booking confirmation.

## Main Modules

- Admin Login
- Business Profile
- Offer Management
- Slot Management
- Public Offer Listing
- Offer Detail Page
- Booking Flow
- Booking Confirmation
- Admin Dashboard

## Required API List

The backend exposes:

```text
POST /api/auth/login

POST /api/business
GET /api/business
PUT /api/business/{id}

POST /api/offers
GET /api/offers
GET /api/offers/{id}
PUT /api/offers/{id}
DELETE /api/offers/{id}

POST /api/slots
GET /api/slots
GET /api/offers/{offerId}/slots
PUT /api/slots/{id}
DELETE /api/slots/{id}

POST /api/bookings
GET /api/bookings
GET /api/bookings/{id}
PUT /api/bookings/{id}/status

GET /api/dashboard/summary
```

## Database Tables

Implemented EF Core tables:

- Users
- Businesses
- Offers
- OfferSlots
- Bookings

## Business Rules

- Offer price must be less than original price.
- Offer price must be positive.
- End date must be at least one full day after start date.
- Expired offers cannot be booked.
- Cancelled and expired offers should not appear on the public listing page.
- A slot cannot be booked if it is full or closed.
- Booked count should increase after booking.
- Booking reference numbers should be unique.
- Admin can pause, cancel, expire, or reactivate offers.
- Same phone number should not exceed the offer max booking limit.

## Bonus Features Implemented

- Dark/light mode.
- Countdown/expiry indicators.
- Export bookings as CSV.
- Payment status placeholder.
- Animated dashboard charts.
- Custom offer-card ambient backgrounds.
- Responsive mobile admin navigation.

## Demo Credentials

Admin accounts:

```text
admin.gym@smartslot.test / Gym@12345
admin.restaurant@smartslot.test / Dine@12345
admin.salon@smartslot.test / Salon@12345
admin.clinic@smartslot.test / Clinic@12345
admin.coaching@smartslot.test / Coach@12345
admin.turf@smartslot.test / Turf@12345
```

Customer account:

```text
customer@smartslot.test / User@12345
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

## Backend Setup

Install .NET 8 SDK and SQL Server or LocalDB, then update the connection string if needed:

```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

Default backend URLs:

```text
http://localhost:5000
https://localhost:5001
```

Swagger/OpenAPI:

```text
http://localhost:5000/swagger
```

The backend uses `Database.EnsureCreated()` in development to create the SQL Server schema for demo use. For production, create EF migrations from `backend/`:

```bash
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
```

ASP.NET Core JSON circular reference protection is configured in `backend/Program.cs`:

```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            ReferenceHandler.IgnoreCycles;

        options.JsonSerializerOptions.DefaultIgnoreCondition =
            JsonIgnoreCondition.WhenWritingNull;
    });
```

Controllers return DTOs instead of raw EF entities.

## Environment Variables

Copy `frontend/.env.example` to `frontend/.env.local` for local frontend development.

```bash
cp frontend/.env.example frontend/.env.local
```

Frontend API settings:

```text
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK_DATA=false
```




## Demo Video

https://drive.google.com/file/d/1gPqe7tT04TQeXcUwDNMmRGdIou8YTugs/view?usp=sharing

## Submission Note

This project is prepared for submission as `willovate-smart-slot` under the GitHub profile `Kaushal-Rohit`.
