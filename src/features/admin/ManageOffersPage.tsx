import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  CalendarClock,
  Copy,
  Edit3,
  PauseCircle,
  PlayCircle,
  PlusCircle,
  Search,
  TimerOff,
  Trash2,
  X,
} from 'lucide-react';
import { AmbientAssetPreview } from '../../components/ambient/AmbientAssetPreview';
import { GlassButton } from '../../components/ui/GlassButton';
import { InputField } from '../../components/ui/InputField';
import { useCategories, useOffers, useSlots } from '../../hooks/useOffers';
import { Offer, OfferSlot, OfferStatus, SlotStatus } from '../../types';
import {
  getBusinessById,
  getOfferPopularity,
  getOfferSlotSummary,
} from '../../services/dataStore';

interface ManageOffersPageProps {
  businessId: string;
  onCreateOffer?: () => void;
  onEditOffer?: (offerId: string) => void;
}

type SortOption = 'latest' | 'highestBookings' | 'endingSoon' | 'highestDiscount';

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const selectClass =
  'rounded-xl border border-slate-300 bg-white/70 px-3 py-2.5 text-sm text-slate-900 backdrop-blur-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/35 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white';

const badgeClass = (status: string) => {
  switch (status) {
    case 'Active':
    case 'Available':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'Paused':
    case 'Pending':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'Full':
    case 'Closed':
    case 'Expired':
      return 'bg-slate-500/10 text-slate-700 dark:text-slate-300';
    case 'Cancelled':
      return 'bg-red-500/10 text-red-700 dark:text-red-300';
    default:
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
  }
};

const utilizationColor = (value: number) => {
  if (value >= 90) return 'bg-red-500';
  if (value >= 70) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const SlotManager: React.FC<{ offer: Offer; onClose: () => void }> = ({ offer, onClose }) => {
  const { slots, saveSlot, setSlotStatus, deleteSlot } = useSlots(offer.id);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slotForm, setSlotForm] = useState({
    slotDate: '',
    startTime: offer.startTime || '',
    endTime: offer.endTime || '',
    capacity: offer.totalCapacity || 1,
    bookedCount: 0,
    status: 'Available' as SlotStatus,
  });

  const resetSlotForm = () => {
    setEditingSlotId(null);
    setSlotForm({
      slotDate: '',
      startTime: offer.startTime || '',
      endTime: offer.endTime || '',
      capacity: offer.totalCapacity || 1,
      bookedCount: 0,
      status: 'Available',
    });
  };

  const editSlot = (slot: OfferSlot) => {
    setEditingSlotId(slot.id);
    setSlotForm({
      slotDate: slot.slotDate,
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity,
      bookedCount: slot.bookedCount,
      status: slot.status,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSlot({
      id: editingSlotId || undefined,
      businessId: offer.businessId,
      offerId: offer.id,
      slotDate: slotForm.slotDate,
      startTime: slotForm.startTime,
      endTime: slotForm.endTime,
      capacity: Number(slotForm.capacity) || 1,
      bookedCount: Number(slotForm.bookedCount) || 0,
      status: slotForm.status,
    });
    resetSlotForm();
  };

  return (
    <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950" initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-slate-800">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Manage slots</p>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">{offer.title}</h2>
          </div>
          <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose} type="button" aria-label="Close slots modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid max-h-[calc(90vh-85px)] grid-cols-1 gap-0 overflow-y-auto lg:grid-cols-[340px_1fr]">
          <form onSubmit={handleSubmit} className="space-y-4 border-b border-slate-200 p-5 dark:border-slate-800 lg:border-b-0 lg:border-r">
            <InputField label="Slot Date" type="date" value={slotForm.slotDate} onChange={(event) => setSlotForm((prev) => ({ ...prev, slotDate: event.target.value }))} required />
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Start" type="time" value={slotForm.startTime} onChange={(event) => setSlotForm((prev) => ({ ...prev, startTime: event.target.value }))} required />
              <InputField label="End" type="time" value={slotForm.endTime} onChange={(event) => setSlotForm((prev) => ({ ...prev, endTime: event.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="Capacity" type="number" min="1" value={slotForm.capacity} onChange={(event) => setSlotForm((prev) => ({ ...prev, capacity: Number(event.target.value) }))} required />
              <InputField label="Booked" type="number" min="0" value={slotForm.bookedCount} onChange={(event) => setSlotForm((prev) => ({ ...prev, bookedCount: Number(event.target.value) }))} required />
            </div>
            <select value={slotForm.status} onChange={(event) => setSlotForm((prev) => ({ ...prev, status: event.target.value as SlotStatus }))} className={`${selectClass} w-full`}>
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Closed">Closed</option>
              <option value="Expired">Expired</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex gap-2">
              {editingSlotId && (
                <GlassButton type="button" variant="secondary" className="flex-1" onClick={resetSlotForm}>
                  Cancel
                </GlassButton>
              )}
              <GlassButton type="submit" className="flex-1">
                <PlusCircle className="h-4 w-4" />
                {editingSlotId ? 'Save Slot' : 'Add Slot'}
              </GlassButton>
            </div>
          </form>

          <div className="overflow-x-auto p-5">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Time</th>
                  <th className="pb-3 font-semibold">Capacity</th>
                  <th className="pb-3 font-semibold">Utilization</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {slots.map((slot) => {
                  const remaining = Math.max(slot.capacity - slot.bookedCount, 0);
                  const percentage = slot.capacity ? Math.round((slot.bookedCount / slot.capacity) * 100) : 0;

                  return (
                    <tr key={slot.id} className="align-middle">
                      <td className="py-4 font-medium text-slate-950 dark:text-white">{slot.slotDate}</td>
                      <td className="py-4 text-slate-600 dark:text-slate-300">{slot.startTime} - {slot.endTime}</td>
                      <td className="py-4 text-slate-600 dark:text-slate-300">{slot.bookedCount}/{slot.capacity} <span className="text-xs text-slate-400">({remaining} left)</span></td>
                      <td className="py-4">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <div className={`h-full rounded-full ${utilizationColor(percentage)}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
                        </div>
                        <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{percentage}% booked</p>
                      </td>
                      <td className="py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(slot.status)}`}>{slot.status}</span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <GlassButton variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => editSlot(slot)}>Edit</GlassButton>
                          <GlassButton variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => setSlotStatus(slot.id, slot.status === 'Closed' ? 'Available' : 'Closed')}>
                            {slot.status === 'Closed' ? 'Reopen' : 'Close'}
                          </GlassButton>
                          <GlassButton variant="danger" className="px-3 py-1.5 text-xs" onClick={() => deleteSlot(slot.id)}>Delete</GlassButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!slots.length && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500 dark:text-slate-400">
                      No slots yet. Add one from the form.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AnalyticsModal: React.FC<{ offer: Offer; onClose: () => void }> = ({ offer, onClose }) => {
  const summary = getOfferSlotSummary(offer.id);
  const popularity = getOfferPopularity(offer);

  return (
    <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-full max-w-2xl rounded-3xl border border-white/50 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950" initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Offer analytics</p>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">{offer.title}</h2>
          </div>
          <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onClose} type="button" aria-label="Close analytics modal">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ['Bookings', summary.bookedCount],
            ['Remaining', summary.remaining],
            ['Utilization', `${summary.utilization}%`],
            ['Popularity', popularity],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/65">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
          <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Booking utilization</span>
            <span>{summary.utilization}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <motion.div className={`h-full ${utilizationColor(summary.utilization)}`} initial={{ width: 0 }} animate={{ width: `${Math.min(summary.utilization, 100)}%` }} transition={{ duration: 0.7 }} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ManageOffersPage: React.FC<ManageOffersPageProps> = ({ businessId, onCreateOffer, onEditOffer }) => {
  const { offers, deleteOffer, setOfferStatus, duplicateOffer } = useOffers(businessId);
  const { categories } = useCategories(businessId);
  const business = getBusinessById(businessId);
  const [slotOffer, setSlotOffer] = useState<Offer | null>(null);
  const [analyticsOffer, setAnalyticsOffer] = useState<Offer | null>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<'All' | OfferStatus>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 240);
    return () => window.clearTimeout(timer);
  }, [query]);

  const filteredOffers = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    return offers
      .filter((offer) => {
        const matchesQuery = !normalizedQuery
          || offer.title.toLowerCase().includes(normalizedQuery)
          || offer.category.toLowerCase().includes(normalizedQuery)
          || offer.description.toLowerCase().includes(normalizedQuery)
          || business.name.toLowerCase().includes(normalizedQuery);
        const matchesCategory = category === 'All' || offer.category === category;
        const matchesStatus = status === 'All' || offer.status === status;
        const matchesDateFrom = !dateFrom || offer.startDate >= dateFrom;
        const matchesDateTo = !dateTo || offer.endDate <= dateTo;

        return matchesQuery && matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'highestBookings':
            return getOfferSlotSummary(b.id).bookedCount - getOfferSlotSummary(a.id).bookedCount;
          case 'endingSoon':
            return Date.parse(a.endDate) - Date.parse(b.endDate);
          case 'highestDiscount':
            return b.discountPercentage - a.discountPercentage;
          case 'latest':
          default:
            return Date.parse(b.createdAt || b.startDate) - Date.parse(a.createdAt || a.startDate);
        }
      });
  }, [business.name, category, dateFrom, dateTo, debouncedQuery, offers, sortBy, status]);

  const handleDelete = (offer: Offer) => {
    if (window.confirm(`Delete "${offer.title}" and its slots/bookings?`)) {
      deleteOffer(offer.id);
    }
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{business.name}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Manage Offers</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Complete offer management with slots, capacity, analytics, and ambient previews.</p>
        </div>
        <GlassButton onClick={onCreateOffer} className="py-3">
          <PlusCircle className="h-4 w-4" />
          Add New Offer
        </GlassButton>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm shadow-slate-950/5 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search offers, categories, business" className={`${selectClass} w-full pl-9`} />
          </div>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className={selectClass}>
            <option value="All">All categories</option>
            {categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value as 'All' | OfferStatus)} className={selectClass}>
            <option value="All">All statuses</option>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Expired">Expired</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className={selectClass} aria-label="Filter start date from" />
          <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className={selectClass} aria-label="Filter end date to" />
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className={selectClass}>
            <option value="latest">Latest</option>
            <option value="highestBookings">Highest bookings</option>
            <option value="endingSoon">Ending soon</option>
            <option value="highestDiscount">Highest discount</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm shadow-slate-950/5 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65 dark:shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1380px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-sm text-slate-500 dark:bg-slate-950/45 dark:text-slate-400">
                <th className="px-5 py-4 font-semibold">Offer</th>
                <th className="px-5 py-4 font-semibold">Business</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Pricing</th>
                <th className="px-5 py-4 font-semibold">Dates</th>
                <th className="px-5 py-4 font-semibold">Capacity</th>
                <th className="px-5 py-4 font-semibold">Ambient</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Created</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 text-sm dark:divide-slate-800/70">
              {filteredOffers.map((offer) => {
                const summary = getOfferSlotSummary(offer.id);
                const capacity = summary.totalCapacity || offer.totalCapacity || 0;
                const booked = summary.bookedCount;
                const remaining = summary.totalCapacity ? summary.remaining : Math.max((offer.totalCapacity || 0) - booked, 0);

                return (
                  <tr key={offer.id} className="transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-5">
                      <div className="flex min-w-[250px] items-center gap-3">
                        <div className="h-14 w-20 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                          <img src={offer.thumbnailUrl || offer.ambientAsset?.url || offer.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-950 dark:text-white">{offer.title}</p>
                          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{offer.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-slate-600 dark:text-slate-300">{business.name}</td>
                    <td className="px-5 py-5 text-slate-600 dark:text-slate-300">{offer.category}</td>
                    <td className="px-5 py-5">
                      <p className="font-bold text-slate-950 dark:text-white">{currency.format(offer.offerPrice)}</p>
                      <p className="text-xs text-slate-500"><span className="line-through">{currency.format(offer.originalPrice)}</span> - {offer.discountPercentage}% off</p>
                    </td>
                    <td className="px-5 py-5 text-slate-600 dark:text-slate-300">
                      <p>{offer.startDate} to {offer.endDate}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{offer.startTime} - {offer.endTime}</p>
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-bold text-slate-950 dark:text-white">{summary.slotCount} slots</p>
                      <p className="text-xs text-slate-500">{booked}/{capacity} booked, {remaining} left</p>
                    </td>
                    <td className="px-5 py-5">
                      <div className="w-32">
                        <AmbientAssetPreview asset={offer.ambientAsset} fallbackUrl={offer.imageUrl} title={offer.ambientAsset ? 'Uploaded custom asset' : 'Preset ambient asset'} />
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(offer.status)}`}>{offer.status}</span>
                    </td>
                    <td className="px-5 py-5 text-slate-600 dark:text-slate-300">{new Date(offer.createdAt || '').toLocaleDateString()}</td>
                    <td className="px-5 py-5">
                      <div className="flex flex-wrap justify-end gap-2">
                        <GlassButton variant="secondary" className="px-3 py-2 text-xs" onClick={() => onEditOffer?.(offer.id)}><Edit3 className="h-3.5 w-3.5" />Edit</GlassButton>
                        <GlassButton variant="secondary" className="px-3 py-2 text-xs" onClick={() => setOfferStatus(offer.id, offer.status === 'Active' ? 'Paused' : 'Active')}>{offer.status === 'Active' ? <PauseCircle className="h-3.5 w-3.5" /> : <PlayCircle className="h-3.5 w-3.5" />}{offer.status === 'Active' ? 'Pause' : 'Activate'}</GlassButton>
                        <GlassButton variant="secondary" className="px-3 py-2 text-xs" onClick={() => setOfferStatus(offer.id, 'Expired')}><TimerOff className="h-3.5 w-3.5" />Expire</GlassButton>
                        <GlassButton variant="secondary" className="px-3 py-2 text-xs" onClick={() => duplicateOffer(offer.id)}><Copy className="h-3.5 w-3.5" />Duplicate</GlassButton>
                        <GlassButton variant="secondary" className="px-3 py-2 text-xs" onClick={() => setAnalyticsOffer(offer)}><BarChart3 className="h-3.5 w-3.5" />Analytics</GlassButton>
                        <GlassButton variant="secondary" className="px-3 py-2 text-xs" onClick={() => setSlotOffer(offer)}><CalendarClock className="h-3.5 w-3.5" />Slots</GlassButton>
                        <GlassButton variant="danger" className="px-3 py-2 text-xs" onClick={() => handleDelete(offer)}><Trash2 className="h-3.5 w-3.5" />Delete</GlassButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!filteredOffers.length && (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    No offers match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {slotOffer && <SlotManager offer={slotOffer} onClose={() => setSlotOffer(null)} />}
        {analyticsOffer && <AnalyticsModal offer={analyticsOffer} onClose={() => setAnalyticsOffer(null)} />}
      </AnimatePresence>
    </div>
  );
};
