import React, { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { GlassButton } from '../../components/ui/GlassButton';
import { useBookings } from '../../hooks/useOffers';
import { Booking, BookingStatus } from '../../types';
import { getBusinessById, getOfferById } from '../../services/dataStore';

interface ManageBookingsPageProps {
  businessId: string;
}

const statuses: Array<'All' | BookingStatus> = ['All', 'Pending', 'Confirmed', 'Cancelled', 'Completed', 'NoShow'];

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const badgeClass = (status: BookingStatus) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
    case 'Pending':
      return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
    case 'Cancelled':
      return 'bg-red-500/10 text-red-700 dark:text-red-300';
    case 'Completed':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-300';
    default:
      return 'bg-slate-500/10 text-slate-700 dark:text-slate-300';
  }
};

const exportCsv = (bookings: Booking[]) => {
  const headers = ['Reference', 'Customer', 'Email', 'Phone', 'Offer', 'Slot', 'People', 'Amount', 'Payment', 'Status', 'Created'];
  const rows = bookings.map((booking) => [
    booking.confirmationCode,
    booking.customerName,
    booking.customerEmail,
    booking.customerPhone || '',
    booking.offerTitle,
    booking.slotLabel,
    booking.people,
    booking.amount,
    booking.paymentStatus || 'Pending',
    booking.status,
    booking.createdAt,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const ManageBookingsPage: React.FC<ManageBookingsPageProps> = ({ businessId }) => {
  const business = getBusinessById(businessId);
  const { bookings, setBookingStatus } = useBookings(businessId);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'All' | BookingStatus>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredBookings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return bookings.filter((booking) => {
      const createdDate = booking.createdAt.slice(0, 10);
      const matchesStatus = status === 'All' || booking.status === status;
      const matchesDate = (!dateFrom || createdDate >= dateFrom) && (!dateTo || createdDate <= dateTo);
      const matchesQuery = !normalizedQuery
        || booking.confirmationCode.toLowerCase().includes(normalizedQuery)
        || booking.customerName.toLowerCase().includes(normalizedQuery)
        || booking.customerEmail.toLowerCase().includes(normalizedQuery)
        || (booking.customerPhone || '').toLowerCase().includes(normalizedQuery)
        || booking.offerTitle.toLowerCase().includes(normalizedQuery);

      return matchesStatus && matchesQuery && matchesDate;
    });
  }, [bookings, dateFrom, dateTo, query, status]);

  return (
    <div className="mx-auto max-w-[1500px] space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{business.name}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Manage Bookings</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Update booking statuses, inspect timelines, and export CSV data.</p>
        </div>
        <GlassButton variant="secondary" className="py-3" onClick={() => exportCsv(filteredBookings)}>
          <Download className="h-4 w-4" />
          Export Bookings
        </GlassButton>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-4 shadow-sm shadow-slate-950/5 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search customer, offer, phone, code"
              className="w-full rounded-xl border border-slate-300 bg-white/70 py-2.5 pl-9 pr-4 text-sm text-slate-900 backdrop-blur-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
            />
          </div>
          <select value={status} onChange={(event) => setStatus(event.target.value as 'All' | BookingStatus)} className="rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white">
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} className="rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white" />
          <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} className="rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white" />
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm shadow-slate-950/5 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65 dark:shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1220px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-sm text-slate-500 dark:bg-slate-950/45 dark:text-slate-400">
                <th className="px-5 py-4 font-semibold">Booking</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Offer & Slot</th>
                <th className="px-5 py-4 font-semibold">People</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Payment</th>
                <th className="px-5 py-4 font-semibold">Timeline</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 text-sm dark:divide-slate-800/70">
              {filteredBookings.map((booking) => {
                const offer = getOfferById(booking.offerId);

                return (
                  <tr key={booking.id} className="transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-5">
                      <p className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">{booking.confirmationCode}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(booking.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-bold text-slate-950 dark:text-white">{booking.customerName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{booking.customerEmail}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{booking.customerPhone || 'No phone'}</p>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                          {offer?.thumbnailUrl || offer?.imageUrl ? <img src={offer.thumbnailUrl || offer.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" /> : null}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{booking.offerTitle}</p>
                          <p className="text-xs text-slate-500">{booking.slotLabel}</p>
                          <p className="text-xs text-slate-400">Slot ref: {booking.slotId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 font-bold text-slate-900 dark:text-slate-100">{booking.people}</td>
                    <td className="px-5 py-5 font-bold text-slate-900 dark:text-slate-100">{currency.format(booking.amount)}</td>
                    <td className="px-5 py-5">
                      <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-700 dark:text-violet-300">{booking.paymentStatus || 'Pending'}</span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="max-w-[220px] space-y-2">
                        {(booking.timeline || []).slice(-3).map((event) => (
                          <div key={event.id} className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                            <span>{event.label} - {new Date(event.createdAt).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(booking.status)}`}>{booking.status}</span>
                    </td>
                    <td className="px-5 py-5 text-right">
                      <select
                        value={booking.status}
                        onChange={(event) => setBookingStatus(booking.id, event.target.value as BookingStatus)}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                        <option value="NoShow">No Show</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              {!filteredBookings.length && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    No bookings match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <GlassButton variant="secondary" className="px-4 py-2 text-sm" onClick={() => { setQuery(''); setStatus('All'); setDateFrom(''); setDateTo(''); }}>
          Clear Filters
        </GlassButton>
      </div>
    </div>
  );
};
