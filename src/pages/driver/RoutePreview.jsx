import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Users, 
  TrendingUp, 
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { RouteRail } from '../../components/RouteRail';

export const RoutePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { publishTrip } = useApp();

  const tripSetup = location.state || {
    origin: 'Chung cư Masteri Thảo Điền, TP. Thủ Đức',
    originShort: 'Masteri Thảo Điền',
    destination: 'Khu Công Nghệ Cao (SHTP), TP. Thủ Đức',
    destinationShort: 'Khu Công Nghệ Cao',
    stops: [{ name: 'Ngã tư Thủ Đức (Đón khách)', time: '07:45' }],
    departureDate: 'Hôm nay',
    departureTime: '07:30',
    maxDetourMins: 6,
    seats: 3,
    priceVnd: 35000,
  };

  const [customPrice, setCustomPrice] = useState(tripSetup.priceVnd || 35000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalRevenue = customPrice * tripSetup.seats;
  const platformFee = Math.round(totalRevenue * 0.1);
  const netEarnings = totalRevenue - platformFee;

  const handleConfirmPublish = () => {
    setIsSubmitting(true);
    publishTrip({
      ...tripSetup,
      priceVnd: customPrice,
    });

    setTimeout(() => {
      navigate('/driver/home');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-canvas">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/driver/create-trip')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Xem trước lộ trình (MF-01)
          </span>
          <div className="w-9" />
        </div>

        {/* Map Polyline Simulation Card */}
        <div className="w-full h-44 bg-slate-900 rounded-3xl overflow-hidden relative shadow-elevated mb-4 border border-slate-800">
          {/* Simulated Dark Map Canvas */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Simulated Route Polyline SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 180">
            {/* Route glow & polyline */}
            <path
              d="M 50 140 C 90 120, 130 110, 170 75 S 250 80, 290 35"
              fill="none"
              stroke="#0D9488"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 50 140 C 90 120, 130 110, 170 75 S 250 80, 290 35"
              fill="none"
              stroke="#5EEAD4"
              strokeWidth="3"
              strokeDasharray="4 2"
              strokeLinecap="round"
            />

            {/* Origin Pin */}
            <circle cx="50" cy="140" r="7" fill="#10B981" />
            <circle cx="50" cy="140" r="3" fill="#FFFFFF" />

            {/* Stop Pin */}
            <circle cx="170" cy="75" r="5" fill="#F59E0B" />

            {/* Destination Pin */}
            <rect x="283" y="28" width="14" height="14" rx="3" fill="#F97316" />
          </svg>

          {/* Map Badges */}
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-[10px] text-teal-300 font-bold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>14.5 km • ~28 phút lái xe</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700 text-[10px] text-amber-300 font-bold">
            Hành lang đón khách ±6p
          </div>
        </div>

        {/* Route Details Summary */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Lộ trình đã thiết lập</span>
            <span className="text-xs font-semibold text-slate-500">
              {tripSetup.departureDate}, {tripSetup.departureTime}
            </span>
          </div>

          <RouteRail
            origin={tripSetup.origin}
            destination={tripSetup.destination}
            stops={tripSetup.stops}
            compact={true}
          />
        </div>

        {/* Revenue & Escrow Calculation Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800">Định giá & Thu nhập dự kiến</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {tripSetup.seats} chỗ trống
            </span>
          </div>

          {/* Price adjuster */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-600 font-medium">Giá đề xuất mỗi khách:</span>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                step="5000"
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
                className="w-24 text-right font-mono font-black text-primary text-sm bg-white border border-slate-300 rounded px-2 py-1 outline-none"
              />
              <span className="text-xs font-bold text-slate-700">đ</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 pt-1">
            <div className="flex justify-between">
              <span>Tổng thu nhập khi đầy xe (3 khách):</span>
              <span className="font-bold text-slate-800">{new Intl.NumberFormat('vi-VN').format(totalRevenue)}đ</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Phí vận hành nền tảng (10%):</span>
              <span>-{new Intl.NumberFormat('vi-VN').format(platformFee)}đ</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-emerald-700 pt-1.5 border-t border-slate-100">
              <span>Thực nhận vào ví Escrow:</span>
              <span>+{new Intl.NumberFormat('vi-VN').format(netEarnings)}đ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm CTA */}
      <button
        onClick={handleConfirmPublish}
        disabled={isSubmitting}
        className="w-full py-3.5 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <CheckCircle2 className="w-4 h-4 animate-spin" />
            <span>Đang đăng chuyến lên mạng lưới...</span>
          </>
        ) : (
          <>
            <span>Xác nhận & Đăng chuyến đi ngay</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
