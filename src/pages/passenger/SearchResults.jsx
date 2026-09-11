import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Star, Users, MapPin, ArrowRight, Filter, Sparkles, Navigation } from 'lucide-react';

export const SearchResults = () => {
  const navigate = useNavigate();
  const { trips, searchFilter, selectedPickupPoint } = useApp();

  const [activeChip, setActiveChip] = useState('match'); // 'match' | 'time' | 'price'

  const sortedTrips = [...trips].sort((a, b) => {
    if (activeChip === 'match') return b.matchPercentage - a.matchPercentage;
    if (activeChip === 'price') return a.priceVnd - b.priceVnd;
    return a.departureTime.localeCompare(b.departureTime);
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/passenger/home')}
            className="w-11 h-11 border border-[#EEF2F0] rounded-2xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors"
          >
            ‹
          </button>

          <div className="flex-1 min-w-0 flex flex-col">
            <span className="text-[17px] font-bold text-[#101B17] truncate">
              {searchFilter.origin} → {searchFilter.destination}
            </span>
            <span className="text-xs text-[#8A9993]">
              {searchFilter.departureDate || 'Thứ 6, 12/09'} · {trips.length} chuyến phù hợp
            </span>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex gap-2 overflow-x-auto rs-scroll py-0.5">
          <button
            type="button"
            onClick={() => setActiveChip('match')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeChip === 'match'
                ? 'bg-[#0F9D76] text-white shadow-xs'
                : 'bg-white text-[#4B5A54] border border-[#E4EAE7]'
            }`}
          >
            Trùng tuyến cao nhất
          </button>
          <button
            type="button"
            onClick={() => setActiveChip('time')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeChip === 'time'
                ? 'bg-[#0F9D76] text-white shadow-xs'
                : 'bg-white text-[#4B5A54] border border-[#E4EAE7]'
            }`}
          >
            Giờ khởi hành gần nhất
          </button>
          <button
            type="button"
            onClick={() => setActiveChip('price')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeChip === 'price'
                ? 'bg-[#0F9D76] text-white shadow-xs'
                : 'bg-white text-[#4B5A54] border border-[#E4EAE7]'
            }`}
          >
            Chi phí tối ưu
          </button>
        </div>
      </div>

      {/* Main Trip Card Stream */}
      <div className="flex-1 overflow-y-auto rs-scroll p-4 pb-12 flex flex-col gap-3.5">
        {/* Curated Pickup Notification Banner */}
        <div 
          onClick={() => navigate('/passenger/pickup-picker')}
          className="bg-white rounded-2xl p-3.5 border border-[#BDE7D5] flex items-center justify-between cursor-pointer hover:bg-[#F1FAF6] transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#101B17] truncate">
                Điểm đón: {selectedPickupPoint?.name || 'Cổng R1 Phú Mỹ Hưng'}
              </span>
              <span className="text-[11px] text-[#0B7A5C] truncate">Điểm đón an toàn, tránh cấm dừng</span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#0B7A5C] shrink-0">Đổi</span>
        </div>

        {/* Trip List */}
        {sortedTrips.map((t) => (
          <div
            key={t.id}
            onClick={() => navigate(`/passenger/trip/${t.id}`)}
            className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] hover:border-[#0F9D76] transition-all cursor-pointer flex flex-col gap-3.5"
          >
            {/* Top Row: Driver Avatar, Name, Verified, Trust Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-sm flex items-center justify-center shrink-0 border border-[#B2E2D0]/50">
                  {t.driverInitials || 'QH'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#101B17]">{t.driverName}</span>
                    <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#8A9993] mt-0.5">
                    <span className="text-[#EE7A22] font-bold">★ {t.driverTrustScore}</span>
                    <span>·</span>
                    <span>{t.vehicleModel}</span>
                  </div>
                </div>
              </div>

              {/* Overlap Pill */}
              <div className="flex flex-col items-end">
                <span className="px-2.5 py-1 rounded-full bg-[#F1FAF6] text-[#0B7A5C] text-xs font-bold font-mono">
                  {t.matchPercentage}% trùng
                </span>
                <span className="text-[10px] text-[#8A9993] mt-0.5">Còn {t.availableSeats} chỗ</span>
              </div>
            </div>

            {/* Overlap Visual Rail Segment */}
            <div className="bg-[#F7FAF9] rounded-2xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#101B17]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
                  <span className="truncate max-w-[140px]">{t.origin}</span>
                </div>
                <span className="font-mono text-[#0F9D76]">{t.departureTime}</span>
              </div>

              {/* Route Progress Graphic */}
              <div className="relative flex items-center px-1 my-1">
                <div className="h-1.5 w-full bg-[#DFE7E3] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#C3CDC9] w-[15%]" />
                  <div className="h-full bg-[#0F9D76] w-[70%]" />
                  <div className="h-full bg-[#C3CDC9] w-[15%]" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-[#101B17]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
                  <span className="truncate max-w-[140px]">{t.destination}</span>
                </div>
                <span className="font-mono text-[#8A9993]">07:48</span>
              </div>
            </div>

            {/* Bottom Fare and Action */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#8A9993] uppercase font-bold tracking-wider">Chia sẻ chi phí</span>
                  <span className="text-[10px] font-mono text-[#0B7A5C] bg-[#F1FAF6] px-1.5 py-0.5 rounded font-semibold">
                    {(t.ratePerKm || 5000).toLocaleString('vi-VN')} ₫/km
                  </span>
                </div>
                <span className="text-lg font-bold text-[#101B17] font-mono block">
                  {new Intl.NumberFormat('vi-VN').format(t.priceVnd)} ₫
                </span>
              </div>

              <button
                type="button"
                className="h-10 px-4 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Xem chi tiết</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
