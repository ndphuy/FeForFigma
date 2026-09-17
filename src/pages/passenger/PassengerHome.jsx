import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  ChevronRight, 
  ArrowUpDown, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CalendarClock, 
  TrendingUp,
  Car,
  Repeat,
  Sparkles,
  Check
} from 'lucide-react';

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
  
  // Search Mode: 'single' (Chuyến lẻ) | 'recurring' (Đi định kỳ)
  const [tripType, setTripType] = useState('single');
  const [origin, setOrigin] = useState(searchParams?.origin || 'FPT University HCMC');
  const [destination, setDestination] = useState(searchParams?.destination || 'Chợ Bến Thành, Q.1');
  
  // Single trip fields
  const [date, setDate] = useState('Thứ 6, 12/09');
  const [time, setTime] = useState('07:30 AM');
  const [passengers, setPassengers] = useState(1);

  // Recurring trip fields
  const [recurringDays, setRecurringDays] = useState(['T2', 'T3', 'T4', 'T5', 'T6']);
  const [recurringTime, setRecurringTime] = useState('07:00 AM');
  const [preferredVehicle, setPreferredVehicle] = useState('all'); // 'all' | 'car' | 'bike'

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const formattedWallet = new Intl.NumberFormat('vi-VN').format(passengerWallet || 450000);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setSearchParams(prev => ({ ...prev, origin: destination, destination: temp }));
  };

  const handleToggleDay = (day) => {
    if (recurringDays.includes(day)) {
      if (recurringDays.length > 1) {
        setRecurringDays(recurringDays.filter(d => d !== day));
      }
    } else {
      setRecurringDays([...recurringDays, day]);
    }
  };

  const handleSearch = () => {
    if (tripType === 'recurring') {
      setSearchParams(prev => ({
        ...prev,
        origin,
        destination,
        departureTime: recurringTime,
        days: recurringDays,
        preferredVehicle,
        seats: 1
      }));
      navigate(`/passenger/results?mode=recurring&days=${encodeURIComponent(recurringDays.join(','))}&time=${encodeURIComponent(recurringTime)}&vehicle=${preferredVehicle}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
    } else {
      setSearchParams(prev => ({ 
        ...prev, 
        origin, 
        destination, 
        departureDate: date, 
        departureTime: time, 
        seats: passengers 
      }));
      navigate(`/passenger/results?mode=single&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&seats=${passengers}`);
    }
  };

  const handleSelectSchedule = (sched) => {
    setOrigin(sched.origin);
    setDestination(sched.destination);
    setRecurringTime(sched.time);
    if (sched.days) setRecurringDays(sched.days);
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
      {/* Top App Bar */}
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

        {/* LỊCH TRÌNH CỐ ĐỊNH (SAVED COMMUTES QUICK BAR) */}
        <div className="bg-white rounded-2xl p-3 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0F9D76]" />
              <span className="text-xs font-bold text-[#101B17]">Lịch trình cố định</span>
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

        {/* MAIN TRIP SEARCH CARD (SINGLE & RECURRING COMMUTE SEARCH) */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_12px_rgba(16,27,23,0.05)] flex flex-col gap-3.5">
          {/* Trip Type Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#EEF2F0] rounded-2xl">
            <button
              type="button"
              onClick={() => setTripType('single')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tripType === 'single'
                  ? 'bg-white text-[#0B7A5C] shadow-xs'
                  : 'text-[#4B5A54] hover:text-[#101B17]'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-[#0F9D76]" />
              <span>Chuyến lẻ (1 lần)</span>
            </button>

            <button
              type="button"
              onClick={() => setTripType('recurring')}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tripType === 'recurring'
                  ? 'bg-[#0F9D76] text-white shadow-xs'
                  : 'text-[#4B5A54] hover:text-[#101B17]'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Đi định kỳ (T2–T6)</span>
            </button>
          </div>

          <span className="text-base font-bold text-[#101B17] tracking-tight">
            {tripType === 'recurring' ? 'Tìm lịch trình đi chung định kỳ' : 'Bạn muốn đi đâu hôm nay?'}
          </span>

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

          {/* SINGLE TRIP CONTROLS */}
          {tripType === 'single' ? (
            <>
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

              {/* Passenger Stepper */}
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
            </>
          ) : (
            /* RECURRING COMMUTE CONTROLS */
            <div className="space-y-3">
              {/* Days of week selector */}
              <div className="border border-[#E4EAE7] rounded-2xl p-3 bg-[#F7FAF9] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">
                    Các ngày lặp lại hàng tuần
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRecurringDays(['T2', 'T3', 'T4', 'T5', 'T6'])}
                      className="text-[10px] font-bold text-[#0F9D76] bg-[#DDF3EA] px-2 py-0.5 rounded-lg hover:bg-[#c9ebdE] cursor-pointer"
                    >
                      T2–T6
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecurringDays(['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'])}
                      className="text-[10px] font-bold text-[#4B5A54] bg-[#E4EAE7] px-2 py-0.5 rounded-lg hover:bg-[#DFE7E3] cursor-pointer"
                    >
                      Cả tuần
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1">
                  {daysOfWeek.map((day) => {
                    const isSelected = recurringDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#0F9D76] text-white shadow-xs scale-105'
                            : 'bg-white border border-[#E4EAE7] text-[#4B5A54] hover:border-[#B2E2D0]'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time & Vehicle Preference */}
              <div className="grid grid-cols-2 gap-2">
                {/* Recurring Time */}
                <div className="border border-[#E4EAE7] rounded-2xl p-2.5 bg-[#F7FAF9] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0F9D76] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A9993] block">Giờ đón cố định</span>
                    <input
                      type="text"
                      value={recurringTime}
                      onChange={(e) => setRecurringTime(e.target.value)}
                      placeholder="07:00 AM"
                      className="w-full text-xs font-semibold text-[#101B17] bg-transparent outline-none truncate"
                    />
                  </div>
                </div>

                {/* Preferred Vehicle */}
                <div className="border border-[#E4EAE7] rounded-2xl p-2.5 bg-[#F7FAF9] flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#0F9D76] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A9993] block">Phương tiện</span>
                    <select
                      value={preferredVehicle}
                      onChange={(e) => setPreferredVehicle(e.target.value)}
                      className="w-full text-xs font-semibold text-[#101B17] bg-transparent outline-none cursor-pointer"
                    >
                      <option value="all">Tất cả xe</option>
                      <option value="car">Ô tô (4-7 chỗ)</option>
                      <option value="bike">Xe máy (1 chỗ)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Savings Perk Badge */}
              <div className="p-2.5 rounded-2xl bg-[#F1FAF6] border border-[#BDE7D5] flex items-center gap-2 text-xs text-[#0B7A5C]">
                <Sparkles className="w-4 h-4 text-[#0F9D76] shrink-0" />
                <span className="text-[11.5px] leading-snug">
                  Đăng ký trọn gói tháng tiết kiệm <strong>thêm ~15%</strong> & cố định tài xế đón hàng ngày.
                </span>
              </div>
            </div>
          )}

          {/* Prominent Search CTA */}
          <button
            type="button"
            onClick={handleSearch}
            className="w-full h-14 min-h-[56px] py-4 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-[15px] shadow-[0_8px_22px_rgba(15,157,118,0.30)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            {tripType === 'recurring' ? (
              <>
                <Repeat className="w-4 h-4" />
                <span>Tìm lịch trình định kỳ phù hợp</span>
              </>
            ) : (
              <span>Tìm chuyến đi phù hợp</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
