import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Star, Car, Users, Info, ArrowRight, Clock } from 'lucide-react';
import { RouteMapPreview } from '../../components/RouteMapPreview';

export const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, setActiveTripId, wishlistDrivers = [], toggleWishlist = () => { } } = useApp();

  const trip = trips.find((t) => t.id === id) || trips[0];

  const handleBookingClick = () => {
    setActiveTripId(trip.id);
    navigate(`/passenger/request-booking/${trip.id}`);
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN').format(trip.priceVnd);

  const cleanShortName = (str, fallback = '') => {
    if (!str) return fallback;
    return str
      .replace(/\s*\(.*?\)\s*/g, '')
      .replace(/University/gi, '')
      .replace(/HCMC/gi, '')
      .replace(/Chợ/gi, '')
      .replace(/,.*$/, '')
      .trim() || fallback;
  };

  const mapPoints = [
    { label: `Điểm đón · ${cleanShortName(trip.origin, 'ĐH FPT')}`, type: 'origin', isPrimary: true },
    { label: `Điểm trả · ${cleanShortName(trip.destination, 'Bến Thành')}`, type: 'destination', isPrimary: true }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-11 h-11 border border-[#EEF2F0] rounded-2xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors"
        >
          ‹
        </button>

        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-[17px] font-bold text-[#101B17]">Chi tiết chuyến đi</span>
          <span className="text-xs text-[#8A9993]">{trip.departureDate || 'Thứ 6, 12/09'} · {trip.distanceKm} km</span>
        </div>
      </div>

      {/* Main Scroll Area */}
      <div className="flex-1 overflow-y-auto rs-scroll p-4 pb-28 flex flex-col gap-3.5">
        {/* Visual Route Map Preview */}
        <RouteMapPreview
          points={mapPoints}
          meta={`${trip.distanceKm || 18.5} km · ${trip.departureTime || '07:00'}`}
          tag="Chặng đi của bạn"
          heightClass="h-60 min-h-[240px] shrink-0"
        />

        {/* Driver & Vehicle Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-lg flex items-center justify-center shrink-0 border border-[#B2E2D0]/50">
              {trip.driverInitials || 'QH'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-[#101B17] truncate">{trip.driverName}</span>
                <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
              </div>
              <div className="flex items-center gap-1 text-xs text-[#8A9993] mt-0.5">
                <span className="text-[#EE7A22] font-bold">★ {trip.driverTrustScore}</span>
                <span>·</span>
                <span>{trip.driverTripsCount || 96} chuyến hoàn thành</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleWishlist(trip.driverId || 'drv_01')}
              className={`p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition-all cursor-pointer shrink-0 ${wishlistDrivers.includes(trip.driverId || 'drv_01')
                  ? 'bg-[#FFF0F0] text-[#C22B35] border border-[#F7D9D9]'
                  : 'bg-[#F4F7F5] text-[#8A9993] hover:text-[#C22B35]'
                }`}
              title="Lưu tài xế yêu thích (Wishlist)"
            >
              <span>{wishlistDrivers.includes(trip.driverId || 'drv_01') ? '❤️ Đã lưu' : '🤍 Lưu'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-[#EEF2F0]">
            <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
              <img src={trip.vehicleImage} alt={trip.vehicleModel} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-xs font-bold text-[#101B17]">{trip.vehicleModel} · {trip.vehicleColor}</span>
              <span className="text-[11px] font-mono text-[#0B7A5C] bg-[#F1FAF6] self-start px-2 py-0.5 rounded-md font-semibold">
                {trip.vehiclePlate}
              </span>
            </div>
            <span className="text-xs font-semibold text-[#8A9993]">Còn {trip.availableSeats} chỗ</span>
          </div>
        </div>

        {/* Route Timeline Itinerary */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#101B17]">Lộ trình & Điểm đón</span>
            <span className="text-xs font-semibold text-[#0B7A5C]">Khởi hành {trip.departureTime}</span>
          </div>

          <div className="flex gap-3 py-1">
            <div className="flex flex-col items-center pt-2 gap-1 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
              <span className="w-0.5 flex-1 min-h-[50px] bg-[#DFE7E3]" />
              <span className="w-2 h-2 rounded-full bg-[#BDE7D5]" />
              <span className="w-0.5 flex-1 min-h-[50px] bg-[#DFE7E3]" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8A9993] tracking-wider">Điểm đón bạn</span>
                  <span className="text-xs font-bold text-[#101B17]">{trip.origin}</span>
                  <span className="text-[11px] text-[#4B5A54]">{trip.originDetail}</span>
                </div>
                <span className="text-xs font-bold text-[#101B17] font-mono">{trip.departureTime}</span>
              </div>

              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8A9993] tracking-wider">Điểm dừng phụ</span>
                  <span className="text-xs font-medium text-[#4B5A54]">Ngã 4 Thủ Đức · Đón thêm khách</span>
                </div>
                <span className="text-xs text-[#8A9993] font-mono">07:15</span>
              </div>

              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8A9993] tracking-wider">Điểm trả bạn</span>
                  <span className="text-xs font-bold text-[#101B17]">{trip.destination}</span>
                  <span className="text-[11px] text-[#4B5A54]">{trip.destinationDetail}</span>
                </div>
                <span className="text-xs font-bold text-[#101B17] font-mono">07:48</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Sharing Transparency Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#101B17]">Chi phí chia sẻ</span>
            <button
              type="button"
              onClick={() => navigate('/shared/cost-breakdown')}
              className="text-xs font-bold text-[#0B7A5C] hover:underline flex items-center gap-1"
            >
              <span>Cách tính ↗</span>
            </button>
          </div>

          <div className="bg-[#F7FAF9] rounded-2xl p-3 flex flex-col gap-2">
            <div className="flex justify-between text-xs text-[#4B5A54]">
              <span>Quãng đường bạn đi (dự kiến)</span>
              <span className="font-mono font-bold text-[#101B17]">9,0 km</span>
            </div>
            <div className="flex justify-between text-xs text-[#4B5A54]">
              <span>Đơn giá cấu hình của tài xế</span>
              <span className="font-mono font-semibold text-[#0B7A5C]">{(trip.ratePerKm || 5000).toLocaleString('vi-VN')} ₫/km</span>
            </div>
            <div className="h-[1px] bg-[#EEF2F0] my-0.5" />
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-bold text-[#101B17]">Bạn chia sẻ (1 chỗ)</span>
              <span className="text-base font-bold text-[#0B7A5C] font-mono">{formattedPrice} ₫</span>
            </div>
            <span className="text-[10.5px] text-[#8A9993]">
              Tính theo 9,0 km × {(trip.ratePerKm || 5000).toLocaleString('vi-VN')} ₫/km.
            </span>
          </div>

          <div className="flex items-start gap-2 bg-[#F1FAF6] rounded-xl p-2.5 border border-[#BDE7D5]/60">
            <Info className="w-4 h-4 text-[#0F9D76] shrink-0 mt-0.5" />
            <span className="text-[11px] text-[#0B7A5C] leading-relaxed">
              Giá được tính theo số km thực tế bạn đi, giúp tối ưu chi phí cho hành trình của bạn.
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Booking Bar */}
      <div className="absolute left-0 right-0 bottom-0 bg-white p-4 border-t border-[#EEF2F0] shadow-2xl flex items-center justify-between gap-3 z-20">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#8A9993] uppercase font-bold tracking-wider">Tổng chi phí</span>
          <span className="text-xl font-bold text-[#101B17] font-mono leading-tight">{formattedPrice} ₫</span>
        </div>

        <button
          type="button"
          onClick={handleBookingClick}
          className="flex-1 h-14 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-[15px] rounded-2xl shadow-[0_8px_20px_rgba(15,157,118,0.28)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
        >
          <span>Đặt 1 chỗ</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
