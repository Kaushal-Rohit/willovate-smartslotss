import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarClock, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { GlassButton } from '../../components/ui/GlassButton';
import { OfferAmbient } from '../../components/ambient/OfferAmbient';
import { useOffers } from '../../hooks/useOffers';
import { BusinessType, Offer } from '../../types';
import {
  getBusinesses,
  getBusinessByOffer,
  getOfferAvailability,
  getOfferPopularity,
} from '../../services/dataStore';

type AvailabilityFilter = 'Any' | 'Active' | 'Available slots' | 'Ending soon';
type SortOption = 'latest' | 'endingSoon' | 'highestDiscount' | 'lowestPrice' | 'highestPrice' | 'mostPopular';

interface OfferListingPageProps {
  onBook?: (offerId: string) => void;
}

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white/75 px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-950/5 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/35 dark:border-slate-700 dark:bg-slate-950/55 dark:text-white dark:placeholder:text-slate-500';

const selectClass = `${inputClass} pr-8`;

const getDaysLeft = (endDate?: string) => {
  if (!endDate) {
    return null;
  }

  const end = new Date(`${endDate}T23:59:59`);
  const diff = end.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const countdownLabel = (endDate?: string) => {
  const days = getDaysLeft(endDate);
  if (days === null) {
    return '';
  }
  if (days < 0) {
    return 'Ended';
  }
  if (days === 0) {
    return 'Ends today';
  }
  if (days === 1) {
    return '1 day left';
  }
  return `${days} days left`;
};

const OfferCard: React.FC<{ offer: Offer; index: number; onBook?: (offerId: string) => void }> = ({ offer, index, onBook }) => {
  const [isHovered, setIsHovered] = useState(false);
  const business = getBusinessByOffer(offer);
  const availability = getOfferAvailability(offer.id);
  const daysLeft = getDaysLeft(offer.endDate);
  const isEndingSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.45, delay: index * 0.055, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative min-h-[420px] overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-lg shadow-slate-950/8 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.015] hover:border-white hover:shadow-2xl hover:shadow-blue-950/15 dark:border-slate-800/80 dark:bg-slate-900/75 dark:shadow-black/20 dark:hover:border-slate-700"
    >
      <div className="absolute inset-0">
        <OfferAmbient businessType={business.businessType} active={isHovered} uploadedAsset={offer.ambientAsset} selectedAssetUrl={offer.imageUrl} />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/55 to-white/95 transition-colors duration-500 dark:from-slate-950/5 dark:via-slate-950/62 dark:to-slate-950/96" />
      </div>

      <div className="relative z-10 flex min-h-[420px] flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm dark:bg-slate-950/60 dark:text-slate-200">
              {business.businessType}
            </span>
            <p className="mt-3 text-sm font-semibold text-blue-700 dark:text-blue-300">{business.name}</p>
          </div>
          <div className="rounded-2xl bg-slate-950 px-3 py-2 text-right text-white shadow-lg shadow-slate-950/20 dark:bg-white dark:text-slate-950">
            <p className="text-lg font-black leading-none">{offer.discountPercentage}%</p>
            <p className="text-[10px] font-bold uppercase tracking-wide">off</p>
          </div>
        </div>

        <div className="mt-auto pt-20">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
              {offer.category}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${offer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_0_4px_rgba(16,185,129,0.12)] animate-pulse" />
              {offer.status}
            </span>
            {isEndingSoon && (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-700 dark:text-red-300">
                Ending soon
              </span>
            )}
          </div>

          <h3 className="text-2xl font-black leading-tight text-slate-950 dark:text-white">{offer.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{offer.description}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-slate-200/70 bg-white/65 p-3 dark:border-slate-800/70 dark:bg-slate-950/45">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Availability</p>
              <p className="mt-1 font-bold text-slate-950 dark:text-white">
                {availability.openSlots ? `${availability.remaining} seats` : 'Flexible'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-white/65 p-3 dark:border-slate-800/70 dark:bg-slate-950/45">
              <p className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <CalendarClock className="h-3.5 w-3.5" />
                Countdown
              </p>
              <p className="mt-1 font-bold text-slate-950 dark:text-white">{countdownLabel(offer.endDate)}</p>
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-black text-slate-950 dark:text-white">{currency.format(offer.offerPrice)}</p>
              <p className="text-sm font-medium text-slate-500 line-through dark:text-slate-400">{currency.format(offer.originalPrice)}</p>
            </div>
            <GlassButton onClick={() => onBook?.(offer.id)} className="shrink-0 px-5 py-2.5">
              Book Slot
            </GlassButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const OfferListingPage: React.FC<OfferListingPageProps> = ({ onBook }) => {
  const { offers } = useOffers();
  const businesses = getBusinesses();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [businessType, setBusinessType] = useState<'All' | BusinessType>('All');
  const [availability, setAvailability] = useState<AvailabilityFilter>('Active');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categories = useMemo(() => ['All', ...Array.from(new Set(offers.map((offer) => offer.category))).sort()], [offers]);
  const businessTypes = useMemo(() => ['All', ...Array.from(new Set(businesses.map((business) => business.businessType))).sort()] as Array<'All' | BusinessType>, [businesses]);

  const filteredOffers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const minimum = minPrice ? Number(minPrice) : null;
    const maximum = maxPrice ? Number(maxPrice) : null;

    const next = offers.filter((offer) => {
      const business = getBusinessByOffer(offer);
      const daysLeft = getDaysLeft(offer.endDate);
      const slotAvailability = getOfferAvailability(offer.id);
      const isPubliclyVisible = offer.status !== 'Cancelled' && offer.status !== 'Expired' && offer.status !== 'Draft';
      const matchesQuery = !normalizedQuery
        || offer.title.toLowerCase().includes(normalizedQuery)
        || offer.description.toLowerCase().includes(normalizedQuery)
        || offer.category.toLowerCase().includes(normalizedQuery)
        || business.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === 'All' || offer.category === category;
      const matchesBusinessType = businessType === 'All' || business.businessType === businessType;
      const matchesPrice = (minimum === null || offer.offerPrice >= minimum) && (maximum === null || offer.offerPrice <= maximum);
      const matchesAvailability =
        availability === 'Any'
        || (availability === 'Active' && offer.status === 'Active')
        || (availability === 'Available slots' && slotAvailability.remaining > 0)
        || (availability === 'Ending soon' && daysLeft !== null && daysLeft >= 0 && daysLeft <= 3);

      return isPubliclyVisible && matchesQuery && matchesCategory && matchesBusinessType && matchesPrice && matchesAvailability;
    });

    return next.sort((a, b) => {
      switch (sortBy) {
        case 'endingSoon':
          return Date.parse(a.endDate) - Date.parse(b.endDate);
        case 'highestDiscount':
          return b.discountPercentage - a.discountPercentage;
        case 'lowestPrice':
          return a.offerPrice - b.offerPrice;
        case 'highestPrice':
          return b.offerPrice - a.offerPrice;
        case 'mostPopular':
          return getOfferPopularity(b) - getOfferPopularity(a);
        case 'latest':
        default:
          return Date.parse(b.createdAt || b.startDate) - Date.parse(a.createdAt || a.startDate);
      }
    });
  }, [availability, businessType, category, maxPrice, minPrice, offers, query, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setCategory('All');
    setBusinessType('All');
    setAvailability('Active');
    setSortBy('latest');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 transition-colors duration-500 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/15 bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-700 dark:text-blue-300">
              <Sparkles className="h-4 w-4" />
              Premium local slots
            </div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Discover limited-time offers from trusted businesses
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Filter by category, business type, price, and availability without losing the full marketplace view.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/65 dark:text-slate-300">
            <span className="font-bold text-slate-950 dark:text-white">{filteredOffers.length}</span> offers available
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-slate-200/70 bg-white/75 p-4 shadow-lg shadow-slate-950/5 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-black/20">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
            <SlidersHorizontal className="h-4 w-4" />
            Search and filters
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1fr_1fr_0.8fr_0.8fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className={`${inputClass} pl-9`} placeholder="Search offers or businesses" type="search" />
            </div>

            <select value={category} onChange={(event) => setCategory(event.target.value)} className={selectClass}>
              {categories.map((item) => (
                <option key={item} value={item}>{item === 'All' ? 'All categories' : item}</option>
              ))}
            </select>

            <select value={businessType} onChange={(event) => setBusinessType(event.target.value as 'All' | BusinessType)} className={selectClass}>
              {businessTypes.map((item) => (
                <option key={item} value={item}>{item === 'All' ? 'All business types' : item}</option>
              ))}
            </select>

            <select value={availability} onChange={(event) => setAvailability(event.target.value as AvailabilityFilter)} className={selectClass}>
              <option value="Active">Active offers</option>
              <option value="Available slots">Available slots</option>
              <option value="Ending soon">Ending soon</option>
              <option value="Any">Any status</option>
            </select>

            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className={selectClass}>
              <option value="latest">Latest</option>
              <option value="endingSoon">Ending soon</option>
              <option value="highestDiscount">Highest discount</option>
              <option value="lowestPrice">Lowest price</option>
              <option value="highestPrice">Highest price</option>
              <option value="mostPopular">Most popular</option>
            </select>

            <input value={minPrice} onChange={(event) => setMinPrice(event.target.value)} className={inputClass} placeholder="Min price" type="number" min="0" />
            <input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className={inputClass} placeholder="Max price" type="number" min="0" />
          </div>
          <div className="mt-4 flex justify-end">
            <GlassButton variant="secondary" className="px-4 py-2 text-sm" onClick={resetFilters}>
              Reset Filters
            </GlassButton>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filteredOffers.map((offer, index) => (
              <OfferCard key={offer.id} offer={offer} index={index} onBook={onBook} />
            ))}
          </AnimatePresence>
        </motion.div>

        {!filteredOffers.length && (
          <div className="mt-10 rounded-3xl border border-slate-200/70 bg-white/75 p-12 text-center shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">No offers found</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Try clearing filters or widening your price range.</p>
            <GlassButton variant="secondary" className="mt-5" onClick={resetFilters}>
              Clear Filters
            </GlassButton>
          </div>
        )}
      </div>
    </div>
  );
};
