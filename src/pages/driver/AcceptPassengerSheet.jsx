import React from 'react';
import { Phone } from 'lucide-react';

export const AcceptPassengerSheet = ({ request, onClose, onAccept }) => {
  if (!request) return null;

  const name = request.passengerName || 'Lan';
  const initials = request.passengerInitials || name.slice(0, 2).toUpperCase();
  const fare = request.fareVnd || 35000;
  const fareFormatted = new Intl.NumberFormat('vi-VN').format(fare) + ' ₫';
  const detourKm = request.detourKm || '+0.8 km';
  const detourMin = request.detourMin || '+3 phút';

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-[#101B17]/50 backdrop-blur-[2px] transition-all animate-[fadeIn_0.2s_ease-out]">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Modal */}
      <div className="relative w-full bg-white rounded-t-[32px] shadow-[0_-12px_40px_rgba(16,27,23,0.22)] flex flex-col max-h-[88%] z-10 animate-[slideUp_0.25s_ease-out] overflow-hidden">
        {/* Handle bar */}
        <div className="flex-none pt-3 pb-1.5 flex justify-center">
          <span className="w-10 h-1 rounded-full bg-[#DFE7E3]" />
        </div>

        <div className="flex-1 overflow-y-auto rs-scroll px-5 py-2.5 flex flex-col gap-3.5">
          {/* Passenger Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center text-base font-bold shrink-0 border border-[#BDE7D5]">
              {initials}
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-base font-bold text-[#101B17] leading-tight">
                Chấp nhận yêu cầu của {name}?
              </span>
              <div className="flex items-center gap-2 text-xs text-[#8A9993]">
                <span><span className="text-[#EE7A22]">★</span> {request.passengerTrustScore || '4.9'} · {request.passengerTrips || 38} chuyến</span>
                <span>•</span>
                <span className="text-[#0B7A5C] font-semibold flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#0F9D76]" />
                  {request.passengerPhone || '0912 345 678'}
                </span>
              </div>
            </div>
          </div>

          {/* Before / After */}
          <div className="flex items-stretch gap-2">
            <div className="flex-1 border border-[#EEF2F0] rounded-2xl p-3 flex flex-col gap-1 bg-white">
              <span className="text-[9.5px] font-bold tracking-wider uppercase text-[#8A9993]">Lộ trình gốc</span>
              <span className="text-base font-bold text-[#4B5A54] leading-tight font-mono">18,5 km</span>
              <span className="text-[11px] text-[#8A9993]">48 phút</span>
            </div>

            <span className="shrink-0 self-center w-6 h-6 rounded-full bg-[#F4F7F5] text-[#8A9993] flex items-center justify-center text-xs font-bold">
              →
            </span>

            <div className="flex-1 rounded-2xl p-3 bg-[#F1FAF6] border border-[#BDE7D5]/70 flex flex-col gap-1">
              <span className="text-[9.5px] font-bold tracking-wider uppercase text-[#0B7A5C]">Sau khi đón</span>
              <span className="text-base font-bold text-[#0B7A5C] leading-tight font-mono">19,3 km</span>
              <span className="text-[11px] text-[#0B7A5C]">51 phút</span>
            </div>
          </div>

          {/* Deltas */}
          <div className="flex gap-2">
            <div className="flex-1 rounded-2xl p-3 bg-[#F7FAF9] border border-[#E4EAE7] flex flex-col gap-0.5">
              <span className="text-[9.5px] font-bold tracking-wider uppercase text-[#8A9993]">Đi vòng thêm</span>
              <span className="text-base font-bold text-[#101B17] font-mono leading-tight">{detourKm}</span>
            </div>
            <div className="flex-1 rounded-2xl p-3 bg-[#F7FAF9] border border-[#E4EAE7] flex flex-col gap-0.5">
              <span className="text-[9.5px] font-bold tracking-wider uppercase text-[#8A9993]">Thời gian thêm</span>
              <span className="text-base font-bold text-[#101B17] font-mono leading-tight">{detourMin}</span>
            </div>
          </div>

          {/* Seats + Contribution */}
          <div className="border border-[#EEF2F0] rounded-2xl p-3.5 flex flex-col gap-3 bg-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#101B17]">Chỗ còn lại sau khi duyệt</span>
                <span className="text-[11px] text-[#8A9993]">1 / 3 chỗ vẫn còn trống</span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <span className="w-7 h-7 rounded-lg bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xs flex items-center justify-center">
                  ✓
                </span>
                <span className="w-7 h-7 rounded-lg bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xs flex items-center justify-center">
                  ✓
                </span>
                <span className="w-7 h-7 rounded-lg bg-white border border-dashed border-[#E4EAE7] text-[#C3CDC9] font-bold text-xs flex items-center justify-center">
                  ○
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-3 border-t border-[#EEF2F0] pt-2.5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A9993]">
                  {name} đóng góp
                </span>
                <span className="text-lg font-bold text-[#0B7A5C] font-mono leading-none">
                  {fareFormatted}
                </span>
              </div>
              <span className="text-[10.5px] text-[#8A9993] text-right">
                Ví RouteShare sau chuyến
              </span>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-[#8A9993] m-0">
            Sau khi chấp nhận, {name} sẽ nhận thông báo và biển số xe của bạn sẽ hiển thị với khách.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex-none border-t border-[#F2F5F4] px-5 py-3.5 pb-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="h-12 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-sm cursor-pointer shadow-[0_6px_18px_rgba(15,157,118,0.28)] active:scale-[0.99] transition-all"
          >
            Chấp nhận khách
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl bg-transparent hover:bg-[#F7FAF9] text-[#4B5A54] font-semibold text-xs cursor-pointer transition-colors"
          >
            Huỷ
          </button>
        </div>
      </div>
    </div>
  );
};

