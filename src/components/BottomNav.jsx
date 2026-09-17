import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, CarFront, History, MessageSquare, User } from 'lucide-react';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { switchRole, pendingBookingsForDriver, isDriverVerified } = useApp();

  // Unified nav: passenger and driver flows live side by side instead of behind a role switch.
  const tabs = [
    {
      id: 'search',
      label: 'Tìm chuyến',
      icon: Search,
      path: '/passenger/home',
      onNavigate: () => switchRole('passenger')
    },
    {
      id: 'post',
      label: 'Đăng chuyến',
      icon: CarFront,
      path: isDriverVerified ? '/driver/home' : '/driver/kyc',
      matchPaths: isDriverVerified ? ['/driver/home'] : ['/driver/home', '/driver/kyc'],
      onNavigate: () => switchRole('driver')
    },
    {
      id: 'trips',
      label: 'Chuyến đi',
      icon: History,
      path: '/passenger/history',
      matchPaths: ['/passenger/history', '/driver/history', '/shared/trip-history']
    },
    {
      id: 'chat',
      label: 'Tin nhắn',
      icon: MessageSquare,
      path: '/passenger/messages',
      matchPaths: ['/passenger/messages', '/driver/messages'],
      hasUnread: true
    },
    {
      id: 'profile',
      label: 'Tài khoản',
      icon: User,
      path: '/profile',
      hasUnread: pendingBookingsForDriver.length > 0
    },
  ];

  return (
    <div className="w-full bg-white px-2 pt-2.5 pb-[22px] flex items-center justify-around select-none z-40 shrink-0 shadow-[0_-2px_18px_rgba(16,27,23,0.06)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = (tab.matchPaths || [tab.path]).includes(location.pathname);

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              tab.onNavigate?.();
              navigate(tab.path);
            }}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex min-w-[62px] flex-col items-center justify-center flex-1 gap-1.5 py-2 px-1 rounded-2xl transition-all relative ${
              isActive ? 'bg-[#F1FAF6] text-[#0F9D76] font-semibold' : 'text-[#8A9993] hover:text-[#4B5A54]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3px]' : 'stroke-[1.8px]'}`} />
              {tab.hasUnread && (
                <span
                  aria-label="Có thông báo chưa đọc"
                  className="absolute -top-0.5 -right-1 w-2.5 h-2.5 bg-[#EE7A22] rounded-full ring-2 ring-white"
                />
              )}
            </div>
            <span className="text-[10.5px] tracking-tight whitespace-nowrap">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
