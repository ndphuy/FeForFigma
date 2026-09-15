import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  Flag, 
  Check, 
  Navigation, 
  UserX, 
  Star, 
  X, 
  Coins, 
  Radio 
} from 'lucide-react';
import { ReportModal } from '../../components/ReportModal';
import { LiveRouteMap } from '../../components/LiveRouteMap';

const normalizeStopName = (s) => (s || '').replace(/\s*\(Điểm\s*\w+\)\s*$/i, '').trim();

export const LiveTracking = () => {
  const navigate = useNavigate();
  const { 
    activeTrip, 
    confirmPassengerPickup, 
    confirmPassengerDropoff, 
    completeTrip, 
    recalculateAndRefundTrip,
    submitNoShowReport,
    isGPSTrackingEnabled,
    setIsGPSTrackingEnabled,
    lastRefundNotification,
    setLastRefundNotification
  } = useApp();

  // Initial Seed Passengers if empty
  const passengers = activeTrip?.passengers?.length > 0 ? activeTrip.passengers : [
    {
      id: 'pas_01',
      name: 'Minh Anh',
      initials: 'MA',
      phone: '0908 123 456',
      pickupPoint: 'FPT University · Cổng 2',
      dropoffPoint: 'Chợ Bến Thành, Q.1',
      fareVnd: 45000,
      status: 'waiting_pickup'
    },
    {
      id: 'pas_02',
      name: 'Lê Tuấn',
      initials: 'LT',
      phone: '0912 345 678',
      pickupPoint: 'Ngã tư Thủ Đức',
      dropoffPoint: 'Chợ Bến Thành, Q.1',
      fareVnd: 35000,
      status: 'waiting_pickup'
    }
  ];

  const [showSosModal, setShowSosModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundModalData, setRefundModalData] = useState(null);
  const [showRateModal, setShowRateModal] = useState(false);
  const [ratingTarget, setRatingTarget] = useState(null);
  const [rateStars, setRateStars] = useState(5);
  const [showNoShowModal, setShowNoShowModal] = useState(false);
  const [noShowTarget, setNoShowTarget] = useState(null);
  const [noShowReason, setNoShowReason] = useState('Khách không có mặt sau 10 phút');

  // Counts & Phase
  const totalCount = passengers.length;
  const waitingCount = passengers.filter((p) => p.status === 'waiting_pickup').length;
  const onBoardCount = passengers.filter((p) => p.status === 'on_board').length;
  const droppedCount = passengers.filter((p) => p.status === 'dropped_off').length;
  const allDone = totalCount > 0 && droppedCount === totalCount;
  const phase = totalCount === 0 ? 'start' : waitingCount > 0 ? 'toPickup' : onBoardCount > 0 ? 'onboard' : 'arrived';

  // Map route stops
  const routeStops = activeTrip?.stops?.length >= 2
    ? activeTrip.stops
    : [
        { id: 'o', name: activeTrip?.origin || 'FPT University' },
        { id: 's1', name: 'Ngã tư Thủ Đức' },
        { id: 'd', name: activeTrip?.destination || 'Chợ Bến Thành, Q.1' },
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
      metrics: [['Điểm đón đầu', '3,4 km'], ['Khách', `${totalCount} người`], ['Tổng chặng', '18,5 km']],
      railTop: ['FPT University · đón khách', '07:15', '#101B17', '#0F9D76'],
      iconBg: '#F4F7F5', iconFg: '#8A9993'
    },
    toPickup: {
      statusLabel: 'Đang tới điểm đón', badgeBg: '#DDF1F4', badgeFg: '#0A6E7A', badgeDot: '#0A6E7A',
      headline: `Còn ${waitingCount} khách chờ đón`, etaBig: '07:15', etaUnit: 'giờ đón dự kiến',
      metrics: [['Còn đón', `${waitingCount} người`], ['Đã đón', `${onBoardCount + droppedCount} người`], ['Trả khách', '08:00']],
      railTop: ['FPT University · Cổng 2', '07:15', '#101B17', '#0F9D76'],
      iconBg: '#DDF1F4', iconFg: '#0A6E7A'
    },
    onboard: {
      statusLabel: 'Đang di chuyển cùng khách', badgeBg: '#DDF3EA', badgeFg: '#0B7A5C', badgeDot: '#0F9D76',
      headline: `Đang chở ${onBoardCount} khách tới điểm trả`, etaBig: '07:55', etaUnit: 'dự kiến tới nơi',
      metrics: [['Trên xe', `${onBoardCount} người`], ['Đã trả', `${droppedCount} người`], ['Điểm trả', 'Bến Thành']],
      railTop: ['Đã đón xong', 'xong', '#8A9993', '#C3CDC9'],
      iconBg: '#DDF3EA', iconFg: '#0B7A5C'
    },
    arrived: {
      statusLabel: 'Đã tới nơi', badgeBg: '#DDF3EA', badgeFg: '#0B7A5C', badgeDot: '#0F9D76',
      headline: 'Đã hoàn thành toàn bộ lộ trình', etaBig: '08:00', etaUnit: 'đã tới nơi',
      metrics: [['Quãng đường', '18,5 km'], ['Thời gian', '45 phút'], ['Thu tiền', '65.000 ₫']],
      railTop: ['Đã đón xong', 'xong', '#8A9993', '#C3CDC9'],
      iconBg: '#DDF3EA', iconFg: '#0B7A5C'
    }
  }[phase];

  const handlePickup = (passenger) => {
    confirmPassengerPickup(activeTrip?.id || 'trip_001', passenger.id);
    
    // If picking up passenger 2 (Lê Tuấn), trigger Dynamic Refund for passenger 1 (Minh Anh)
    if (passenger.id === 'pas_02' || passenger.name.includes('Tuấn')) {
      const refundVal = recalculateAndRefundTrip(activeTrip?.id || 'trip_001', passenger.name, 15000);
      setRefundModalData({
        newPassenger: passenger.name,
        refundAmount: refundVal,
        beneficiary: 'Minh Anh'
      });
      setShowRefundModal(true);
    }
  };

  const handleDropoff = (passenger) => {
    confirmPassengerDropoff(activeTrip?.id || 'trip_001', passenger.id);
    setRatingTarget(passenger);
    setShowRateModal(true);
  };

  const handleNoShow = (passenger) => {
    setNoShowTarget(passenger);
    setShowNoShowModal(true);
  };

  const confirmSubmitNoShow = () => {
    if (noShowTarget) {
      submitNoShowReport({
        tripId: activeTrip?.id || 'trip_001',
        role: 'passenger',
        reason: `${noShowTarget.name}: ${noShowReason}`,
        evidenceNote: 'Tài xế đã đợi tại điểm đón đúng giờ và có định vị GPS'
      });
      setShowNoShowModal(false);
      alert(`Đã ghi nhận báo cáo vắng mặt cho ${noShowTarget.name}. Hồ sơ được chuyển đến Admin xử lý hoàn tiền & điểm uy tín.`);
    }
  };

  const handleCompleteTrip = () => {
    if (!allDone) return;
    if (activeTrip?.id) {
      completeTrip(activeTrip.id);
    }
    navigate('/shared/trip-complete');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F4F7F5] overflow-hidden relative">
      {/* Live Route Vector Map */}
      <LiveRouteMap points={mapPoints} progress={mapProgress} />

      {/* Top Floating Control Bar */}
      <div className="relative z-20 p-4 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={() => navigate('/driver/home')}
          className="w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md border border-[#E4EAE7] shadow-md flex items-center justify-center text-lg text-[#101B17] shrink-0 pointer-events-auto cursor-pointer hover:bg-white transition-colors"
        >
          ‹
        </button>

        {/* GPS Live Status Pill */}
        <div 
          onClick={() => setIsGPSTrackingEnabled(!isGPSTrackingEnabled)}
          className={`px-3 py-1.5 rounded-full border shadow-md flex items-center gap-1.5 pointer-events-auto cursor-pointer transition-all ${
            isGPSTrackingEnabled 
              ? 'bg-white/95 border-[#BDE7D5] text-[#0B7A5C]' 
              : 'bg-white/95 border-[#E4EAE7] text-[#8A9993]'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 shrink-0 ${isGPSTrackingEnabled ? 'text-[#0F9D76] animate-pulse' : 'text-[#8A9993]'}`} />
          <span className="text-[11px] font-bold whitespace-nowrap">
            {isGPSTrackingEnabled ? 'GPS Live: Bật' : 'GPS: Tắt'}
          </span>
        </div>

        {/* SOS Emergency Button */}
        <button
          type="button"
          onClick={() => setShowSosModal(true)}
          className="px-3 h-10 rounded-xl bg-[#C22B35] hover:bg-[#A8222B] text-white font-bold text-xs shadow-[0_4px_12px_rgba(194,43,53,0.3)] flex items-center gap-1 pointer-events-auto cursor-pointer active:scale-95 transition-all shrink-0"
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>SOS</span>
        </button>
      </div>

      {/* In-Trip Status Bottom Sheet */}
      <div className="relative z-20 bg-white rounded-t-[28px] p-4 pb-5 border-t border-[#E4EAE7] shadow-[0_-8px_30px_rgba(16,27,23,0.12)] flex flex-col gap-3 max-h-[75%] overflow-y-auto rs-scroll">
        {/* Status Phase Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
              style={{ backgroundColor: cfg.badgeDot }}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B7A5C] truncate">
              {cfg.statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#8A9993] shrink-0 font-medium">
            <Navigation className="w-3.5 h-3.5 text-[#0F9D76] shrink-0" />
            <span className="font-mono font-bold text-[#101B17] whitespace-nowrap">18,5 km</span>
          </div>
        </div>

        {/* Dynamic Refund Notice Pill if triggered */}
        {lastRefundNotification && (
          <div className="p-2.5 bg-[#F1FAF6] border border-[#BDE7D5] rounded-xl flex items-center justify-between gap-2 animate-[rs-pop_0.3s_ease-out]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">🎉</span>
              <span className="text-xs text-[#0B7A5C] font-semibold leading-tight line-clamp-2">
                {lastRefundNotification.message}
              </span>
            </div>
          </div>
        )}

        {/* Passenger Boarding Cards */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A9993] truncate">
              Hành khách ({passengers.length} người)
            </span>
            <span className="text-[10.5px] text-[#0B7A5C] font-semibold bg-[#F1FAF6] px-2 py-0.5 rounded-full border border-[#BDE7D5]/70 shrink-0">
              Chia sẻ chi phí
            </span>
          </div>

          {passengers.map((p, idx) => (
            <div
              key={p.id}
              className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                p.status === 'on_board'
                  ? 'bg-[#F1FAF6] border-[#BDE7D5]'
                  : p.status === 'dropped_off'
                    ? 'bg-[#F7FAF9] border-[#E4EAE7] opacity-75'
                    : 'bg-white border-[#E4EAE7]'
              }`}
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xs flex items-center justify-center shrink-0 border border-[#B2E2D0]">
                  {p.initials || `K${idx + 1}`}
                </div>
                <div className="flex flex-col min-w-0 flex-1 justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#101B17] truncate">{p.name}</span>
                  </div>
                  <span className="text-[11px] text-[#4B5A54] truncate" title={`${p.pickupPoint} → ${p.dropoffPoint}`}>
                    {p.pickupPoint} → {p.dropoffPoint}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#0F9D76]">
                    {new Intl.NumberFormat('vi-VN').format(p.fareVnd)} ₫
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {p.status === 'waiting_pickup' && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleNoShow(p)}
                      title="Báo vắng mặt (No-show)"
                      className="w-8 h-8 rounded-xl bg-[#FFF0F0] hover:bg-red-100 text-[#C22B35] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePickup(p)}
                      className="h-8 px-2.5 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Đón khách
                    </button>
                  </>
                )}

                {p.status === 'on_board' && (
                  <button
                    type="button"
                    onClick={() => handleDropoff(p)}
                    className="h-8 px-2.5 rounded-xl bg-[#EE7A22] hover:bg-[#D96A16] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Trả khách
                  </button>
                )}

                {p.status === 'dropped_off' && (
                  <span className="h-8 px-2 rounded-xl bg-[#DDF3EA] text-[#0B7A5C] text-[11px] font-bold flex items-center gap-1 whitespace-nowrap shrink-0">
                    <Check className="w-3.5 h-3.5" />
                    Đã trả
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Contact Bar */}
        <div className="flex gap-2 shrink-0">
          <a
            href="tel:0901234567"
            className="flex-1 h-10 rounded-xl border border-[#E4EAE7] bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-[#0B7A5C] transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={() => navigate('/shared/chat/bk_01')}
            className="flex-1 h-10 rounded-xl bg-[#F1FAF6] hover:bg-[#DDF3EA] flex items-center justify-center text-[#0B7A5C] transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowReport(true)}
            title="Báo cáo sự cố an toàn"
            className="flex-1 h-10 rounded-xl border border-[#E4EAE7] hover:bg-[#FFF4E9] flex items-center justify-center text-[#EE7A22] transition-colors cursor-pointer"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>

        {/* Complete Trip Action Button */}
        <button
          type="button"
          onClick={handleCompleteTrip}
          disabled={!allDone}
          className={`w-full h-12 rounded-xl font-bold text-sm shadow-[0_6px_18px_rgba(15,157,118,0.25)] transition-all flex items-center justify-center cursor-pointer shrink-0 ${
            allDone
              ? 'bg-[#0F9D76] hover:bg-[#0B8A66] text-white active:scale-[0.99]'
              : 'bg-[#EEF2F0] text-[#8A9993] cursor-not-allowed shadow-none'
          }`}
        >
          {allDone
            ? 'Hoàn tất chuyến đi & Xem báo cáo'
            : waitingCount > 0
              ? `Còn ${waitingCount} khách chưa đón`
              : `Đang chở ${onBoardCount} khách tới điểm trả`}
        </button>
      </div>

      {/* CELEBRATION MODAL: DYNAMIC REFUND ON ADDITIONAL PASSENGER */}
      {showRefundModal && refundModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[350px] bg-white rounded-3xl p-6 text-center border border-[#BDE7D5] shadow-2xl flex flex-col gap-3.5 relative overflow-hidden animate-[rs-pop_0.3s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center mx-auto text-2xl border border-[#B2E2D0] shadow-sm">
              <Coins className="w-8 h-8 text-[#0F9D76]" />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-base font-bold text-[#101B17]">
                Hoàn tiền Chia sẻ Chi phí!
              </span>
              <p className="text-xs text-[#4B5A54] leading-relaxed">
                Đón thêm bạn <strong>{refundModalData.newPassenger}</strong> đi chung lộ trình. Hệ thống tự động tính lại tỷ lệ chia sẻ tiền xăng và hoàn tiền thừa về ví:
              </p>
            </div>

            <div className="p-3 bg-[#F1FAF6] rounded-2xl border border-[#BDE7D5] flex items-center justify-center gap-2">
              <span className="text-xs text-[#4B5A54]">Hoàn lại ví {refundModalData.beneficiary}:</span>
              <span className="text-lg font-bold font-mono text-[#0F9D76]">
                +{new Intl.NumberFormat('vi-VN').format(refundModalData.refundAmount)} ₫
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowRefundModal(false)}
              className="w-full h-12 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs mt-1"
            >
              Tuyệt vời, tiếp tục hành trình
            </button>
          </div>
        </div>
      )}

      {/* QUICK RATING MODAL PER PASSENGER DROPOFF */}
      {showRateModal && ratingTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-5 border border-[#E4EAE7] shadow-2xl flex flex-col gap-3.5 animate-[rs-pop_0.25s_ease-out] text-center">
            <div className="flex items-center justify-between pb-1 border-b border-[#EEF2F0]">
              <span className="text-xs font-bold text-[#101B17]">Đã trả {ratingTarget.name}</span>
              <button
                type="button"
                onClick={() => setShowRateModal(false)}
                className="w-6 h-6 rounded-full bg-[#F4F7F5] flex items-center justify-center text-xs text-[#8A9993] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#4B5A54]">
              Đánh giá mức độ hài lòng về hành khách {ratingTarget.name}:
            </p>

            {/* Stars Selector */}
            <div className="flex justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRateStars(s)}
                  className="p-1 cursor-pointer transition-transform active:scale-125"
                >
                  <Star
                    className={`w-7 h-7 ${
                      s <= rateStars ? 'fill-[#EE7A22] text-[#EE7A22]' : 'text-[#DFE7E3]'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowRateModal(false);
              }}
              className="w-full h-11 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      )}

      {/* NO-SHOW MODAL */}
      {showNoShowModal && noShowTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[340px] bg-white rounded-3xl p-5 border border-red-200 shadow-2xl flex flex-col gap-3 animate-[rs-pop_0.25s_ease-out]">
            <div className="flex items-center justify-between pb-1 border-b border-[#EEF2F0]">
              <span className="text-xs font-bold text-[#C22B35] flex items-center gap-1">
                <UserX className="w-4 h-4" />
                Báo vắng mặt (No-show)
              </span>
              <button
                type="button"
                onClick={() => setShowNoShowModal(false)}
                className="w-6 h-6 rounded-full bg-[#F4F7F5] flex items-center justify-center text-xs text-[#8A9993] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#4B5A54] leading-relaxed">
              Xác nhận hành khách <strong>{noShowTarget.name}</strong> không có mặt tại điểm hẹn? Hệ thống sẽ trừ điểm uy tín và gửi minh chứng đến Admin.
            </p>

            <select
              value={noShowReason}
              onChange={(e) => setNoShowReason(e.target.value)}
              className="w-full p-2.5 text-xs bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl outline-none"
            >
              <option value="Khách không có mặt sau 10 phút">Khách không có mặt sau 10 phút</option>
              <option value="Không liên lạc được qua số điện thoại">Không liên lạc được qua số điện thoại</option>
              <option value="Khách báo huỷ đột xuất">Khách báo huỷ đột xuất tại chỗ</option>
            </select>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNoShowModal(false)}
                className="flex-1 h-10 rounded-xl bg-[#F4F7F5] text-[#4B5A54] font-bold text-xs cursor-pointer"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                onClick={confirmSubmitNoShow}
                className="flex-1 h-10 rounded-xl bg-[#C22B35] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Xác nhận báo cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS MODAL */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-[#101B17]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-pop border border-red-200">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Trợ giúp khẩn cấp (SOS)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Toạ độ GPS và lộ trình hiện tại sẽ được gửi ngay đến 2 số điện thoại người thân và tổng đài khẩn cấp 113.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <a
                href="tel:113"
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-red-200 cursor-pointer"
              >
                <span>📞 Gọi Cảnh sát 113</span>
              </a>
              <button
                type="button"
                onClick={() => setShowSosModal(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold cursor-pointer"
              >
                Huỷ bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Report Modal */}
      <ReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        reportedName={passengers.length === 1 ? passengers[0].name : `${passengers.length} hành khách trên chuyến`}
        tripCode={activeTrip?.id}
      />
    </div>
  );
};
