import {
  AdminAccount,
  Booking,
  BookingStatus,
  Business,
  BusinessType,
  Category,
  CustomerAccount,
  Offer,
  OfferSlot,
  OfferStatus,
  SlotStatus,
} from '../types';

type AdminCredential = {
  email: string;
  password: string;
  account: AdminAccount;
};

type CustomerCredential = {
  email: string;
  password: string;
  account: CustomerAccount;
};

const STORE_KEYS = {
  businesses: 'businesses',
  offers: 'offers',
  categories: 'categories',
  bookings: 'bookings',
  slots: 'offerSlots',
};

const GYM_GIF = '/images/218fc872735831.5bf1e45999c40.gif';
const RESTAURANT_GIF = '/images/NOT3bRt5u3.gif';
const SALON_GIF =
  '/images/salon-motion.gif';
const ACTION_GIF = '/images/bc2c5056215299.59a596bb8c323.gif';
const CLINIC_AVIF =
  '/images/personal-trainer-gives-instruction-woman-squat-exercise-illustration_166119-18.avif';

export const businessTypeAssets: Record<BusinessType, string> = {
  Gym: GYM_GIF,
  Restaurant: RESTAURANT_GIF,
  Salon: SALON_GIF,
  Clinic: CLINIC_AVIF,
  Coaching: ACTION_GIF,
  Turf: ACTION_GIF,
  Cosmetics: SALON_GIF,
  'Massage/Spa': CLINIC_AVIF,
  'Gaming Zone': ACTION_GIF,
  'Activity Center': ACTION_GIF,
  Other: ACTION_GIF,
};

export const businesses: Business[] = [
  {
    id: 'b1',
    name: 'Titan Fitness Studio',
    businessType: 'Gym',
    ownerName: 'Aarav Mehta',
    phone: '+91 98765 10001',
    email: 'admin.gym@smartslot.test',
    address: '24 Motion Park, Bandra West',
    city: 'Mumbai',
    openingTime: '06:00',
    closingTime: '22:00',
  },
  {
    id: 'b2',
    name: 'Fork & Flame Bistro',
    businessType: 'Restaurant',
    ownerName: 'Nisha Rao',
    phone: '+91 98765 10002',
    email: 'admin.restaurant@smartslot.test',
    address: '18 Market Lane, Koregaon Park',
    city: 'Pune',
    openingTime: '11:00',
    closingTime: '23:00',
  },
  {
    id: 'b3',
    name: 'Luxe Layer Salon',
    businessType: 'Salon',
    ownerName: 'Rhea Kapoor',
    phone: '+91 98765 10003',
    email: 'admin.salon@smartslot.test',
    address: '9 Pearl Avenue, Indiranagar',
    city: 'Bengaluru',
    openingTime: '10:00',
    closingTime: '20:30',
  },
  {
    id: 'b4',
    name: 'Northstar Clinic',
    businessType: 'Clinic',
    ownerName: 'Dr. Kabir Shah',
    phone: '+91 98765 10004',
    email: 'admin.clinic@smartslot.test',
    address: '42 Wellness Street, Alwarpet',
    city: 'Chennai',
    openingTime: '08:00',
    closingTime: '19:00',
  },
  {
    id: 'b5',
    name: 'MentorMint Coaching',
    businessType: 'Coaching',
    ownerName: 'Ishaan Sethi',
    phone: '+91 98765 10005',
    email: 'admin.coaching@smartslot.test',
    address: '7 Knowledge Square, Salt Lake',
    city: 'Kolkata',
    openingTime: '09:00',
    closingTime: '21:00',
  },
  {
    id: 'b6',
    name: 'Skyline Turf Arena',
    businessType: 'Turf',
    ownerName: 'Dev Nair',
    phone: '+91 98765 10006',
    email: 'admin.turf@smartslot.test',
    address: '3 Arena Road, Hitec City',
    city: 'Hyderabad',
    openingTime: '05:00',
    closingTime: '23:30',
  },
];

export const adminCredentials: AdminCredential[] = [
  {
    email: 'admin.gym@smartslot.test',
    password: 'Gym@12345',
    account: {
      id: 'admin-b1',
      name: 'Aarav Mehta',
      email: 'admin.gym@smartslot.test',
      role: 'Admin',
      businessId: 'b1',
      businessName: 'Titan Fitness Studio',
      businessType: 'Gym',
    },
  },
  {
    email: 'admin.restaurant@smartslot.test',
    password: 'Dine@12345',
    account: {
      id: 'admin-b2',
      name: 'Nisha Rao',
      email: 'admin.restaurant@smartslot.test',
      role: 'Admin',
      businessId: 'b2',
      businessName: 'Fork & Flame Bistro',
      businessType: 'Restaurant',
    },
  },
  {
    email: 'admin.salon@smartslot.test',
    password: 'Salon@12345',
    account: {
      id: 'admin-b3',
      name: 'Rhea Kapoor',
      email: 'admin.salon@smartslot.test',
      role: 'Admin',
      businessId: 'b3',
      businessName: 'Luxe Layer Salon',
      businessType: 'Salon',
    },
  },
  {
    email: 'admin.clinic@smartslot.test',
    password: 'Clinic@12345',
    account: {
      id: 'admin-b4',
      name: 'Dr. Kabir Shah',
      email: 'admin.clinic@smartslot.test',
      role: 'Admin',
      businessId: 'b4',
      businessName: 'Northstar Clinic',
      businessType: 'Clinic',
    },
  },
  {
    email: 'admin.coaching@smartslot.test',
    password: 'Coach@12345',
    account: {
      id: 'admin-b5',
      name: 'Ishaan Sethi',
      email: 'admin.coaching@smartslot.test',
      role: 'Admin',
      businessId: 'b5',
      businessName: 'MentorMint Coaching',
      businessType: 'Coaching',
    },
  },
  {
    email: 'admin.turf@smartslot.test',
    password: 'Turf@12345',
    account: {
      id: 'admin-b6',
      name: 'Dev Nair',
      email: 'admin.turf@smartslot.test',
      role: 'Admin',
      businessId: 'b6',
      businessName: 'Skyline Turf Arena',
      businessType: 'Turf',
    },
  },
];

export const customerCredential: CustomerCredential = {
  email: 'customer@smartslot.test',
  password: 'User@12345',
  account: {
    id: 'customer-1',
    name: 'Maya Customer',
    email: 'customer@smartslot.test',
    role: 'Customer',
  },
};

const defaultCategories: Category[] = [
  { id: 'cat-b1-fitness', businessId: 'b1', name: 'Fitness', description: 'Gym access and strength sessions', color: 'blue', createdAt: '2026-05-20T09:00:00.000Z' },
  { id: 'cat-b1-bootcamp', businessId: 'b1', name: 'Bootcamp', description: 'Group conditioning programs', color: 'emerald', createdAt: '2026-05-20T09:05:00.000Z' },
  { id: 'cat-b1-nutrition', businessId: 'b1', name: 'Nutrition', description: 'Diet and wellness consultations', color: 'amber', createdAt: '2026-05-20T09:10:00.000Z' },
  { id: 'cat-b2-dining', businessId: 'b2', name: 'Dining', description: 'Chef-led table offers', color: 'rose', createdAt: '2026-05-20T10:00:00.000Z' },
  { id: 'cat-b2-buffet', businessId: 'b2', name: 'Buffet', description: 'Time-limited buffet slots', color: 'orange', createdAt: '2026-05-20T10:05:00.000Z' },
  { id: 'cat-b3-hair', businessId: 'b3', name: 'Hair', description: 'Cut, blowout, and styling', color: 'pink', createdAt: '2026-05-20T11:00:00.000Z' },
  { id: 'cat-b3-skin', businessId: 'b3', name: 'Skin', description: 'Facials and glow treatments', color: 'violet', createdAt: '2026-05-20T11:05:00.000Z' },
  { id: 'cat-b4-diagnostics', businessId: 'b4', name: 'Diagnostics', description: 'Preventive health checks', color: 'cyan', createdAt: '2026-05-20T12:00:00.000Z' },
  { id: 'cat-b4-dental', businessId: 'b4', name: 'Dental', description: 'Dental consultation slots', color: 'sky', createdAt: '2026-05-20T12:05:00.000Z' },
  { id: 'cat-b5-math', businessId: 'b5', name: 'Math', description: 'Math mastery workshops', color: 'indigo', createdAt: '2026-05-20T13:00:00.000Z' },
  { id: 'cat-b5-coding', businessId: 'b5', name: 'Coding', description: 'Short coding cohorts', color: 'slate', createdAt: '2026-05-20T13:05:00.000Z' },
  { id: 'cat-b6-football', businessId: 'b6', name: 'Football', description: 'Turf match slots', color: 'lime', createdAt: '2026-05-20T14:00:00.000Z' },
  { id: 'cat-b6-cricket', businessId: 'b6', name: 'Cricket', description: 'Net and turf sessions', color: 'green', createdAt: '2026-05-20T14:05:00.000Z' },
];

const defaultOffers: Offer[] = [
  {
    id: 'offer-b1-gym-trial',
    businessId: 'b1',
    title: 'Afternoon Gym Trial',
    description: 'Experience premium equipment and guided access during calmer afternoon hours.',
    category: 'Fitness',
    originalPrice: 499,
    offerPrice: 99,
    discountPercentage: 80,
    startDate: '2026-05-23',
    endDate: '2026-05-30',
    startTime: '14:00',
    endTime: '17:00',
    totalCapacity: 16,
    maxBookingPerCustomer: 1,
    termsAndConditions: 'Valid for first-time visitors. ID required at reception.',
    status: 'Active',
    imageUrl: GYM_GIF,
    createdAt: '2026-05-23T08:00:00.000Z',
    popularity: 31,
  },
  {
    id: 'offer-b2-lunch',
    businessId: 'b2',
    title: 'Chef Lunch Tasting Table',
    description: 'A weekday tasting table with seasonal plates and reserved quiet-hour seating.',
    category: 'Dining',
    originalPrice: 1800,
    offerPrice: 899,
    discountPercentage: 50,
    startDate: '2026-05-24',
    endDate: '2026-06-03',
    startTime: '12:00',
    endTime: '15:00',
    totalCapacity: 10,
    maxBookingPerCustomer: 4,
    termsAndConditions: 'Reservation valid for dine-in only. Taxes charged at the venue.',
    status: 'Active',
    imageUrl: RESTAURANT_GIF,
    createdAt: '2026-05-23T09:00:00.000Z',
    popularity: 44,
  },
  {
    id: 'offer-b3-glow',
    businessId: 'b3',
    title: 'Glow Facial and Blowout',
    description: 'A polished two-service slot for skin refresh and a soft finish blowout.',
    category: 'Skin',
    originalPrice: 3200,
    offerPrice: 1499,
    discountPercentage: 53,
    startDate: '2026-05-24',
    endDate: '2026-06-07',
    startTime: '10:00',
    endTime: '18:00',
    totalCapacity: 4,
    maxBookingPerCustomer: 1,
    termsAndConditions: 'Patch test may be required. Weekend slots are limited.',
    status: 'Active',
    imageUrl: SALON_GIF,
    createdAt: '2026-05-23T10:00:00.000Z',
    popularity: 27,
  },
  {
    id: 'offer-b4-health-check',
    businessId: 'b4',
    title: 'Preventive Health Checkup',
    description: 'A compact screening package with vitals, core markers, and doctor review.',
    category: 'Diagnostics',
    originalPrice: 2500,
    offerPrice: 1299,
    discountPercentage: 48,
    startDate: '2026-05-24',
    endDate: '2026-06-12',
    startTime: '08:00',
    endTime: '12:00',
    totalCapacity: 6,
    maxBookingPerCustomer: 1,
    termsAndConditions: 'Fasting may be required for select tests. Reports shared digitally.',
    status: 'Active',
    imageUrl: CLINIC_AVIF,
    createdAt: '2026-05-23T11:00:00.000Z',
    popularity: 22,
  },
  {
    id: 'offer-b5-math',
    businessId: 'b5',
    title: 'Weekend Math Masterclass',
    description: 'A focused two-hour small-batch class for problem solving and exam speed.',
    category: 'Math',
    originalPrice: 1200,
    offerPrice: 499,
    discountPercentage: 58,
    startDate: '2026-05-25',
    endDate: '2026-06-01',
    startTime: '10:00',
    endTime: '12:00',
    totalCapacity: 16,
    maxBookingPerCustomer: 1,
    termsAndConditions: 'Suitable for grades 8 to 10. Includes practice worksheet.',
    status: 'Active',
    imageUrl: ACTION_GIF,
    createdAt: '2026-05-23T12:00:00.000Z',
    popularity: 36,
  },
  {
    id: 'offer-b6-turf',
    businessId: 'b6',
    title: 'Evening Football Turf Slot',
    description: 'Prime evening turf access for small teams with clean changing-room access.',
    category: 'Football',
    originalPrice: 3000,
    offerPrice: 1599,
    discountPercentage: 47,
    startDate: '2026-05-24',
    endDate: '2026-05-29',
    startTime: '19:00',
    endTime: '20:00',
    totalCapacity: 1,
    maxBookingPerCustomer: 1,
    termsAndConditions: 'Studs only on turf. Bring booking code at entry.',
    status: 'Active',
    imageUrl: ACTION_GIF,
    createdAt: '2026-05-23T13:00:00.000Z',
    popularity: 52,
  },
];

const defaultSlots: OfferSlot[] = [
  { id: 'slot-b1-1', businessId: 'b1', offerId: 'offer-b1-gym-trial', slotDate: '2026-05-25', startTime: '14:00', endTime: '15:00', capacity: 8, bookedCount: 5, status: 'Available' },
  { id: 'slot-b1-2', businessId: 'b1', offerId: 'offer-b1-gym-trial', slotDate: '2026-05-26', startTime: '16:00', endTime: '17:00', capacity: 8, bookedCount: 8, status: 'Full' },
  { id: 'slot-b2-1', businessId: 'b2', offerId: 'offer-b2-lunch', slotDate: '2026-05-26', startTime: '13:00', endTime: '14:30', capacity: 10, bookedCount: 6, status: 'Available' },
  { id: 'slot-b3-1', businessId: 'b3', offerId: 'offer-b3-glow', slotDate: '2026-05-27', startTime: '11:00', endTime: '12:30', capacity: 4, bookedCount: 2, status: 'Available' },
  { id: 'slot-b4-1', businessId: 'b4', offerId: 'offer-b4-health-check', slotDate: '2026-05-27', startTime: '09:00', endTime: '10:00', capacity: 6, bookedCount: 1, status: 'Available' },
  { id: 'slot-b5-1', businessId: 'b5', offerId: 'offer-b5-math', slotDate: '2026-05-30', startTime: '10:00', endTime: '12:00', capacity: 16, bookedCount: 12, status: 'Available' },
  { id: 'slot-b6-1', businessId: 'b6', offerId: 'offer-b6-turf', slotDate: '2026-05-25', startTime: '19:00', endTime: '20:00', capacity: 1, bookedCount: 0, status: 'Available' },
];

const defaultBookings: Booking[] = [
  { id: 'booking-b1-1', businessId: 'b1', offerId: 'offer-b1-gym-trial', offerTitle: 'Afternoon Gym Trial', customerId: 'customer-1', customerName: 'Maya Customer', customerEmail: 'customer@smartslot.test', slotId: 'slot-b1-1', confirmationCode: 'GY-8492', status: 'Confirmed', createdAt: '2026-05-24T08:20:00.000Z', slotLabel: 'May 25, 2026 - 14:00', people: 1, amount: 99 },
  { id: 'booking-b2-1', businessId: 'b2', offerId: 'offer-b2-lunch', offerTitle: 'Chef Lunch Tasting Table', customerId: 'customer-1', customerName: 'Maya Customer', customerEmail: 'customer@smartslot.test', slotId: 'slot-b2-1', confirmationCode: 'RS-1029', status: 'Pending', createdAt: '2026-05-24T09:35:00.000Z', slotLabel: 'May 26, 2026 - 13:00', people: 2, amount: 1798 },
  { id: 'booking-b3-1', businessId: 'b3', offerId: 'offer-b3-glow', offerTitle: 'Glow Facial and Blowout', customerId: 'customer-1', customerName: 'Maya Customer', customerEmail: 'customer@smartslot.test', slotId: 'slot-b3-1', confirmationCode: 'SL-3321', status: 'Confirmed', createdAt: '2026-05-24T10:10:00.000Z', slotLabel: 'May 27, 2026 - 11:00', people: 1, amount: 1499 },
  { id: 'booking-b6-1', businessId: 'b6', offerId: 'offer-b6-turf', offerTitle: 'Evening Football Turf Slot', customerId: 'customer-1', customerName: 'Maya Customer', customerEmail: 'customer@smartslot.test', slotId: 'slot-b6-1', confirmationCode: 'TF-4419', status: 'Completed', createdAt: '2026-05-23T16:40:00.000Z', slotLabel: 'May 25, 2026 - 19:00', people: 10, amount: 1599 },
];

const legacyFitnessCategories = ['Fitness', 'Bootcamp', 'Nutrition', 'Yoga'];

const createId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const parseDateOnly = (value?: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const addDays = (value: string, days: number) => {
  const date = parseDateOnly(value);
  if (!date) {
    return '';
  }

  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export const validateOfferDates = (startDate?: string, endDate?: string) => {
  const start = parseDateOnly(startDate);
  const end = parseDateOnly(endDate);

  if (!startDate || !start) {
    return 'Start date is required and must be a valid date.';
  }

  if (!endDate || !end) {
    return 'End date is required and must be a valid date.';
  }

  const dayGap = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  if (dayGap < 1) {
    return 'End date must be at least 1 full day after start date.';
  }

  return '';
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const businessExists = (businessId: string) => getBusinesses().some((business) => business.id === businessId);

const readStore = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStore = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('smartslot-store-change', { detail: { key } }));
};

const normalizeOffer = (offer: Offer): Offer => {
  const originalPrice = Number(offer.originalPrice) || 0;
  const offerPrice = Number(offer.offerPrice) || 0;
  const category = offer.category || 'Fitness';
  const legacyBusinessId = legacyFitnessCategories.includes(category) ? 'b1' : offer.businessId;
  const businessId = businessExists(legacyBusinessId) ? legacyBusinessId : 'b1';
  const business = getBusinessById(businessId);
  const discountPercentage = originalPrice > 0 ? Math.max(0, Math.round(((originalPrice - offerPrice) / originalPrice) * 100)) : 0;
  const totalCapacity = Math.max(1, Number(offer.totalCapacity) || 1);
  const maxBookingPerCustomer = Math.max(1, Number(offer.maxBookingPerCustomer) || 1);
  const imageUrl = offer.imageUrl?.includes('sophiachang-illustrator') ? SALON_GIF : offer.imageUrl || businessTypeAssets[business.businessType] || ACTION_GIF;

  return {
    ...offer,
    id: offer.id || createId('offer'),
    businessId,
    category,
    originalPrice,
    offerPrice,
    discountPercentage,
    startDate: offer.startDate || new Date().toISOString().slice(0, 10),
    endDate: offer.endDate || addDays(new Date().toISOString().slice(0, 10), 1),
    startTime: offer.startTime || business.openingTime || '09:00',
    endTime: offer.endTime || business.closingTime || '18:00',
    totalCapacity,
    maxBookingPerCustomer,
    termsAndConditions: offer.termsAndConditions || '',
    status: offer.status || 'Active',
    imageUrl,
    thumbnailUrl: offer.thumbnailUrl || offer.ambientAsset?.url || imageUrl,
    createdAt: offer.createdAt || new Date().toISOString(),
    updatedAt: offer.updatedAt || offer.createdAt || new Date().toISOString(),
    popularity: offer.popularity ?? 0,
  };
};

const normalizeSlot = (slot: OfferSlot): OfferSlot => {
  const capacity = Math.max(1, Number(slot.capacity) || 1);
  const bookedCount = Math.min(Math.max(0, Number(slot.bookedCount) || 0), capacity);
  const explicitStatus = slot.status || 'Available';
  const status = bookedCount >= capacity && explicitStatus === 'Available' ? 'Full' : explicitStatus;

  return {
    ...slot,
    id: slot.id || createId('slot'),
    businessId: slot.businessId || getOfferById(slot.offerId)?.businessId || 'b1',
    capacity,
    bookedCount,
    status,
    createdAt: slot.createdAt || new Date().toISOString(),
    updatedAt: slot.updatedAt || slot.createdAt || new Date().toISOString(),
  };
};

const normalizeBooking = (booking: Booking): Booking => ({
  ...booking,
  id: booking.id || createId('booking'),
  businessId: booking.businessId || getOfferById(booking.offerId)?.businessId || 'b1',
  offerId: booking.offerId || '',
  offerTitle: booking.offerTitle || getOfferById(booking.offerId)?.title || 'Offer',
  customerName: booking.customerName || 'Customer',
  customerPhone: booking.customerPhone || '+91 90000 00000',
  customerEmail: booking.customerEmail || 'customer@smartslot.test',
  confirmationCode: booking.confirmationCode || `BK-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
  status: booking.status || 'Pending',
  paymentStatus: booking.paymentStatus || (booking.status === 'Confirmed' || booking.status === 'Completed' ? 'Paid' : 'Pending'),
  createdAt: booking.createdAt || new Date().toISOString(),
  slotLabel: booking.slotLabel || 'Slot pending',
  people: Number(booking.people) || 1,
  amount: Number(booking.amount) || 0,
  timeline: booking.timeline?.length
    ? booking.timeline
    : [
        {
          id: createId('timeline'),
          status: booking.status || 'Pending',
          label: `Booking ${booking.status || 'Pending'}`,
          createdAt: booking.createdAt || new Date().toISOString(),
        },
      ],
});

export const initializeStore = () => {
  const storedBusinesses = readStore<Business[] | null>(STORE_KEYS.businesses, null);
  const offers = readStore<Offer[] | null>(STORE_KEYS.offers, null);
  const categories = readStore<Category[] | null>(STORE_KEYS.categories, null);
  const slots = readStore<OfferSlot[] | null>(STORE_KEYS.slots, null);
  const bookings = readStore<Booking[] | null>(STORE_KEYS.bookings, null);

  if (!storedBusinesses) {
    writeStore(STORE_KEYS.businesses, businesses);
  }

  if (!offers) {
    writeStore(STORE_KEYS.offers, defaultOffers);
  } else {
    writeStore(STORE_KEYS.offers, offers.map(normalizeOffer));
  }

  if (!categories) {
    writeStore(STORE_KEYS.categories, defaultCategories);
  }

  if (!slots) {
    writeStore(STORE_KEYS.slots, defaultSlots);
  } else {
    writeStore(STORE_KEYS.slots, slots.map(normalizeSlot));
  }

  if (!bookings) {
    writeStore(STORE_KEYS.bookings, defaultBookings);
  } else {
    writeStore(STORE_KEYS.bookings, bookings.map(normalizeBooking));
  }
};

export const hydrateStoreFromApi = (data: {
  businesses?: Business[];
  offers?: Offer[];
  slots?: OfferSlot[];
  bookings?: Booking[];
}) => {
  if (data.businesses?.length) {
    writeStore(STORE_KEYS.businesses, data.businesses);
  }

  if (data.offers) {
    const normalizedOffers = data.offers.map(normalizeOffer);
    writeStore(STORE_KEYS.offers, normalizedOffers);

    const existingCategories = readStore<Category[]>(STORE_KEYS.categories, defaultCategories);
    const derivedCategories = normalizedOffers.reduce<Category[]>((acc, offer) => {
      const exists = acc.some(
        (category) =>
          category.businessId === offer.businessId
          && category.name.toLowerCase() === offer.category.toLowerCase(),
      );

      if (!exists) {
        acc.push({
          id: `api-cat-${offer.businessId}-${offer.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          businessId: offer.businessId,
          name: offer.category,
          description: 'Synced from backend offer data.',
          color: 'blue',
          createdAt: offer.createdAt || new Date().toISOString(),
        });
      }

      return acc;
    }, []);

    const mergedCategories = [
      ...existingCategories.filter(
        (category) =>
          !derivedCategories.some(
            (derived) =>
              derived.businessId === category.businessId
              && derived.name.toLowerCase() === category.name.toLowerCase(),
          ),
      ),
      ...derivedCategories,
    ];
    writeStore(STORE_KEYS.categories, mergedCategories);
  }

  if (data.slots) {
    writeStore(STORE_KEYS.slots, data.slots.map(normalizeSlot));
  }

  if (data.bookings) {
    writeStore(STORE_KEYS.bookings, data.bookings.map(normalizeBooking));
  }
};

export const authenticateAdmin = (email: string, password: string): AdminAccount | null => {
  const credential = adminCredentials.find(
    (admin) => normalizeEmail(admin.email) === normalizeEmail(email) && admin.password === password,
  );

  return credential ? { ...credential.account } : null;
};

export const authenticateCustomer = (email: string, password: string): CustomerAccount | null => {
  if (normalizeEmail(email) === normalizeEmail(customerCredential.email) && password === customerCredential.password) {
    return { ...customerCredential.account };
  }

  return null;
};

export const getBusinesses = () => readStore<Business[]>(STORE_KEYS.businesses, businesses);

export const getBusinessById = (businessId: string) =>
  getBusinesses().find((business) => business.id === businessId) || getBusinesses()[0];

export const saveBusinessRecord = (business: Business) => {
  const next = getBusinesses().map((item) => (item.id === business.id ? { ...business, createdAt: business.createdAt || item.createdAt || new Date().toISOString() } : item));
  writeStore(STORE_KEYS.businesses, next);
  return business;
};

export const getBusinessByOffer = (offer: Offer) => getBusinessById(offer.businessId);

export const getAllOffers = () => readStore<Offer[]>(STORE_KEYS.offers, defaultOffers).map(normalizeOffer);

export const getOffersByBusiness = (businessId: string) =>
  getAllOffers().filter((offer) => offer.businessId === businessId);

export const getOfferById = (offerId: string) => getAllOffers().find((offer) => offer.id === offerId);

export const saveOfferRecord = (offer: Offer) => {
  const offers = getAllOffers();
  const normalized = normalizeOffer({ ...offer, updatedAt: new Date().toISOString() });
  const existingIndex = offers.findIndex((item) => item.id === normalized.id);
  const next = existingIndex >= 0
    ? offers.map((item) => (item.id === normalized.id ? normalized : item))
    : [normalized, ...offers];

  writeStore(STORE_KEYS.offers, next);
  return normalized;
};

export const duplicateOfferRecord = (offerId: string) => {
  const offer = getOfferById(offerId);
  if (!offer) {
    return null;
  }

  const duplicate = normalizeOffer({
    ...offer,
    id: createId('offer'),
    title: `${offer.title} Copy`,
    status: 'Draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    popularity: 0,
  });

  writeStore(STORE_KEYS.offers, [duplicate, ...getAllOffers()]);
  return duplicate;
};

export const updateOfferStatus = (offerId: string, status: OfferStatus) => {
  const offer = getOfferById(offerId);
  if (!offer) {
    return null;
  }

  return saveOfferRecord({ ...offer, status });
};

export const deleteOfferRecord = (offerId: string) => {
  writeStore(STORE_KEYS.offers, getAllOffers().filter((offer) => offer.id !== offerId));
  writeStore(STORE_KEYS.slots, getAllSlots().filter((slot) => slot.offerId !== offerId));
  writeStore(STORE_KEYS.bookings, getAllBookings().filter((booking) => booking.offerId !== offerId));
};

export const getAllCategories = () => readStore<Category[]>(STORE_KEYS.categories, defaultCategories);

export const getCategoriesByBusiness = (businessId: string) =>
  getAllCategories().filter((category) => category.businessId === businessId);

export const saveCategoryRecord = (category: Omit<Category, 'id' | 'createdAt'> & Partial<Pick<Category, 'id' | 'createdAt'>>) => {
  const categories = getAllCategories();
  const normalized: Category = {
    id: category.id || createId('category'),
    businessId: category.businessId,
    name: category.name.trim(),
    description: category.description?.trim(),
    color: category.color || 'blue',
    createdAt: category.createdAt || new Date().toISOString(),
  };
  const next = categories.some((item) => item.id === normalized.id)
    ? categories.map((item) => (item.id === normalized.id ? normalized : item))
    : [normalized, ...categories];

  writeStore(STORE_KEYS.categories, next);
  return normalized;
};

export const deleteCategoryRecord = (categoryId: string) => {
  const category = getAllCategories().find((item) => item.id === categoryId);

  if (!category) {
    return { ok: false, error: 'Category not found.' };
  }

  const isUsed = getOffersByBusiness(category.businessId).some((offer) => offer.category === category.name);
  if (isUsed) {
    return { ok: false, error: 'This category is assigned to an offer. Reassign or delete the offer first.' };
  }

  writeStore(STORE_KEYS.categories, getAllCategories().filter((item) => item.id !== categoryId));
  return { ok: true, error: '' };
};

export const getAllSlots = () => readStore<OfferSlot[]>(STORE_KEYS.slots, defaultSlots).map(normalizeSlot);

export const getSlotsByOffer = (offerId: string) =>
  getAllSlots().filter((slot) => slot.offerId === offerId);

export const getSlotsByBusiness = (businessId: string) =>
  getAllSlots().filter((slot) => slot.businessId === businessId);

export const saveSlotRecord = (slot: Omit<OfferSlot, 'id'> & Partial<Pick<OfferSlot, 'id'>>) => {
  const slots = getAllSlots();
  const capacity = Math.max(1, Number(slot.capacity) || 1);
  const bookedCount = Math.min(Number(slot.bookedCount) || 0, capacity);
  const normalized: OfferSlot = normalizeSlot({
    id: slot.id || createId('slot'),
    businessId: slot.businessId,
    offerId: slot.offerId,
    slotDate: slot.slotDate,
    startTime: slot.startTime,
    endTime: slot.endTime,
    capacity,
    bookedCount,
    status: bookedCount >= capacity && slot.status === 'Available' ? 'Full' : slot.status || 'Available',
    createdAt: slot.createdAt,
    updatedAt: new Date().toISOString(),
  });
  const next = slots.some((item) => item.id === normalized.id)
    ? slots.map((item) => (item.id === normalized.id ? normalized : item))
    : [normalized, ...slots];

  writeStore(STORE_KEYS.slots, next);
  return normalized;
};

export const updateSlotStatus = (slotId: string, status: SlotStatus) => {
  const slot = getAllSlots().find((item) => item.id === slotId);
  if (!slot) {
    return null;
  }

  return saveSlotRecord({ ...slot, status });
};

export const deleteSlotRecord = (slotId: string) => {
  writeStore(STORE_KEYS.slots, getAllSlots().filter((slot) => slot.id !== slotId));
};

export const getAllBookings = () => readStore<Booking[]>(STORE_KEYS.bookings, defaultBookings).map(normalizeBooking);

export const getBookingsByBusiness = (businessId: string) =>
  getAllBookings().filter((booking) => booking.businessId === businessId);

export const getBookingById = (bookingId: string) =>
  getAllBookings().find((booking) => booking.id === bookingId);

export const createBookingRecord = (input: {
  offerId: string;
  slotId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  people: number;
  specialNote?: string;
}) => {
  const offer = getOfferById(input.offerId);
  const slot = getAllSlots().find((item) => item.id === input.slotId);

  if (!offer || !slot) {
    return { ok: false, error: 'Offer or slot could not be found.', booking: null };
  }

  if (offer.status !== 'Active') {
    return { ok: false, error: 'Only active offers can be booked.', booking: null };
  }

  if (new Date(`${offer.endDate}T23:59:59`).getTime() < Date.now()) {
    return { ok: false, error: 'Expired offers cannot be booked.', booking: null };
  }

  if (slot.status !== 'Available' || slot.bookedCount >= slot.capacity) {
    return { ok: false, error: 'This slot is full or not available.', booking: null };
  }

  const people = Math.max(1, Number(input.people) || 1);
  const available = slot.capacity - slot.bookedCount;
  if (people > available) {
    return { ok: false, error: `Only ${available} seats are available for this slot.`, booking: null };
  }

  const phoneBookings = getAllBookings().filter(
    (booking) => booking.offerId === offer.id
      && booking.customerPhone === input.customerPhone
      && booking.status !== 'Cancelled',
  );

  if (phoneBookings.length >= (offer.maxBookingPerCustomer || 1)) {
    return { ok: false, error: 'This phone number has reached the max booking limit for this offer.', booking: null };
  }

  const nextSlot = normalizeSlot({ ...slot, bookedCount: slot.bookedCount + people });
  const booking: Booking = normalizeBooking({
    id: createId('booking'),
    businessId: offer.businessId,
    offerId: offer.id,
    offerTitle: offer.title,
    customerId: input.customerId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail || '',
    slotId: slot.id,
    confirmationCode: `BK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    status: 'Pending',
    paymentStatus: 'Pending',
    createdAt: new Date().toISOString(),
    slotLabel: `${slot.slotDate} - ${slot.startTime} to ${slot.endTime}`,
    people,
    amount: people * offer.offerPrice,
    specialNote: input.specialNote,
    timeline: [
      {
        id: createId('timeline'),
        status: 'Pending',
        label: 'Booking created',
        createdAt: new Date().toISOString(),
      },
    ],
  });

  writeStore(STORE_KEYS.slots, getAllSlots().map((item) => (item.id === slot.id ? nextSlot : item)));
  writeStore(STORE_KEYS.bookings, [booking, ...getAllBookings()]);

  return { ok: true, error: '', booking };
};

export const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
  const next = getAllBookings().map((booking) => (
    booking.id === bookingId
      ? {
          ...booking,
          status,
          paymentStatus: status === 'Cancelled' ? 'Refunded' : booking.paymentStatus,
          timeline: [
            ...(booking.timeline || []),
            {
              id: createId('timeline'),
              status,
              label: `Status changed to ${status}`,
              createdAt: new Date().toISOString(),
            },
          ],
        }
      : booking
  ));
  writeStore(STORE_KEYS.bookings, next);
};

export const getOfferAvailability = (offerId: string) => {
  const slots = getSlotsByOffer(offerId);
  const totalCapacity = slots.reduce((sum, slot) => sum + slot.capacity, 0);
  const bookedCount = slots.reduce((sum, slot) => sum + slot.bookedCount, 0);
  const openSlots = slots.filter((slot) => slot.status === 'Available' && slot.bookedCount < slot.capacity).length;

  return {
    totalCapacity,
    bookedCount,
    remaining: Math.max(totalCapacity - bookedCount, 0),
    openSlots,
  };
};

export const getOfferSlotSummary = (offerId: string) => {
  const slots = getSlotsByOffer(offerId);
  const totalCapacity = slots.reduce((sum, slot) => sum + slot.capacity, 0);
  const bookedCount = slots.reduce((sum, slot) => sum + slot.bookedCount, 0);

  return {
    slotCount: slots.length,
    totalCapacity,
    bookedCount,
    remaining: Math.max(totalCapacity - bookedCount, 0),
    utilization: totalCapacity ? Math.round((bookedCount / totalCapacity) * 100) : 0,
  };
};

export const getOfferPopularity = (offer: Offer) =>
  (offer.popularity || 0) + getAllBookings().filter((booking) => booking.offerId === offer.id).length;

export const calculateDiscount = (originalPrice: number, offerPrice: number) => {
  if (originalPrice <= 0 || offerPrice <= 0 || offerPrice >= originalPrice) {
    return 0;
  }

  return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
};
