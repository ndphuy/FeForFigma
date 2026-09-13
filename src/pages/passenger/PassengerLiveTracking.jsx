import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Phone, MessageSquare, AlertCircle, Home, Navigation, Crosshair } from 'lucide-react';
import { SOSModal } from '../../components/SOSModal';

export const PassengerLiveTracking = () => {
  const navigate = useNavigate();
  const { activeTrip, activeBooking } = useApp();

  const [etaMinutes, setEtaMinutes] = useState(4);
  const [driverPos, setDriverPos] = useState({ x: 38, y: 55 });
  const [showSOS, setShowSOS] = useState(false);
  const [rideStep, setRideStep] = useState(1); // 1: Driver arriving, 2: On board, 3: Arrived

  useEffect(() => {
    const interval = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
      setDriverPos((prev) => ({
        x: Math.min(prev.x + 2, 70),
        y: Math.max(prev.y - 2, 35)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#E9EFEC] overflow-hidden relative select-none">
      {/* MAP BACKGROUND CANVAS */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#E4EBE8_0_8px,#EDF2F0_8px_16px)]">
        {/* Map Grid Road Lines */}
        <div className="absolute left-0 right-0 top-60 h-3.5 bg-[#DCE5E1]" />
        <div className="absolute left-0 right-0 top-[420px] h-2.5 bg-[#DCE5E1]" />
        <div className="absolute top-0 bottom-0 left-28 width-3 bg-[#DCE5E1]" />
        <div className="absolute top-0 bottom-0 right-24 width-2.5 bg-[#DCE5E1]" />
        <div className="absolute left-32 top-64 w-32 h-24 rounded-2xl bg-[#DFEDE6]" />

        {/* Dynamic Road SVG Polylines */}
        <svg viewBox="0 0 390 844" className="absolute inset-0 w-full h-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="60,620 140,500 230,360 320,180" stroke="#C3CDC9" strokeWidth="6" strokeDasharray="3 9" />
          <polyline points="140,500 230,360 320,180" stroke="#0F9D76" strokeWidth="8" />
        </svg>

        {/* Pickup Pin */}
        <div className="absolute left-[140px] top-[500px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
          <span className="px-2.5 py-1 rounded-xl bg-white shadow-md text-[10.5px] font-bold text-[#0B7A5C] whitespace-nowrap">
            Điểm đón bạn
          </span>
          <div className="w-5 h-5 rounded-full bg-[#0F9D76] border-2 border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">
            ✓
          </div>
        </div>

        {/* Destination Pin */}
        <div className="absolute left-[320px] top-[180px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
          <span className="px-2.5 py-1 rounded-xl bg-white shadow-md text-[10.5px] font-bold text-[#101B17] whitespace-nowrap">
            Chợ Bến Thành
          </span>
          <span className="w-4.5 h-4.5 rounded-sm bg-[#EE7A22] border-2 border-white shadow-md" />
        </div>

        {/* DRIVER CAR PIN WITH PULSING RADAR */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
          style={{ left: `${driverPos.x}%`, top: `${driverPos.y}%` }}
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <span className="absolute w-12 h-12 rounded-full bg-[#0F9D76]/30 animate-rs-pulse2" />
            <div className="relative w-8 h-8 rounded-full bg-[#0F9D76] border-3 border-white shadow-[0_4px_14px_rgba(15,157,118,0.5)] flex items-center justify-center text-white text-xs">
              🚗
            </div>
          </div>
        </div>
      </div>

      {/* TOP LIVE STATUS CARD */}
      <div className="relative flex-none m-4 bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-[0_8px_26px_rgba(16,27,23,0.12)] border border-[#E4EAE7] flex flex-col gap-3 z-20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center font-bold shrink-0">
            {rideStep === 1 ? '🚗' : rideStep === 2 ? '🛣️' : '🏁'}
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <span className="inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded-full bg-[#F1FAF6] text-[#0B7A5C] text-[10px] font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D76] animate-pulse" />
              {rideStep === 1 ? 'Tài xế đang đến' : rideStep === 2 ? 'Đang di chuyển' : 'Đã đến điểm trả'}
            </span>
            <span className="text-sm font-bold text-[#101B17] truncate mt-0.5">
              {rideStep === 1 ? `${activeTrip.driverName} cách bạn ${etaMinutes} phút` : 'Đang trên đường đến Bến Thành'}
            </span>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-xl font-bold text-[#0B7A5C] font-mono leading-none">
              {rideStep === 1 ? `${etaMinutes}p` : '07:48'}
            </span>
            <span className="text-[10px] text-[#8A9993] mt-0.5">
              {rideStep === 1 ? 'dự kiến đón' : 'dự kiến đến'}
            </span>
          </div>
        </div>


      </div>

      {/* BOTTOM CONTROLS & DRIVER INFO CARD */}
      <div className="relative mt-auto m-4 flex flex-col gap-3 z-20">
        {/* SOS + Recenter buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowSOS(true)}
            className="h-11 px-4 rounded-2xl bg-[#C22B35] hover:bg-[#A8232C] text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <AlertCircle className="w-4 h-4" />
            <span>SOS Khẩn cấp</span>
          </button>

          {/* Simulation Toggle Step button */}
          <button
            type="button"
            onClick={() => {
              if (rideStep === 1) setRideStep(2);
              else if (rideStep === 2) setRideStep(3);
              else navigate('/shared/trip-complete');
            }}
            className="h-11 px-3.5 rounded-2xl bg-white hover:bg-[#F1FAF6] text-[#0B7A5C] border border-[#E4EAE7] text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{rideStep === 1 ? '⚡ Lên xe (Demo)' : rideStep === 2 ? '⚡ Tới nơi (Demo)' : '⚡ Đánh giá ↗'}</span>
          </button>
        </div>

        {/* Driver Card Sheet */}
        <div className="bg-white rounded-[28px] p-4 border border-[#E4EAE7] shadow-[0_12px_32px_rgba(16,27,23,0.15)] flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-base flex items-center justify-center shrink-0 border border-[#B2E2D0]/50">
              {activeTrip.driverInitials || 'QH'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#101B17] truncate">{activeTrip.driverName}</span>
                <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
              </div>
              <span className="text-xs text-[#8A9993]">
                {activeTrip.vehicleModel} · {activeTrip.vehiclePlate}
              </span>
            </div>

            {/* Phone & Chat Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:0901234567"
                className="w-10 h-10 rounded-2xl border border-[#E4EAE7] hover:bg-[#F1FAF6] flex items-center justify-center text-[#0B7A5C] transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => navigate('/shared/chat/trip_001')}
                className="w-10 h-10 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}
    </div>
  );
};
