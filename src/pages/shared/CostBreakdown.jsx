import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Info, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const CostBreakdown = () => {
  const navigate = useNavigate();

  const segments = [
    { km: 5, kmLabel: "5 km", barBg: "#DFE7E3", barFg: "#4B5A54", endLabel: "B", isUser: false },
    { km: 15, kmLabel: "15 km", barBg: "#0F9D76", barFg: "#FFFFFF", endLabel: "C", isUser: true },
    { km: 10, kmLabel: "10 km", barBg: "#DFE7E3", barFg: "#4B5A54", endLabel: "D", isUser: false },
  ];

  const costParts = [
    { label: "Xăng xe (tiêu thụ thực tế ~7.5L/100km)", value: "92.000 ₫", color: "#0F9D76", weight: 68 },
    { label: "Phí cầu đường BOT Xa Lộ HN", value: "20.000 ₫", color: "#EE7A22", weight: 15 },
    { label: "Hao mòn lốp, nhớt & bảo dưỡng", value: "23.000 ₫", color: "#6366F1", weight: 17 },
  ];

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
          <span className="text-xs text-[#8A9993]">Chuyến A → D · 30 km</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto rs-scroll p-4 pb-24 flex flex-col gap-3.5">
        {/* 1. Route Segment Visualizer */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#101B17]">Phần đường bạn thực tế đi</span>
            <span className="text-xs font-mono font-bold text-[#0B7A5C]">9 km (Điểm đón → Điểm trả)</span>
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

            <div className="flex justify-between text-[11px] font-mono text-[#8A9993] px-1">
              <span>Đón (A)</span>
              <span>Điểm B</span>
              <span>Trả (C)</span>
              <span>Đích (D)</span>
            </div>

            <div className="flex items-center gap-3 pt-1 text-[11px]">
              <span className="inline-flex items-center gap-1.5 font-bold text-[#0B7A5C]">
                <span className="w-3.5 h-1.5 rounded-full bg-[#0F9D76]" /> Chặng của bạn (9 km)
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
              <span className="font-bold text-[#0B7A5C] font-mono">5.000 ₫ / km</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#4B5A54]">Quãng đường đón - trả của bạn:</span>
              <span className="font-bold text-[#101B17] font-mono">9,0 km</span>
            </div>
            <div className="h-[1px] bg-[#EEF2F0] my-0.5" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#101B17] font-bold">Công thức tính:</span>
              <span className="font-mono font-semibold text-[#4B5A54]">9,0 km × 5.000 ₫/km</span>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-[#F1FAF6] rounded-2xl p-3 border border-[#BDE7D5]/60">
            <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0 mt-0.5" />
            <span className="text-[11px] text-[#0B7A5C] leading-relaxed">
              <strong>Công bằng & minh bạch:</strong> Bạn chỉ chi trả cho đúng quãng đường thực tế mà bạn ngồi trên xe, không phải trả cho toàn bộ tuyến của tài xế.
            </span>
          </div>
        </div>

        {/* 3. Final Fare Breakdown */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <span className="text-sm font-bold text-[#101B17]">Tổng tiền cần thanh toán</span>

          {/* Step 1 */}
          <div className="bg-[#F7FAF9] rounded-2xl p-3 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0B7A5C]">Chi phí chia sẻ theo cự ly (1 chỗ)</span>
              <span className="text-xs font-mono font-bold text-[#101B17]">45.000 ₫</span>
            </div>
            <p className="text-[11px] text-[#8A9993]">
              9 km × 5.000 ₫/km = 45.000 ₫
            </p>
          </div>

          {/* Step 3 Final */}
          <div className="bg-[#F1FAF6] border border-[#BDE7D5] rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#0F9D76]" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#101B17]">Bạn chia sẻ (1 chỗ)</span>
                <span className="text-[10px] text-[#0B7A5C]">Đúng theo km thực tế · Không phụ phí</span>
              </div>
            </div>
            <span className="text-xl font-bold text-[#0F9D76] font-mono">45.000 ₫</span>
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
