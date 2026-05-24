import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { GlassButton } from '../../components/ui/GlassButton';
import { getBookingById, getBusinessById } from '../../services/dataStore';

interface BookingConfirmationPageProps {
  bookingId?: string;
  onBrowse?: () => void;
}

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({ bookingId, onBrowse }) => {
  const booking = bookingId ? getBookingById(bookingId) : undefined;
  const business = booking ? getBusinessById(booking.businessId) : undefined;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 p-4 transition-colors duration-500 dark:bg-slate-950">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-8 text-center shadow-2xl shadow-slate-950/10 backdrop-blur-2xl dark:border-slate-800/70 dark:bg-slate-900/75 dark:shadow-black/20">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.18),transparent_38%)]" />

        <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <h1 className="relative z-10 text-3xl font-black text-slate-950 dark:text-white">
          Booking Created
        </h1>
        <p className="relative z-10 mt-2 text-slate-600 dark:text-slate-300">
          {booking ? `Your reservation for ${booking.offerTitle} is pending admin confirmation.` : 'Your booking details could not be loaded.'}
        </p>

        {booking && (
          <div className="relative z-10 mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-left dark:border-slate-700 dark:bg-slate-950/45">
            <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Booking Reference</p>
            <p className="mt-2 text-center text-4xl font-black tracking-widest text-blue-600 dark:text-blue-300">{booking.confirmationCode}</p>
            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5 text-sm dark:border-slate-800">
              <div className="flex justify-between gap-4"><span className="text-slate-500">Business</span><span className="font-semibold text-slate-950 dark:text-white">{business?.name}</span></div>
              <div className="flex justify-between gap-4"><span className="text-slate-500">Offer</span><span className="font-semibold text-slate-950 dark:text-white">{booking.offerTitle}</span></div>
              <div className="flex justify-between gap-4"><span className="text-slate-500">Slot</span><span className="font-semibold text-slate-950 dark:text-white">{booking.slotLabel}</span></div>
              <div className="flex justify-between gap-4"><span className="text-slate-500">Customer</span><span className="font-semibold text-slate-950 dark:text-white">{booking.customerName}</span></div>
              <div className="flex justify-between gap-4"><span className="text-slate-500">People</span><span className="font-semibold text-slate-950 dark:text-white">{booking.people}</span></div>
              <div className="flex justify-between gap-4"><span className="text-slate-500">Amount</span><span className="font-semibold text-emerald-600">{currency.format(booking.amount)}</span></div>
              <div className="flex justify-between gap-4"><span className="text-slate-500">Status</span><span className="font-semibold text-blue-600 dark:text-blue-300">{booking.status}</span></div>
            </div>
          </div>
        )}

        <div className="relative z-10 mt-8 flex justify-center">
          <GlassButton onClick={onBrowse}>Browse More Offers</GlassButton>
        </div>
      </div>
    </div>
  );
};
