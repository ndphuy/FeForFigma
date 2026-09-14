import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { formatDateTime } from '../../../utils/adminFormat';

export const AuditToast = ({ entry, onDismiss }) => {
  useEffect(() => {
    if (!entry) return undefined;
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [entry, onDismiss]);

  if (!entry) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[300] max-w-sm animate-rs-pop">
      <div className="bg-[#0F1F1A] text-white rounded-2xl shadow-elevated border border-white/10 px-4 py-3.5 flex items-start gap-3">
        <span className="w-8 h-8 rounded-lg bg-[#0F9D76]/20 text-[#7BCCAF] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-tight">{entry.action}</p>
          <p className="mt-0.5 text-xs text-white/60 truncate">{entry.target}</p>
          <p className="mt-1 text-[11px] text-white/40 font-mono">
            {entry.actor} · {formatDateTime(entry.timestamp)}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Đóng thông báo"
          className="ml-auto text-white/40 hover:text-white text-xs shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
