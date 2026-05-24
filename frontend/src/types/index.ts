export type OfferStatus = 'Draft' | 'Active' | 'Paused' | 'Expired' | 'Cancelled';
export type SlotStatus = 'Available' | 'Full' | 'Closed' | 'Expired' | 'Cancelled';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'NoShow';
export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded' | 'Failed';
export type UserRole = 'Admin' | 'Customer' | 'Guest';
export type BusinessType =
  | 'Gym'
  | 'Restaurant'
  | 'Salon'
  | 'Clinic'
  | 'Coaching'
  | 'Turf'
  | 'Cosmetics'
  | 'Massage/Spa'
  | 'Gaming Zone'
  | 'Activity Center'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface AdminAccount extends User {
  role: 'Admin';
  businessId: string;
  businessName: string;
  businessType: BusinessType;
}

export interface CustomerAccount extends User {
  role: 'Customer';
}

export interface Booking {
  id: string;
  businessId: string;
  offerId: string;
  offerTitle: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail: string;
  slotId: string;
  confirmationCode: string;
  status: BookingStatus;
  paymentStatus?: PaymentStatus;
  createdAt: string;
  slotLabel: string;
  people: number;
  amount: number;
  specialNote?: string;
  timeline?: BookingTimelineEvent[];
}

export interface Business {
  id: string;
  name: string;
  businessType: BusinessType;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  openingTime: string;
  closingTime: string;
  logoUrl?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
}

export interface AmbientAsset {
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface Offer {
  id: string;
  businessId: string;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  totalCapacity?: number;
  maxBookingPerCustomer?: number;
  termsAndConditions: string;
  status: OfferStatus;
  imageUrl?: string;
  thumbnailUrl?: string;
  ambientAsset?: AmbientAsset;
  createdAt?: string;
  updatedAt?: string;
  popularity?: number;
}

export interface OfferSlot {
  id: string;
  businessId: string;
  offerId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  status: SlotStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingTimelineEvent {
  id: string;
  status: BookingStatus;
  label: string;
  createdAt: string;
}
