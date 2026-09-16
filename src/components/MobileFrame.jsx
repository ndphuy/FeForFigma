import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBar } from './StatusBar';
import { BottomNav } from './BottomNav';
import { RotateCcw, User, Car, Layers } from 'lucide-react';

export const MobileFrame = ({ children, hideNav = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentRole,
    switchRole,
    resetDemoState,
    pendingBookingsForDriver
  } = useApp();

  const handleRoleToggle = (role) => {
    switchRole(role);
    if (role === 'driver') {
      navigate('/driver/home');
    } else {
      navigate('/passenger/home');
    }
  };

  const screensList = [
    {
      group: 'Hành khách (Passenger)',
      screens: [
        { name: '1. Trang chủ (Passenger Home)', path: '/passenger/home' },
        { name: '2. Lịch trình quen thuộc (Saved Commutes)', path: '/passenger/schedules' },
        { name: '3. Kết quả tìm kiếm (Search Results)', path: '/passenger/results' },
        { name: '4. Chọn điểm đón thuận tiện (Pickup Picker)', path: '/passenger/pickup-picker' },
        { name: '5. Chi tiết chuyến đi (Trip Detail)', path: '/passenger/trip-detail/trip_001' },
        { name: '6. Bóc tách chi phí (Cost Breakdown)', path: '/shared/cost-breakdown' },
        { name: '7. Gửi yêu cầu đặt chỗ (Request Booking)', path: '/passenger/request-booking/trip_001' },
        { name: '8. Đang chờ tài xế duyệt (Booking Pending)', path: '/passenger/booking-pending/trip_001' },
        { name: '9. Đặt chỗ thành công (Booking Confirmed)', path: '/passenger/booking-confirm/trip_001' },
        { name: '10. Theo dõi trực tiếp (Passenger Live)', path: '/passenger/live-tracking' },
        { name: '11. Đánh giá chuyến đi (Review Trip)', path: '/shared/review-trip' },
        { name: '12. Thông báo hành khách (Notifications)', path: '/passenger/notifications' },
        { name: '13. Danh sách tin nhắn hành khách', path: '/passenger/messages' },
      ]
    },
    {
      group: 'Tài xế (Driver)',
      screens: [
        { name: '1. Bảng tin tài xế (Driver Home)', path: '/driver/home' },
        { name: '2. Lịch trình định kỳ (Driver Schedules)', path: '/driver/schedules' },
        { name: '3. Tạo chuyến đi 6 bước (Create Trip)', path: '/driver/create-trip' },
        { name: '4. Danh sách yêu cầu chờ duyệt (Requests)', path: '/driver/requests' },
        { name: '5. Điều hướng GPS & Trả khách (Active Trip)', path: '/driver/active-trip' },
        { name: '6. Xác thực CCCD & GPLX (KYC)', path: '/driver/kyc' },
        { name: '7. Thông báo tài xế (Notifications)', path: '/driver/notifications' },
        { name: '8. Danh sách tin nhắn tài xế', path: '/driver/messages' },
      ]
    },
    {
      group: 'Dịch vụ & Tiện ích',
      screens: [
        { name: 'Lịch sử chuyến đi (Trip History)', path: '/shared/trip-history' },
        { name: 'Lịch sử chi phí (Cost History)', path: '/shared/cost-history' },
        { name: 'Danh sách yêu thích (Wishlist)', path: '/shared/wishlist' },
        { name: 'Ví RouteShare & Lịch sử giao dịch', path: '/wallet' },
        { name: 'Nạp tiền qua VietQR (PayOS)', path: '/wallet/top-up' },
        { name: 'Hồ sơ cá nhân & Chuyển đổi vai trò', path: '/profile' },
        { name: 'Đăng nhập / Xác thực', path: '/auth/login' },
      ]
    },
    {
      group: 'Quản trị (Admin)',
      screens: [
        { name: 'Admin Console — Bảng điều khiển desktop', path: '/admin/overview' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#09120e] text-[#101B17] flex flex-col items-center justify-start py-6 px-3 sm:px-6 relative selection:bg-brand-500 selection:text-white">
      {/* ================= FLOATING DEMO CONTROL BAR ================= */}
      <header className="w-full max-w-[940px] bg-[#14231e]/90 backdrop-blur-xl border border-[#233830] rounded-2xl p-3 mb-6 shadow-2xl z-40 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0F9D76] flex items-center justify-center text-white font-bold text-sm shadow-md">
            RS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-white tracking-wide">RouteShare Design System</span>
              <span className="text-[10px] font-semibold bg-[#0F9D76]/20 text-[#3EAF89] px-2 py-0.5 rounded-full border border-[#0F9D76]/30">Live Prototype</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">390 × 844 px · Be Vietnam Pro · 8px Grid</p>
          </div>
        </div>

        {/* Middle: Role Switcher */}
        <div className="flex items-center bg-[#0d1814] p-1 rounded-xl border border-[#233830]">
          <button
            onClick={() => handleRoleToggle('passenger')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'passenger'
                ? 'bg-[#0F9D76] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>🚶 Hành khách</span>
          </button>

          <button
            onClick={() => handleRoleToggle('driver')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              currentRole === 'driver'
                ? 'bg-[#0F9D76] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>🚗 Tài xế</span>
            {pendingBookingsForDriver.length > 0 && (
              <span className="w-2.5 h-2.5 bg-[#EE7A22] rounded-full absolute top-1 right-1 border-2 border-[#0d1814]" />
            )}
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={location.pathname}
              onChange={(e) => navigate(e.target.value)}
              className="bg-slate-700 hover:bg-slate-600 text-xs font-medium text-slate-200 py-1.5 pl-3 pr-8 rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer appearance-none"
            >
              {screensList.map((grp, gIdx) => (
                <optgroup key={gIdx} label={grp.group} className="bg-slate-800 text-slate-300 font-bold">
                  {grp.screens.map((scr, sIdx) => (
                    <option key={sIdx} value={scr.path} className="text-slate-100 font-normal">
                      {scr.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <Layers className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={resetDemoState}
            title="Khôi phục trạng thái ban đầu"
            className="flex items-center space-x-1 bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>

        {/* 5 SCENARIO QUICK SWITCHER FOR THESIS PRESENTATION */}
        <div className="w-full pt-2.5 mt-1 border-t border-[#233830] flex items-center justify-between gap-2 overflow-x-auto rs-scroll">
          <span className="text-[11px] font-bold text-[#3EAF89] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <span>🎯 Kịch bản Demo:</span>
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                switchRole('driver');
                navigate('/driver/create-trip');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#1F3A31] hover:bg-[#2B4E43] text-xs font-semibold text-[#7FDCC0] border border-[#2B4E43] transition-colors whitespace-nowrap cursor-pointer"
            >
              1. Tạo chuyến đa điểm
            </button>
            <button
              onClick={() => {
                switchRole('passenger');
                navigate('/passenger/results');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#1F3A31] hover:bg-[#2B4E43] text-xs font-semibold text-[#7FDCC0] border border-[#2B4E43] transition-colors whitespace-nowrap cursor-pointer"
            >
              2. Tìm chuyến & Điểm đón
            </button>
            <button
              onClick={() => {
                switchRole('driver');
                navigate('/driver/active-trip');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#0F9D76] hover:bg-[#0B8A66] text-xs font-bold text-white shadow-xs transition-colors whitespace-nowrap cursor-pointer animate-pulse"
            >
              3. Live Trip & Hoàn tiền
            </button>
            <button
              onClick={() => {
                switchRole('driver');
                navigate('/driver/kyc');
              }}
              className="px-2.5 py-1 rounded-lg bg-[#1F3A31] hover:bg-[#2B4E43] text-xs font-semibold text-[#7FDCC0] border border-[#2B4E43] transition-colors whitespace-nowrap cursor-pointer"
            >
              4. Quản lý Xe & Modal
            </button>
            <button
              onClick={() => navigate('/admin/overview')}
              className="px-2.5 py-1 rounded-lg bg-[#1A2A38] hover:bg-[#243A4D] text-xs font-semibold text-[#78B4E8] border border-[#2A445C] transition-colors whitespace-nowrap cursor-pointer"
            >
              5. Admin Portal
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE DEVICE FRAME (390 x 844) ================= */}
      <div className="relative flex flex-col items-center">
        <div className="w-[390px] h-[844px] max-h-[844px] bg-white rounded-[46px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_12px_#1e293b,0_0_0_14px_#334155] border-[3px] border-slate-900 overflow-hidden flex flex-col relative z-20 [transform:translateZ(0)]">
          {/* Dynamic Island */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-50 flex items-center justify-end px-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Status Bar */}
          <StatusBar />

          {/* Screen Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-canvas text-slate-900 flex flex-col relative">
            {children}
          </main>

          {/* Bottom Nav Bar */}
          {!hideNav && <BottomNav />}
        </div>
      </div>
    </div>
  );
};
