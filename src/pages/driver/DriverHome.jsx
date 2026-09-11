import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Plus, Wallet, ChevronRight, Users, Navigation, Bell, Info, Phone, MessageSquare, MapPin, X, Car } from 'lucide-react';

export const DriverHome = () => {
  const navigate = useNavigate();
  const { currentUser, trips, pendingBookingsForDriver, driverWallet } = useApp();
  const [showDetailModal, setShowDetailModal] = useState(false);

  const formattedWallet = new Intl.NumberFormat('vi-VN').format(driverWallet);
  const activeTrip = trips[0] || {};
  const confirmedPassengers = activeTrip.passengers || [];
  
  // Passenger capacity is 3 for a 4-seater car (1 driver + 3 passenger seats)
  const passengerCapacity = 3;
  const occupiedSeatsCount = confirmedPassengers.length;
  const freeSeatsCount = Math.max(0, passengerCapacity - occupiedSeatsCount);

  return (
    <div className="w-full flex flex-col bg-[#F4F7F5] pb-6">
      {/* Top Bar matching synchronized header style */}
      <div className="flex-none bg-white px-4 pt-1.5 pb-3 flex items-center gap-3 border-b border-[#EEF2F0]">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="w-11 h-11 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-sm flex items-center justify-center shrink-0 border border-[#B2E2D0]/60 cursor-pointer shadow-xs"
        >
          {currentUser.initials || 'QH'}
        </button>

        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-[11px] font-medium text-[#8A9993]">Chào buổi sáng</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold text-[#101B17] truncate">{currentUser.name || 'Quốc Huy'}</span>
            <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#4B5A54] mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D76]" />
            Tài xế đã xác thực
            <span className="text-[#C3CDC9] text-[10px]">▾</span>
          </span>
        </div>

        {/* Static Notification Bell Icon */}
        <div
          className="relative w-10 h-10 border border-[#EEF2F0] rounded-2xl bg-white flex items-center justify-center text-[#4B5A54] shrink-0 cursor-pointer hover:bg-[#F7FAF9] transition-colors"
          title="Thông báo"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EE7A22] ring-2 ring-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3.5 flex flex-col gap-3">
        {/* Primary CTA: + Tạo chuyến đi mới */}
        <button
          type="button"
          onClick={() => navigate('/driver/create-trip')}
          className="w-full h-13 min-h-[52px] rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-sm shadow-[0_6px_18px_rgba(15,157,118,0.28)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-base leading-none">
            +
          </span>
          <span>Tạo chuyến đi mới</span>
        </button>

        {/* Compact Wallet Bar */}
        <div
          onClick={() => navigate('/wallet')}
          className="bg-white rounded-2xl p-3 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] flex items-center justify-between cursor-pointer hover:border-[#0F9D76] transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DDF3EA] text-[#0F9D76] flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10.5px] text-[#8A9993] block font-medium">Số dư ví Tài xế</span>
              <span className="text-xs font-bold text-[#101B17] font-mono">{formattedWallet} ₫</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11.5px] font-bold text-[#0B7A5C] bg-[#F1FAF6] px-2.5 py-1 rounded-xl">
            <span>Chi tiết ví</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Pending Requests Banner (Orange) */}
        {pendingBookingsForDriver.length > 0 && (
          <div className="bg-[#FFF4E9] border border-[#F7D9B8] rounded-2xl p-3 flex items-center gap-2.5">
            <div className="flex -space-x-2 shrink-0">
              {pendingBookingsForDriver.map((pb, idx) => (
                <span
                  key={pb.id || idx}
                  className="w-8 h-8 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xs flex items-center justify-center border-2 border-[#FFF4E9]"
                >
                  {pb.passengerInitials || 'MA'}
                </span>
              ))}
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
              <span className="text-xs font-bold text-[#8A4A0B]">
                {pendingBookingsForDriver.length} yêu cầu chờ bạn duyệt
              </span>
              <span className="text-[11px] text-[#8A4A0B]/80 truncate">
                {pendingBookingsForDriver[0]?.passengerName}: {pendingBookingsForDriver[0]?.pickupPoint}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/driver/requests')}
              className="h-10 min-h-[40px] px-5 rounded-xl bg-[#EE7A22] hover:bg-[#D96A16] text-white text-xs font-bold shrink-0 transition-all shadow-xs cursor-pointer flex items-center justify-center active:scale-[0.98]"
            >
              Duyệt
            </button>
          </div>
        )}

        {/* Today's Active Trip Card */}
        <div className="flex flex-col gap-2 pt-0.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-bold text-[#101B17]">Chuyến hôm nay</span>
            <button
              type="button"
              onClick={() => navigate('/driver/active-trip')}
              className="text-xs font-bold text-[#0B7A5C] hover:underline cursor-pointer"
            >
              Điều hướng ↗
            </button>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_12px_rgba(16,27,23,0.05)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DDF1F4] text-[#0A6E7A] text-[10.5px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A6E7A]" /> Đã xác nhận
              </span>
              
              <button
                type="button"
                onClick={() => setShowDetailModal(true)}
                className="text-xs font-bold text-[#0F9D76] hover:underline flex items-center gap-1 cursor-pointer bg-[#F1FAF6] px-2.5 py-1 rounded-lg border border-[#BDE7D5]/60"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Thông tin chi tiết</span>
              </button>
            </div>

            {/* Route */}
            <div className="flex gap-2.5">
              <div className="flex flex-col items-center pt-1.5 gap-1 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
                <span className="w-0.5 flex-1 min-h-[30px] bg-[#DFE7E3]" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between gap-2.5">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold text-[#101B17] truncate">{activeTrip.origin || 'FPT University HCMC'}</span>
                  <span className="text-xs font-bold text-[#101B17] font-mono shrink-0">{activeTrip.departureTime || '07:00'}</span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs font-bold text-[#101B17] truncate">{activeTrip.destination || 'Chợ Bến Thành, Q.1'}</span>
                  <span className="text-xs text-[#8A9993] font-mono shrink-0">07:48</span>
                </div>
              </div>
            </div>

            {/* Dynamic Seat Occupancy & Confirmed Passengers List */}
            <div className="flex flex-col gap-2 pt-2.5 border-t border-[#EEF2F0]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8A9993] font-semibold">
                  Tình trạng chỗ ngồi ({occupiedSeatsCount}/{passengerCapacity} chỗ)
                </span>
                <span className="font-bold text-[#0F9D76]">
                  {freeSeatsCount > 0 ? `${freeSeatsCount} ghế trống` : 'Đã đủ khách'}
                </span>
              </div>

              {confirmedPassengers.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {confirmedPassengers.map((p) => (
                    <div
                      key={p.id}
                      className="w-full p-2.5 rounded-2xl bg-[#F7FAF9] border border-[#E4EAE7] flex items-center justify-between gap-2.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xs flex items-center justify-center shrink-0 border border-[#B2E2D0]/50">
                          {p.initials || 'KH'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-[#101B17] truncate">{p.name}</span>
                          <span className="text-[10.5px] text-[#4B5A54] truncate">
                            Đón tại: <strong className="text-[#101B17] font-semibold">{p.pickupPoint}</strong>
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#EE7A22] bg-[#FFF4E9] border border-[#F7D9B8]/60 px-2 py-0.5 rounded-md shrink-0">
                        Chờ đón
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-[#F7FAF9] border border-[#EEF2F0] text-center text-xs text-[#8A9993]">
                  Chưa có hành khách nào đặt chỗ
                </div>
              )}
            </div>

            {/* Navigation CTA */}
            <button
              type="button"
              onClick={() => navigate('/driver/active-trip')}
              className="w-full h-12 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-sm rounded-xl shadow-[0_4px_14px_rgba(15,157,118,0.25)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Bắt đầu điều hướng chuyến đi</span>
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL INFO MODAL */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-[390px] bg-white rounded-t-[32px] p-4.5 flex flex-col gap-3.5 max-h-[85vh] overflow-y-auto rs-scroll shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF2F0]">
              <div className="flex flex-col">
                <span className="text-base font-bold text-[#101B17]">Chi tiết chuyến đi</span>
                <span className="text-xs text-[#8A9993] font-mono">Mã chuyến: #TRIP-001 · Hôm nay 07:00</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 rounded-full bg-[#F4F7F5] hover:bg-[#E4EAE7] flex items-center justify-center text-[#101B17] font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vehicle Info */}
            <div className="p-3 rounded-2xl bg-[#F7FAF9] border border-[#E4EAE7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center text-base">
                  🚗
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#101B17]">{activeTrip.vehicleModel || 'Honda City'} · {activeTrip.vehicleColor || 'Trắng'}</span>
                  <span className="text-xs font-mono text-[#0B7A5C] font-semibold">{activeTrip.vehiclePlate || '51G-119.02'}</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white border border-[#E4EAE7] text-[10.5px] font-bold text-[#4B5A54]">
                {occupiedSeatsCount}/{passengerCapacity} chỗ
              </span>
            </div>

            {/* Full Itinerary Stops */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold text-[#101B17] uppercase tracking-wider">Lộ trình & Điểm dừng</span>
              <div className="bg-[#F7FAF9] rounded-2xl p-3 border border-[#E4EAE7] flex flex-col gap-2.5">
                {activeTrip.stops?.map((st, idx) => (
                  <div key={st.id || idx} className="flex items-start gap-2.5 relative">
                    <div className="flex flex-col items-center mt-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-[#0F9D76]' : idx === activeTrip.stops.length - 1 ? 'bg-[#EE7A22]' : 'bg-[#0B7A5C]'}`} />
                      {idx < activeTrip.stops.length - 1 && <span className="w-0.5 h-6 bg-[#DFE7E3] my-0.5" />}
                    </div>
                    <div className="flex-1 min-w-0 flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#101B17] truncate">{st.name}</span>
                        <span className="text-[10px] text-[#8A9993]">{st.role}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#0B7A5C]">{st.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmed Passengers Information */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#101B17] uppercase tracking-wider">
                  Hành khách đã đặt ({confirmedPassengers.length})
                </span>
                <span className="text-xs font-bold font-mono text-[#0F9D76]">
                  Thu được: {new Intl.NumberFormat('vi-VN').format(confirmedPassengers.reduce((sum, p) => sum + (p.fareVnd || 0), 0))} ₫
                </span>
              </div>

              {confirmedPassengers.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {confirmedPassengers.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-white border border-[#E4EAE7] shadow-2xs flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xs flex items-center justify-center border border-[#B2E2D0]/50">
                            {p.initials || 'KH'}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#101B17] block">{p.name}</span>
                            <span className="text-[10.5px] text-[#8A9993]">{p.phone}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold font-mono text-[#0F9D76] block">
                            {new Intl.NumberFormat('vi-VN').format(p.fareVnd || 35000)} ₫
                          </span>
                          <span className="text-[9.5px] text-[#8A9993]">Đã xác nhận</span>
                        </div>
                      </div>

                      <div className="bg-[#F7FAF9] p-2 rounded-xl text-[10.5px] flex flex-col gap-1 text-[#4B5A54]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#0F9D76] font-bold">Điểm đón:</span>
                          <span className="truncate">{p.pickupPoint}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#EE7A22] font-bold">Điểm trả:</span>
                          <span className="truncate">{p.dropoffPoint}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1 border-t border-[#EEF2F0]">
                        <a
                          href={`tel:${p.phone}`}
                          className="flex-1 h-8.5 rounded-xl bg-[#F1FAF6] hover:bg-[#DDF3EA] text-[#0B7A5C] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Gọi điện</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDetailModal(false);
                            navigate(`/shared/chat/${p.id}`);
                          }}
                          className="flex-1 h-8.5 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Nhắn tin</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-[#F7FAF9] text-center text-xs text-[#8A9993]">
                  Chưa có hành khách nào đặt chỗ cho chuyến đi này.
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowDetailModal(false)}
              className="w-full h-11 bg-[#F4F7F5] hover:bg-[#E4EAE7] text-[#101B17] font-bold text-xs rounded-xl transition-colors cursor-pointer mt-1"
            >
              Đóng thông tin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

