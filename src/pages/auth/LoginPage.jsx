import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { OTPInput } from '../../components/OTPInput';
import { RouteShareMark } from '../../components/RouteShareMark';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { currentRole, switchRole, setIsAuthenticated } = useApp();

  // viewMode: 'login' | 'forgot_phone' | 'forgot_otp' | 'forgot_reset'
  const [viewMode, setViewMode] = useState('login');
  
  // Login method: 'phone' | 'email'
  const [loginType, setLoginType] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password flow states
  const [recoveryType, setRecoveryType] = useState('phone'); // 'phone' | 'email'
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(45);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Standard Password Login
  const handlePasswordLogin = (e) => {
    e.preventDefault();
    if (loginType === 'phone') {
      if (phoneNumber.length < 9) {
        setErrorMsg('Vui lòng nhập số điện thoại hợp lệ (từ 9-10 chữ số).');
        return;
      }
    } else {
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ.');
        return;
      }
    }

    if (!password) {
      setErrorMsg('Vui lòng nhập mật khẩu.');
      return;
    }

    setErrorMsg('');
    setIsAuthenticated(true);
    if (currentRole === 'driver') {
      navigate('/driver/home');
    } else {
      navigate('/passenger/home');
    }
  };

  // Handle Forgot Password - Send OTP
  const handleForgotSendOTP = (e) => {
    e.preventDefault();
    if (recoveryType === 'phone') {
      if (phoneNumber.length < 9) {
        setErrorMsg('Vui lòng nhập số điện thoại hợp lệ để nhận mã xác thực.');
        return;
      }
    } else {
      if (!recoveryEmail.trim() || !recoveryEmail.includes('@')) {
        setErrorMsg('Vui lòng nhập địa chỉ email hợp lệ để nhận mã xác thực.');
        return;
      }
    }

    setErrorMsg('');
    setOtpValue('');
    setTimer(45);
    setViewMode('forgot_otp');
  };

  // Handle Forgot Password - Verify OTP
  const handleForgotVerifyOTP = (e) => {
    e.preventDefault();
    if (otpValue.length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số OTP.');
      return;
    }
    setErrorMsg('');
    setViewMode('forgot_reset');
  };

  // Handle Forgot Password - Reset & Login
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }
    setErrorMsg('');
    setIsAuthenticated(true);
    if (currentRole === 'driver') {
      navigate('/driver/home');
    } else {
      navigate('/passenger/home');
    }
  };

  // Quick Demo Login Handler
  const handleQuickDemoLogin = (role, demoPhone) => {
    switchRole(role);
    setIsAuthenticated(true);
    if (role === 'driver') {
      navigate('/driver/home');
    } else {
      navigate('/passenger/home');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#F4F7F5] overflow-y-auto rs-scroll">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-6">
          {viewMode === 'login' ? (
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#0F9D76] flex items-center justify-center shadow-sm">
                <RouteShareMark size={24} color="#FFFFFF" />
              </div>
              <div>
                <span className="text-base font-bold text-[#101B17] tracking-tight block">RouteShare</span>
                <span className="text-[10px] text-[#4B5A54] block">Đi chung xe văn minh TP.HCM</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  if (viewMode === 'forgot_reset') setViewMode('forgot_otp');
                  else if (viewMode === 'forgot_otp') setViewMode('forgot_phone');
                  else setViewMode('login');
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
                onClick={() => {
                  setErrorMsg('');
                  setViewMode('login');
                }}
                className="text-xs font-bold text-[#0F9D76] hover:underline cursor-pointer"
              >
                Đăng nhập
              </button>
            </div>
          )}

          {viewMode === 'login' && (
            <button
              type="button"
              onClick={() => navigate('/auth/register')}
              className="text-xs font-bold text-[#0F9D76] bg-[#DDF3EA] px-3 py-1.5 rounded-xl hover:bg-[#c9ebdE] transition-colors cursor-pointer border border-[#B2E2D0]"
            >
              Đăng ký
            </button>
          )}
        </div>

        {/* VIEW 1: STANDARD LOGIN FORM */}
        {viewMode === 'login' && (
          <div>
            <div className="mb-4">
              <h1 className="text-xl font-bold text-[#101B17]">Đăng nhập tài khoản</h1>
              <p className="text-xs text-[#4B5A54] mt-1">
                Nhập thông tin tài khoản và mật khẩu để tiếp tục hành trình.
              </p>
            </div>

            {/* Login Type Selector (Phone vs Email) */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#E4EAE7]/70 rounded-2xl mb-4">
              <button
                type="button"
                onClick={() => {
                  setLoginType('phone');
                  setErrorMsg('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginType === 'phone'
                    ? 'bg-white text-[#0B7A5C] shadow-xs'
                    : 'text-[#4B5A54] hover:text-[#101B17]'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#0F9D76]" />
                <span>Số điện thoại</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginType('email');
                  setErrorMsg('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginType === 'email'
                    ? 'bg-white text-[#0B7A5C] shadow-xs'
                    : 'text-[#4B5A54] hover:text-[#101B17]'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#0F9D76]" />
                <span>Email</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-[#FFF0F0] border border-[#F7D9D9] text-[#C22B35] text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              {/* Phone or Email Input */}
              {loginType === 'phone' ? (
                <div>
                  <label className="text-[11.5px] font-bold text-[#101B17] block mb-1.5">
                    Số điện thoại
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="Nhập số điện thoại (VD: 0912 345 678)..."
                      className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#E4EAE7] rounded-2xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none font-mono transition-colors shadow-xs"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[11.5px] font-bold text-[#101B17] block mb-1.5">
                    Địa chỉ Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="example@fpt.edu.vn / gmail.com..."
                      className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#E4EAE7] rounded-2xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none transition-colors shadow-xs"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11.5px] font-bold text-[#101B17]">
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      if (loginType === 'email' && email) {
                        setRecoveryType('email');
                        setRecoveryEmail(email);
                      } else {
                        setRecoveryType('phone');
                      }
                      setViewMode('forgot_phone');
                    }}
                    className="text-[11px] text-[#0F9D76] font-semibold hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Nhập mật khẩu của bạn..."
                    className="w-full pl-10 pr-10 py-3.5 bg-white border border-[#E4EAE7] rounded-2xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none transition-colors shadow-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#8A9993] hover:text-[#101B17] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] active:scale-[0.99] text-white font-bold rounded-2xl text-xs transition-all shadow-[0_4px_14px_rgba(15,157,118,0.25)] flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
              >
                <span>Đăng nhập</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Demo One-Click Quick Logins for Capstone Presentations */}
            <div className="mt-6 pt-5 border-t border-[#EEF2F0]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-[#8A9993] uppercase tracking-wider">
                  Đăng nhập nhanh Demo Capstone
                </span>
                <span className="text-[10px] text-[#0F9D76] font-bold bg-[#DDF3EA] px-2 py-0.5 rounded-full">
                  1 chạm
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Passenger Quick Login */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('passenger', '0912 345 678')}
                  className="p-3 bg-white hover:bg-[#F1FAF6] border border-[#E4EAE7] hover:border-[#0F9D76] rounded-2xl text-left transition-all cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold flex items-center justify-center text-[10px]">
                      MA
                    </div>
                    <span className="text-xs font-bold text-[#101B17] group-hover:text-[#0F9D76]">Minh Anh</span>
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-[#4B5A54]">
                    <span>Hành khách</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8A9993] group-hover:text-[#0F9D76]" />
                  </div>
                </button>

                {/* Driver Quick Login */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('driver', '0908 123 456')}
                  className="p-3 bg-white hover:bg-[#F1FAF6] border border-[#E4EAE7] hover:border-[#0F9D76] rounded-2xl text-left transition-all cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-[#0F9D76] text-white font-bold flex items-center justify-center text-[10px]">
                      QH
                    </div>
                    <span className="text-xs font-bold text-[#101B17] group-hover:text-[#0F9D76]">Quốc Huy</span>
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-[#4B5A54]">
                    <span>Tài xế · 4.9⭐</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#8A9993] group-hover:text-[#0F9D76]" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: FORGOT PASSWORD - STEP 1: ENTER PHONE OR EMAIL */}
        {viewMode === 'forgot_phone' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-[#101B17]">Khôi phục mật khẩu</h1>
              <p className="text-xs text-[#4B5A54] mt-1">
                Chọn phương thức nhận mã xác thực OTP để khôi phục tài khoản của bạn.
              </p>
            </div>

            {/* Recovery Method Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#E4EAE7]/70 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setRecoveryType('phone');
                  setErrorMsg('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  recoveryType === 'phone'
                    ? 'bg-white text-[#0B7A5C] shadow-xs'
                    : 'text-[#4B5A54] hover:text-[#101B17]'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#0F9D76]" />
                <span>Số điện thoại</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRecoveryType('email');
                  setErrorMsg('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  recoveryType === 'email'
                    ? 'bg-white text-[#0B7A5C] shadow-xs'
                    : 'text-[#4B5A54] hover:text-[#101B17]'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#0F9D76]" />
                <span>Email</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#FFF0F0] border border-[#F7D9D9] text-[#C22B35] text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleForgotSendOTP} className="space-y-4">
              {recoveryType === 'phone' ? (
                <div>
                  <label className="text-[11.5px] font-bold text-[#101B17] block mb-1.5">
                    Số điện thoại đăng ký
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="Nhập số điện thoại (VD: 0912 345 678)..."
                      className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#E4EAE7] rounded-2xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none font-mono transition-colors shadow-xs"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-[11.5px] font-bold text-[#101B17] block mb-1.5">
                    Địa chỉ Email đăng ký
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => {
                        setRecoveryEmail(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="Nhập email đã đăng ký..."
                      className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#E4EAE7] rounded-2xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none transition-colors shadow-xs"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] active:scale-[0.99] text-white font-bold rounded-2xl text-xs transition-all shadow-[0_4px_14px_rgba(15,157,118,0.25)] flex items-center justify-center space-x-1.5 cursor-pointer mt-1"
              >
                <span>Nhận mã xác thực OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* VIEW 3: FORGOT PASSWORD - STEP 2: VERIFY OTP */}
        {viewMode === 'forgot_otp' && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-[#101B17]">Nhập mã xác thực OTP</h1>
              <p className="text-xs text-[#4B5A54] mt-1">
                {recoveryType === 'phone'
                  ? 'Mã xác thực 6 số đã được gửi qua SMS đến số điện thoại:'
                  : 'Mã xác thực 6 số đã được gửi tới hòm thư Email:'}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DDF3EA] text-[#0B7A5C] rounded-xl text-xs font-bold font-mono">
                {recoveryType === 'phone' ? (
                  <>
                    <Phone className="w-3.5 h-3.5" />
                    <span>{phoneNumber || '0912 345 678'}</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    <span>{recoveryEmail || 'example@gmail.com'}</span>
                  </>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#FFF0F0] border border-[#F7D9D9] text-[#C22B35] text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleForgotVerifyOTP} className="space-y-5">
              <div className="py-1">
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

              <div className="space-y-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] active:scale-[0.99] text-white font-bold rounded-2xl text-xs transition-all shadow-[0_4px_14px_rgba(15,157,118,0.25)] flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác thực & Tiếp tục</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setViewMode('forgot_phone');
                  }}
                  className="w-full py-2.5 text-xs text-[#8A9993] hover:text-[#101B17] font-semibold cursor-pointer"
                >
                  Đổi {recoveryType === 'phone' ? 'số điện thoại' : 'địa chỉ email'} khác
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 4: FORGOT PASSWORD - STEP 3: RESET PASSWORD */}
        {viewMode === 'forgot_reset' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-[#101B17]">Đặt mật khẩu mới</h1>
              <p className="text-xs text-[#4B5A54] mt-1">
                Tạo mật khẩu mới an toàn cho tài khoản RouteShare của bạn.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#FFF0F0] border border-[#F7D9D9] text-[#C22B35] text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="text-[11.5px] font-bold text-[#101B17] block mb-1.5">
                  Mật khẩu mới <span className="text-[#C22B35]">*</span>
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Tối thiểu 6 ký tự..."
                    className="w-full pl-10 pr-10 py-3.5 bg-white border border-[#E4EAE7] rounded-2xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none transition-colors shadow-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 text-[#8A9993] hover:text-[#101B17] cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="text-[11.5px] font-bold text-[#101B17] block mb-1.5">
                  Xác nhận mật khẩu mới <span className="text-[#C22B35]">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#8A9993] absolute left-3.5 pointer-events-none" />
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Nhập lại mật khẩu mới..."
                    className="w-full pl-10 pr-10 py-3.5 bg-white border border-[#E4EAE7] rounded-2xl text-xs font-semibold text-[#101B17] focus:border-[#0F9D76] outline-none transition-colors shadow-xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                    className="absolute right-3.5 text-[#8A9993] hover:text-[#101B17] cursor-pointer"
                  >
                    {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#DDF3EA]/60 border border-[#BDE7D5] flex items-center gap-2 text-xs text-[#0B7A5C]">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#0F9D76]" />
                <span>Mật khẩu mới sẽ được cập nhật ngay lập tức sau khi xác nhận.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] active:scale-[0.99] text-white font-bold rounded-2xl text-xs transition-all shadow-[0_4px_14px_rgba(15,157,118,0.25)] flex items-center justify-center space-x-1.5 cursor-pointer mt-1"
              >
                <span>Cập nhật & Đăng nhập ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Register Prompt & Slogan */}
      {viewMode === 'login' && (
        <div className="pt-6 space-y-3">
          <div className="text-center">
            <p className="text-xs text-[#4B5A54]">
              Chưa có tài khoản RouteShare?{' '}
              <button
                type="button"
                onClick={() => navigate('/auth/register')}
                className="text-[#0F9D76] font-bold hover:underline cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>

          <div className="text-center text-[10.5px] text-[#8A9993]">
            RouteShare Vietnam · Đi chung xe văn minh & an toàn
          </div>
        </div>
      )}
    </div>
  );
};
