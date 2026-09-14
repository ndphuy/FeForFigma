import React from 'react';
import { X } from 'lucide-react';

export const SidePanel = ({ open, onClose, title, subtitle, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-[#07110D]/50 backdrop-blur-[2px] animate-rs-backdrop-in" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[440px] h-full bg-white shadow-elevated flex flex-col animate-rs-sheet-up"
      >
        <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 border-b border-border-subtle shrink-0">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-textPrimary leading-tight truncate">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-textSecondary">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-9 h-9 rounded-full flex items-center justify-center text-textTertiary hover:bg-canvas shrink-0"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto rs-scroll px-6 py-5 flex flex-col gap-5">{children}</div>

        {footer && <div className="px-6 py-4 border-t border-border-subtle shrink-0 flex items-center justify-end gap-2.5">{footer}</div>}
      </section>
    </div>
  );
};

export const PanelField = ({ label, value, mono = false }) => (
  <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border-subtle last:border-0">
    <span className="text-xs text-textTertiary shrink-0">{label}</span>
    <span className={`text-sm font-semibold text-textPrimary text-right truncate ${mono ? 'font-mono' : ''}`}>{value}</span>
  </div>
);
