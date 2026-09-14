import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from '../../context/AdminContext';
import { AdminLayout } from './AdminLayout';
import { AdminOverview } from './AdminOverview';
import { AdminUsers } from './AdminUsers';
import { AdminDrivers } from './AdminDrivers';
import { AdminVehicles } from './AdminVehicles';
import { AdminTrips } from './AdminTrips';
import { AdminBookings } from './AdminBookings';
import { AdminSafetyReports } from './AdminSafetyReports';
import { AdminReviews } from './AdminReviews';
import { AdminCostRules } from './AdminCostRules';
import { AdminNotifications } from './AdminNotifications';
import { AdminSettings } from './AdminSettings';

export const AdminApp = () => (
  <AdminProvider>
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="drivers" element={<AdminDrivers />} />
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="trips" element={<AdminTrips />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="safety-reports" element={<AdminSafetyReports />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="cost-rules" element={<AdminCostRules />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Route>
    </Routes>
  </AdminProvider>
);
