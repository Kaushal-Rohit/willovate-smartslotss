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
import {
  deleteOfferApi,
  deleteSlotApi,
  saveBusinessApi,
  saveOfferApi,
  saveSlotApi,
  shouldUseApi,
  syncApiData,
  updateBookingStatusApi,
  updateOfferStatusApi,
  updateSlotStatusApi,
} from '../services/apiClient';

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

  useEffect(() => {
    if (!shouldUseApi()) {
      return;
    }

    let active = true;
    syncApiData({ businessId, includeInactive: Boolean(businessId) })
      .then(() => {
        if (active) {
          reload();
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [businessId, reload]);

  const refreshRemote = () => {
    if (!shouldUseApi()) {
      return;
    }

    syncApiData({ businessId, includeInactive: Boolean(businessId) })
      .then(reload)
      .catch(() => undefined);
  };

  const saveOffer = (offer: Offer) => {
    const saved = saveOfferRecord(offer);
    if (shouldUseApi()) {
      saveOfferApi(saved).then(refreshRemote).catch(() => undefined);
    }
    return saved;
  };
  const updateOffer = (updatedOffer: Offer) => saveOffer(updatedOffer);
  const setOfferStatus = (offerId: string, status: OfferStatus) => {
    const updated = updateOfferStatus(offerId, status);
    if (updated && shouldUseApi()) {
      updateOfferStatusApi(updated, status).then(refreshRemote).catch(() => undefined);
    }
    return updated;
  };
  const deleteOffer = (id: string) => {
    deleteOfferRecord(id);
    if (shouldUseApi()) {
      deleteOfferApi(id).then(refreshRemote).catch(() => undefined);
    }
  };
  const duplicateOffer = (id: string) => {
    const duplicated = duplicateOfferRecord(id);
    if (duplicated && shouldUseApi()) {
      saveOfferApi(duplicated).then(refreshRemote).catch(() => undefined);
    }
    return duplicated;
  };

  return { offers, saveOffer, updateOffer, setOfferStatus, deleteOffer, duplicateOffer, getOfferById };
};

export const useBusinessProfile = (businessId: string) => {
  const [business, setBusiness] = useState<Business>(() => getBusinessById(businessId));

  const reload = useCallback(() => {
    setBusiness(getBusinessById(businessId));
  }, [businessId]);

  useStoreListener(reload);

  useEffect(() => {
    if (!shouldUseApi()) {
      return;
    }

    let active = true;
    syncApiData({ businessId, includeInactive: true })
      .then(() => {
        if (active) {
          reload();
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [businessId, reload]);

  const saveBusiness = (updatedBusiness: Business) => {
    const saved = saveBusinessRecord(updatedBusiness);
    if (shouldUseApi()) {
      saveBusinessApi(saved)
        .then(() => syncApiData({ businessId, includeInactive: true }).then(reload))
        .catch(() => undefined);
    }
    return saved;
  };

  return {
    business,
    businesses: getBusinesses(),
    saveBusiness,
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

  useEffect(() => {
    if (!shouldUseApi()) {
      return;
    }

    let active = true;
    syncApiData({ businessId, includeInactive: true })
      .then(() => {
        if (active) {
          reload();
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [businessId, reload]);

  const setBookingStatus = (bookingId: string, status: BookingStatus) => {
    updateBookingStatus(bookingId, status);
    if (shouldUseApi()) {
      updateBookingStatusApi(bookingId, status)
        .then(() => syncApiData({ businessId, includeInactive: true }).then(reload))
        .catch(() => undefined);
    }
  };

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

  useEffect(() => {
    if (!shouldUseApi()) {
      return;
    }

    let active = true;
    syncApiData({ businessId, includeInactive: true })
      .then(() => {
        if (active) {
          reload();
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [businessId, reload]);

  const refreshRemote = () => {
    if (!shouldUseApi()) {
      return;
    }

    syncApiData({ businessId, includeInactive: true }).then(reload).catch(() => undefined);
  };

  const saveSlot = (slot: Omit<OfferSlot, 'id'> & Partial<Pick<OfferSlot, 'id'>>) => {
    const saved = saveSlotRecord(slot);
    if (shouldUseApi()) {
      saveSlotApi(saved).then(refreshRemote).catch(() => undefined);
    }
    return saved;
  };
  const setSlotStatus = (slotId: string, status: SlotStatus) => {
    const updated = updateSlotStatus(slotId, status);
    if (updated && shouldUseApi()) {
      updateSlotStatusApi(updated, status).then(refreshRemote).catch(() => undefined);
    }
    return updated;
  };
  const deleteSlot = (slotId: string) => {
    deleteSlotRecord(slotId);
    if (shouldUseApi()) {
      deleteSlotApi(slotId).then(refreshRemote).catch(() => undefined);
    }
  };

  return { slots, saveSlot, setSlotStatus, deleteSlot };
};
