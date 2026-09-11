import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { BoardingPIN } from '../../components/BoardingPIN';
import { 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Car, 
  User, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const BoardingVerify = () => {
  const navigate = useNavigate();
  const { activeTrip, verifyBoardingPin, completeTrip, currentRole, notify } = useApp();

  const [inputPin, setInputPin] = useState('');
  const [verificationResult, setVerificationResult] = useState(null); // null | 'success' | 'error'
  const [viewMode, setViewMode] = useState(currentRole === 'driver' ? 'driver_input' : 'passenger_show');

  const trip = activeTrip;
  const targetPin = trip?.boardingPin || '8204';

  const handleKeypadClick = (num) => {
    if (inputPin.length < 4) {
      const nextPin = inputPin + num;
      setInputPin(nextPin);
      if (nextPin.length === 4) {
        validatePin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setInputPin(prev => prev.slice(0, -1));
    setVerificationResult(null);
  };

  const validatePin = (pinToTest) => {
    const res = verifyBoardingPin(trip?.id || 'trip_001', pinToTest);
    if (res.success) {
      setVerificationResult('success');
      notify?.('Xác thực mã PIN thành công! Hành khách đã lên xe.');
    } else {
      setVerificationResult('error');
    }
  };

  const handleCompleteRide = () => {
    completeTrip(trip?.id || 'trip_001');
    navigate('/shared/trip-complete');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-[#F4F7F5] overflow-y-auto rs-scroll">
      <div className="flex flex-col gap-3.5">
        {/* Header */}
        <div className="bg-white p-3.5 px-4 rounded-2xl flex items-center justify-between border border-[#EEF2F0] shadow-[0_1px_4px_rgba(16,27,23,0.04)]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white border border-[#EEF2F0] hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0"
          >
            ‹
          </button>
          <span className="text-xs font-bold text-[#101B17] uppercase tracking-wider">
            Xác thực lên xe (Mã PIN)
          </span>
          <div className="w-10" />
        </div>

        {/* Perspective Mode Switcher */}
        <div className="bg-[#E9EFEC] p-1 rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => setViewMode('passenger_show')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'passenger_show'
                ? 'bg-white text-[#0B7A5C] shadow-xs'
                : 'text-[#5B6B64] hover:text-[#101B17]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Khách (Mã PIN)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('driver_input')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'driver_input'
                ? 'bg-white text-[#0B7A5C] shadow-xs'
                : 'text-[#5B6B64] hover:text-[#101B17]'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Tài xế (Nhập mã PIN)</span>
          </button>
        </div>

        {/* PASSENGER PERSPECTIVE: SHOW PIN */}
        {viewMode === 'passenger_show' ? (
          <div className="flex flex-col gap-3.5">
            <BoardingPIN pin={targetPin} passengerName="Trần Thị Mai" />

            <div className="bg-white p-4 rounded-3xl border border-[#EEF2F0] shadow-[0_2px_12px_rgba(16,27,23,0.05)] text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#0B7A5C] font-bold">
                <ShieldCheck className="w-4.5 h-4.5" />
                <span>Quy trình bảo vệ an toàn RouteShare</span>
              </div>
              <p className="text-[#8A9993] text-xs leading-relaxed m-0">
                Tài xế phải nhập chính xác 4 số này để xác nhận đón đúng người. Tiền cước chỉ bắt đầu tính khi mã được kích hoạt.
              </p>
            </div>
          </div>
        ) : (
          /* DRIVER PERSPECTIVE: INPUT KEYPAD */
          <div className="flex flex-col gap-3.5">
            <div className="bg-white p-5 rounded-[28px] border border-[#EEF2F0] shadow-[0_2px_12px_rgba(16,27,23,0.05)] text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-[#DDF3EA] text-[#0B7A5C] rounded-2xl flex items-center justify-center mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-[#101B17]">
                Nhập mã PIN của hành khách
              </h2>
              <p className="text-xs text-[#8A9993] mb-4">
                Hỏi hành khách 4 số hiển thị trên ứng dụng của họ (Mẫu: 8204)
              </p>

              {/* 4 Box Display */}
              <div className="flex justify-center gap-2.5 mb-4">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-13 h-15 rounded-2xl border-2 flex items-center justify-center text-2xl font-bold font-mono transition-all ${
                      inputPin[idx]
                        ? 'border-[#0F9D76] text-[#0B7A5C] bg-[#F1FAF6] shadow-xs'
                        : 'border-[#E4EAE7] text-[#C3CDC9] bg-[#F7FAF9]'
                    }`}
                  >
                    {inputPin[idx] || '•'}
                  </div>
                ))}
              </div>

              {/* Feedback Alert */}
              {verificationResult === 'success' && (
                <div className="bg-[#DDF3EA] text-[#0B7A5C] p-3 rounded-2xl border border-[#BDE7D5] text-xs font-bold flex items-center justify-center gap-1.5 w-full animate-[rs-pop_0.3s_ease-out]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác thực thành công! Đã đón khách.</span>
                </div>
              )}

              {verificationResult === 'error' && (
                <div className="bg-[#FFF0F0] text-[#C22B35] p-3 rounded-2xl border border-[#FCDAD7] text-xs font-bold flex items-center justify-center gap-1.5 w-full animate-[rs-pop_0.3s_ease-out]">
                  <XCircle className="w-4 h-4" />
                  <span>Mã PIN không đúng. Vui lòng nhập lại (Gợi ý: 8204).</span>
                </div>
              )}
            </div>

            {/* Simulated Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadClick(num.toString())}
                  className="py-3 bg-white hover:bg-[#F7FAF9] active:bg-[#EAEFEA] rounded-2xl text-lg font-bold font-mono text-[#101B17] shadow-xs border border-[#EEF2F0] transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setInputPin('8204');
                  validatePin('8204');
                }}
                className="py-3 bg-[#F1FAF6] hover:bg-[#DDF3EA] rounded-2xl text-[11px] font-bold text-[#0B7A5C] border border-[#BDE7D5]"
              >
                Mẫu 8204
              </button>
              <button
                type="button"
                onClick={() => handleKeypadClick('0')}
                className="py-3 bg-white hover:bg-[#F7FAF9] rounded-2xl text-lg font-bold font-mono text-[#101B17] shadow-xs border border-[#EEF2F0]"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-3 bg-[#F4F7F5] hover:bg-[#EAEFEA] rounded-2xl text-xs font-bold text-[#4B5A54]"
              >
                Xóa
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Complete Trip Action Button */}
      <button
        type="button"
        onClick={handleCompleteRide}
        className="w-full h-[56px] bg-[#0F9D76] hover:bg-[#0B7A5C] active:scale-[0.99] text-white font-bold rounded-[19px] text-sm transition-all shadow-[0_8px_20px_rgba(15,157,118,0.30)] flex items-center justify-center gap-2 mt-4 cursor-pointer"
      >
        <Sparkles className="w-4 h-4" />
        <span>Hoàn tất & Quyết toán chi phí</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
