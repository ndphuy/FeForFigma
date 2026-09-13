import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, CarFront, MessageSquare, Bell, User } from 'lucide-react';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, pendingBookingsForDriver } = useApp();

  const passengerTabs = [
    {
      id: 'p_home',
      label: 'Trang chủ',
      icon: Home,
      path: '/passenger/home'
    },
    {
      id: 'p_history',
      label: 'Chuyến đi',
      icon: CarFront,
      path: '/passenger/history'
    },
    {
      id: 'p_chat',
      label: 'Tin nhắn',
      icon: MessageSquare,
      path: '/passenger/messages',
      hasUnread: true
    },
    {
      id: 'p_notifications',
      label: 'Thông báo',
      icon: Bell,
      path: '/passenger/notifications',
      hasUnread: true
    },
    { 
      id: 'p_profile', 
      label: 'Tài khoản', 
      icon: User, 
      path: '/profile' 
    },
  ];

  const driverTabs = [
    {
      id: 'd_home',
      label: 'Trang chủ',
      icon: Home,
      path: '/driver/home'
    },
    {
      id: 'd_history',
      label: 'Chuyến đi',
      icon: CarFront,
      path: '/driver/history'
    },
    {
      id: 'd_chat',
      label: 'Tin nhắn',
      icon: MessageSquare,
      path: '/driver/messages',
      hasUnread: true
    },
    {
      id: 'd_notifications',
      label: 'Thông báo',
      icon: Bell,
      path: '/driver/notifications',
      hasUnread: pendingBookingsForDriver.length > 0
    },
    { 
      id: 'd_profile', 
      label: 'Tài khoản', 
      icon: User, 
      path: '/profile' 
    },
  ];

  const tabs = currentRole === 'driver' ? driverTabs : passengerTabs;

  return (
    <div className="w-full bg-white px-2 pt-2.5 pb-[22px] flex items-center justify-around select-none z-40 shrink-0 shadow-[0_-2px_18px_rgba(16,27,23,0.06)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => navigate(tab.path)}
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
