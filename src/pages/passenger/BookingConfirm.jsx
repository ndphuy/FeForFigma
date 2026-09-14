import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Phone, MessageSquare, ArrowRight, Home, CheckCircle2, CalendarClock } from 'lucide-react';

export const BookingConfirm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, activeBooking, acceptReschedule, declineReschedule } = useApp();

  const trip = trips.find((t) => t.id === id) || trips[0];
  const booking = activeBooking;
  const isPendingReschedule = booking?.status === 'pending_reschedule';

  const handleAcceptReschedule = () => {
    if (booking) acceptReschedule(booking.id);
  };

  const handleDeclineReschedule = () => {
    if (booking) declineReschedule(booking.id);
    navigate('/passenger/home');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Success Hero Header */}
      <div className="flex-none bg-[#0F9D76] px-5 pt-2 pb-10 flex flex-col items-center gap-3 text-center rounded-b-[34px] shadow-lg relative">
        <button
          type="button"
          onClick={() => navigate('/passenger/home')}
          className="self-end w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center text-lg transition-colors hover:bg-white/30 cursor-pointer"
        >
          ×
        </button>

        {/* Pop Checkmark Icon */}
        <div className="relative w-24 h-24 flex items-center justify-center -mt-2">
          <span className="absolute w-22 h-22 rounded-full bg-white/25 animate-rs-ring2" />
          <div className="relative w-18 h-18 rounded-full bg-white flex items-center justify-center shadow-lg animate-rs-pop">
            <CheckCircle2 className="w-10 h-10 text-[#0F9D76] stroke-[2.5]" />
          </div>
        </div>

        <span className="text-[21px] font-bold text-white leading-tight max-w-[20ch]">
          Chuyến đi của bạn đã được xác nhận!
        </span>

        <span className="text-xs text-[#DDF3EA] leading-relaxed max-w-[32ch]">
          {trip.driverName} đã đồng ý. Chỗ của bạn đã được giữ cho {trip.departureTime} ngày {trip.departureDate || '12/09'}.
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold font-mono mt-1">
          Mã đặt chỗ: {booking?.bookingCode || '#RS-4821'}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto rs-scroll p-4 -mt-5 pb-28 flex flex-col gap-3.5 z-10">
        {/* Reschedule Alert — driver changed the trip, passenger must respond */}
        {isPendingReschedule && (
          <div className="bg-white rounded-3xl p-4 border-[1.5px] border-[#F7D9B8] shadow-[0_6px_20px_rgba(16,27,23,0.08)] flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-[#FFF4E9] text-[#EE7A22] flex items-center justify-center shrink-0">
                <CalendarClock className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <span className="block text-sm font-bold text-[#101B17]">Tài xế đã đổi lịch chuyến đi</span>
                <span className="block text-xs text-[#8A9993]">Vui lòng xác nhận lịch mới hoặc huỷ đặt chỗ</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-[#F7FAF9] rounded-2xl p-3">
              <div className="flex-1 min-w-0 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">Lịch cũ</span>
                <span className="block text-xs font-bold text-[#8A9993] line-through font-mono mt-0.5">
                  {booking.previousDepartureDate} · {booking.previousDepartureTime}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8A9993] shrink-0" />
              <div className="flex-1 min-w-0 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#0B7A5C]">Lịch mới</span>
                <span className="block text-xs font-bold text-[#0B7A5C] font-mono mt-0.5">
                  {booking.departureDate} · {booking.departureTime}
                </span>
              </div>
            </div>

            {booking.rescheduleReason && (
              <p className="text-[11px] text-[#8A4A0B] bg-[#FFF4E9] border border-[#F7D9B8]/70 rounded-xl p-2.5 leading-relaxed">
                Lý do từ tài xế: {booking.rescheduleReason}
              </p>
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleDeclineReschedule}
                className="flex-1 h-11 border border-[#E4EAE7] hover:bg-[#FFF0F0] text-[#C22B35] font-bold text-xs rounded-2xl transition-colors cursor-pointer"
              >
                Huỷ đặt chỗ
              </button>
              <button
                type="button"
                onClick={handleAcceptReschedule}
                className="flex-1 h-11 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-xs rounded-2xl shadow-xs transition-colors cursor-pointer"
              >
                Đồng ý lịch mới
              </button>
            </div>
          </div>
        )}

        {/* Driver & Vehicle Card with Call & Chat Buttons */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_6px_20px_rgba(16,27,23,0.08)] flex flex-col gap-3.5">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-lg flex items-center justify-center shrink-0 border border-[#B2E2D0]/50">
              {trip.driverInitials || 'QH'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-[#101B17] truncate">{trip.driverName}</span>
                <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
              </div>
              <span className="text-xs text-[#8A9993]">
                <span className="text-[#EE7A22]">★</span> {trip.driverTrustScore} · {trip.driverTripsCount || 96} chuyến
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="tel:0901234567"
                className="w-10 h-10 rounded-2xl border border-[#E4EAE7] hover:bg-[#F1FAF6] flex items-center justify-center text-[#0B7A5C] transition-colors"
                title="Gọi điện"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => navigate('/shared/chat/trip_001')}
                className="w-10 h-10 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                title="Nhắn tin"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-[#EEF2F0]">
            <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              <img src={trip.vehicleImage} alt={trip.vehicleModel} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-xs font-bold text-[#101B17]">{trip.vehicleModel} · {trip.vehicleColor}</span>
              <span className="text-[11px] font-mono text-[#0B7A5C] bg-[#F1FAF6] self-start px-2 py-0.5 rounded-md font-semibold">
                {trip.vehiclePlate}
              </span>
            </div>
          </div>
        </div>

        {/* Boarding PIN / Code */}
        <div className="bg-[#F1FAF6] border border-[#BDE7D5] rounded-3xl p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#0B7A5C] tracking-wider">Mã xác thực lên xe (PIN)</span>
            <span className="text-xs text-[#4B5A54] mt-0.5">Đọc mã này cho tài xế khi bạn lên xe</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-[#0F9D76] text-white font-mono font-black text-lg tracking-widest shadow-xs">
            {booking?.pin || '4821'}
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#101B17]">Hành trình của bạn</span>
            <span className="text-xs text-[#0B7A5C] font-semibold">{trip.departureDate || 'Thứ 6, 12/09'}</span>
          </div>

          <div className="flex gap-3 py-1">
            <div className="flex flex-col items-center pt-1.5 gap-1 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
              <span className="w-0.5 flex-1 min-h-[36px] bg-[#DFE7E3]" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8A9993] tracking-wider">Điểm đón</span>
                  <span className="text-xs font-bold text-[#101B17]">{trip.origin}</span>
                </div>
                <span className="text-xs font-bold text-[#101B17] font-mono">{trip.departureTime}</span>
              </div>

              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8A9993] tracking-wider">Điểm trả dự kiến</span>
                  <span className="text-xs font-bold text-[#101B17]">{trip.destination}</span>
                </div>
                <span className="text-xs font-bold text-[#101B17] font-mono">07:48</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="absolute left-0 right-0 bottom-0 bg-white p-4 border-t border-[#EEF2F0] shadow-2xl flex items-center gap-3 z-20">
        <button
          type="button"
          onClick={() => navigate('/passenger/home')}
          className="w-13 h-13 border border-[#E4EAE7] hover:bg-[#F7FAF9] text-[#4B5A54] rounded-2xl flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          title="Về trang chủ"
        >
          <Home className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/passenger/live-tracking')}
          className="flex-1 h-13 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-sm rounded-2xl shadow-[0_8px_20px_rgba(15,157,118,0.28)] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Theo dõi trực tiếp</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
