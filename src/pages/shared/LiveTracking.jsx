import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Phone, MessageSquare, AlertTriangle, Crosshair, Map, Flag, Check } from 'lucide-react';
import { ReportModal } from '../../components/ReportModal';
import { LiveRouteMap } from '../../components/LiveRouteMap';

// Stop names carry a "(Điểm X)" suffix in trip.stops but bookings store the bare
// name — normalize both sides before matching a passenger's pickup/dropoff to a stop.
const normalizeStopName = (s) => (s || '').replace(/\s*\(Điểm\s*\w+\)\s*$/i, '').trim();

export const LiveTracking = () => {
  const navigate = useNavigate();
  const { activeTrip, confirmPassengerPickup, confirmPassengerDropoff, completeTrip, notify } = useApp();
  const passengers = activeTrip?.passengers || [];

  const [showSosModal, setShowSosModal] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Real trip phase, derived from each passenger's own status — not a fake global timeline.
  // Grab-style: the trip can only finish once every passenger has actually been dropped off.
  const totalCount = passengers.length;
  const waitingCount = passengers.filter((p) => p.status === 'waiting_pickup').length;
  const onBoardCount = passengers.filter((p) => p.status === 'on_board').length;
  const droppedCount = passengers.filter((p) => p.status === 'dropped_off').length;
  const allDone = totalCount > 0 && droppedCount === totalCount;
  const phase = totalCount === 0 ? 'start' : waitingCount > 0 ? 'toPickup' : onBoardCount > 0 ? 'onboard' : 'arrived';

  // Map: plot the trip's real stops and mark which ones are an actual pickup/dropoff.
  const routeStops = activeTrip?.stops?.length >= 2
    ? activeTrip.stops
    : [
        { id: 'o', name: activeTrip?.origin },
        { id: 'd', name: activeTrip?.destination },
      ];

  const mapPoints = routeStops.map((stop, idx) => {
    const stopName = normalizeStopName(stop.name);
    const isOrigin = idx === 0;
    const isDestination = idx === routeStops.length - 1;
    const pickupsHere = passengers.filter((p) => normalizeStopName(p.pickupPoint) === stopName);
    const dropoffsHere = passengers.filter((p) => normalizeStopName(p.dropoffPoint) === stopName);
    const isPickupStop = isOrigin || pickupsHere.length > 0;
    const isDropoffStop = !isPickupStop && (isDestination || dropoffsHere.length > 0);
    const done = isPickupStop
      ? isOrigin ? waitingCount === 0 : pickupsHere.every((p) => p.status !== 'waiting_pickup')
      : isDestination ? allDone : dropoffsHere.every((p) => p.status === 'dropped_off');

    return {
      label: stopName,
      type: isPickupStop ? 'pickup' : isDropoffStop ? 'dropoff' : 'waypoint',
      done,
    };
  });

  // Progress = fraction of pickup/dropoff checkpoints already completed (2 per passenger).
  const totalCheckpoints = totalCount * 2;
  const completedCheckpoints = passengers.reduce(
    (sum, p) => sum + (p.status !== 'waiting_pickup' ? 1 : 0) + (p.status === 'dropped_off' ? 1 : 0),
    0
  );
  const mapProgress = totalCheckpoints > 0 ? completedCheckpoints / totalCheckpoints : phase === 'arrived' ? 1 : 0;

  const cfg = {
    start: {
      statusLabel: 'Sẵn sàng', badgeBg: '#EEF2F0', badgeFg: '#5B6B64', badgeDot: '#8A9993',
      headline: 'Chưa có khách trên chuyến', etaBig: '07:00', etaUnit: 'khởi hành',
      metrics: [['Điểm đón đầu', '3,4 km'], ['Khách', `${totalCount} người`], ['Tổng chặng', '27,4 km']],
      railTop: ['FPT University · đón khách', '07:25', '#101B17', '#0F9D76'],
      iconBg: '#F4F7F5', iconFg: '#8A9993'
    },
    toPickup: {
      statusLabel: 'Đang tới điểm đón', badgeBg: '#DDF1F4', badgeFg: '#0A6E7A', badgeDot: '#0A6E7A',
      headline: `Còn ${waitingCount} khách chờ đón`, etaBig: '07:25', etaUnit: 'giờ đón dự kiến',
      metrics: [['Còn phải đón', `${waitingCount} người`], ['Đã đón', `${onBoardCount + droppedCount} người`], ['Trả khách', '08:00']],
      railTop: ['FPT University · Cổng 2', '07:25', '#101B17', '#0F9D76'],
      iconBg: '#DDF1F4', iconFg: '#0A6E7A'
    },
    onboard: {
      statusLabel: 'Khách đã lên xe', badgeBg: '#DDF3EA', badgeFg: '#0B7A5C', badgeDot: '#0F9D76',
      headline: `Đang chở ${onBoardCount} khách tới điểm trả`, etaBig: '08:00', etaUnit: 'dự kiến tới nơi',
      metrics: [['Trên xe', `${onBoardCount} người`], ['Đã trả', `${droppedCount} người`], ['Điểm trả', 'Bến Thành']],
      railTop: ['Đã đón xong', 'xong', '#8A9993', '#C3CDC9'],
      iconBg: '#DDF3EA', iconFg: '#0B7A5C'
    },
    arrived: {
      statusLabel: 'Đã tới nơi', badgeBg: '#DDF3EA', badgeFg: '#0B7A5C', badgeDot: '#0F9D76',
      headline: 'Đã đón trả xong tất cả khách', etaBig: '08:00', etaUnit: 'đã tới nơi',
      metrics: [['Quãng đường', '14 km'], ['Thời gian', '35 phút'], ['Thu tiền mặt', '35.000 ₫']],
      railTop: ['Đã đón xong', 'xong', '#8A9993', '#C3CDC9'],
      iconBg: '#DDF3EA', iconFg: '#0B7A5C'
    }
  }[phase];

  const handleCompleteTrip = () => {
    if (!allDone) return;
    if (activeTrip?.id) {
      completeTrip(activeTrip.id);
    }
    notify?.('Đã hoàn tất chuyến đi!');
    navigate('/shared/trip-complete');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#E9EFEC] overflow-hidden relative select-none">
      {/* MAP — real stops from this trip, driver marker animates by actual pickup/dropoff progress */}
      <LiveRouteMap points={mapPoints} progress={mapProgress} />

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

        {/* Passenger List — real pickup/dropoff per passenger, each with its own action */}
        <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto rs-scroll">
          {passengers.length === 0 ? (
            <div className="text-center text-xs text-[#8A9993] py-2">Chưa có hành khách nào trên chuyến này.</div>
          ) : (
            passengers.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-[#F7FAF9] rounded-2xl p-3">
                <div className="w-11 h-11 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-sm flex items-center justify-center shrink-0 border border-[#BDE7D5]">
                  {p.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#101B17] truncate">{p.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0F9D76] shrink-0" />
                  </div>
                  <span className="text-[11px] text-[#8A9993] truncate block">
                    {p.pickupPoint} → {p.dropoffPoint}
                  </span>
                </div>

                {p.status === 'on_board' ? (
                  <button
                    type="button"
                    onClick={() => confirmPassengerDropoff(activeTrip.id, p.id)}
                    className="h-10 px-3 rounded-xl bg-[#EE7A22] hover:bg-[#D96A16] text-white text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Đã trả khách
                  </button>
                ) : p.status === 'dropped_off' ? (
                  <span className="h-10 px-3 rounded-xl bg-[#DDF3EA] text-[#0B7A5C] text-[11px] font-bold shrink-0 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Đã xong
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => confirmPassengerPickup(activeTrip.id, p.id)}
                    className="h-10 px-3 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Đã đón
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Shared contact actions */}
        <div className="flex gap-2 shrink-0">
          <a
            href="tel:0901234567"
            className="flex-1 h-11 rounded-2xl border border-[#E4EAE7] bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-[#0B7A5C] transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => navigate('/shared/chat/bk_01')}
            className="flex-1 h-11 rounded-2xl bg-[#F1FAF6] hover:bg-[#DDF3EA] flex items-center justify-center text-[#0B7A5C] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowReport(true)}
            title="Báo cáo sự cố"
            className="flex-1 h-11 rounded-2xl border border-[#E4EAE7] hover:bg-[#FFF4E9] flex items-center justify-center text-[#8A4A0B] transition-colors"
          >
            <Flag className="w-4 h-4" />
          </button>
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

        {/* Trip only finishes once every passenger has actually been dropped off */}
        <button
          type="button"
          onClick={handleCompleteTrip}
          disabled={!allDone}
          className={`h-[60px] rounded-[20px] font-bold text-[16.5px] shadow-[0_8px_20px_rgba(15,157,118,0.30)] active:scale-[0.99] transition-all flex items-center justify-center ${
            allDone
              ? 'bg-[#0F9D76] hover:bg-[#0B8A66] text-white cursor-pointer'
              : 'bg-[#EEF2F0] text-[#8A9993] cursor-not-allowed shadow-none'
          }`}
        >
          {allDone
            ? 'Hoàn tất chuyến đi'
            : waitingCount > 0
              ? `Còn ${waitingCount} khách chưa đón`
              : `Đang chở ${onBoardCount} khách tới điểm trả`}
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

      {/* Report Modal */}
      <ReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        reportedName={passengers.length === 1 ? passengers[0].name : `${passengers.length} hành khách trên chuyến`}
        tripCode={activeTrip?.id}
      />
    </div>
  );
};
