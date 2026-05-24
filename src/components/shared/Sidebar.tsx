import React from 'react';
import { BarChart3, Building2, CalendarDays, FolderKanban, PlusCircle, Tags } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: BarChart3 },
  { id: 'create-offer', label: 'Create Offer', Icon: PlusCircle },
  { id: 'manage-offers', label: 'Manage Offers', Icon: Tags },
  { id: 'manage-categories', label: 'Categories', Icon: FolderKanban },
  { id: 'manage-bookings', label: 'Bookings', Icon: CalendarDays },
  { id: 'business-profile', label: 'Business Profile', Icon: Building2 },
];

export const Sidebar: React.FC<{ onNav?: (page: string) => void; activePage?: string; businessName?: string }> = ({
  onNav,
  activePage,
  businessName,
}) => {
  return (
    <>
      <div className="sticky top-16 z-40 border-b border-slate-200/70 bg-white/75 px-3 py-2 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/75 md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onNav?.(id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                activePage === id
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                  : 'bg-slate-950/5 text-slate-600 dark:bg-white/10 dark:text-slate-300'
              }`}
              type="button"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <aside className="sticky top-16 hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200/70 bg-white/60 p-4 backdrop-blur-xl transition-colors duration-500 dark:border-slate-800/70 dark:bg-slate-950/55 md:block">
        <div className="mb-5 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Workspace</p>
          <p className="mt-1 truncate text-sm font-bold text-slate-950 dark:text-white">{businessName || 'Business'}</p>
        </div>

      <nav className="flex flex-col gap-1.5">
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onNav?.(id)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition-all duration-200 ${
              activePage === id
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15 dark:bg-white dark:text-slate-950 dark:shadow-white/10'
                : 'text-slate-600 hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
            }`}
            type="button"
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm backdrop-blur-md dark:bg-emerald-400/10">
          <p className="font-semibold text-slate-800 dark:text-slate-100">System Status</p>
          <p className="mt-1 flex items-center gap-2 text-emerald-600 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.14)] animate-pulse" />
            Operational
          </p>
        </div>
      </div>
      </aside>
    </>
  );
};
