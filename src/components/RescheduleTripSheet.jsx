import React, { useState } from 'react';
import { X, CalendarClock, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Driver changes departure date/time; confirmed passengers get asked to accept or cancel (SF-15, SF-16).
export const RescheduleTripSheet = ({ open, onClose, tripId, tripLabel, currentDate, currentTime }) => {
  const { rescheduleTrip } = useApp();
  const [newDate, setNewDate] = useState(currentDate || '');
  const [newTime, setNewTime] = useState(currentTime || '');
  const [reason, setReason] = useState('');
  const [done, setDone] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setNewDate(currentDate || '');
    setNewTime(currentTime || '');
    setReason('');
    setDone(false);
    onClose?.();
  };

  const hasChange = newDate.trim() !== (currentDate || '').trim() || newTime.trim() !== (currentTime || '').trim();

  const handleConfirm = () => {
    if (!newDate.trim() || !newTime.trim() || !hasChange) return;
    rescheduleTrip(tripId, { departureDate: newDate.trim(), departureTime: newTime.trim() }, reason.trim());
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
            <div className="w-16 h-16 rounded-full bg-[#DDF3EA] text-[#0F9D76] flex items-center justify-center animate-rs-pop">
              <CalendarClock className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#101B17]">Đã đổi lịch chuyến đi</h2>
            <p className="text-sm text-[#4B5A54] leading-relaxed max-w-[28ch]">
              Hành khách đã xác nhận chỗ sẽ nhận thông báo và cần đồng ý lịch mới hoặc huỷ đặt chỗ.
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
                <h2 className="text-lg font-bold text-[#101B17]">Đổi lịch chuyến đi</h2>
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

            <div className="rs-scroll flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-3.5">
              <div className="rounded-2xl bg-[#F1FAF6] border border-[#BDE7D5] px-3.5 py-2.5 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#0F9D76] shrink-0 mt-0.5" />
                <span className="text-[11px] text-[#0B7A5C] leading-relaxed">
                  Hành khách đã xác nhận chỗ sẽ được yêu cầu chấp nhận lịch mới hoặc huỷ đặt chỗ trước giờ khởi hành.
                </span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
                <div className="flex justify-between text-xs pb-2 border-b border-[#EEF2F0]">
                  <span className="text-[#8A9993]">Lịch hiện tại:</span>
                  <span className="font-bold text-[#101B17] font-mono">{currentDate} · {currentTime}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">Ngày đi mới</span>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(event) => setNewDate(event.target.value)}
                    className="w-full text-xs font-bold text-[#101B17] bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl p-3 outline-none focus:border-[#0F9D76]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">Giờ xuất phát mới</span>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(event) => setNewTime(event.target.value)}
                    className="w-full text-xs font-bold text-[#101B17] bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl p-3 outline-none focus:border-[#0F9D76]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-[#101B17]">Lý do đổi lịch (tuỳ chọn)</span>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="VD: Dời giờ họp nên xuất phát muộn hơn 30 phút..."
                  className="w-full text-xs text-[#101B17] bg-[#F7FAF9] border border-[#E4EAE7] rounded-2xl p-3 outline-none focus:border-[#0F9D76] resize-none"
                />
              </div>
            </div>

            <div className="flex-none px-5 pt-3 pb-5 border-t border-[#EEF2F0]">
              <button
                type="button"
                disabled={!newDate.trim() || !newTime.trim() || !hasChange}
                onClick={handleConfirm}
                className="w-full h-13 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] disabled:bg-[#DFE7E3] disabled:cursor-not-allowed text-white font-bold text-sm shadow-[0_8px_20px_rgba(15,157,118,0.28)] disabled:shadow-none transition-all cursor-pointer"
              >
                Xác nhận lịch mới
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};
