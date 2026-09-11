import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, Search, MessageSquare, User, PlusCircle, Inbox, Clock, History } from 'lucide-react';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, pendingBookingsForDriver } = useApp();

  const passengerTabs = [
    { 
      id: 'p_home', 
      label: 'Khám phá', 
      icon: Home, 
      path: '/passenger/home' 
    },
    { 
      id: 'p_history', 
      label: 'Lịch sử', 
      icon: Clock, 
      path: '/passenger/history' 
    },
    { 
      id: 'p_chat', 
      label: 'Tin nhắn', 
      icon: MessageSquare, 
      path: '/shared/chat/trip_001' 
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
      label: 'Bảng tin', 
      icon: Home, 
      path: '/driver/home' 
    },
    { 
      id: 'd_history', 
      label: 'Lịch sử', 
      icon: Clock, 
      path: '/driver/history' 
    },
    { 
      id: 'd_requests', 
      label: 'Yêu cầu', 
      icon: Inbox, 
      path: '/driver/requests',
      badge: pendingBookingsForDriver.length > 0 ? pendingBookingsForDriver.length : null
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
    <div className="w-full bg-white border-t border-[#E4EAE7] px-4 py-2 flex items-center justify-between select-none z-40 shrink-0 shadow-[0_-2px_10px_rgba(16,27,23,0.03)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
              isActive ? 'text-[#0F9D76] font-semibold' : 'text-[#8A9993] hover:text-[#4B5A54]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3px]' : 'stroke-[1.8px]'}`} />
              {tab.badge && (
                <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 bg-[#EE7A22] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-1 tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

