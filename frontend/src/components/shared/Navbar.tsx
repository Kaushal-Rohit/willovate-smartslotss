import React from 'react';
import { LogOut, Moon, ShieldCheck, Sun, UserRound } from 'lucide-react';
import { GlassButton } from '../ui/GlassButton';

interface NavbarProps {
  userRole?: 'Admin' | 'Customer' | 'Guest';
  displayName?: string;
  businessName?: string;
  onLogoutClick?: () => void;
  isDark?: boolean;
  toggleTheme?: () => void;
  onNav?: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole = 'Guest',
  displayName,
  businessName,
  onLogoutClick,
  isDark,
  toggleTheme,
  onNav,
}) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/75 shadow-sm shadow-slate-950/5 backdrop-blur-xl transition-colors duration-500 dark:border-slate-800/70 dark:bg-slate-950/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button className="flex min-w-0 items-center gap-3" onClick={() => onNav?.('home')} type="button">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-950/20 dark:bg-white dark:text-slate-950">
            S
          </span>
          <span className="truncate text-xl font-bold text-slate-950 dark:text-white">
            SmartSlot
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Sun className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'}`} />
            <Moon className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
          </button>

          {userRole === 'Guest' && (
            <div className="flex items-center gap-2">
              <GlassButton variant="secondary" className="hidden px-4 py-2 sm:inline-flex" onClick={() => onNav?.('admin-login')}>
                <ShieldCheck className="h-4 w-4" />
                Admin
              </GlassButton>
              <GlassButton className="px-4 py-2" onClick={() => onNav?.('sign-in')}>
                <UserRound className="h-4 w-4" />
                Customer
              </GlassButton>
            </div>
          )}

          {userRole !== 'Guest' && (
            <div className="flex min-w-0 items-center gap-2">
              <div className="hidden min-w-0 text-right sm:block">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {userRole === 'Admin' ? businessName : displayName}
                </p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {userRole === 'Admin' ? 'Business admin' : 'Customer account'}
                </p>
              </div>
              <GlassButton variant="ghost" className="px-3 py-2" onClick={onLogoutClick}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </GlassButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
