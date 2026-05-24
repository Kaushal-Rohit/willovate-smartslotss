import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, MapPin } from 'lucide-react';
import { AmbientRenderer } from '../../components/ambient/AmbientRenderer';
import { GlassButton } from '../../components/ui/GlassButton';
import { InputField } from '../../components/ui/InputField';
import { useSlots } from '../../hooks/useOffers';
import { CustomerAccount } from '../../types';
import { createBookingRecord, getBusinessByOffer, getOfferById } from '../../services/dataStore';
import { ApiError, createBookingApi, shouldUseApi, syncApiData } from '../../services/apiClient';

interface OfferDetailPageProps {
  offerId: string;
  customer?: CustomerAccount;
  onBack?: () => void;
  onBooked?: (bookingId: string) => void;
  onRequireLogin?: () => void;
}

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const OfferDetailPage: React.FC<OfferDetailPageProps> = ({ offerId, customer, onBack, onBooked, onRequireLogin }) => {
  const offer = getOfferById(offerId);
  const { slots } = useSlots(offerId);
  const business = offer ? getBusinessByOffer(offer) : null;
  const availableSlots = useMemo(() => slots.filter((slot) => slot.status === 'Available' && slot.bookedCount < slot.capacity), [slots]);
  const [selectedSlotId, setSelectedSlotId] = useState(availableSlots[0]?.id || '');
  const [name, setName] = useState(customer?.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(customer?.email || '');
  const [people, setPeople] = useState(1);
  const [specialNote, setSpecialNote] = useState('');
  const [error, setError] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  if (!offer || !business) {
    return (
      <div className="mx-auto max-w-4xl p-8">
        <GlassButton variant="secondary" onClick={onBack}><ArrowLeft className="h-4 w-4" />Back</GlassButton>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Offer not found</h1>
        </div>
      </div>
    );
  }

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);
  const remaining = selectedSlot ? selectedSlot.capacity - selectedSlot.bookedCount : 0;

  const handleBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!customer) {
      onRequireLogin?.();
      return;
    }

    if (!selectedSlotId) {
      setError('Please select an available slot.');
      return;
    }

    if (!name.trim() || !phone.trim()) {
      setError('Customer name and phone number are required.');
      return;
    }

    setIsBooking(true);

    try {
      if (shouldUseApi()) {
        const booking = await createBookingApi({
          offerId: offer.id,
          slotId: selectedSlotId,
          customerId: customer.id,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim(),
          people,
          specialNote,
        });
        await syncApiData({ businessId: offer.businessId, includeInactive: true });
        onBooked?.(booking.id);
        return;
      }
    } catch (apiError) {
      if (apiError instanceof ApiError && apiError.status !== 0) {
        setError(apiError.message);
        setIsBooking(false);
        return;
      }
    }

    const result = createBookingRecord({
      offerId: offer.id,
      slotId: selectedSlotId,
      customerId: customer.id,
      customerName: name.trim(),
      customerPhone: phone.trim(),
      customerEmail: email.trim(),
      people,
      specialNote,
    });

    if (!result.ok || !result.booking) {
      setError(result.error);
      setIsBooking(false);
      return;
    }

    setIsBooking(false);
    onBooked?.(result.booking.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 transition-colors duration-500 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <GlassButton variant="secondary" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Offers
        </GlassButton>

        <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/75 shadow-2xl shadow-slate-950/10 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/75">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[420px] overflow-hidden p-8 lg:p-10">
              <AmbientRenderer businessType={business.businessType} active uploadedAsset={offer.ambientAsset} selectedAssetUrl={offer.imageUrl} />
              <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/75 to-white dark:from-slate-950/20 dark:via-slate-950/72 dark:to-slate-950" />
              <div className="relative z-10">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">{offer.category}</span>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">{offer.status}</span>
                </div>
                <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 dark:text-white">{offer.title}</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{offer.description}</p>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800/70 dark:bg-slate-950/45">
                    <p className="text-xs font-semibold text-slate-500">Offer Price</p>
                    <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{currency.format(offer.offerPrice)}</p>
                    <p className="text-xs text-slate-500 line-through">{currency.format(offer.originalPrice)}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800/70 dark:bg-slate-950/45">
                    <p className="text-xs font-semibold text-slate-500">Discount</p>
                    <p className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{offer.discountPercentage}%</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-800/70 dark:bg-slate-950/45">
                    <p className="text-xs font-semibold text-slate-500">Valid Until</p>
                    <p className="mt-2 text-lg font-black text-slate-950 dark:text-white">{offer.endDate}</p>
                    <p className="text-xs text-slate-500">{offer.startTime} - {offer.endTime}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{business.name}, {business.address}, {business.city}</p>
                  <p><span className="font-semibold text-slate-900 dark:text-white">Terms:</span> {offer.termsAndConditions || 'Standard venue terms apply.'}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleBooking} className="border-t border-slate-200/70 bg-white/80 p-8 dark:border-slate-800/70 dark:bg-slate-950/55 lg:border-l lg:border-t-0">
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Book a Slot</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pending bookings can be confirmed by the business admin.</p>

              {error && (
                <div className="mt-5 flex gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div className="space-y-3">
                  {availableSlots.map((slot) => (
                    <label key={slot.id} className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white/70 p-4 transition-colors hover:border-blue-500 dark:border-slate-800 dark:bg-slate-900/60">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="slot" checked={selectedSlotId === slot.id} onChange={() => setSelectedSlotId(slot.id)} className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-bold text-slate-950 dark:text-white">{slot.slotDate}</p>
                          <p className="text-xs text-slate-500">{slot.startTime} - {slot.endTime}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">{slot.capacity - slot.bookedCount} left</span>
                    </label>
                  ))}
                  {!availableSlots.length && <p className="rounded-2xl bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">No available slots for this offer.</p>}
                </div>

                <InputField label="Customer Name" value={name} onChange={(event) => setName(event.target.value)} required />
                <InputField label="Phone Number" value={phone} onChange={(event) => setPhone(event.target.value)} required />
                <InputField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                <InputField label="Number of People" type="number" min="1" max={remaining || undefined} value={people} onChange={(event) => setPeople(Number(event.target.value))} required />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Special Note</label>
                  <textarea value={specialNote} onChange={(event) => setSpecialNote(event.target.value)} rows={3} className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-slate-900 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white" />
                </div>
                <GlassButton type="submit" className="w-full py-3" isLoading={isBooking}>
                  {customer ? 'Confirm Booking' : 'Sign In to Book'}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
