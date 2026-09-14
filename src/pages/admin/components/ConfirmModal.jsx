import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Xác nhận',
  tone = 'danger',
}) => {
  if (!open) return null;
  const isDanger = tone === 'danger';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#07110D]/55 backdrop-blur-[2px] px-4 animate-rs-backdrop-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] bg-white rounded-2xl shadow-elevated border border-border-subtle p-6 flex flex-col gap-4"
      >
        <div className="flex items-start gap-3">
          <span
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isDanger ? 'bg-danger-light text-danger' : 'bg-highlight-light text-highlight-dark'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1 pt-1">
            <h3 className="text-base font-bold text-textPrimary leading-tight">{title}</h3>
            <p className="mt-1.5 text-sm text-textSecondary leading-relaxed">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 rounded-full flex items-center justify-center text-textTertiary hover:bg-canvas shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-xl bg-canvas border border-border-subtle px-3.5 py-2.5 text-[11px] text-textTertiary leading-relaxed">
          Hành động này sẽ được ghi lại kèm người thực hiện và thời gian trong nhật ký hệ thống.
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-4 rounded-xl text-sm font-semibold text-textPrimary bg-white border border-border hover:bg-canvas transition-colors"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-11 px-4 rounded-xl text-sm font-semibold text-white transition-colors ${
              isDanger ? 'bg-danger hover:bg-danger-hover' : 'bg-primary hover:bg-primary-hover'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
