import { useCallback, useEffect, useState } from 'react';
import { BookingStatus, Business, Category, Offer, OfferSlot, OfferStatus, SlotStatus } from '../types';
import {
  deleteCategoryRecord,
  deleteOfferRecord,
  deleteSlotRecord,
  duplicateOfferRecord,
  getAllOffers,
  getBusinessById,
  getBusinesses,
  getBookingsByBusiness,
  getCategoriesByBusiness,
  getOfferById,
  getOffersByBusiness,
  getSlotsByBusiness,
  getSlotsByOffer,
  saveCategoryRecord,
  saveBusinessRecord,
  saveOfferRecord,
  saveSlotRecord,
  updateBookingStatus,
  updateOfferStatus,
  updateSlotStatus,
} from '../services/dataStore';

const STORE_CHANGE_EVENT = 'smartslot-store-change';

const useStoreListener = (reload: () => void) => {
  useEffect(() => {
    reload();
    window.addEventListener(STORE_CHANGE_EVENT, reload);
    window.addEventListener('storage', reload);

    return () => {
      window.removeEventListener(STORE_CHANGE_EVENT, reload);
      window.removeEventListener('storage', reload);
    };
  }, [reload]);
};

export const useOffers = (businessId?: string) => {
  const [offers, setOffers] = useState<Offer[]>([]);

  const reload = useCallback(() => {
    setOffers(businessId ? getOffersByBusiness(businessId) : getAllOffers());
  }, [businessId]);

  useStoreListener(reload);

  const saveOffer = (offer: Offer) => saveOfferRecord(offer);
  const updateOffer = (updatedOffer: Offer) => saveOfferRecord(updatedOffer);
  const setOfferStatus = (offerId: string, status: OfferStatus) => updateOfferStatus(offerId, status);
  const deleteOffer = (id: string) => deleteOfferRecord(id);
  const duplicateOffer = (id: string) => duplicateOfferRecord(id);

  return { offers, saveOffer, updateOffer, setOfferStatus, deleteOffer, duplicateOffer, getOfferById };
};

export const useBusinessProfile = (businessId: string) => {
  const [business, setBusiness] = useState<Business>(() => getBusinessById(businessId));

  const reload = useCallback(() => {
    setBusiness(getBusinessById(businessId));
  }, [businessId]);

  useStoreListener(reload);

  return {
    business,
    businesses: getBusinesses(),
    saveBusiness: saveBusinessRecord,
  };
};

export const useCategories = (businessId: string) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const reload = useCallback(() => {
    setCategories(getCategoriesByBusiness(businessId));
  }, [businessId]);

  useStoreListener(reload);

  return {
    categories,
    saveCategory: saveCategoryRecord,
    deleteCategory: deleteCategoryRecord,
  };
};

export const useBookings = (businessId: string) => {
  const [bookings, setBookings] = useState(getBookingsByBusiness(businessId));

  const reload = useCallback(() => {
    setBookings(getBookingsByBusiness(businessId));
  }, [businessId]);

  useStoreListener(reload);

  const setBookingStatus = (bookingId: string, status: BookingStatus) => updateBookingStatus(bookingId, status);

  return { bookings, setBookingStatus };
};

export const useSlots = (offerId?: string, businessId?: string) => {
  const [slots, setSlots] = useState<OfferSlot[]>([]);

  const reload = useCallback(() => {
    if (offerId) {
      setSlots(getSlotsByOffer(offerId));
      return;
    }

    if (businessId) {
      setSlots(getSlotsByBusiness(businessId));
      return;
    }

    setSlots([]);
  }, [businessId, offerId]);

  useStoreListener(reload);

  const saveSlot = (slot: Omit<OfferSlot, 'id'> & Partial<Pick<OfferSlot, 'id'>>) => saveSlotRecord(slot);
  const setSlotStatus = (slotId: string, status: SlotStatus) => updateSlotStatus(slotId, status);
  const deleteSlot = (slotId: string) => deleteSlotRecord(slotId);

  return { slots, saveSlot, setSlotStatus, deleteSlot };
};
