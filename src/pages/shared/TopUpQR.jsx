import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  Copy, 
  Check, 
  QrCode, 
  Building2, 
  CheckCircle2, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export const TopUpQR = () => {
  const navigate = useNavigate();
  const { currentRole, passengerWallet, driverWallet } = useApp();

  const [selectedAmount, setSelectedAmount] = useState(100000);
  const [copiedField, setCopiedField] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const amounts = [50000, 100000, 200000, 500000];

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleConfirmPaid = () => {
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/wallet');
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#F4F7F5]">
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-[#E4EAE7] flex items-center justify-center text-[#101B17] shadow-xs hover:bg-[#F1FAF6] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold text-[#101B17]">Nạp tiền qua VietQR / PayOS</h1>
          <div className="w-10" />
        </div>

        {/* 1. Select Amount Chips */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] space-y-3">
          <span className="text-xs font-bold text-[#101B17] block">
            1. Chọn số tiền nạp
          </span>

          <div className="grid grid-cols-2 gap-2">
            {amounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSelectedAmount(amt)}
                className={`py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                  selectedAmount === amt
                    ? 'bg-[#0F9D76] text-white border-[#0F9D76] shadow-xs'
                    : 'bg-white text-[#101B17] border-[#E4EAE7] hover:bg-[#F1FAF6]'
                }`}
              >
                {new Intl.NumberFormat('vi-VN').format(amt)} đ
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E4EAE7] flex items-center justify-between">
            <span className="text-xs text-[#4B5A54]">Số tiền cần thanh toán:</span>
            <span className="text-base font-black text-[#0F9D76]">
              {new Intl.NumberFormat('vi-VN').format(selectedAmount)} đ
            </span>
          </div>
        </div>

        {/* 2. VietQR / PayOS Payment Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] text-center space-y-4">
          <div className="flex items-center justify-center space-x-1.5 text-xs font-bold text-[#0F9D76]">
            <QrCode className="w-4 h-4" />
            <span>2. Quét mã VietQR (PayOS Gateway)</span>
          </div>

          {/* QR Code Container */}
          <div className="bg-[#F4F7F5] p-4 rounded-2xl w-48 h-48 mx-auto flex flex-col items-center justify-center border border-[#E4EAE7] shadow-inner">
            {/* Simulated Clean VietQR Pattern */}
            <div className="grid grid-cols-5 gap-1.5 w-36 h-36 p-1 bg-white rounded-xl shadow-xs">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-xs ${
                    [0, 1, 2, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 23, 24].includes(i)
                      ? 'bg-[#101B17]'
                      : 'bg-[#DDF3EA]'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-[#0B7A5C] font-bold mt-1.5">
              VietQR · NAPAS 247
            </span>
          </div>

          {/* Bank Transfer Info Table */}
          <div className="bg-[#F4F7F5] rounded-2xl p-3.5 space-y-2 text-xs text-left border border-[#E4EAE7]">
            <div className="flex justify-between items-center text-[#4B5A54]">
              <span>Ngân hàng:</span>
              <span className="font-bold text-[#101B17]">MB Bank (Quân Đội)</span>
            </div>

            <div className="flex justify-between items-center text-[#4B5A54]">
              <span>Số tài khoản:</span>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold font-mono text-[#101B17]">090812345688</span>
                <button
                  onClick={() => handleCopy('090812345688', 'stk')}
                  className="p-1 rounded bg-white text-[#0F9D76] border border-[#E4EAE7]"
                >
                  {copiedField === 'stk' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-[#4B5A54]">
              <span>Chủ tài khoản:</span>
              <span className="font-bold text-[#101B17]">CONG TY ROUTESHARE</span>
            </div>

            <div className="flex justify-between items-center text-[#4B5A54] pt-1.5 border-t border-[#E4EAE7]">
              <span>Nội dung CK:</span>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono font-bold text-[#EE7A22]">RS128940</span>
                <button
                  onClick={() => handleCopy('RS128940', 'memo')}
                  className="p-1 rounded bg-white text-[#0F9D76] border border-[#E4EAE7]"
                >
                  {copiedField === 'memo' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation CTA */}
      <div className="pt-3">
        <button
          onClick={handleConfirmPaid}
          disabled={isSuccess}
          className={`w-full py-3.5 font-bold rounded-2xl text-xs transition-all shadow-xs flex items-center justify-center space-x-2 ${
            isSuccess 
              ? 'bg-[#0B7A5C] text-white' 
              : 'bg-[#0F9D76] hover:bg-[#0B7A5C] active:scale-[0.99] text-white'
          }`}
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Nạp tiền thành công! Đang chuyển về ví...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Xác nhận đã chuyển khoản ({new Intl.NumberFormat('vi-VN').format(selectedAmount)} đ)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
