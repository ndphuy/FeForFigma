import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { OTPInput } from '../../components/OTPInput';
import { RouteShareMark } from '../../components/RouteShareMark';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { currentRole, switchRole, setIsAuthenticated } = useApp();

  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(45);

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (phoneNumber.length >= 9) {
      setStep('otp');
    }
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setIsAuthenticated(true);
    if (currentRole === 'driver') {
      navigate('/driver/home');
    } else {
      navigate('/passenger/home');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white">
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[#0F9D76] flex items-center justify-center shadow-sm">
            <RouteShareMark size={24} />
          </div>
          <span className="text-lg font-bold text-[#101B17] tracking-tight">RouteShare</span>
        </div>

        {/* Headline */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#101B17]">
            {step === 'phone' ? 'Đăng nhập tài khoản' : 'Nhập mã xác thực'}
          </h1>
          <p className="text-xs text-[#4B5A54] mt-1">
            {step === 'phone'
              ? 'Nhập số điện thoại để tiếp tục sử dụng RouteShare.'
              : `Mã OTP đã được gửi đến số điện thoại ${phoneNumber}.`}
          </p>
        </div>

        {/* Form Content */}
        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#101B17] block mb-1.5">
                Số điện thoại
              </label>
              <div className="relative flex items-center">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Nhập số điện thoại..."
                  className="w-full px-4 py-3.5 bg-[#F4F7F5] border border-[#E4EAE7] rounded-2xl text-xs font-semibold text-[#101B17] focus:bg-white focus:border-[#0F9D76] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] active:scale-[0.99] text-white font-bold rounded-2xl text-xs transition-all shadow-xs flex items-center justify-center space-x-1.5 mt-2"
            >
              <span>Tiếp tục với mã OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <OTPInput value={otpValue} onChange={setOtpValue} />

            <div className="text-center">
              <p className="text-xs text-[#4B5A54]">
                Chưa nhận được mã?{' '}
                <button
                  type="button"
                  onClick={() => setTimer(45)}
                  className="text-[#0F9D76] font-bold hover:underline"
                >
                  Gửi lại ({timer}s)
                </button>
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold rounded-2xl text-xs transition-all shadow-xs flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác nhận & Bắt đầu</span>
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full py-2.5 text-xs text-[#8A9993] hover:text-[#101B17] font-semibold"
              >
                Đổi số điện thoại khác
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#8A9993]">
        RouteShare Vietnam · Đi chung xe văn minh
      </div>
    </div>
  );
};
