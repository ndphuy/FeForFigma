import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Wallet, ChevronRight, ArrowUpDown, Calendar, Clock, User, Bell, MapPin, CalendarClock, TrendingUp } from 'lucide-react';

export const PassengerHome = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    trips,
    searchParams,
    setSearchParams,
    passengerWallet,
    activeBooking,
    passengerSchedules
  } = useApp();
  const hasPendingReschedule = activeBooking?.status === 'pending_reschedule';
  const [origin, setOrigin] = useState(searchParams?.origin || 'FPT University HCMC');
  const [destination, setDestination] = useState(searchParams?.destination || 'Chợ Bến Thành, Q.1');
  const [date, setDate] = useState('Thứ 6, 12/09');
  const [time, setTime] = useState('07:30 AM');
  const [passengers, setPassengers] = useState(1);

  const formattedWallet = new Intl.NumberFormat('vi-VN').format(passengerWallet || 450000);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setSearchParams(prev => ({ ...prev, origin: destination, destination: temp }));
  };

  const handleSearch = () => {
    setSearchParams(prev => ({ ...prev, origin, destination, departureDate: date, departureTime: time, seats: passengers }));
    navigate('/passenger/results');
  };

  const handleSelectSchedule = (sched) => {
    setOrigin(sched.origin);
    setDestination(sched.destination);
    setTime(sched.time);
    setSearchParams(prev => ({
      ...prev,
      origin: sched.origin,
      destination: sched.destination,
      departureTime: sched.time,
      seats: 1
    }));
    navigate(`/passenger/results?mode=recurring&scheduleId=${sched.id}&origin=${encodeURIComponent(sched.origin)}&destination=${encodeURIComponent(sched.destination)}&time=${encodeURIComponent(sched.time)}`);
  };

  return (
    <div className="w-full flex flex-col bg-[#F4F7F5] pb-6">
      {/* Top App Bar with Synchronized Style */}
      <div className="flex-none bg-white px-4 pt-1.5 pb-3 flex items-center gap-3 border-b border-[#EEF2F0]">
        {/* User Avatar Circle */}
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="w-11 h-11 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-sm flex items-center justify-center shrink-0 border border-[#B2E2D0]/60 cursor-pointer shadow-xs"
        >
          {currentUser.initials || 'MA'}
        </button>

        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-[11px] font-medium text-[#8A9993]">Chào buổi sáng</span>
          <span className="text-[15px] font-bold tracking-tight text-[#101B17] truncate">{currentUser.name || 'Minh Anh'}</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-[#4B5A54] mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D76]" />
            TP. Hồ Chí Minh
            <span className="text-[#C3CDC9] text-[10px]">▾</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/passenger/notifications')}
          className="relative w-10 h-10 border border-[#EEF2F0] rounded-2xl bg-white flex items-center justify-center text-[#4B5A54] shrink-0 cursor-pointer hover:bg-[#F7FAF9] transition-colors"
          title="Thông báo"
          aria-label="Mở thông báo"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EE7A22] ring-2 ring-white" />
        </button>
      </div>

      {/* Main Content */}
      <div className="p-3.5 flex flex-col gap-3.5">
        {/* COMPACT WALLET BAR */}
        <div
          onClick={() => navigate('/wallet')}
          className="bg-white rounded-2xl p-3 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] flex items-center justify-between cursor-pointer hover:border-[#0F9D76] transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DDF3EA] text-[#0F9D76] flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10.5px] text-[#8A9993] block font-medium">Số dư ví RouteShare</span>
              <span className="text-xs font-bold text-[#101B17] font-mono">{formattedWallet} ₫</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11.5px] font-bold text-[#0B7A5C] bg-[#F1FAF6] px-2.5 py-1 rounded-xl">
            <span>Nạp ví</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* LỊCH TRÌNH QUEN THUỘC (SAVED COMMUTES QUICK BAR) */}
        <div className="bg-white rounded-2xl p-3 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0F9D76]" />
              <span className="text-xs font-bold text-[#101B17]">Lịch trình quen thuộc</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/passenger/schedules')}
              className="text-[11px] font-bold text-[#0F9D76] hover:underline cursor-pointer flex items-center space-x-0.5"
            >
              <span>Quản lý lịch</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto rs-scroll pb-0.5 pt-0.5 -mx-1 px-1">
            {passengerSchedules.filter(s => s.active).map((sched) => (
              <button
                key={sched.id}
                type="button"
                onClick={() => handleSelectSchedule(sched)}
                className="flex items-center space-x-2 bg-[#F7FAF9] hover:bg-[#DDF3EA] hover:border-[#B2E2D0] border border-[#E4EAE7] px-3 py-2 rounded-xl text-left shrink-0 transition-all cursor-pointer group"
              >
                <span className="text-base">{sched.icon || '🏢'}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#101B17] group-hover:text-[#0B7A5C] truncate max-w-[130px]">
                    {sched.title}
                  </span>
                  <span className="text-[10px] text-[#4B5A54] font-mono font-medium">
                    {sched.time} · {sched.days?.join(', ')}
                  </span>
                </div>
              </button>
            ))}

            <button
              type="button"
              onClick={() => navigate('/passenger/schedules')}
              className="flex items-center space-x-1 border border-dashed border-[#B2E2D0] bg-[#F1FAF6] text-[#0B7A5C] px-3 py-2 rounded-xl text-xs font-bold shrink-0 hover:bg-[#DDF3EA] transition-colors cursor-pointer"
            >
              <span>+ Thêm</span>
            </button>
          </div>
        </div>

        {/* Reschedule Alert */}
        {hasPendingReschedule && (
          <button
            type="button"
            onClick={() => navigate(`/passenger/booking-confirm/${activeBooking.tripId}`)}
            className="bg-[#FFF4E9] border border-[#F7D9B8] rounded-2xl p-3 flex items-center gap-2.5 text-left hover:bg-[#FFEEDB] transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-xl bg-[#EE7A22] text-white flex items-center justify-center shrink-0">
              <CalendarClock className="w-4 h-4" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-[#8A4A0B]">Tài xế đã đổi lịch chuyến của bạn</span>
              <span className="block text-[11px] text-[#8A4A0B]/80">Bấm để xác nhận lịch mới hoặc huỷ đặt chỗ</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#8A4A0B] shrink-0" />
          </button>
        )}

        {/* SEARCH CARD */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_12px_rgba(16,27,23,0.05)] flex flex-col gap-3.5">
          <span className="text-base font-bold text-[#101B17] tracking-tight">Bạn muốn đi đâu?</span>

          {/* Pickup / Destination inputs + swap */}
          <div className="relative flex gap-2.5 border border-[#E4EAE7] rounded-2xl px-3 py-1 bg-white">
            <div className="flex flex-col items-center pt-3.5 gap-1 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
              <span className="w-0.5 h-7 bg-[#DFE7E3]" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
            </div>

            <div className="flex-1 min-w-0 pr-10 flex flex-col">
              <div
                onClick={() => navigate('/passenger/destination-search')}
                className="py-1.5 flex flex-col justify-center cursor-pointer min-w-0"
              >
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A9993]">Điểm đón</span>
                <span className="text-xs font-semibold text-[#101B17] truncate">{origin}</span>
              </div>
              <div className="h-[1px] bg-[#EEF2F0]" />
              <div
                onClick={() => navigate('/passenger/destination-search')}
                className="py-1.5 flex flex-col justify-center cursor-pointer min-w-0"
              >
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A9993]">Điểm đến</span>
                <span className="text-xs font-semibold text-[#101B17] truncate">{destination}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#F4F7F5] flex items-center justify-center text-[#4B5A54] hover:bg-[#DDF3EA] hover:text-[#0B7A5C] transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Date & Time Selectors */}
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-[#E4EAE7] rounded-2xl p-2.5 bg-[#F7FAF9] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0F9D76] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A9993] block">Ngày đi</span>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-semibold text-[#101B17] bg-transparent outline-none truncate"
                />
              </div>
            </div>

            <div className="border border-[#E4EAE7] rounded-2xl p-2.5 bg-[#F7FAF9] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#0F9D76] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A9993] block">Giờ đón</span>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full text-xs font-semibold text-[#101B17] bg-transparent outline-none truncate"
                />
              </div>
            </div>
          </div>

          {/* Passenger Stepper: min 1, max 6 */}
          <div className="border border-[#E4EAE7] rounded-2xl p-2.5 bg-[#F7FAF9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#0F9D76] shrink-0" />
              <div>
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A9993] block">Số người đi cùng</span>
                <span className="text-xs font-semibold text-[#101B17]">
                  {passengers} người (Tối đa 6)
                </span>
              </div>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-[#E4EAE7] shadow-2xs">
              <button
                type="button"
                onClick={() => setPassengers(p => Math.max(1, p - 1))}
                disabled={passengers <= 1}
                className="w-6 h-6 rounded-lg bg-[#F4F7F5] disabled:opacity-30 text-[#101B17] font-bold text-sm flex items-center justify-center hover:bg-[#DDF3EA] hover:text-[#0B7A5C] transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="w-5 text-center text-xs font-bold font-mono text-[#101B17]">
                {passengers}
              </span>
              <button
                type="button"
                onClick={() => setPassengers(p => Math.min(6, p + 1))}
                disabled={passengers >= 6}
                className="w-6 h-6 rounded-lg bg-[#F4F7F5] disabled:opacity-30 text-[#101B17] font-bold text-sm flex items-center justify-center hover:bg-[#DDF3EA] hover:text-[#0B7A5C] transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Prominent Search CTA (Enlarged with comfortable height & padding) */}
          <button
            type="button"
            onClick={handleSearch}
            className="w-full h-14 min-h-[56px] py-4 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-[15px] shadow-[0_8px_22px_rgba(15,157,118,0.30)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            Tìm chuyến đi phù hợp
          </button>
        </div>
      </div>
    </div>
  );
};
