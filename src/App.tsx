import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/shared/Navbar';
import { Sidebar } from './components/shared/Sidebar';
import { OfferListingPage } from './features/customer/OfferListingPage';
import { OfferDetailPage } from './features/customer/OfferDetailPage';
import { BookingConfirmationPage } from './features/customer/BookingConfirmationPage';
import { AdminLoginPage } from './features/auth/AdminLoginPage';
import { CustomerRegistrationPage } from './features/auth/CustomerRegistrationPage';
import { AdminDashboardPage } from './features/admin/AdminDashboardPage';
import { CreateOfferPage } from './features/admin/CreateOfferPage';
import { ManageOffersPage } from './features/admin/ManageOffersPage';
import { ManageBookingsPage } from './features/admin/ManageBookingsPage';
import { ManageCategoriesPage } from './features/admin/ManageCategoriesPage';
import { BusinessProfilePage } from './features/admin/BusinessProfilePage';
import { AdminAccount, CustomerAccount } from './types';
import { initializeStore } from './services/dataStore';

type PageRoute =
  | 'home'
  | 'admin-login'
  | 'sign-in'
  | 'offer-detail'
  | 'booking-confirmation'
  | 'dashboard'
  | 'create-offer'
  | 'manage-offers'
  | 'manage-categories'
  | 'manage-bookings'
  | 'business-profile';

type Session =
  | { role: 'Admin'; account: AdminAccount }
  | { role: 'Customer'; account: CustomerAccount }
  | null;

const readStoredSession = (): Session => {
  try {
    const stored = window.localStorage.getItem('smartslot-session');
    return stored ? (JSON.parse(stored) as Session) : null;
  } catch {
    return null;
  }
};

const readStoredTheme = () => {
  const stored = window.localStorage.getItem('smartslot-theme');
  if (stored === 'dark') {
    return true;
  }
  if (stored === 'light') {
    return false;
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

function App() {
  const [isDark, setIsDark] = useState(readStoredTheme);
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [session, setSession] = useState<Session>(readStoredSession);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  const currentAdmin = session?.role === 'Admin' ? session.account : null;
  const currentCustomer = session?.role === 'Customer' ? session.account : null;
  const userRole = session?.role || 'Guest';

  useEffect(() => {
    initializeStore();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    window.localStorage.setItem('smartslot-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    if (session) {
      window.localStorage.setItem('smartslot-session', JSON.stringify(session));
      return;
    }

    window.localStorage.removeItem('smartslot-session');
  }, [session]);

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transition');
    window.setTimeout(() => document.documentElement.classList.remove('theme-transition'), 520);
    setIsDark((value) => !value);
  };

  const handleNav = (page: string) => {
    if (page !== 'create-offer') {
      setEditingOfferId(null);
    }
    setCurrentPage(page as PageRoute);
  };

  const handleAdminAuth = (account: AdminAccount) => {
    setSession({ role: 'Admin', account });
    setEditingOfferId(null);
    setCurrentPage('dashboard');
  };

  const handleCustomerAuth = (account: CustomerAccount) => {
    setSession({ role: 'Customer', account });
    setCurrentPage(selectedOfferId ? 'offer-detail' : 'home');
  };

  const handleLogout = () => {
    setSession(null);
    setEditingOfferId(null);
    setCurrentPage('home');
  };

  const openCreateOffer = () => {
    setEditingOfferId(null);
    setCurrentPage('create-offer');
  };

  const openEditOffer = (offerId: string) => {
    setEditingOfferId(offerId);
    setCurrentPage('create-offer');
  };

  const handleOfferBooking = (offerId: string) => {
    setSelectedOfferId(offerId);
    setCurrentPage(currentCustomer ? 'offer-detail' : 'sign-in');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <OfferListingPage onBook={handleOfferBooking} />;
      case 'offer-detail':
        return selectedOfferId ? (
          <OfferDetailPage
            offerId={selectedOfferId}
            customer={currentCustomer || undefined}
            onBack={() => setCurrentPage('home')}
            onBooked={(bookingId) => {
              setConfirmedBookingId(bookingId);
              setCurrentPage('booking-confirmation');
            }}
            onRequireLogin={() => setCurrentPage('sign-in')}
          />
        ) : (
          <OfferListingPage onBook={handleOfferBooking} />
        );
      case 'booking-confirmation':
        return <BookingConfirmationPage bookingId={confirmedBookingId || undefined} onBrowse={() => setCurrentPage('home')} />;
      case 'admin-login':
        return currentAdmin ? (
          <AdminDashboardPage businessId={currentAdmin.businessId} onNav={handleNav} />
        ) : (
          <AdminLoginPage onLogin={handleAdminAuth} />
        );
      case 'sign-in':
        return <CustomerRegistrationPage onLogin={handleCustomerAuth} />;
      case 'dashboard':
        return currentAdmin ? (
          <AdminDashboardPage businessId={currentAdmin.businessId} onNav={handleNav} />
        ) : (
          <AdminLoginPage onLogin={handleAdminAuth} />
        );
      case 'create-offer':
        return currentAdmin ? (
          <CreateOfferPage
            businessId={currentAdmin.businessId}
            offerId={editingOfferId || undefined}
            onCancel={() => setCurrentPage('manage-offers')}
            onSaved={() => {
              setEditingOfferId(null);
              setCurrentPage('manage-offers');
            }}
          />
        ) : (
          <AdminLoginPage onLogin={handleAdminAuth} />
        );
      case 'manage-offers':
        return currentAdmin ? (
          <ManageOffersPage
            businessId={currentAdmin.businessId}
            onCreateOffer={openCreateOffer}
            onEditOffer={openEditOffer}
          />
        ) : (
          <AdminLoginPage onLogin={handleAdminAuth} />
        );
      case 'manage-categories':
        return currentAdmin ? <ManageCategoriesPage businessId={currentAdmin.businessId} /> : <AdminLoginPage onLogin={handleAdminAuth} />;
      case 'manage-bookings':
        return currentAdmin ? <ManageBookingsPage businessId={currentAdmin.businessId} /> : <AdminLoginPage onLogin={handleAdminAuth} />;
      case 'business-profile':
        return currentAdmin ? <BusinessProfilePage businessId={currentAdmin.businessId} /> : <AdminLoginPage onLogin={handleAdminAuth} />;
      default:
        return <OfferListingPage onBook={handleOfferBooking} />;
    }
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
        <Navbar
          userRole={userRole}
          displayName={currentCustomer?.name}
          businessName={currentAdmin?.businessName}
          isDark={isDark}
          toggleTheme={toggleTheme}
          onNav={handleNav}
          onLogoutClick={handleLogout}
        />
        <div className="flex min-h-[calc(100vh-4rem)]">
          {currentAdmin && currentPage !== 'home' && (
            <Sidebar onNav={handleNav} activePage={currentPage} businessName={currentAdmin.businessName} />
          )}
          <main className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
