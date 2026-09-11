import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Check, X, ArrowRight, Clock, MapPin } from 'lucide-react';
import { AcceptPassengerSheet } from './AcceptPassengerSheet';

export const BookingRequests = () => {
  const navigate = useNavigate();
  const { bookings, respondBooking, pendingBookingsForDriver } = useApp();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'accepted' | 'rejected'
  const [selectedRequest, setSelectedRequest] = useState(null);

  const displayedRequests = bookings.filter(b => {
    if (activeTab === 'pending') return b.status === 'pending';
    if (activeTab === 'accepted') return b.status === 'confirmed';
    if (activeTab === 'rejected') return b.status === 'rejected';
    return true;
  });

  const handleQuickAccept = (bookingId) => {
    respondBooking(bookingId, 'accept');
  };

  const handleQuickDecline = (bookingId) => {
    respondBooking(bookingId, 'reject');
  };

  return (
    <div className="w-full flex flex-col bg-[#F4F7F5] pb-6">
      {/* Header matching Booking Requests */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/driver/home')}
            className="w-10 h-10 border border-[#EEF2F0] rounded-xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors cursor-pointer"
          >
            ‹
          </button>

          <div className="flex-1 min-w-0 flex flex-col">
            <span className="text-base font-bold text-[#101B17] tracking-tight">Yêu cầu đặt chỗ</span>
            <span className="text-[11px] text-[#8A9993]">Chuyến 07:00 hôm nay</span>
          </div>

          <span className="min-w-[28px] h-7 px-2 rounded-full bg-[#EE7A22] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {pendingBookingsForDriver.length}
          </span>
        </div>

        {/* Tabs: Chờ duyệt, Đã nhận, Đã từ chối */}
        <div className="flex gap-2 overflow-x-auto rs-scroll">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`h-8.5 px-3.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#0F9D76] text-white shadow-xs'
                : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#EAEFEA]'
            }`}
          >
            Chờ duyệt ({pendingBookingsForDriver.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('accepted')}
            className={`h-8.5 px-3.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'accepted'
                ? 'bg-[#0F9D76] text-white shadow-xs'
                : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#EAEFEA]'
            }`}
          >
            Đã nhận
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rejected')}
            className={`h-8.5 px-3.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-[#0F9D76] text-white shadow-xs'
                : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#EAEFEA]'
            }`}
          >
            Đã từ chối
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="p-3.5 flex flex-col gap-3">
        {displayedRequests.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#8A9993]">
            Không có yêu cầu nào trong mục này.
          </div>
        ) : (
          displayedRequests.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl p-3.5 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.04)] flex flex-col gap-3"
            >
              {/* Trip Context Tag Bar */}
              <div className="bg-[#F7FAF9] p-2.5 px-3 rounded-xl border border-[#EEF2F0] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-[#0F9D76] text-white text-[10px] font-bold">
                    🚗 Chuyến {r.departureTime || '07:00'}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-[#0B7A5C]">
                    {r.vehiclePlate || '51G-119.02'}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#101B17] truncate">
                  {r.routeText || 'FPT University → Chợ Bến Thành'}
                </span>
              </div>

              {/* Passenger Header */}
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-sm flex items-center justify-center shrink-0 border border-[#B2E2D0]/50">
                  {r.passengerInitials || 'MA'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-[#101B17] truncate">{r.passengerName}</span>
                    <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
                  </div>
                  <span className="text-[11px] text-[#8A9993]">
                    <span className="text-[#EE7A22]">★</span> {r.passengerTrustScore || 4.9} · {r.passengerTrips || 38} chuyến
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold font-mono text-[#0F9D76] block">
                    {new Intl.NumberFormat('vi-VN').format(r.fareVnd || 45000)} ₫
                  </span>
                  <span className="text-[10px] text-[#8A9993] block">{r.createdAt || '12 phút trước'}</span>
                </div>
              </div>

              {/* Decision Pair: Overlap % & Detour */}
              <div className="flex gap-2">
                {/* Overlap Progress */}
                <div className="flex-1 rounded-2xl p-2.5 bg-[#F1FAF6] border border-[#BDE7D5]/70 flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#0B7A5C]">Độ trùng tuyến</span>
                  <span className="text-xl font-bold font-mono text-[#0B7A5C] leading-none">
                    {r.overlapPercent || 91}%
                  </span>
                  <div className="h-1 rounded-full bg-[#DDF3EA] overflow-hidden mt-0.5">
                    <div className="h-full bg-[#0F9D76]" style={{ width: `${r.overlapPercent || 91}%` }} />
                  </div>
                </div>

                {/* Detour */}
                <div className="flex-1 rounded-2xl p-2.5 bg-[#F7FAF9] border border-[#E4EAE7] flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A9993]">Bạn đi thêm</span>
                  <span className="text-base font-bold font-mono text-[#101B17] leading-tight">
                    {r.detourKm || '+0.8 km'}
                  </span>
                  <span className="text-[10.5px] font-semibold text-[#4B5A54]">{r.detourMin || '+3 phút'}</span>
                </div>
              </div>

              {/* Journey details: Pickup & Dropoff specific */}
              <div className="bg-[#F7FAF9] rounded-xl p-2.5 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0F9D76] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase font-bold text-[#8A9993] block">Khách đón tại</span>
                    <span className="text-[#101B17] font-semibold truncate block text-xs">{r.pickupPoint}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-xs bg-[#EE7A22] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase font-bold text-[#8A9993] block">Khách trả tại</span>
                    <span className="text-[#101B17] font-semibold truncate block text-xs">{r.dropoffPoint}</span>
                  </div>
                </div>
              </div>

              {/* Optional passenger message */}
              {r.message && (
                <div className="bg-[#FFF4E9] p-2.5 rounded-xl border border-[#F7D9B8]/70 text-xs text-[#8A4A0B]">
                  <strong>Lời nhắn:</strong> "{r.message}"
                </div>
              )}

              {/* Bottom Actions for Pending */}
              {r.status === 'pending' ? (
                <div className="flex items-center gap-2 pt-1 border-t border-[#EEF2F0]">
                  <button
                    type="button"
                    onClick={() => handleQuickDecline(r.id)}
                    className="flex-1 h-11 border border-[#E4EAE7] hover:bg-[#FFF0F0] text-[#C22B35] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Từ chối
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRequest(r)}
                    className="flex-1 h-11 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Duyệt khách</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#8A9993]">Trạng thái:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    r.status === 'confirmed'
                      ? 'bg-[#DDF3EA] text-[#0B7A5C]'
                      : 'bg-[#FFF0F0] text-[#C22B35]'
                  }`}>
                    {r.status === 'confirmed' ? '✓ Đã đồng ý đón' : '✗ Đã từ chối'}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Accept Passenger Bottom Sheet */}
      {selectedRequest && (
        <AcceptPassengerSheet
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onAccept={() => {
            handleQuickAccept(selectedRequest.id);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
};

