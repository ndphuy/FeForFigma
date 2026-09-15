import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, MapPin, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { AppMap } from '../../components/AppMap';

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

  // Map points for AppMap in picker mode
  const mapPoints = filteredPoints.map((pt, idx) => ({
    id: pt.id,
    name: pt.name?.split('(')[0]?.trim() || pt.name,
    label: pt.name?.split('(')[0]?.trim() || pt.name,
    isSafe: pt.isSafe,
    type: pt.isSafe ? 'safe' : 'warning',
    x: idx === 0 ? 80 : idx === 1 ? 175 : idx === 2 ? 260 : 330,
    y: idx === 0 ? 145 : idx === 1 ? 115 : idx === 2 ? 85 : 60,
  }));

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Header matching Pickup Location Picker.dc.html */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-11 h-11 border border-[#EEF2F0] rounded-2xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors cursor-pointer"
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
        {/* Interactive Unified Map Canvas */}
        <AppMap
          mode="picker"
          points={mapPoints}
          selectedPointId={selectedPointId}
          onSelectPoint={(pointId) => setSelectedPointId(typeof pointId === 'object' ? pointId.id : pointId)}
          meta={`${filteredPoints.length} trạm khả dụng`}
          tag="Trạm an toàn đề xuất"
          heightClass="h-56"
        />

        {/* Car vs Motorbike Carpooling Rule Banner */}
        <div className="bg-[#F1FAF6] p-3 rounded-2xl border border-[#BDE7D5] flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B7A5C]">
            <ShieldCheck className="w-4 h-4 text-[#0F9D76]" />
            <span>Quy tắc đón khách đi ké:</span>
          </div>
          <p className="text-[11px] text-[#4B5A54] leading-relaxed">
            • <strong>Ô tô:</strong> Đón tại các trạm dừng an toàn, cố định dọc tuyến của chủ xe.<br />
            • <strong>Xe máy:</strong> Linh hoạt đón tại các điểm giao cắt thuận tiện cho cả hai bên.
          </p>
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
            🚗 Trạm dừng Ô tô ({pickupPoints.length})
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
            🛵 Điểm đón Xe máy linh hoạt
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
