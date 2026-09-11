import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Star, CheckCircle2 } from 'lucide-react';

export const TripCard = ({ trip, onSelect }) => {
  const navigate = useNavigate();
  const { setActiveTripId } = useApp();

  const handleCardClick = () => {
    setActiveTripId(trip.id);
    if (onSelect) {
      onSelect(trip);
    } else {
      navigate(`/passenger/trip-detail/${trip.id}`);
    }
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN').format(trip.priceVnd);

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.04)] hover:border-[#0F9D76]/50 transition-all cursor-pointer active:scale-[0.99] mb-3.5"
    >
      {/* Top row: Avatar + Name + Vehicle + Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Circular Initials Avatar */}
          <div className="w-11 h-11 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold flex items-center justify-center text-sm shrink-0 border border-[#B2E2D0]">
            {trip.driverInitials || trip.driverName?.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-bold text-[#101B17]">{trip.driverName}</span>
              {trip.verified && (
                <CheckCircle2 className="w-4 h-4 text-[#0F9D76] fill-[#DDF3EA]" />
              )}
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-[#4B5A54] mt-0.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-[#101B17]">{trip.driverTrustScore}</span>
              <span>·</span>
              <span>{trip.vehicleModel}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {trip.statusText === 'Chờ duyệt' ? (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FDF1E9] text-[#EE7A22] border border-[#FCDDC8]">
              Chờ duyệt
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#DDF3EA] text-[#0B7A5C] border border-[#B2E2D0]">
              Đang mở
            </span>
          )}
        </div>
      </div>

      {/* Divider with clear border */}
      <div className="border-t border-[#E4EAE7] my-3" />

      {/* Bottom row: Departure Info & Price */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[11px] font-medium text-[#8A9993] block mb-0.5">Khởi hành</span>
          <p className="text-sm font-bold text-[#101B17]">
            {trip.departureDate} · {trip.departureTime}
          </p>
          <p className="text-xs text-[#4B5A54] mt-0.5">
            Trống {trip.availableSeats} chỗ · {trip.distanceKm || 12.6} km
          </p>
        </div>

        <div className="text-right">
          <span className="text-lg font-black text-[#0F9D76]">
            {formattedPrice} đ
          </span>
        </div>
      </div>
    </div>
  );
};
