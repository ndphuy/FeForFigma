import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, CheckCircle, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SOSModal = () => {
  const { isSOSModalOpen, setIsSOSModalOpen, isSOSActive, setIsSOSActive } = useApp();
  const [countdown, setCountdown] = useState(5);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    let timer;
    if (isSOSModalOpen && !isSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && !isSent) {
      setIsSent(true);
      setIsSOSActive(true);
    }
    return () => clearTimeout(timer);
  }, [isSOSModalOpen, countdown, isSent]);

  if (!isSOSModalOpen) return null;

  const handleCancel = () => {
    setIsSOSModalOpen(false);
    setCountdown(5);
    setIsSent(false);
  };

  const handleImmediateSend = () => {
    setIsSent(true);
    setIsSOSActive(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[340px] bg-white rounded-3xl p-6 text-center shadow-2xl border border-red-200 relative overflow-hidden">
        {/* Red pulse top bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-pulse" />
        
        <button 
          onClick={handleCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSent ? (
          <div>
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <ShieldAlert className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">CẢNH BÁO KHẨN CẤP (SOS)</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Hệ thống sẽ tự động gửi tọa độ trực tiếp, lộ trình và thông tin xe đến người thân khẩn cấp và tổng đài hỗ trợ 24/7.
            </p>

            {/* Countdown Badge */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-600 text-white font-mono text-2xl font-black mb-5 shadow-lg shadow-red-200 animate-pulse">
              {countdown}s
            </div>

            <div className="space-y-2">
              <button
                onClick={handleImmediateSend}
                className="w-full py-3 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-red-200 flex items-center justify-center space-x-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gửi tín hiệu ngay lập tức</span>
              </button>

              <button
                onClick={handleCancel}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all"
              >
                Hủy bỏ (Nhấn nhầm)
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">ĐÃ KÍCH HOẠT SOS!</h3>
            <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 mb-4 text-left leading-relaxed">
              📍 Vị trí GPS & mã định danh chuyến đi đang được truyền trực tiếp đến tổng đài an toàn RouteShare và 2 số điện thoại khẩn cấp đã đăng ký.
            </p>

            <a
              href="tel:113"
              className="block w-full py-3 bg-red-600 text-white font-bold rounded-xl text-sm mb-2 shadow-md shadow-red-200"
            >
              📞 Gọi Cảnh sát 113
            </a>

            <button
              onClick={handleCancel}
              className="w-full py-2 text-slate-500 text-xs font-semibold hover:text-slate-700"
            >
              Đóng cửa sổ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
