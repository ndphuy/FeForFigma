import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, MessageSquare, XCircle, ArrowRight, Zap } from 'lucide-react';

export const BookingPending = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, bookings, respondBooking, activeBookingId } = useApp();

  const trip = trips.find((t) => t.id === id) || trips[0];
  const booking = bookings.find((b) => b.id === activeBookingId) || bookings[0];

  const handleInstantAccept = () => {
    respondBooking(booking?.id || 'bk_demo_01', 'accept');
    navigate(`/passenger/booking-confirm/${trip.id}`);
  };

  const handleCancel = () => {
    respondBooking(booking?.id || 'bk_demo_01', 'reject');
    navigate('/passenger/home');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/passenger/home')}
          className="w-11 h-11 border border-[#EEF2F0] rounded-2xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors"
        >
          ‹
        </button>

        <div className="flex-1 min-w-0">
          <span className="text-[17px] font-bold text-[#101B17]">Yêu cầu đặt chỗ</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto rs-scroll p-4 pb-32 flex flex-col gap-3.5">
        {/* Status Hero with Pulsating Radar Ring */}
        <div className="bg-white rounded-[28px] p-6 border border-[#E4EAE7] shadow-[0_2px_12px_rgba(16,27,23,0.06)] flex flex-col items-center gap-3.5 text-center relative overflow-hidden">
          {/* Animated Pulsing Ring */}
          <div className="relative w-32 h-32 flex items-center justify-center my-2">
            <span className="absolute w-28 h-28 rounded-full bg-[#DDF3EA] animate-rs-ring" />
            <span className="absolute w-28 h-28 rounded-full bg-[#E9F6F0] animate-rs-ring [animation-delay:1.4s]" />
            <div className="relative w-24 h-24 rounded-full bg-[#F1FAF6] flex items-center justify-center shadow-md animate-rs-float">
              <span className="w-16 h-16 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-2xl flex items-center justify-center border-2 border-white">
                {trip.driverInitials || 'QH'}
              </span>

              {/* Typing Dot Bubble */}
              <span className="absolute right-0 bottom-1 flex gap-1 items-center px-2 py-1.5 rounded-xl bg-white shadow-lg border border-[#EEF2F0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D76] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D76] animate-pulse [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D76] animate-pulse [animation-delay:0.4s]" />
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1E4] text-[#B45812] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#EE7A22]" /> Đã gửi yêu cầu
          </span>

          <span className="text-[19px] font-bold text-[#101B17] leading-snug max-w-[22ch]">
            Đang chờ {trip.driverName} duyệt yêu cầu của bạn
          </span>

          <span className="text-xs text-[#4B5A54] leading-relaxed max-w-[32ch]">
            Tài xế thường phản hồi trong vòng 3–5 phút. Bạn sẽ nhận thông báo ngay khi có kết quả.
          </span>
        </div>

        {/* 3-Step Timeline Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <div className="flex items-start justify-between relative">
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center gap-1 text-center relative">
              <div className="w-8 h-8 rounded-full bg-[#0F9D76] text-white font-bold text-xs flex items-center justify-center shadow-xs z-10">
                ✓
              </div>
              <span className="text-xs font-bold text-[#101B17]">Gửi yêu cầu</span>
              <span className="text-[10px] text-[#8A9993]">07:12</span>
            </div>

            {/* Connecting Rail 1 */}
            <div className="absolute top-4 left-[22%] right-[52%] h-0.5 bg-[#EE7A22]" />

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center gap-1 text-center relative">
              <div className="w-8 h-8 rounded-full bg-[#FFF1E4] border-2 border-[#EE7A22] text-[#EE7A22] font-bold text-xs flex items-center justify-center z-10 animate-pulse">
                2
              </div>
              <span className="text-xs font-bold text-[#EE7A22]">Tài xế duyệt</span>
              <span className="text-[10px] text-[#EE7A22]">Đang chờ...</span>
            </div>

            {/* Connecting Rail 2 */}
            <div className="absolute top-4 left-[52%] right-[22%] h-0.5 bg-[#DFE7E3]" />

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center gap-1 text-center relative">
              <div className="w-8 h-8 rounded-full bg-[#F4F7F5] border border-[#DFE7E3] text-[#8A9993] font-bold text-xs flex items-center justify-center z-10">
                3
              </div>
              <span className="text-xs font-semibold text-[#8A9993]">Xác nhận</span>
              <span className="text-[10px] text-[#8A9993]">Khởi hành 07:00</span>
            </div>
          </div>
        </div>

        {/* Driver & Trip Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-base flex items-center justify-center shrink-0 border border-[#B2E2D0]/50">
            {trip.driverInitials || 'QH'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#101B17] truncate">{trip.driverName}</span>
              <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
            </div>
            <span className="text-xs text-[#8A9993]">
              <span className="text-[#EE7A22]">★</span> {trip.driverTrustScore} · {trip.vehicleModel}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/shared/chat/trip_001')}
            className="h-9 px-3 bg-[#F1FAF6] hover:bg-[#DDF3EA] text-[#0B7A5C] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Nhắn tin</span>
          </button>
        </div>

        {/* Demo Trigger Instant Accept */}
        <div className="bg-[#F1FAF6] border border-[#BDE7D5] rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Zap className="w-4 h-4 text-[#0F9D76] shrink-0" />
            <span className="text-xs text-[#0B7A5C] font-semibold">Demo: Giả lập tài xế phê duyệt ngay</span>
          </div>
          <button
            type="button"
            onClick={handleInstantAccept}
            className="px-3 py-1.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Duyệt ngay
          </button>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="absolute left-0 right-0 bottom-0 bg-white p-4 border-t border-[#EEF2F0] shadow-2xl flex items-center gap-3 z-20">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 h-12 border border-[#E4EAE7] hover:bg-[#F7FAF9] text-[#C22B35] font-bold text-xs rounded-2xl transition-colors cursor-pointer"
        >
          Hủy yêu cầu
        </button>

        <button
          type="button"
          onClick={() => navigate('/passenger/home')}
          className="flex-1 h-12 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-xs rounded-2xl shadow-xs transition-colors cursor-pointer"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};
