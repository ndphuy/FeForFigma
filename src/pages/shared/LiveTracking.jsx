import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Phone, MessageSquare, AlertTriangle, Crosshair, Map } from 'lucide-react';

export const LiveTracking = () => {
  const navigate = useNavigate();
  const { activeTrip, confirmPassengerDropoff, completeTrip, notify } = useApp();

  // Phases: 'start' -> 'toPickup' -> 'onboard' -> 'arrived'
  const [phase, setPhase] = useState('toPickup');
  const [minutesToPickup, setMinutesToPickup] = useState(6);
  const [showSosModal, setShowSosModal] = useState(false);

  // Points on map
  const pts = {
    origin: [58, 640],
    car: [128, 520],
    pickup: [212, 398],
    drop: [318, 172]
  };

  const carAt = phase === 'start' ? pts.origin : phase === 'arrived' ? pts.drop : phase === 'onboard' ? [258, 300] : pts.car;

  const j = (a) => a.map(pt => `${pt[0]},${pt[1]}`).join(' ');

  const donePoints = phase === 'start' ? [pts.origin] : phase === 'toPickup' ? [pts.origin, carAt]
    : phase === 'onboard' ? [pts.origin, pts.pickup, carAt] : [pts.origin, pts.pickup, pts.drop];
  const livePoints = phase === 'start' ? [pts.origin, pts.pickup, pts.drop]
    : phase === 'toPickup' ? [carAt, pts.pickup, pts.drop]
    : phase === 'onboard' ? [carAt, pts.drop] : [pts.drop];

  const cfg = {
    start: {
      statusLabel: 'Sẵn sàng', badgeBg: '#EEF2F0', badgeFg: '#5B6B64', badgeDot: '#8A9993',
      headline: 'Bắt đầu chuyến đi', etaBig: '07:00', etaUnit: 'khởi hành',
      metrics: [['Điểm đón đầu', '3,4 km'], ['Khách', '1 người'], ['Tổng chặng', '27,4 km']],
      cta: 'Bắt đầu chuyến',
      railTop: ['FPT University · đón Lan', '07:25', '#101B17', '#0F9D76'],
      pickupLabel: 'Điểm đón Lan', pickupPin: '#0F9D76', pickupLabelColor: '#101B17',
      dropLabel: 'Bến Thành', dropLabelColor: '#8A9993',
      passengerSub: 'Đã xác nhận · đóng góp 35.000 ₫',
      iconBg: '#F4F7F5', iconFg: '#8A9993'
    },
    toPickup: {
      statusLabel: 'Đang tới điểm đón', badgeBg: '#DDF1F4', badgeFg: '#0A6E7A', badgeDot: '#0A6E7A',
      headline: `Đón Lan sau ${minutesToPickup} phút`, etaBig: `07:2${Math.min(9, minutesToPickup)}`, etaUnit: 'giờ đón dự kiến',
      metrics: [['Cách khách', '2,1 km'], ['Giờ đón', '07:25'], ['Trả khách', '08:00']],
      cta: 'Đã đón khách',
      railTop: ['FPT University · Cổng 2', '07:25', '#101B17', '#0F9D76'],
      pickupLabel: `Lan · ${minutesToPickup} phút`, pickupPin: '#0F9D76', pickupLabelColor: '#0B7A5C',
      dropLabel: 'Bến Thành', dropLabelColor: '#8A9993',
      passengerSub: 'Đang chờ tại Cổng 2 · 4.9 ★',
      iconBg: '#DDF1F4', iconFg: '#0A6E7A'
    },
    onboard: {
      statusLabel: 'Khách đã lên xe', badgeBg: '#DDF3EA', badgeFg: '#0B7A5C', badgeDot: '#0F9D76',
      headline: 'Đang tới điểm trả khách', etaBig: '08:00', etaUnit: 'dự kiến tới nơi',
      metrics: [['Còn lại', '11,8 km'], ['Thời gian', '26 phút'], ['Điểm trả', 'Bến Thành']],
      cta: 'Kết thúc chuyến',
      railTop: ['Đã đón lúc 07:25', 'xong', '#8A9993', '#C3CDC9'],
      pickupLabel: 'Đã đón 07:25', pickupPin: '#C3CDC9', pickupLabelColor: '#8A9993',
      dropLabel: 'Điểm trả · 08:00', dropLabelColor: '#101B17',
      passengerSub: 'Trên xe · đóng góp 35.000 ₫ tiền mặt',
      iconBg: '#DDF3EA', iconFg: '#0B7A5C'
    },
    arrived: {
      statusLabel: 'Đã tới nơi', badgeBg: '#DDF3EA', badgeFg: '#0B7A5C', badgeDot: '#0F9D76',
      headline: 'Hoàn thành chuyến với Lan', etaBig: '08:00', etaUnit: 'đã tới nơi',
      metrics: [['Quãng đường', '14 km'], ['Thời gian', '35 phút'], ['Thu tiền mặt', '35.000 ₫']],
      cta: 'Xác nhận hoàn thành',
      railTop: ['Đã đón lúc 07:25', 'xong', '#8A9993', '#C3CDC9'],
      pickupLabel: 'Đã đón 07:25', pickupPin: '#C3CDC9', pickupLabelColor: '#8A9993',
      dropLabel: 'Đã trả khách', dropLabelColor: '#0B7A5C',
      passengerSub: 'Đã xuống xe · đánh giá chuyến đi',
      iconBg: '#DDF3EA', iconFg: '#0B7A5C'
    }
  }[phase];

  const handleAdvance = () => {
    if (phase === 'start') {
      setPhase('toPickup');
      notify?.('Đã bắt đầu hành trình!');
    } else if (phase === 'toPickup') {
      setPhase('onboard');
      notify?.('Hành khách Lan đã lên xe!');
    } else if (phase === 'onboard') {
      setPhase('arrived');
      notify?.('Đã đến điểm trả khách!');
    } else if (phase === 'arrived') {
      if (activeTrip?.id) {
        completeTrip?.(activeTrip.id);
      }
      navigate('/shared/trip-complete');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#E9EFEC] overflow-hidden relative select-none">
      {/* MAP BACKGROUND */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#E4EBE8_0_8px,#EDF2F0_8px_16px)]">
        {/* Road Grid lines */}
        <div className="absolute left-0 right-0 top-[300px] h-3.5 bg-[#DCE5E1]" />
        <div className="absolute left-0 right-0 top-[470px] h-2.5 bg-[#DCE5E1]" />
        <div className="absolute top-0 bottom-0 left-[104px] width-3 bg-[#DCE5E1]" />
        <div className="absolute top-0 bottom-0 left-[286px] width-2 bg-[#DCE5E1]" />
        <div className="absolute left-[150px] top-[344px] w-[118px] h-[92px] rounded-2xl bg-[#DFEDE6]" />

        {/* Polylines */}
        <svg viewBox="0 0 390 844" className="absolute inset-0 w-full h-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points={j(donePoints)} stroke="#C3CDC9" strokeWidth="6" strokeDasharray="2 11" />
          <polyline points={j(livePoints)} stroke="#0F9D76" strokeWidth="8" />
        </svg>

        {/* DRIVER CAR PIN WITH PULSE */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center transition-all duration-700"
          style={{ left: `${carAt[0]}px`, top: `${carAt[1]}px` }}
        >
          <span className="absolute w-11 h-11 rounded-full bg-[#0F9D76]/30 animate-[rs-pulse2_2.2s_ease-out_infinite]" />
          <div className="relative w-8 h-8 rounded-full bg-[#0F9D76] border-4 border-white shadow-[0_4px_12px_rgba(15,157,118,0.45)] flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#FFFFFF">
              <path d="M5 15.5v2a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-1h7v1a1 1 0 0 0 1 1H18a1 1 0 0 0 1-1v-2l-1.4-5a2 2 0 0 0-1.9-1.4H8.3A2 2 0 0 0 6.4 10.5z" />
            </svg>
          </div>
        </div>

        {/* PICKUP PIN */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10"
          style={{ left: '212px', top: '398px' }}
        >
          <span
            className="px-2.5 py-1.5 rounded-xl bg-white shadow-[0_5px_16px_rgba(16,27,23,0.16)] text-[11.5px] font-bold whitespace-nowrap"
            style={{ color: cfg.pickupLabelColor }}
          >
            {cfg.pickupLabel}
          </span>
          <span
            className="w-5.5 h-5.5 rounded-full border-4 border-white shadow-[0_4px_12px_rgba(16,27,23,0.22)]"
            style={{ backgroundColor: cfg.pickupPin }}
          />
        </div>

        {/* DROPOFF PIN */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10"
          style={{ left: '318px', top: '172px' }}
        >
          <span
            className="px-2.5 py-1.5 rounded-xl bg-white shadow-[0_5px_16px_rgba(16,27,23,0.16)] text-[11.5px] font-bold whitespace-nowrap"
            style={{ color: cfg.dropLabelColor }}
          >
            {cfg.dropLabel}
          </span>
          <span className="w-5 h-5 rounded-md bg-[#EE7A22] border-4 border-white shadow-[0_4px_12px_rgba(16,27,23,0.22)]" />
        </div>
      </div>

      {/* TOP STATUS CARD (Answer at a glance) */}
      <div className="relative z-20 m-4 mt-2 bg-white rounded-3xl p-4 shadow-[0_8px_26px_rgba(16,27,23,0.14)] flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: cfg.iconBg }}
          >
            <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke={cfg.iconFg} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20s-6.5-4.6-6.5-9A6.5 6.5 0 0 1 12 5a6.5 6.5 0 0 1 6.5 6c0 4.4-6.5 9-6.5 9z" />
              <circle cx="12" cy="11" r="2.4" />
            </svg>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <span
              className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide"
              style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeFg }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.badgeDot }} />
              {cfg.statusLabel}
            </span>
            <span className="text-[17px] font-bold text-[#101B17] truncate">{cfg.headline}</span>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-[22px] font-bold text-[#0B7A5C] font-mono leading-none">{cfg.etaBig}</span>
            <span className="text-[10.5px] text-[#8A9993]">{cfg.etaUnit}</span>
          </div>
        </div>

        <div className="flex gap-2 border-t border-[#EEF2F0] pt-3">
          {cfg.metrics.map(([label, val], idx) => (
            <div key={idx} className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#8A9993] truncate">{label}</span>
              <span className="text-[14.5px] font-bold text-[#101B17] font-mono truncate">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SOS + RECENTRE / OVERVIEW FLOATING CONTROLS */}
      <div className="relative z-20 mt-auto mx-4 pb-3 flex items-end justify-between gap-2.5">
        <button
          type="button"
          onClick={() => setShowSosModal(true)}
          className="w-15 h-15 rounded-2xl bg-[#C22B35] hover:bg-[#A8232C] text-white font-bold text-xs tracking-wider shadow-[0_8px_22px_rgba(194,43,53,0.36)] cursor-pointer flex items-center justify-center transition-all active:scale-95"
        >
          SOS
        </button>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => notify?.('Đã định vị lại vị trí xe.')}
            className="w-13 h-13 rounded-2xl bg-white hover:bg-[#F1FAF6] shadow-[0_6px_18px_rgba(16,27,23,0.16)] flex items-center justify-center text-[#0B7A5C] transition-all cursor-pointer"
          >
            <Crosshair className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => notify?.('Đang hiển thị toàn bộ lộ trình.')}
            className="w-13 h-13 rounded-2xl bg-white hover:bg-[#F1FAF6] shadow-[0_6px_18px_rgba(16,27,23,0.16)] flex items-center justify-center text-[#0B7A5C] transition-all cursor-pointer"
          >
            <Map className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* BOTTOM PASSENGER & STEP ACTION CARD */}
      <div className="relative z-20 bg-white rounded-t-[32px] p-4 pb-8 shadow-[0_-10px_32px_rgba(16,27,23,0.14)] flex flex-col gap-3.5">
        <div className="w-11 h-1.5 rounded-full bg-[#DFE7E3] self-center" />

        {/* Passenger Info Row */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-base flex items-center justify-center shrink-0 border border-[#BDE7D5]">
            LA
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-[#101B17]">Lan</span>
              <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
            </div>
            <span className="text-xs text-[#8A9993] truncate">{cfg.passengerSub}</span>
          </div>

          <div className="flex gap-2 shrink-0">
            <a
              href="tel:0901234567"
              className="w-12 h-12 rounded-2xl border border-[#E4EAE7] bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-[#0B7A5C] transition-colors"
            >
              <Phone className="w-4.5 h-4.5" />
            </a>
            <button
              type="button"
              onClick={() => navigate('/shared/chat/bk_01')}
              className="w-12 h-12 rounded-2xl bg-[#F1FAF6] hover:bg-[#DDF3EA] flex items-center justify-center text-[#0B7A5C] transition-colors"
            >
              <MessageSquare className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Stop Progress Rail */}
        <div className="flex gap-3 bg-[#F7FAF9] rounded-2xl p-3">
          <div className="flex flex-col items-center pt-1.5 gap-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.railTop[3] }} />
            <span className="w-0.5 flex-1 min-h-[16px] bg-[#DFE7E3]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2.5 text-xs">
            <div className="flex justify-between gap-2">
              <span className="font-bold truncate" style={{ color: cfg.railTop[2] }}>
                {cfg.railTop[0]}
              </span>
              <span className="font-bold shrink-0 font-mono" style={{ color: cfg.railTop[2] }}>
                {cfg.railTop[1]}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-bold text-[#101B17] truncate">Chợ Bến Thành, Q.1</span>
              <span className="font-bold text-[#101B17] shrink-0 font-mono">08:00</span>
            </div>
          </div>
        </div>

        {/* ONE CTA AT A TIME */}
        <button
          type="button"
          onClick={handleAdvance}
          className="h-[60px] rounded-[20px] bg-[#0F9D76] hover:bg-[#0B8A66] text-white font-bold text-[16.5px] cursor-pointer shadow-[0_8px_20px_rgba(15,157,118,0.30)] active:scale-[0.99] transition-all flex items-center justify-center"
        >
          {cfg.cta}
        </button>
      </div>

      {/* SOS Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-[#101B17]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-pop">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Trợ giúp khẩn cấp (SOS)</h3>
              <p className="text-xs text-slate-500">
                Toạ độ GPS và lộ trình hiện tại sẽ được gửi ngay đến trung tâm hỗ trợ 24/7 và người thân.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <a
                href="tel:113"
                className="w-full py-3.5 bg-red-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-red-200"
              >
                <span>Gọi Cảnh sát 113</span>
              </a>
              <button
                type="button"
                onClick={() => setShowSosModal(false)}
                className="w-full py-3 bg-slate-100 text-slate-700 rounded-2xl text-xs font-semibold"
              >
                Huỷ bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
