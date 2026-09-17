import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MOCK_USER_PROFILES } from '../../data/mockData';
import {
  User,
  Car,
  Calendar,
  ChevronRight,
  ShieldCheck,
  LogOut,
  Star,
  Receipt,
  Heart,
  Bell
} from 'lucide-react';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentRole, currentUser, driverWallet, passengerWallet, vehicles, activeVehicle, pendingBookingsForDriver, isDriverVerified } = useApp();
  const hasUnreadNotifications = currentRole === 'driver' && pendingBookingsForDriver.length > 0;

  const formattedDriverWallet = new Intl.NumberFormat('vi-VN').format(driverWallet);
  const formattedPassengerWallet = new Intl.NumberFormat('vi-VN').format(passengerWallet);

  return (
    <div className="flex-1 p-4 space-y-3.5 bg-[#F4F7F5] overflow-y-auto rs-scroll pb-8">
      {/* User Header Card — one identity, two role activity stats underneath */}
      <div className="bg-white rounded-3xl p-5 border border-[#E4EAE7] shadow-[0_2px_12px_rgba(16,27,23,0.04)]">
        <div className="flex items-center space-x-3.5">
          {/* Circular Initials Avatar */}
          <div className="w-14 h-14 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold flex items-center justify-center text-lg shrink-0 border border-[#B2E2D0]/50 shadow-xs">
            {currentUser.initials}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-[#101B17] truncate">{currentUser.name}</h1>
            <p className="text-xs text-[#4B5A54] mt-0.5">{currentUser.phone}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="flex items-center font-bold text-amber-600 text-xs">
                <Star className="w-3.5 h-3.5 fill-[#EE7A22] text-[#EE7A22] mr-0.5" />
                {currentUser.trustScore}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF2FF] text-[#2F6FCE] border border-[#BBD6F7]">Tài xế</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4E9] text-[#D96A16] border border-[#F7D9B8]">Hành khách</span>
            </div>
          </div>
        </div>

        {/* As driver */}
        <div
          onClick={() => navigate('/wallet')}
          className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[#E4EAE7] p-3 cursor-pointer hover:bg-[#F1FAF6] transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[#EAF2FF] text-[#2F6FCE] shrink-0">Là tài xế</span>
            <span className="text-[11px] text-[#4B5A54] truncate">{MOCK_USER_PROFILES.driver.tripsCompleted} chuyến lái</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-bold text-[#101B17] font-mono text-xs">{formattedDriverWallet} ₫</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#0F9D76]" />
          </div>
        </div>

        {/* As passenger */}
        <div
          onClick={() => navigate('/wallet')}
          className="mt-2.5 flex items-center justify-between gap-3 rounded-2xl border border-[#E4EAE7] p-3 cursor-pointer hover:bg-[#F1FAF6] transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[#FFF4E9] text-[#D96A16] shrink-0">Là hành khách</span>
            <span className="text-[11px] text-[#4B5A54] truncate">{MOCK_USER_PROFILES.passenger.tripsTaken} chuyến đi</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-bold text-[#101B17] font-mono text-xs">{formattedPassengerWallet} ₫</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#0F9D76]" />
          </div>
        </div>
      </div>

      {/* Account Settings Menu List */}
      <div className="bg-white rounded-3xl border border-[#E4EAE7] shadow-[0_2px_12px_rgba(16,27,23,0.04)] divide-y divide-[#EEF2F0] overflow-hidden">
        {/* Notifications */}
        <button
          type="button"
          onClick={() => navigate(currentRole === 'driver' ? '/driver/notifications' : '/passenger/notifications')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F1FAF6] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-4.5 h-4.5 text-[#4B5A54]" />
              {hasUnreadNotifications && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#EE7A22] ring-2 ring-white" />
              )}
            </div>
            <span className="text-xs font-semibold text-[#101B17]">Thông báo</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8A9993]" />
        </button>

        {/* Driver Specific: Vehicle Profile */}
        {currentRole === 'driver' && (
          <button
            type="button"
            onClick={() => navigate('/driver/kyc')}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F1FAF6] transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <Car className="w-4.5 h-4.5 text-[#0B7A5C] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#101B17]">Hồ sơ phương tiện ({vehicles.length}/3 xe)</span>
                <span className="text-[11px] text-[#0B7A5C] truncate">
                  Quản lý Ô tô ({vehicles.filter(v => v.type === 'car').length}) & Xe máy ({vehicles.filter(v => v.type === 'bike').length})
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A9993] shrink-0" />
          </button>
        )}

        {/* Cost History */}
        <button
          type="button"
          onClick={() => navigate('/shared/cost-history')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F1FAF6] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <Receipt className="w-4.5 h-4.5 text-[#4B5A54]" />
            <span className="text-xs font-semibold text-[#101B17]">Lịch sử chi phí</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8A9993]" />
        </button>

        {/* Wishlist Menu Item */}
        <button
          type="button"
          onClick={() => navigate('/shared/wishlist')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F1FAF6] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <Heart className="w-4.5 h-4.5 text-[#C22B35] fill-[#C22B35]/15" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#101B17]">Danh sách yêu thích</span>
              <span className="text-[11px] text-[#8A9993]">Lưu bạn đồng hành quen thuộc</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8A9993]" />
        </button>

        {/* Recurring Commute */}
        <button
          type="button"
          onClick={() => navigate(currentRole === 'driver' ? '/driver/schedules' : '/passenger/schedules')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F1FAF6] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <Calendar className="w-4.5 h-4.5 text-[#4B5A54]" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#101B17]">Lịch trình cố định</span>
              <span className="text-[11px] text-[#8A9993]">
                {currentRole === 'driver' ? 'Tuyến cố định nhận khách cả tháng' : 'Nhu cầu đi học/đi làm cố định'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8A9993]" />
        </button>

        {/* Identity Verification */}
        <button
          type="button"
          onClick={() => navigate('/driver/kyc')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#F1FAF6] transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <ShieldCheck className={`w-4.5 h-4.5 ${isDriverVerified ? 'text-[#0F9D76]' : 'text-[#D96A16]'}`} />
            <span className="text-xs font-semibold text-[#101B17]">Xác thực CCCD & GPLX (tài xế)</span>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
            isDriverVerified
              ? 'text-[#0F9D76] bg-[#DDF3EA] border-[#B2E2D0]'
              : 'text-[#D96A16] bg-[#FFF4E9] border-[#F7D9B8]'
          }`}>
            {isDriverVerified ? 'Đã xác thực' : 'Chưa xác thực'}
          </span>
        </button>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={() => navigate('/auth/login')}
        className="w-full py-3.5 bg-white hover:bg-[#FFF0F0] text-[#C22B35] font-bold rounded-2xl text-xs border border-[#E4EAE7] shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
};
