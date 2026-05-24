# Willovate Smart Slot

Full-stack Smart Offer Slot Booking System for businesses to create limited-time offer slots and customers to reserve them online.

## Problem Statement Summary

Willovate Smart Slot is based on the hackathon problem statement for a service-business offer booking platform. A business owner can create limited-time offers with one or more bookable slots. Customers can browse active offers, view details, choose an available slot, and create a booking. Admins manage business profile data, offers, slots, bookings, and dashboard analytics.

The platform is designed for restaurants, gyms, salons, clinics, coaching classes, gaming zones, turfs, spas, activity centers, and similar service businesses.

## Current Implementation Note

This repository currently contains the React + TypeScript frontend implementation with a localStorage-backed mock data layer that mirrors the required API/data model. The PDF-required backend stack is documented below for submission alignment, but no .NET backend project files were present in this checkout.

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
- Database: PostgreSQL or SQL Server
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

The backend required by the PDF should expose:

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

Suggested tables from the PDF:

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
npm install
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

## Backend Setup

No .NET backend project files were present in this checkout. When adding the required backend, use .NET 8 Web API with Swagger/OpenAPI and PostgreSQL or SQL Server.

Recommended commands for a future backend folder:

```bash
dotnet restore
dotnet build
dotnet run
```

For ASP.NET Core JSON circular reference protection, configure controllers with:

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

Prefer DTOs over returning raw EF entities directly.

## Environment Variables

Copy `.env.example` to `.env.local` for local frontend development.

```bash
cp .env.example .env.local
```

Do not commit real secrets, database passwords, API keys, JWT secrets, or private connection strings.

## How To Run

```bash
npm install
npm run build
npm run dev
```

## Screenshots

Add frontend screenshots here before final submission:

- Admin Login
- Admin Dashboard
- Create Offer
- Manage Offers
- Manage Bookings
- Public Offer Listing
- Offer Detail
- Booking Confirmation

## Swagger Screenshot

Add Swagger/OpenAPI screenshot here after the .NET backend is connected.

## Demo Video

Add the final 2-3 minute demo video link here.

## Submission Note

This project is prepared for submission as `willovate-smart-slot` under the GitHub profile `Kaushal-Rohit`.
