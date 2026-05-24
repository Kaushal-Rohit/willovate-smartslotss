import { AdminAccount, Booking, BookingStatus, Business, CustomerAccount, Offer, OfferSlot, OfferStatus, SlotStatus } from '../types';
import { hydrateStoreFromApi } from './dataStore';

type LoginResponse<TAccount> = {
  token: string;
  account: TAccount;
};

type SyncOptions = {
  businessId?: string;
  includeInactive?: boolean;
};

type ApiRequestOptions = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '').endsWith('/api')
  ? rawBaseUrl.replace(/\/+$/, '')
  : `${rawBaseUrl.replace(/\/+$/, '')}/api`;

export const shouldUseApi = () => import.meta.env.VITE_USE_MOCK_DATA === 'false';

export const isGuid = (value?: string) =>
  Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));

const buildQuery = (params: Record<string, string | number | boolean | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  const value = query.toString();
  return value ? `?${value}` : '';
};

const apiRequest = async <T,>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new ApiError(payload?.message || `API request failed with status ${response.status}.`, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Backend API is unavailable. Falling back to local demo data.', 0);
  }
};

export const loginAdminApi = async (email: string, password: string) => {
  const response = await apiRequest<LoginResponse<AdminAccount>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role: 'Admin' }),
  });
  return response.account;
};

export const loginCustomerApi = async (email: string, password: string) => {
  const response = await apiRequest<LoginResponse<CustomerAccount>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role: 'Customer' }),
  });
  return response.account;
};

export const fetchBusinessesApi = () => apiRequest<Business[]>('/business');

export const saveBusinessApi = (business: Business) =>
  apiRequest<Business>(`/business/${business.id}`, {
    method: 'PUT',
    body: JSON.stringify(business),
  });

export const fetchOffersApi = (options: SyncOptions = {}) =>
  apiRequest<Offer[]>(`/offers${buildQuery({ businessId: options.businessId, includeInactive: options.includeInactive })}`);

export const fetchOfferApi = (offerId: string) => apiRequest<Offer>(`/offers/${offerId}`);

export const saveOfferApi = (offer: Offer) => {
  if (isGuid(offer.id)) {
    return apiRequest<Offer>(`/offers/${offer.id}`, {
      method: 'PUT',
      body: JSON.stringify(offer),
    });
  }

  return apiRequest<Offer>('/offers', {
    method: 'POST',
    body: JSON.stringify(offer),
  });
};

export const updateOfferStatusApi = (offer: Offer, status: OfferStatus) =>
  saveOfferApi({ ...offer, status, updatedAt: new Date().toISOString() });

export const deleteOfferApi = (offerId: string) =>
  isGuid(offerId)
    ? apiRequest<void>(`/offers/${offerId}`, { method: 'DELETE' })
    : Promise.resolve();

export const fetchSlotsApi = (options: SyncOptions & { offerId?: string } = {}) =>
  apiRequest<OfferSlot[]>(`/slots${buildQuery({ businessId: options.businessId, offerId: options.offerId })}`);

export const fetchOfferSlotsApi = (offerId: string) => apiRequest<OfferSlot[]>(`/offers/${offerId}/slots`);

export const saveSlotApi = (slot: Omit<OfferSlot, 'id'> & Partial<Pick<OfferSlot, 'id'>>) => {
  if (isGuid(slot.id)) {
    return apiRequest<OfferSlot>(`/slots/${slot.id}`, {
      method: 'PUT',
      body: JSON.stringify(slot),
    });
  }

  return apiRequest<OfferSlot>('/slots', {
    method: 'POST',
    body: JSON.stringify(slot),
  });
};

export const updateSlotStatusApi = (slot: OfferSlot, status: SlotStatus) =>
  saveSlotApi({ ...slot, status, updatedAt: new Date().toISOString() });

export const deleteSlotApi = (slotId: string) =>
  isGuid(slotId)
    ? apiRequest<void>(`/slots/${slotId}`, { method: 'DELETE' })
    : Promise.resolve();

export const fetchBookingsApi = (businessId?: string) =>
  apiRequest<Booking[]>(`/bookings${buildQuery({ businessId })}`);

export const createBookingApi = (input: {
  offerId: string;
  slotId: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  people: number;
  specialNote?: string;
}) =>
  apiRequest<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      customerId: isGuid(input.customerId) ? input.customerId : undefined,
    }),
  });

export const updateBookingStatusApi = (bookingId: string, status: BookingStatus) =>
  isGuid(bookingId)
    ? apiRequest<Booking>(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
    : Promise.resolve(undefined);

export const syncApiData = async (options: SyncOptions = {}) => {
  if (!shouldUseApi()) {
    return;
  }

  const [businesses, offers, slots, bookings] = await Promise.all([
    fetchBusinessesApi(),
    fetchOffersApi({ businessId: options.businessId, includeInactive: options.includeInactive ?? Boolean(options.businessId) }),
    fetchSlotsApi({ businessId: options.businessId }),
    options.businessId ? fetchBookingsApi(options.businessId) : Promise.resolve(undefined),
  ]);

  hydrateStoreFromApi({
    businesses,
    offers,
    slots,
    bookings,
  });
};
