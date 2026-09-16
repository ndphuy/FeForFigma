import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  User,
  Car,
  Calendar,
  ChevronRight,
  ShieldCheck,
  LogOut,
  Star,
  Wallet,
  Receipt,
  Heart,
  Bell
} from 'lucide-react';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentRole, currentUser, driverWallet, passengerWallet, vehicles, activeVehicle, pendingBookingsForDriver } = useApp();
  const hasUnreadNotifications = currentRole === 'driver' && pendingBookingsForDriver.length > 0;

  const currentWallet = currentRole === 'driver' ? driverWallet : passengerWallet;
  const formattedWallet = new Intl.NumberFormat('vi-VN').format(currentWallet);

  return (
    <div className="flex-1 p-4 space-y-3.5 bg-[#F4F7F5] overflow-y-auto rs-scroll pb-8">
      {/* User Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#E4EAE7] shadow-[0_2px_12px_rgba(16,27,23,0.04)]">
        <div className="flex items-center space-x-3.5">
          {/* Circular Initials Avatar */}
          <div className="w-14 h-14 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold flex items-center justify-center text-lg shrink-0 border border-[#B2E2D0]/50 shadow-xs">
            {currentUser.initials || (currentRole === 'driver' ? 'QH' : 'MA')}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-[#101B17] truncate">{currentUser.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF3EA] text-[#0B7A5C] border border-[#B2E2D0]">
                {currentRole === 'driver' ? 'Tài xế' : 'Hành khách'}
              </span>
            </div>
            
            <p className="text-xs text-[#4B5A54] mt-0.5">{currentUser.phone}</p>
            
            <div className="flex items-center space-x-2 text-xs text-[#4B5A54] mt-1">
              <span className="flex items-center font-bold text-amber-600">
                <Star className="w-3.5 h-3.5 fill-[#EE7A22] text-[#EE7A22] mr-0.5" />
                {currentUser.trustScore}
              </span>
              <span>·</span>
              <span>{currentRole === 'driver' ? `${currentUser.tripsCompleted || 96} chuyến lái` : `${currentUser.tripsTaken || 38} chuyến đi`}</span>
            </div>
          </div>
        </div>

        {/* Wallet Balance Bar (Clicking navigates to Wallet Detail) */}
        <div 
          onClick={() => navigate('/wallet')}
          className="mt-4 pt-4 border-t border-[#EEF2F0] flex items-center justify-between cursor-pointer hover:bg-[#F1FAF6] -mx-2 px-2 py-1 rounded-xl transition-colors"
        >
          <div className="flex items-center space-x-2 text-xs text-[#4B5A54]">
            <Wallet className="w-4 h-4 text-[#0F9D76]" />
            <span>Số dư ví:</span>
            <span className="font-bold text-[#101B17] font-mono">{formattedWallet} ₫</span>
          </div>

          <div className="flex items-center space-x-1 text-xs font-bold text-[#0F9D76]">
            <span>Chi tiết ví</span>
            <ChevronRight className="w-4 h-4" />
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
        <div className="px-4 py-3.5 flex items-center justify-between text-left">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-4.5 h-4.5 text-[#0F9D76]" />
            <span className="text-xs font-semibold text-[#101B17]">Xác thực CCCD gắn chip</span>
          </div>
          <span className="text-[11px] font-bold text-[#0F9D76] bg-[#DDF3EA] px-2.5 py-0.5 rounded-full border border-[#B2E2D0]">
            Đã xác thực
          </span>
        </div>
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
