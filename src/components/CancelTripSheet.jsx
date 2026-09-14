import React, { useState } from 'react';
import { X, AlertTriangle, Ban } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CANCEL_REASONS = [
  'Bận việc đột xuất',
  'Xe gặp sự cố',
  'Thời tiết xấu',
  'Không đủ khách trùng tuyến',
  'Lý do khác',
];

// Driver cancels a trip that hasn't started yet (SF-14).
export const CancelTripSheet = ({ open, onClose, tripId, tripLabel }) => {
  const { cancelTrip } = useApp();
  const [reason, setReason] = useState(null);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setReason(null);
    setNote('');
    setDone(false);
    onClose?.();
  };

  const handleConfirm = () => {
    if (!reason) return;
    cancelTrip(tripId, note.trim() ? `${reason} — ${note.trim()}` : reason);
    setDone(true);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-[#07110D]/55 backdrop-blur-[2.5px] animate-rs-backdrop-in"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className="animate-rs-sheet-up flex max-h-[90vh] w-full max-w-[390px] flex-col overflow-hidden rounded-t-[30px] bg-white shadow-[0_-18px_48px_rgba(7,17,13,0.22)]"
      >
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-[#D7E0DC]" />

        {done ? (
          <div className="flex flex-col items-center gap-3.5 px-5 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FCEBEB] text-[#C22B35] flex items-center justify-center animate-rs-pop">
              <Ban className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#101B17]">Đã huỷ chuyến đi</h2>
            <p className="text-sm text-[#4B5A54] leading-relaxed max-w-[28ch]">
              Hành khách đã đặt chỗ sẽ được thông báo ngay và không bị trừ tiền cho chuyến này.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="w-full h-12 mt-2 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between px-5 pb-3 pt-2.5 shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-[#101B17]">Huỷ chuyến đi</h2>
                {tripLabel && <p className="mt-0.5 text-sm text-[#8A9993] truncate">{tripLabel}</p>}
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F7F5] text-[#101B17] hover:bg-[#E4EAE7] shrink-0 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="rs-scroll flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-3">
              <div className="rounded-2xl bg-[#FCEBEB] border border-[#F4C6C6] px-3.5 py-2.5 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#C22B35] shrink-0 mt-0.5" />
                <span className="text-[11px] text-[#8A1F27] leading-relaxed">
                  Hành động này sẽ huỷ toàn bộ chuyến, kể cả các yêu cầu đang chờ hoặc đã được duyệt. Hành khách sẽ được thông báo ngay.
                </span>
              </div>

              <span className="text-xs font-bold text-[#101B17]">Vì sao bạn huỷ chuyến này?</span>
              <div className="flex flex-col gap-2">
                {CANCEL_REASONS.map((r) => {
                  const isSelected = reason === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(r)}
                      className={`h-11 px-3.5 rounded-2xl border-[1.5px] text-left text-xs font-semibold transition-all cursor-pointer ${
                        isSelected ? 'border-[#C22B35] bg-[#FCEBEB] text-[#8A1F27]' : 'border-[#E4EAE7] bg-white text-[#4B5A54] hover:border-[#F4C6C6]'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-xs font-bold text-[#101B17]">Ghi chú thêm (tuỳ chọn)</span>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Giải thích thêm để hành khách hiểu rõ hơn..."
                  className="w-full text-xs text-[#101B17] bg-[#F7FAF9] border border-[#E4EAE7] rounded-2xl p-3 outline-none focus:border-[#0F9D76] resize-none"
                />
              </div>
            </div>

            <div className="flex-none px-5 pt-3 pb-5 border-t border-[#EEF2F0]">
              <button
                type="button"
                disabled={!reason}
                onClick={handleConfirm}
                className="w-full h-13 rounded-2xl bg-[#C22B35] hover:bg-[#A8232C] disabled:bg-[#DFE7E3] disabled:cursor-not-allowed text-white font-bold text-sm shadow-[0_8px_20px_rgba(194,43,53,0.28)] disabled:shadow-none transition-all cursor-pointer"
              >
                Xác nhận huỷ chuyến
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};
