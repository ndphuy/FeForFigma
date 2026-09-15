import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { AdminApp } from './pages/admin/AdminApp';

// Auth & Profile
import { LoginPage } from './pages/auth/LoginPage';
import { ProfilePage } from './pages/shared/ProfilePage';
import { KYCVerify } from './pages/driver/KYCVerify';
import { RecurringSchedule } from './pages/shared/RecurringSchedule';

// Wallet & Payments
import { WalletDetail } from './pages/shared/WalletDetail';
import { TopUpQR } from './pages/shared/TopUpQR';

// Driver Pages
import { DriverHome } from './pages/driver/DriverHome';
import { CreateTrip } from './pages/driver/CreateTrip';
import { BookingRequests } from './pages/driver/BookingRequests';
import { ApprovalModal } from './pages/driver/ApprovalModal';

// Passenger Pages
import { PassengerHome } from './pages/passenger/PassengerHome';
import { DestinationSearch } from './pages/passenger/DestinationSearch';
import { SearchResults } from './pages/passenger/SearchResults';
import { PickupPicker } from './pages/passenger/PickupPicker';
import { RequestBooking } from './pages/passenger/RequestBooking';
import { BookingPending } from './pages/passenger/BookingPending';
import { BookingConfirm } from './pages/passenger/BookingConfirm';
import { PassengerLiveTracking } from './pages/passenger/PassengerLiveTracking';

// Shared Pages
import { CostBreakdown } from './pages/shared/CostBreakdown';
import { CostHistory } from './pages/shared/CostHistory';
import { LiveTracking } from './pages/shared/LiveTracking';
import { TripChat } from './pages/shared/TripChat';
import { TripComplete } from './pages/shared/TripComplete';
import { TripHistory } from './pages/shared/TripHistory';
import { NotificationsPage } from './pages/shared/NotificationsPage';
import { ConversationList } from './pages/shared/ConversationList';
import { TripDetailView } from './pages/shared/TripDetailView';
import { WishlistPage } from './pages/shared/WishlistPage';

const AppRoutes = () => {
  const { currentRole } = useApp();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    );
  }

  const hideNavRoutes = [
    '/auth/login',
    '/shared/live-tracking',
    '/driver/active-trip',
    '/passenger/live-tracking',
    '/passenger/booking-pending',
    '/passenger/booking-confirm',
    '/passenger/request-booking',
    '/passenger/pickup-picker',
    '/passenger/destination-search',
    '/passenger/results',
    '/shared/chat',
    '/shared/trip-complete',
    '/shared/trip-detail',
    '/shared/wishlist',
    '/passenger/wishlist',
    '/driver/wishlist',
    '/wallet/top-up'
  ];

  const shouldHideNav = hideNavRoutes.some(r => location.pathname.startsWith(r));

  return (
    <MobileFrame hideNav={shouldHideNav}>
      <Routes>
        {/* Default Redirect */}
        <Route 
          path="/" 
          element={<Navigate to={currentRole === 'driver' ? '/driver/home' : '/passenger/home'} replace />} 
        />

        {/* Auth & Profile */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/driver/kyc" element={<KYCVerify />} />
        <Route path="/shared/schedule" element={<RecurringSchedule />} />

        {/* Wallet Routes */}
        <Route path="/wallet" element={<WalletDetail />} />
        <Route path="/wallet/top-up" element={<TopUpQR />} />

        {/* Driver Flows */}
        <Route path="/driver/home" element={<DriverHome />} />
        <Route path="/driver/create-trip" element={<CreateTrip />} />
        <Route path="/driver/requests" element={<BookingRequests />} />
        <Route path="/driver/approval" element={<ApprovalModal />} />
        <Route path="/driver/route-preview" element={<TripDetailView />} />
        <Route path="/driver/trip-detail/:id" element={<TripDetailView />} />
        <Route path="/driver/trip-detail" element={<TripDetailView />} />
        <Route path="/driver/active-trip" element={<LiveTracking />} />

        {/* Passenger Flows */}
        <Route path="/passenger/home" element={<PassengerHome />} />
        <Route path="/passenger/destination-search" element={<DestinationSearch />} />
        <Route path="/passenger/results" element={<SearchResults />} />
        <Route path="/passenger/pickup-picker" element={<PickupPicker />} />
        <Route path="/passenger/trip/:id" element={<TripDetailView />} />
        <Route path="/passenger/trip-detail/:id" element={<TripDetailView />} />
        <Route path="/passenger/request-booking/:id" element={<RequestBooking />} />
        <Route path="/passenger/request-booking" element={<RequestBooking />} />
        <Route path="/passenger/booking-pending/:id" element={<BookingPending />} />
        <Route path="/passenger/booking-pending" element={<BookingPending />} />
        <Route path="/passenger/booking-confirm/:id" element={<BookingConfirm />} />
        <Route path="/passenger/booking-confirm" element={<BookingConfirm />} />
        <Route path="/passenger/live-tracking" element={<PassengerLiveTracking />} />

        {/* Shared Flows & Dedicated Full Views */}
        <Route path="/shared/trip-detail/:id" element={<TripDetailView />} />
        <Route path="/shared/trip-detail" element={<TripDetailView />} />
        <Route path="/shared/wishlist" element={<WishlistPage />} />
        <Route path="/passenger/wishlist" element={<WishlistPage />} />
        <Route path="/driver/wishlist" element={<WishlistPage />} />
        <Route path="/shared/trip-history" element={<TripHistory />} />
        <Route path="/passenger/history" element={<TripHistory />} />
        <Route path="/driver/history" element={<TripHistory />} />
        <Route path="/passenger/messages" element={<ConversationList />} />
        <Route path="/driver/messages" element={<ConversationList />} />
        <Route path="/passenger/notifications" element={<NotificationsPage />} />
        <Route path="/driver/notifications" element={<NotificationsPage />} />
        <Route path="/passenger/cost-breakdown" element={<CostBreakdown />} />
        <Route path="/shared/cost-breakdown" element={<CostBreakdown />} />
        <Route path="/shared/cost-history" element={<CostHistory />} />
        <Route path="/passenger/cost-history" element={<CostHistory />} />
        <Route path="/driver/cost-history" element={<CostHistory />} />
        <Route path="/shared/live-tracking" element={<LiveTracking />} />
        <Route path="/shared/chat/:id" element={<TripChat />} />
        <Route path="/shared/chat" element={<TripChat />} />
        <Route path="/shared/trip-complete" element={<TripComplete />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MobileFrame>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  );
}
