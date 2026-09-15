import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Phone, MessageSquare, AlertCircle, Home, Navigation, Crosshair, Flag } from 'lucide-react';
import { SOSModal } from '../../components/SOSModal';
import { ReportModal } from '../../components/ReportModal';
import { AppMap } from '../../components/AppMap';

export const PassengerLiveTracking = () => {
  const navigate = useNavigate();
  const { activeTrip, activeBooking } = useApp();

  const [etaMinutes, setEtaMinutes] = useState(4);
  const [showSOS, setShowSOS] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [rideStep, setRideStep] = useState(1); // 1: Driver arriving, 2: On board, 3: Arrived

  const rideProgress = rideStep === 1 ? 0.25 : rideStep === 2 ? 0.70 : 1.0;

  useEffect(() => {
    const interval = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const livePoints = [
    { label: 'Điểm đón bạn (FPT)', type: 'origin', isPrimary: true },
    { label: 'Chợ Bến Thành, Q.1', type: 'destination', isPrimary: true }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#E9EFEC] overflow-hidden relative select-none">
      {/* UNIFIED MASTER MAP BACKGROUND CANVAS */}
      <AppMap
        mode="live"
        points={livePoints}
        progress={rideProgress}
        className="absolute inset-0 z-0"
        showControls={false}
      />

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
              <button
                type="button"
                onClick={() => setShowReport(true)}
                title="Báo cáo sự cố"
                className="w-10 h-10 rounded-2xl border border-[#E4EAE7] hover:bg-[#FFF4E9] flex items-center justify-center text-[#8A4A0B] transition-colors cursor-pointer"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Modal */}
      {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}

      {/* Report Modal */}
      <ReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        reportedName={activeTrip.driverName}
        tripCode={activeTrip.id}
      />
    </div>
  );
};
