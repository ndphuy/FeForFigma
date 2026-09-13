import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Wallet, ChevronRight, ArrowUpDown, Calendar, Clock, User, Bell, MapPin } from 'lucide-react';

export const PassengerHome = () => {
  const navigate = useNavigate();
  const { currentUser, trips, searchParams, setSearchParams, passengerWallet } = useApp();
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

  const shortcuts = ['Đến ĐH FPT', 'Về Quận 1', 'Khu CNC'];

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
                onClick={() => navigate('/passenger/pickup-picker')}
                className="py-1.5 flex flex-col justify-center cursor-pointer min-w-0"
              >
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A9993]">Điểm đón</span>
                <span className="text-xs font-semibold text-[#101B17] truncate">{origin}</span>
              </div>
              <div className="h-[1px] bg-[#EEF2F0]" />
              <div 
                onClick={() => navigate('/passenger/pickup-picker')}
                className="py-1.5 flex flex-col justify-center cursor-pointer min-w-0"
              >
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A9993]">Điểm đến</span>
                <span className="text-xs font-semibold text-[#101B17] truncate">{destination}</span>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleSwap}
              title="Đổi chiều đi" 
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 border border-[#E4EAE7] rounded-xl bg-white hover:bg-[#F1FAF6] hover:border-[#BDE7D5] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4 text-[#0B7A5C]" />
            </button>
          </div>

          {/* Date / Time */}
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => setDate(date === 'Thứ 6, 12/09' ? 'Thứ 7, 13/09' : 'Thứ 6, 12/09')}
              className="flex-1 min-w-0 h-13 border border-[#E4EAE7] rounded-xl bg-white hover:border-[#BDE7D5] flex items-center gap-2 px-3 text-left transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#0B7A5C] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A9993]">Ngày đi</span>
                <span className="text-xs font-bold text-[#101B17] truncate">{date}</span>
              </div>
            </button>

            <button 
              type="button" 
              onClick={() => setTime(time === '07:30 AM' ? '08:00 AM' : '07:30 AM')}
              className="flex-1 min-w-0 h-13 border border-[#E4EAE7] rounded-xl bg-white hover:border-[#BDE7D5] flex items-center gap-2 px-3 text-left transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4 text-[#0B7A5C] shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#8A9993]">Giờ đi</span>
                <span className="text-xs font-bold text-[#101B17] truncate">{time}</span>
              </div>
            </button>
          </div>

          {/* Passengers count selector */}
          <div className="flex items-center justify-between border border-[#E4EAE7] rounded-2xl p-2.5 px-3.5">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#0B7A5C]" />
              <span className="text-xs font-semibold text-[#101B17]">Số người đi cùng</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPassengers(num)}
                  className={`w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                    passengers === num 
                      ? 'bg-[#0F9D76] text-white shadow-xs' 
                      : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#E4EAE7]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Prominent Search CTA (Enlarged with comfortable height & padding) */}
          <button 
            type="button" 
            onClick={handleSearch}
            className="w-full h-14 min-h-[56px] py-4 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-[15px] shadow-[0_8px_22px_rgba(15,157,118,0.30)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            Tìm chuyến đi trùng tuyến
          </button>
        </div>

        {/* Shortcuts */}
        <div className="flex gap-2 overflow-x-auto rs-scroll py-0.5">
          {shortcuts.map((sc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (i === 0) setDestination('FPT University HCMC');
                if (i === 1) setDestination('Chợ Bến Thành, Q.1');
                if (i === 2) setDestination('Khu Công Nghệ Cao');
              }}
              className="h-8.5 px-3 rounded-full bg-white border border-[#E4EAE7] text-[#4B5A54] text-xs font-semibold hover:border-[#0F9D76] hover:text-[#0B7A5C] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <MapPin className="w-3 h-3 text-[#8A9993]" />
              {sc}
            </button>
          ))}
        </div>

        {/* AI Notification Card */}
        <div className="bg-[#F1FAF6] border border-[#BDE7D5]/70 rounded-2xl p-3 flex gap-2.5 items-start">
          <span className="px-1.5 py-0.5 rounded-md bg-[#0F9D76] text-white text-[9px] font-bold tracking-wider shrink-0 mt-0.5">AI</span>
          <span className="text-xs text-[#0B7A5C] leading-relaxed">
            Tuyến <strong>FPT University → Quận 1</strong> lúc 07:00–08:00 có <strong>14 tài xế</strong> đang chia sẻ chỗ tuần này.
          </span>
        </div>

        {/* Candidate Trips Section */}
        <div className="flex flex-col gap-2.5 pt-0.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-bold text-[#101B17]">Chuyến gợi ý tốt nhất</span>
            <button 
              onClick={() => navigate('/passenger/results')}
              className="text-xs font-bold text-[#0B7A5C] hover:underline cursor-pointer"
            >
              Xem tất cả ({trips.length})
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {trips.slice(0, 2).map((t) => (
              <div 
                key={t.id}
                onClick={() => navigate(`/passenger/trip/${t.id}`)}
                className="bg-white rounded-3xl p-3.5 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.04)] flex flex-col gap-3 cursor-pointer hover:border-[#0F9D76] transition-all"
              >
                {/* Header */}
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xs flex items-center justify-center shrink-0 border border-[#B2E2D0]/50">
                    {t.driverInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#101B17] truncate block">{t.driverName}</span>
                    <span className="text-[11px] text-[#8A9993]">
                      <span className="text-[#EE7A22]">★</span> {t.driverTrustScore} · {t.vehicleModel}
                    </span>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-sm font-bold text-[#0B7A5C] font-mono leading-tight">{t.matchPercentage}%</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#8A9993]">Trùng tuyến</span>
                  </div>
                </div>

                {/* Overlap Progress Bar */}
                <div className="flex flex-col gap-1">
                  <div className="h-1.5 rounded-full overflow-hidden bg-[#EEF2F0] flex gap-0.5">
                    {t.segments?.map((seg, sIdx) => (
                      <span key={sIdx} style={{ flex: seg.km, background: seg.barBg }} />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-[#4B5A54] font-medium truncate max-w-[200px]">{t.originDetail}</span>
                    <span className="font-bold text-[#0F9D76] shrink-0">Còn {t.availableSeats} chỗ</span>
                  </div>
                </div>

                {/* Bottom Route & Fare */}
                <div className="flex items-center justify-between pt-2 border-t border-[#EEF2F0]">
                  <div className="flex items-center gap-1.5 text-xs text-[#4B5A54] font-medium truncate min-w-0">
                    <span>{t.departureTime}</span>
                    <span className="text-[#8A9993]">→</span>
                    <span className="truncate">{t.destination}</span>
                  </div>
                  <div className="text-xs font-bold text-[#101B17] font-mono shrink-0 pl-2">
                    {new Intl.NumberFormat('vi-VN').format(t.priceVnd)} ₫
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
