import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { OTPInput } from '../../components/OTPInput';
import { RouteShareMark } from '../../components/RouteShareMark';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Car
} from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { switchRole, setIsAuthenticated } = useApp();

  // Step: 1 = Form Info, 2 = OTP Verification, 3 = Success
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(45);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (field, value) => {
    setErrorMsg('');
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitInfo = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên.');
      return;
    }
    if (formData.phone.length < 9) {
      setErrorMsg('Vui lòng nhập số điện thoại hợp lệ (từ 9-10 chữ số).');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMsg('Bạn cần đồng ý với Điều khoản sử dụng RouteShare.');
      return;
    }

    setErrorMsg('');
    setStep(2);
  };

  const handleVerifyOTP = (e) => {
    e?.preventDefault();
    if (otpValue.length < 6) {
      setErrorMsg('Vui lòng nhập đủ mã OTP gồm 6 chữ số.');
      return;
    }

    // Default to passenger, user has full unified role capability
    switchRole('passenger');
    setIsAuthenticated(true);
    setStep(3);
  };

  const handleFinish = () => {
    navigate('/passenger/home');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#F4F7F5] overflow-y-auto rs-scroll">
      <div>
        {/* Top App Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={() => {
              if (step === 2) {
                setStep(1);
              } else {
                navigate('/auth/login');
              }
            }}
            className="w-10 h-10 rounded-2xl bg-white border border-[#E4EAE7] flex items-center justify-center text-[#101B17] hover:bg-[#F7FAF9] transition-colors cursor-pointer shadow-xs"
            aria-label="Quay lại"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-xl bg-[#0F9D76] flex items-center justify-center shadow-xs">
              <RouteShareMark size={16} color="#FFFFFF" />
            </div>
            <span className="text-sm font-bold text-[#101B17] tracking-tight">RouteShare</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/auth/login')}
            className="text-xs font-bold text-[#0F9D76] hover:underline cursor-pointer"
          >
            Đăng nhập
          </button>
        </div>

        {/* STEP 1: FORM INFORMATION */}
        {step === 1 && (
          <form onSubmit={handleSubmitInfo} className="space-y-3.5">
            <div className="text-left mb-3">
              <h1 className="text-xl font-bold text-[#101B17]">Đăng ký tài khoản</h1>
              <p className="text-xs text-[#4B5A54] mt-0.5">
                Tạo tài khoản RouteShare dùng chung cho cả Đi xe & Lái xe chia sẻ.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#FFF0F0] border border-[#F7D9D9] text-[#C22B35] text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="text-[11.5px] font-bold text-[#101B17] block mb-1">
                Họ và tên <span className="text-[#C22B35]">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E4EAE7] rounded-xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-[11.5px] font-bold text-[#101B17] block mb-1">
                Số điện thoại <span className="text-[#C22B35]">*</span>
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="0912 345 678"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E4EAE7] rounded-xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none font-mono transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="text-[11.5px] font-bold text-[#101B17] block mb-1">
                Email sinh viên / công sở <span className="text-[#8A9993] font-normal">(tùy chọn)</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@fpt.edu.vn"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#E4EAE7] rounded-xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[11.5px] font-bold text-[#101B17] block mb-1">
                Mật khẩu <span className="text-[#C22B35]">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Tối thiểu 6 ký tự..."
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#E4EAE7] rounded-xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#8A9993] hover:text-[#101B17] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[11.5px] font-bold text-[#101B17] block mb-1">
                Xác nhận mật khẩu <span className="text-[#C22B35]">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Nhập lại mật khẩu..."
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[#E4EAE7] rounded-xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-[#8A9993] hover:text-[#101B17] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms agreement checkbox */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                className="mt-0.5 rounded border-[#E4EAE7] text-[#0F9D76] focus:ring-[#0F9D76]"
              />
              <span className="text-[11px] text-[#4B5A54] leading-relaxed">
                Tôi đồng ý với <strong className="text-[#0F9D76]">Điều khoản sử dụng</strong> & Quy chuẩn an toàn cộng đồng của RouteShare Vietnam.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold rounded-2xl text-xs transition-all shadow-[0_4px_14px_rgba(15,157,118,0.25)] flex items-center justify-center space-x-1.5 cursor-pointer mt-3"
            >
              <span>Tiếp tục xác thực số điện thoại</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="text-left">
              <h1 className="text-xl font-bold text-[#101B17]">Nhập mã xác thực OTP</h1>
              <p className="text-xs text-[#4B5A54] mt-1">
                Mã xác thực 6 số đã được gửi qua SMS đến số điện thoại:
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DDF3EA] text-[#0B7A5C] rounded-xl text-xs font-bold font-mono">
                <Phone className="w-3.5 h-3.5" />
                <span>{formData.phone || '0912 345 678'}</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#FFF0F0] border border-[#F7D9D9] text-[#C22B35] text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="py-2">
              <OTPInput value={otpValue} onChange={setOtpValue} />
            </div>

            <div className="text-center">
              <p className="text-xs text-[#4B5A54]">
                Chưa nhận được mã?{' '}
                <button
                  type="button"
                  onClick={() => setTimer(45)}
                  className="text-[#0F9D76] font-bold hover:underline cursor-pointer"
                >
                  Gửi lại ({timer}s)
                </button>
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold rounded-2xl text-xs transition-all shadow-[0_4px_14px_rgba(15,157,118,0.25)] flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác nhận đăng ký</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2.5 text-xs text-[#8A9993] hover:text-[#101B17] font-semibold cursor-pointer"
              >
                Chỉnh sửa thông tin đăng ký
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: REGISTRATION SUCCESS */}
        {step === 3 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#DDF3EA] text-[#0F9D76] flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#101B17]">Đăng ký thành công!</h1>
              <p className="text-xs text-[#4B5A54] mt-1.5 max-w-[290px] mx-auto leading-relaxed">
                Chào mừng <strong>{formData.fullName || 'bạn'}</strong> đến với RouteShare. Tài khoản đã sẵn sàng cho cả nhu cầu Đi xe và Lái xe chia sẻ.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#E4EAE7] text-left space-y-2 max-w-[320px] mx-auto shadow-xs">
              <div className="flex items-center gap-2 text-xs text-[#101B17]">
                <ShieldCheck className="w-4 h-4 text-[#0F9D76]" />
                <span>Tài khoản đã được bảo vệ & kích hoạt</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#4B5A54]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D76]" />
                <span>Số điện thoại: <strong className="font-mono text-[#101B17]">{formData.phone || '0912 345 678'}</strong></span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold rounded-2xl text-xs transition-all shadow-[0_4px_14px_rgba(15,157,118,0.25)] flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Bắt đầu trải nghiệm ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  switchRole('driver');
                  navigate('/driver/kyc');
                }}
                className="w-full py-3 bg-white hover:bg-[#F1FAF6] text-[#0B7A5C] font-bold rounded-2xl text-xs border border-[#BDE7D5] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Car className="w-4 h-4 text-[#0F9D76]" />
                <span>Đăng ký thông tin xe & Giấy phép lái xe</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[10.5px] text-[#8A9993] pt-6">
        RouteShare Vietnam · Đi chung xe văn minh & an toàn
      </div>
    </div>
  );
};
