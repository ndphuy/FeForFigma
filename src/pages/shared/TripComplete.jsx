import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Check, Home, Star, Heart, ThumbsUp, Flag } from 'lucide-react';
import { ReportModal } from '../../components/ReportModal';

export const TripComplete = () => {
  const navigate = useNavigate();
  const { currentRole, activeTrip, notify } = useApp();

  const [rating, setRating] = useState(5);
  const [selectedChips, setSelectedChips] = useState(['Lái xe an toàn', 'Đúng giờ']);
  const [tipAmount, setTipAmount] = useState(0);
  const [showReport, setShowReport] = useState(false);

  const fare = activeTrip?.priceVnd || 35000;
  const formattedFare = new Intl.NumberFormat('vi-VN').format(fare) + ' ₫';

  const tags = [
    'Lái xe an toàn',
    'Đúng giờ',
    'Xe sạch sẽ & thơm',
    'Thân thiện, lịch sự',
    'Trò chuyện vui vẻ',
    'Tôn trọng không gian riêng'
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
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-y-auto rs-scroll p-4 pb-8 justify-between relative">
      <div className="flex flex-col gap-4">
        {/* Celebration Header */}
        <div className="bg-white rounded-[28px] p-6 text-center shadow-[0_2px_16px_rgba(16,27,23,0.06)] flex flex-col items-center gap-3 animate-[rs-pop_0.4s_ease-out]">
          <div className="w-16 h-16 rounded-full bg-[#DDF3EA] text-[#0F9D76] flex items-center justify-center border-4 border-white shadow-[0_4px_16px_rgba(15,157,118,0.25)]">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-[#101B17]">Chuyến đi hoàn tất!</h1>
            <p className="text-xs text-[#8A9993] max-w-[260px]">
              {currentRole === 'driver'
                ? 'Tiền đóng góp chuyến đi đã được ghi nhận vào tài khoản của bạn.'
                : 'Cảm ơn bạn đã chung tay chia sẻ lộ trình xanh cùng cộng đồng.'}
            </p>
          </div>

          {/* Fare Summary Box */}
          <div className="w-full bg-[#F7FAF9] border border-[#EEF2F0] rounded-2xl p-3.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8A9993]">
              {currentRole === 'driver' ? 'Đóng góp nhận được:' : 'Chi phí đóng góp:'}
            </span>
            <span className="text-xl font-bold font-mono text-[#0B7A5C]">
              {formattedFare}
            </span>
          </div>
        </div>

        {/* Rating & Compliments Card */}
        <div className="bg-white rounded-[28px] p-5 shadow-[0_2px_16px_rgba(16,27,23,0.06)] flex flex-col gap-4 text-center">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A9993]">
              {currentRole === 'driver' ? 'Đánh giá hành khách Lan' : 'Đánh giá tài xế Quốc Huy'}
            </span>
            <span className="text-base font-bold text-[#101B17]">
              Trải nghiệm chuyến đi của bạn thế nào?
            </span>
          </div>

          {/* Star Selector */}
          <div className="flex justify-center gap-2 py-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="w-11 h-11 rounded-2xl bg-[#F7FAF9] hover:bg-[#F1FAF6] flex items-center justify-center transition-transform active:scale-90"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    s <= rating
                      ? 'text-[#EE7A22] fill-[#EE7A22]'
                      : 'text-[#DFE7E3]'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Compliment Tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((chip) => {
              const active = selectedChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleChip(chip)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#0F9D76] text-white shadow-[0_2px_8px_rgba(15,157,118,0.3)]'
                      : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#EAEFEA]'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Optional Tip / Appreciation for passenger */}
          {currentRole === 'passenger' && (
            <div className="border-t border-[#EEF2F0] pt-3.5 flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#8A9993]">
                Tặng thêm tiền tip cảm ơn tài xế (tuỳ chọn):
              </span>
              <div className="flex justify-center gap-2">
                {[0, 10000, 20000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTipAmount(amt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
                      tipAmount === amt
                        ? 'bg-[#0B7A5C] text-white'
                        : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#EAEFEA]'
                    }`}
                  >
                    {amt === 0 ? 'Không' : `+${amt / 1000}k`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowReport(true)}
            className="mx-auto flex items-center gap-1.5 text-[11px] font-semibold text-[#8A9993] hover:text-[#C22B35] transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            Gặp vấn đề với chuyến đi? Báo cáo ngay
          </button>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        reportedName={currentRole === 'driver' ? 'Lan' : 'Quốc Huy'}
        tripCode={activeTrip?.id}
      />

      {/* Done CTA */}
      <button
        type="button"
        onClick={handleFinish}
        className="w-full h-[56px] rounded-[19px] bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-base shadow-[0_8px_20px_rgba(15,157,118,0.30)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4"
      >
        <Home className="w-5 h-5" />
        <span>Gửi đánh giá & Về trang chủ</span>
      </button>
    </div>
  );
};
