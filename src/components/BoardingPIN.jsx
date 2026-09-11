import React, { useState } from 'react';
import { Copy, Check, QrCode, ShieldCheck, Key } from 'lucide-react';

export const BoardingPIN = ({ pin = "8204", passengerName = "Trần Thị Mai" }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const digits = pin.split('');

  return (
    <div className="bg-gradient-to-br from-brand-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-brand-700/50 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-center space-x-2 text-brand-200 text-xs font-semibold tracking-wider uppercase mb-2">
        <ShieldCheck className="w-4 h-4 text-brand-300" />
        <span>Mã xác thực lên xe (Boarding PIN)</span>
      </div>

      <p className="text-xs text-slate-300 mb-5 max-w-[260px] mx-auto leading-relaxed">
        Đọc mã này cho tài xế khi bước lên xe để bắt đầu tính cước và kích hoạt bảo hiểm chuyến đi.
      </p>

      {!showQR ? (
        <div className="flex items-center justify-center gap-3 mb-6">
          {digits.map((digit, idx) => (
            <div
              key={idx}
              className="w-14 h-16 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-brand-400/40 flex items-center justify-center text-3xl font-black font-mono text-white shadow-inner shadow-black/40 animate-pulse-ring"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              {digit}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto mb-6 flex flex-col items-center justify-center shadow-lg">
          {/* Simulated QR Code */}
          <div className="grid grid-cols-5 gap-1.5 w-32 h-32 p-1">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-xs ${
                  [0, 1, 2, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 23, 24].includes(i)
                    ? 'bg-slate-900'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-slate-600 font-bold mt-1">PIN: {pin}</span>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
        </button>

        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-xs font-semibold text-white transition-colors shadow-sm"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>{showQR ? 'Xem số PIN' : 'Mã QR'}</span>
        </button>
      </div>
    </div>
  );
};
