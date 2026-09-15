import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MapPin, Users, Navigation } from 'lucide-react';
import { AppMap } from '../../components/AppMap';

// Read-only route preview for a trip the driver has ALREADY published (opened from
// DriverHome's "Xem lộ trình"). This must never publish a trip — that belongs to
// CreateTrip's own step-6 review + publish.
export const RoutePreview = () => {
  const navigate = useNavigate();
  const { trips } = useApp();
  const trip = trips.find((t) => t.id === 'trip_001') || trips[0];

  const stops = trip?.stops?.length
    ? trip.stops
    : [
        { id: 'st_o', name: trip?.origin, role: 'Xuất phát', time: trip?.departureTime, isPassengerStop: true },
        { id: 'st_d', name: trip?.destination, role: 'Điểm kết thúc', time: '07:48', isPassengerStop: true },
      ];

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

  const mapPoints = stops.map((s, idx) => ({
    label: `${idx === 0 ? 'Xuất phát' : idx === stops.length - 1 ? 'Điểm đến' : 'Trạm'} · ${cleanShortName(s.name)}`,
    type: idx === 0 ? 'origin' : idx === stops.length - 1 ? 'destination' : 'waypoint'
  }));

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-11 h-11 border border-[#EEF2F0] rounded-2xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors cursor-pointer"
        >
          ‹
        </button>
        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-[17px] font-bold text-[#101B17]">Xem lộ trình</span>
          <span className="text-xs text-[#8A9993] truncate">
            {trip?.departureDate || 'Hôm nay'} · Khởi hành {trip?.departureTime}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rs-scroll p-4 pb-8 flex flex-col gap-3.5">
        {/* Unified Map Canvas */}
        <AppMap
          mode="preview"
          points={mapPoints}
          meta={`${trip?.distanceKm || 18.5} km · ${trip?.timeRange || '07:00–07:48'}`}
          tag="Lộ trình đã đăng"
          heightClass="h-56"
        />

        {/* Trip meta chips */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1.5 rounded-full bg-white border border-[#E4EAE7] text-[#4B5A54] text-[11.5px] font-semibold">
            {trip?.vehicleModel} · {trip?.vehiclePlate}
          </span>
          <span className="px-2.5 py-1.5 rounded-full bg-white border border-[#E4EAE7] text-[#4B5A54] text-[11.5px] font-semibold flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            Còn {trip?.availableSeats}/{trip?.totalSeats} chỗ
          </span>
          <span className="px-2.5 py-1.5 rounded-full bg-[#F1FAF6] border border-[#BDE7D5] text-[#0B7A5C] text-[11.5px] font-semibold">
            {trip?.statusText}
          </span>
        </div>

        {/* Stop-by-stop itinerary */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <span className="text-sm font-bold text-[#101B17]">Lộ trình chi tiết</span>

          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1.5 gap-1 shrink-0">
              {stops.map((stop, idx) => (
                <React.Fragment key={stop.id || idx}>
                  <span
                    className={
                      idx === stops.length - 1
                        ? 'w-2.5 h-2.5 rounded-xs bg-[#EE7A22] shrink-0'
                        : idx === 0
                          ? 'w-2.5 h-2.5 rounded-full bg-[#0F9D76] shrink-0'
                          : 'w-2 h-2 rounded-full bg-[#BDE7D5] shrink-0'
                    }
                  />
                  {idx < stops.length - 1 && <span className="w-0.5 flex-1 min-h-[36px] bg-[#DFE7E3]" />}
                </React.Fragment>
              ))}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
              {stops.map((stop, idx) => (
                <div key={stop.id || idx} className="flex justify-between items-start gap-2">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#8A9993] tracking-wider">
                      {stop.role || (idx === 0 ? 'Xuất phát' : idx === stops.length - 1 ? 'Điểm kết thúc' : 'Điểm dừng')}
                    </span>
                    <span className="text-xs font-bold text-[#101B17] truncate">{stop.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#101B17] font-mono shrink-0">{stop.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Passengers on this trip */}
        {trip?.passengers?.length > 0 && (
          <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-2.5">
            <span className="text-sm font-bold text-[#101B17]">Hành khách trên chuyến ({trip.passengers.length})</span>
            {trip.passengers.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5 bg-[#F7FAF9] rounded-2xl p-2.5">
                <span className="w-9 h-9 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xs flex items-center justify-center shrink-0">
                  {p.initials}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-[#101B17] truncate">{p.name}</span>
                  <span className="block text-[11px] text-[#8A9993] truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {p.pickupPoint} → {p.dropoffPoint}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/driver/home')}
          className="h-12 w-full shrink-0 rounded-[18px] bg-[#F4F7F5] text-[14px] font-semibold text-[#101B17] transition-colors hover:bg-[#E4EAE7]"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
