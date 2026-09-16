import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  IdCard,
  Car,
  Route,
  CalendarCheck,
  ShieldAlert,
  Star,
  Coins,
  Bell,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AuditToast } from './components/AuditToast';
import { RouteShareMark } from '../../components/RouteShareMark';
import { ADMIN_OVERVIEW_STATS, ADMIN_NOTIFICATIONS } from '../../data/adminMockData';

const NAV_ITEMS = [
  { label: 'Tổng quan', path: '/admin/overview', icon: LayoutDashboard },
  { label: 'Người dùng', path: '/admin/users', icon: Users },
  { label: 'Tài xế', path: '/admin/drivers', icon: IdCard },
  { label: 'Phương tiện', path: '/admin/vehicles', icon: Car },
  { label: 'Chuyến đi', path: '/admin/trips', icon: Route },
  { label: 'Đặt chỗ', path: '/admin/bookings', icon: CalendarCheck },
  { label: 'Báo cáo an toàn', path: '/admin/safety-reports', icon: ShieldAlert, badgeKey: 'safety' },
  { label: 'Đánh giá', path: '/admin/reviews', icon: Star },
  { label: 'Quy tắc chi phí', path: '/admin/cost-rules', icon: Coins },
  { label: 'Thông báo', path: '/admin/notifications', icon: Bell, badgeKey: 'notifications' },
  { label: 'Cài đặt hệ thống', path: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminUser, toast, dismissToast } = useAdmin();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const badges = {
    safety: ADMIN_OVERVIEW_STATS.openSafetyReports,
    notifications: ADMIN_NOTIFICATIONS.filter((n) => n.unread).length,
  };

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Backdrop (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#07110D]/55 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[248px] bg-[#0F1F1A] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between gap-2 px-5 h-[72px] border-b border-white/8 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <RouteShareMark size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-tight truncate">RouteShare</p>
              <p className="text-[11px] text-white/45 leading-tight truncate">Admin Console</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:bg-white/5 shrink-0 lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 h-11 px-3.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/15 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-brand-300' : 'text-white/45'}`} />
                <span className="truncate flex-1">{item.label}</span>
                {badgeCount > 0 && (
                  <span className="shrink-0 min-w-[19px] h-[19px] px-1 rounded-full bg-highlight text-white text-[10px] font-bold flex items-center justify-center">
                    {badgeCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/8 p-3.5 shrink-0">
          <div className="flex items-center gap-2.5 px-1.5 py-1.5">
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 text-brand-200 flex items-center justify-center text-xs font-bold shrink-0">
              {adminUser.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white truncate">{adminUser.name}</p>
              <p className="text-[11px] text-white/45 truncate">{adminUser.role}</p>
            </div>
            <button
              type="button"
              aria-label="Đăng xuất"
              title="Đăng xuất"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col lg:ml-[248px]">
        {/* Mobile top strip */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-border-subtle h-14 flex items-center gap-3 px-4">
          <button
            type="button"
            aria-label="Mở menu"
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-textPrimary hover:bg-canvas shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shrink-0">
              <RouteShareMark size={15} />
            </div>
            <span className="text-sm font-bold text-textPrimary truncate">RouteShare Admin</span>
          </div>
        </div>

        <main className="flex-1 p-5 md:p-8 lg:p-10">
          <div className="max-w-[1400px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <AuditToast entry={toast} onDismiss={dismissToast} />
    </div>
  );
};
