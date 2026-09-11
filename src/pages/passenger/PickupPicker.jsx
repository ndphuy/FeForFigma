import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, MapPin, AlertTriangle, Check, ArrowRight } from 'lucide-react';

export const PickupPicker = () => {
  const navigate = useNavigate();
  const { pickupPoints, setSelectedPickupPoint } = useApp();

  const [selectedPointId, setSelectedPointId] = useState(pickupPoints[0]?.id || 'pp_01');
  const [filter, setFilter] = useState('all'); // 'all' | 'safe'

  const filteredPoints = pickupPoints.filter(p => {
    if (filter === 'safe') return p.isSafe;
    return true;
  });

  const selectedPoint = pickupPoints.find(p => p.id === selectedPointId) || pickupPoints[0];

  const handleConfirm = () => {
    if (selectedPoint) {
      setSelectedPickupPoint(selectedPoint);
    }
    navigate('/passenger/results');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Header matching Pickup Location Picker.dc.html */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-11 h-11 border border-[#EEF2F0] rounded-2xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors"
        >
          ‹
        </button>

        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-[17px] font-bold text-[#101B17]">Chọn điểm đón an toàn</span>
          <span className="text-xs text-[#8A9993]">Khu vực Phú Mỹ Hưng, Q.7</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto rs-scroll p-4 pb-28 flex flex-col gap-3.5">
        {/* Interactive Map Canvas Preview */}
        <div className="h-56 rounded-3xl overflow-hidden relative bg-[repeating-linear-gradient(135deg,#E4EBE8_0_8px,#EDF2F0_8px_16px)] border border-[#E4EAE7] shadow-inner">
          <div className="absolute left-0 right-0 top-24 h-3 bg-[#DCE5E1]" />
          <div className="absolute top-0 bottom-0 left-28 width-2.5 bg-[#DCE5E1]" />
          <div className="absolute right-12 bottom-10 w-24 h-16 rounded-xl bg-[#DFEDE6]" />

          {/* Safe Pickup Pin 1 */}
          <div className="absolute left-16 top-14 flex flex-col items-center gap-1">
            <span className="px-2 py-0.5 rounded-lg bg-white shadow-md text-[9.5px] font-bold text-[#0B7A5C] whitespace-nowrap">
              Cổng R1 (Khuyên dùng)
            </span>
            <div className="w-6 h-6 rounded-full bg-[#0F9D76] border-2 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold">
              ✓
            </div>
          </div>

          {/* Safe Pickup Pin 2 */}
          <div className="absolute right-20 top-28 flex flex-col items-center gap-1">
            <span className="px-2 py-0.5 rounded-lg bg-white shadow-md text-[9.5px] font-bold text-[#0B7A5C] whitespace-nowrap">
              Bến xe buýt Crescent
            </span>
            <div className="w-5 h-5 rounded-full bg-[#0F9D76] border-2 border-white shadow-md flex items-center justify-center text-white text-[9px]">
              ✓
            </div>
          </div>

          {/* Warning Pin */}
          <div className="absolute right-10 top-6 flex flex-col items-center gap-1 opacity-80">
            <span className="px-1.5 py-0.5 rounded bg-white/90 shadow-xs text-[8.5px] font-bold text-[#C22B35]">
              Cấm dừng
            </span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#EE7A22] border border-white shadow-xs" />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto rs-scroll py-0.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#0F9D76] text-white'
                : 'bg-white text-[#4B5A54] border border-[#E4EAE7]'
            }`}
          >
            Tất cả điểm đón
          </button>
          <button
            type="button"
            onClick={() => setFilter('safe')}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === 'safe'
                ? 'bg-[#0F9D76] text-white'
                : 'bg-white text-[#4B5A54] border border-[#E4EAE7]'
            }`}
          >
            Tránh cấm dừng đỗ
          </button>
        </div>

        {/* Curated Pickup Points List */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8A9993] px-1">
            Điểm đón thuận tiện được đề xuất
          </span>

          {filteredPoints.map((pt) => {
            const isSelected = selectedPointId === pt.id;
            return (
              <div
                key={pt.id}
                onClick={() => setSelectedPointId(pt.id)}
                className={`p-3.5 rounded-2xl border-[1.5px] transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'bg-white border-[#0F9D76] shadow-sm'
                    : 'bg-white border-[#E4EAE7] hover:border-[#BDE7D5]'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  pt.isSafe ? 'bg-[#DDF3EA] text-[#0B7A5C]' : 'bg-[#FFF4E9] text-[#EE7A22]'
                }`}>
                  {pt.isSafe ? <MapPin className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#101B17] truncate">{pt.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      pt.isSafe ? 'bg-[#F1FAF6] text-[#0B7A5C]' : 'bg-[#FFF4E9] text-[#EE7A22]'
                    }`}>
                      {pt.safetyTag}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#8A9993] leading-relaxed truncate">{pt.address}</span>
                  <span className="text-[11px] text-[#4B5A54] font-medium">{pt.distance} · {pt.note}</span>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#0F9D76] text-white flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute left-0 right-0 bottom-0 bg-white p-4 border-t border-[#EEF2F0] shadow-2xl flex flex-col gap-2 z-20">
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full h-13 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-sm rounded-2xl shadow-[0_8px_20px_rgba(15,157,118,0.28)] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Xác nhận điểm đón này</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
