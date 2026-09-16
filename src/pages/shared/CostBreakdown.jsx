import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const formatVnd = (n) => `${new Intl.NumberFormat('vi-VN').format(n || 0)} ₫`;

export const CostBreakdown = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { trips, activeTrip } = useApp();

  const trip = trips.find((t) => t.id === id) || activeTrip || trips[0];

  const cs = trip?.costSharing || {};
  const ratePerKm = trip?.ratePerKm || cs.costPerKm || 5000;
  const totalKm = cs.totalKm || trip?.distanceKm || 0;
  const passengerKm = cs.passengerKm || 0;
  const totalCostVnd = cs.totalCostVnd || (cs.fuelVnd || 0) + (cs.tollVnd || 0) + (cs.wearAndTearVnd || 0);

  const segments = trip?.segments && trip.segments.length > 0
    ? trip.segments
    : [{ km: totalKm || 1, kmLabel: `${totalKm} km`, barBg: '#0F9D76', barFg: '#FFFFFF', endLabel: 'B', isUserLeg: true }];

  const costParts = [
    { label: 'Xăng xe (tiêu thụ thực tế)', value: cs.fuelVnd || 0, color: '#0F9D76' },
    { label: 'Phí cầu đường / BOT', value: cs.tollVnd || 0, color: '#EE7A22' },
    { label: 'Hao mòn lốp, nhớt & bảo dưỡng', value: cs.wearAndTearVnd || 0, color: '#6366F1' },
  ].filter((p) => p.value > 0);

  const bookedPassengers = (trip?.passengers || []).filter((p) => p.fareVnd);
  const totalCollectedVnd = bookedPassengers.reduce((sum, p) => sum + (p.fareVnd || 0), 0);

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
          <span className="text-[17px] font-bold text-[#101B17]">Minh bạch chi phí chia sẻ</span>
          <span className="text-xs text-[#8A9993] truncate">
            {trip ? `${trip.origin} → ${trip.destination}` : 'Chuyến đi'} · {totalKm} km
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto rs-scroll p-4 pb-24 flex flex-col gap-3.5">
        {/* 1. Route Segment Visualizer */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#101B17]">Chặng có khách trên xe</span>
            <span className="text-xs font-mono font-bold text-[#0B7A5C]">{passengerKm} km</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1 h-9 rounded-xl overflow-hidden">
              {segments.map((s, idx) => (
                <span
                  key={idx}
                  style={{ flex: s.km, background: s.barBg, color: s.barFg }}
                  className="flex items-center justify-center text-[11px] font-bold"
                >
                  {s.kmLabel}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1 text-[11px]">
              <span className="inline-flex items-center gap-1.5 font-bold text-[#0B7A5C]">
                <span className="w-3.5 h-1.5 rounded-full bg-[#0F9D76]" /> Chặng có khách ({passengerKm} km)
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#8A9993]">
                <span className="w-3.5 h-1.5 rounded-full bg-[#DFE7E3]" /> Đoạn xe đi riêng
              </span>
            </div>
          </div>
        </div>

        {/* 2. Rate Configuration & Transparent Formula */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <span className="text-sm font-bold text-[#101B17]">Định mức chia sẻ chi phí</span>

          <div className="bg-[#F7FAF9] rounded-2xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#4B5A54]">Đơn giá cấu hình chuyến đi:</span>
              <span className="font-bold text-[#0B7A5C] font-mono">{formatVnd(ratePerKm)} / km</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#4B5A54]">Tổng quãng đường chuyến:</span>
              <span className="font-bold text-[#101B17] font-mono">{totalKm} km</span>
            </div>
            {costParts.length > 0 && (
              <>
                <div className="h-[1px] bg-[#EEF2F0] my-0.5" />
                {costParts.map((p) => (
                  <div key={p.label} className="flex items-center justify-between text-xs">
                    <span className="text-[#4B5A54]">{p.label}:</span>
                    <span className="font-bold text-[#101B17] font-mono">{formatVnd(p.value)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#EEF2F0]">
                  <span className="text-[#101B17] font-bold">Tổng chi phí chuyến:</span>
                  <span className="font-mono font-bold text-[#0F9D76]">{formatVnd(totalCostVnd)}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-start gap-2 bg-[#F1FAF6] rounded-2xl p-3 border border-[#BDE7D5]/60">
            <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0 mt-0.5" />
            <span className="text-[11px] text-[#0B7A5C] leading-relaxed">
              <strong>Công bằng & minh bạch:</strong> Mỗi khách chỉ trả đúng số km thực tế họ ngồi trên xe, không phải trả cho toàn bộ tuyến của tài xế.
            </span>
          </div>
        </div>

        {/* 3. Per-passenger Fare Breakdown */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <span className="text-sm font-bold text-[#101B17]">Khách đã đặt & chia sẻ chi phí</span>

          {bookedPassengers.length === 0 ? (
            <p className="text-xs text-[#8A9993]">Chưa có khách nào được duyệt trên chuyến này.</p>
          ) : (
            bookedPassengers.map((p) => (
              <div key={p.id} className="bg-[#F7FAF9] rounded-2xl p-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0B7A5C]">{p.name}</span>
                  <span className="text-xs font-mono font-bold text-[#101B17]">{formatVnd(p.fareVnd)}</span>
                </div>
                <p className="text-[11px] text-[#8A9993] truncate">
                  {p.pickupPoint} → {p.dropoffPoint}
                </p>
              </div>
            ))
          )}

          {/* Total */}
          <div className="bg-[#F1FAF6] border border-[#BDE7D5] rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#0F9D76]" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#101B17]">Tổng thu từ khách ({bookedPassengers.length} người)</span>
                <span className="text-[10px] text-[#0B7A5C]">Đúng theo km thực tế · Không phụ phí</span>
              </div>
            </div>
            <span className="text-xl font-bold text-[#0F9D76] font-mono">{formatVnd(totalCollectedVnd)}</span>
          </div>
        </div>
      </div>

      {/* Bottom Close */}
      <div className="absolute left-0 right-0 bottom-0 bg-white p-4 border-t border-[#EEF2F0] shadow-xl z-20">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full h-12 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-xs rounded-2xl transition-all shadow-xs"
        >
          Đã hiểu & Quay lại
        </button>
      </div>
    </div>
  );
};
