import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Check, Home, Star, Flag, Car, MapPin, Calendar, Clock } from 'lucide-react';
import { ReportModal } from '../../components/ReportModal';

export const TripComplete = () => {
  const navigate = useNavigate();
  const { currentRole, activeTrip, notify } = useApp();

  const [rating, setRating] = useState(5);
  const [selectedChips, setSelectedChips] = useState(['Lái xe an toàn', 'Đúng giờ']);
  const [tipAmount, setTipAmount] = useState('');
  const [showReport, setShowReport] = useState(false);

  // Trip details from activeTrip or fallback
  const fare = activeTrip?.priceVnd || 45000;
  const formattedFare = new Intl.NumberFormat('vi-VN').format(fare) + ' ₫';
  const tripCode = activeTrip?.id ? `#RS-${activeTrip.id.slice(-4)}` : '#RS-4821';
  const tripDate = activeTrip?.departureDate || 'Hôm nay, 12/09';
  const tripTime = activeTrip?.departureTime || '07:00';
  const origin = activeTrip?.origin || 'FPT University HCMC (Cổng 2)';
  const destination = activeTrip?.destination || 'Chợ Bến Thành, Q.1';
  const partnerName = currentRole === 'driver'
    ? (activeTrip?.passengers?.[0]?.name || 'Lê Minh Anh')
    : (activeTrip?.driverName || 'Nguyễn Quốc Huy');
  const partnerInitials = currentRole === 'driver'
    ? (activeTrip?.passengers?.[0]?.initials || 'MA')
    : (activeTrip?.driverInitials || 'QH');
  const vehicleModel = activeTrip?.vehicleModel || 'Honda City';
  const vehiclePlate = activeTrip?.vehiclePlate || '51G-119.02';

  const tags = [
    'Lái xe an toàn',
    'Đúng giờ',
    'Xe sạch & thơm',
    'Thân thiện, lịch sự',
    'Không gian riêng'
  ];

  const toggleChip = (chip) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter(c => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  const handleFinish = () => {
    notify?.('Cảm ơn bạn đã gửi đánh giá chuyến đi!');
    navigate(currentRole === 'driver' ? '/driver/home' : '/passenger/home');
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between bg-[#F4F7F5] p-3.5 overflow-hidden select-none relative">
      <div className="flex flex-col gap-2.5">
        {/* Celebration & Trip Info Card */}
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#E4EAE7] flex flex-col gap-2">
          {/* Top Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#DDF3EA] text-[#0F9D76] flex items-center justify-center border border-[#B2E2D0] shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold text-[#101B17]">Chuyến đi hoàn tất!</h1>
                <span className="text-[10px] text-[#8A9993]">{tripCode} · {tripDate} · {tripTime}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#DDF3EA] text-[#0B7A5C] text-[10px] font-bold border border-[#B2E2D0]">
              Đã thanh toán
            </span>
          </div>

          {/* Partner & Vehicle Info Row */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7FAF9] border border-[#EEF2F0] text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xs flex items-center justify-center shrink-0 border border-[#B2E2D0]">
                {partnerInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-[#101B17] text-xs truncate">{partnerName}</span>
                <span className="text-[10px] text-[#8A9993] truncate">
                  {currentRole === 'passenger' ? `${vehicleModel} · ${vehiclePlate}` : 'Hành khách đi cùng'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="text-[10px] text-[#8A9993]">{currentRole === 'driver' ? 'Thu nhập:' : 'Chi phí:'}</span>
              <span className="font-bold font-mono text-[#0B7A5C] text-xs">{formattedFare}</span>
            </div>
          </div>

          {/* Route Checkpoints */}
          <div className="flex flex-col gap-1 px-1 text-[11px]">
            <div className="flex items-center gap-2 text-[#101B17]">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
              <span className="truncate"><strong className="font-medium text-[#8A9993]">Đón:</strong> {origin}</span>
            </div>
            <div className="flex items-center gap-2 text-[#101B17]">
              <span className="w-2 h-2 rounded-sm bg-[#EE7A22] shrink-0" />
              <span className="truncate"><strong className="font-medium text-[#8A9993]">Trả:</strong> {destination}</span>
            </div>
          </div>
        </div>

        {/* Compact Rating & Review Card */}
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-[#E4EAE7] flex flex-col gap-2 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">
              {currentRole === 'driver' ? `Đánh giá hành khách ${partnerName}` : `Đánh giá tài xế ${partnerName}`}
            </span>
            <span className="text-xs font-bold text-[#101B17] mt-0.5">
              Trải nghiệm chuyến đi của bạn thế nào?
            </span>
          </div>

          {/* Star Selector */}
          <div className="flex justify-center gap-2 py-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="w-9 h-9 rounded-xl bg-[#F7FAF9] hover:bg-[#F1FAF6] flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
              >
                <Star
                  className={`w-5 h-5 transition-colors ${s <= rating
                    ? 'text-[#EE7A22] fill-[#EE7A22]'
                    : 'text-[#DFE7E3]'
                    }`}
                />
              </button>
            ))}
          </div>

          {/* Compliment Tags */}
          <div className="flex flex-wrap justify-center gap-1.5">
            {tags.map((chip) => {
              const active = selectedChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleChip(chip)}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer ${active
                    ? 'bg-[#0F9D76] text-white shadow-2xs'
                    : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#EAEFEA]'
                    }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Tip Input - User enters manually */}
          {currentRole === 'passenger' && (
            <div className="border-t border-[#EEF2F0] pt-2 flex items-center justify-between gap-2">
              <span className="text-[10.5px] font-semibold text-[#4B5A54] text-left">
                Tặng tiền tip cảm ơn (tuỳ chọn):
              </span>
              <div className="relative flex items-center w-28">
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  placeholder="0"
                  className="w-full h-7.5 rounded-lg border border-[#D5E2DC] bg-[#F7FAF9] px-2 pr-5 text-right text-xs font-bold font-mono text-[#0B7A5C] outline-none focus:border-[#0F9D76] focus:bg-white transition-all"
                />
                <span className="absolute right-1.5 text-[11px] font-bold text-[#8A9993] font-mono pointer-events-none">₫</span>
              </div>
            </div>
          )}

          {/* Report Trigger */}
          <button
            type="button"
            onClick={() => setShowReport(true)}
            className="mx-auto flex items-center gap-1 text-[10px] font-semibold text-[#8A9993] hover:text-[#C22B35] transition-colors pt-0.5"
          >
            <Flag className="w-3 h-3" />
            <span>Gặp vấn đề với chuyến đi? Báo cáo ngay</span>
          </button>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        reportedName={partnerName}
        tripCode={tripCode}
      />

      {/* Done CTA Button */}
      <button
        type="button"
        onClick={handleFinish}
        className="w-full h-11 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-xs shadow-[0_6px_16px_rgba(15,157,118,0.25)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 shrink-0"
      >
        <Home className="w-4 h-4" />
        <span>Gửi đánh giá & Về trang chủ</span>
      </button>
    </div>
  );
};
