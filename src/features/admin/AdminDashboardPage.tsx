import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, CalendarDays, IndianRupee, Layers3, Percent, PlusCircle, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassButton } from '../../components/ui/GlassButton';
import { useBookings, useCategories, useOffers, useSlots } from '../../hooks/useOffers';
import { getBusinessById, getOfferSlotSummary } from '../../services/dataStore';

interface AdminDashboardPageProps {
  businessId: string;
  onNav?: (page: string) => void;
}

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ businessId, onNav }) => {
  const { offers } = useOffers(businessId);
  const { categories } = useCategories(businessId);
  const { bookings } = useBookings(businessId);
  const { slots } = useSlots(undefined, businessId);
  const business = getBusinessById(businessId);

  const today = new Date().toISOString().slice(0, 10);
  const confirmedBookings = bookings.filter((booking) => ['Confirmed', 'Completed'].includes(booking.status));
  const earnings = confirmedBookings.reduce((sum, booking) => sum + booking.amount, 0);
  const activeOffers = offers.filter((offer) => offer.status === 'Active');
  const todaysBookings = bookings.filter((booking) => booking.createdAt.slice(0, 10) === today);
  const totalCapacity = slots.reduce((sum, slot) => sum + slot.capacity, 0);
  const bookedSeats = slots.reduce((sum, slot) => sum + slot.bookedCount, 0);
  const availableSeats = Math.max(totalCapacity - bookedSeats, 0);
  const conversionRate = totalCapacity ? Math.round((bookedSeats / totalCapacity) * 100) : 0;

  const recentBookings = bookings.slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5);
  const expiringOffers = offers
    .filter((offer) => offer.status === 'Active')
    .sort((a, b) => Date.parse(a.endDate) - Date.parse(b.endDate))
    .slice(0, 4);
  const topOffers = offers
    .map((offer) => ({ name: offer.title.length > 18 ? `${offer.title.slice(0, 18)}...` : offer.title, bookings: getOfferSlotSummary(offer.id).bookedCount }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);
  const categoryAnalytics = categories.map((category) => ({
    name: category.name,
    value: offers.filter((offer) => offer.category === category.name).length,
  })).filter((item) => item.value > 0);
  const bookingTrend = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const iso = date.toISOString().slice(0, 10);
      return {
        date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        bookings: bookings.filter((booking) => booking.createdAt.slice(0, 10) === iso).length,
      };
    });
    return days;
  }, [bookings]);

  const metrics = [
    { label: 'Total Revenue', value: currency.format(earnings), trend: `${confirmedBookings.length} paid bookings`, Icon: IndianRupee },
    { label: 'Total Offers', value: offers.length.toString(), trend: `${activeOffers.length} active offers`, Icon: Layers3 },
    { label: "Today's Bookings", value: todaysBookings.length.toString(), trend: `${bookings.length} total bookings`, Icon: CalendarDays },
    { label: 'Conversion Rate', value: `${conversionRate}%`, trend: `${bookedSeats}/${totalCapacity} seats booked`, Icon: Percent },
    { label: 'Available Seats', value: availableSeats.toString(), trend: `${totalCapacity} total capacity`, Icon: Users },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-8 p-6 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{business.businessType} workspace</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">{business.name}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">PDF dashboard summary, capacity, bookings, and performance analytics.</p>
        </div>
        <GlassButton onClick={() => onNav?.('create-offer')} className="py-3">
          <PlusCircle className="h-4 w-4" />
          Create New Offer
        </GlassButton>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map(({ label, value, trend, Icon }, index) => (
          <motion.div
            key={label}
            className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950/10 dark:border-slate-800/70 dark:bg-slate-900/65 dark:shadow-black/20"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                <Icon className="h-4 w-4" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <h3 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}</h3>
            <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Booking Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Last 7 days booking activity.</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Occupancy Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Booked versus available seats.</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: 'Booked', value: bookedSeats }, { name: 'Available', value: availableSeats }]} innerRadius={66} outerRadius={96} paddingAngle={4} dataKey="value">
                  <Cell fill="#2563eb" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Top-Performing Offers</h2>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topOffers}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="bookings" radius={[8, 8, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Business Category Analytics</h2>
          <div className="mt-5 space-y-3">
            {categoryAnalytics.map((item, index) => (
              <div key={item.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
                  <span className="text-slate-500">{item.value} offers</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: colors[index % colors.length] }} initial={{ width: 0 }} animate={{ width: `${Math.max(12, (item.value / Math.max(offers.length, 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Expiring Offers</h2>
          <div className="mt-5 space-y-3">
            {expiringOffers.map((offer) => (
              <div key={offer.id} className="rounded-2xl border border-slate-200/70 bg-white/60 p-4 dark:border-slate-800 dark:bg-slate-950/35">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-950 dark:text-white">{offer.title}</p>
                    <p className="text-xs text-slate-500">Ends {offer.endDate}</p>
                  </div>
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-700 dark:text-red-300">{offer.discountPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm shadow-slate-950/5 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65 dark:shadow-black/20">
        <div className="flex items-center justify-between border-b border-slate-200/70 p-6 dark:border-slate-800/70">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">Recent Bookings Activity</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Latest reservations for {business.name}.</p>
          </div>
          <GlassButton variant="secondary" className="px-4 py-2 text-sm" onClick={() => onNav?.('manage-bookings')}>
            View All
          </GlassButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-sm text-slate-500 dark:bg-slate-950/45 dark:text-slate-400">
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Offer</th>
                <th className="px-5 py-4 font-semibold">Slot</th>
                <th className="px-5 py-4 font-semibold">People</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 text-sm dark:divide-slate-800/70">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-4 font-semibold text-slate-950 dark:text-white">{booking.customerName}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{booking.offerTitle}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{booking.slotLabel}</td>
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">{booking.people}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!recentBookings.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                    No bookings for this business yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
