import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Wallet, TrendingUp, Clock3 } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Chờ tài xế duyệt', bg: 'bg-[#F4F7F5]', fg: 'text-[#4B5A54]' },
  confirmed: { label: 'Đã xác nhận · chưa hoàn tất', bg: 'bg-[#DDF1F4]', fg: 'text-[#0A6E7A]' },
  pending_reschedule: { label: 'Chờ xác nhận lịch mới', bg: 'bg-[#FFF4E9]', fg: 'text-[#B45812]' },
  completed: { label: 'Đã hoàn tất', bg: 'bg-[#DDF3EA]', fg: 'text-[#0B7A5C]' },
  rejected: { label: 'Bị từ chối', bg: 'bg-[#FFF0F0]', fg: 'text-[#C22B35]' },
  cancelled: { label: 'Đã huỷ', bg: 'bg-[#FFF0F0]', fg: 'text-[#C22B35]' },
};

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n || 0);

export const CostHistory = () => {
  const navigate = useNavigate();
  const { currentRole, currentUser, trips, bookings } = useApp();
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'upcoming'

  const entries = useMemo(() => {
    if (currentRole === 'driver') {
      const myTripIds = new Set(trips.filter((t) => t.driverId === currentUser.id).map((t) => t.id));
      return bookings
        .filter((b) => myTripIds.has(b.tripId) && ['confirmed', 'completed', 'pending_reschedule'].includes(b.status))
        .map((b) => ({
          id: b.id,
          title: `Đóng góp từ ${b.passengerName}`,
          route: b.routeText,
          date: b.departureDate,
          amount: b.fareVnd,
          status: b.status,
          code: b.bookingCode,
        }));
    }
    return bookings
      .filter((b) => b.passengerId === currentUser.id)
      .map((b) => ({
        id: b.id,
        title: `Đóng góp cho ${b.driverName}`,
        route: b.routeText,
        date: b.departureDate,
        amount: b.fareVnd,
        status: b.status,
        code: b.bookingCode,
      }));
  }, [currentRole, currentUser.id, trips, bookings]);

  const totalCompleted = entries.filter((e) => e.status === 'completed').reduce((sum, e) => sum + e.amount, 0);
  const totalUpcoming = entries
    .filter((e) => e.status === 'confirmed' || e.status === 'pending_reschedule')
    .reduce((sum, e) => sum + e.amount, 0);

  const filteredEntries = entries.filter((e) => {
    if (filter === 'completed') return e.status === 'completed';
    if (filter === 'upcoming') return e.status === 'confirmed' || e.status === 'pending_reschedule' || e.status === 'pending';
    return true;
  });

  return (
    <div className="w-full flex flex-col bg-[#F4F7F5] pb-6">
      {/* Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-11 h-11 border border-[#EEF2F0] rounded-2xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors"
        >
          ‹
        </button>
        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-[17px] font-bold text-[#101B17]">Lịch sử chi phí</span>
          <span className="text-xs text-[#8A9993]">
            {currentRole === 'driver' ? 'Chi phí đã nhận từ hành khách' : 'Chi phí bạn đã chia sẻ'}
          </span>
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-3.5">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white rounded-2xl p-3.5 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] flex flex-col gap-1.5">
            <span className="w-8 h-8 rounded-xl bg-[#DDF3EA] text-[#0F9D76] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">
              {currentRole === 'driver' ? 'Đã nhận' : 'Đã đóng góp'}
            </span>
            <span className="text-sm font-bold font-mono text-[#101B17]">{fmt(totalCompleted)} ₫</span>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] flex flex-col gap-1.5">
            <span className="w-8 h-8 rounded-xl bg-[#DDF1F4] text-[#0A6E7A] flex items-center justify-center">
              <Clock3 className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">Đang chờ hoàn tất</span>
            <span className="text-sm font-bold font-mono text-[#101B17]">{fmt(totalUpcoming)} ₫</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`flex-1 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-[#0F9D76] text-white shadow-xs' : 'bg-white text-[#4B5A54] border border-[#E4EAE7] hover:bg-[#F7FAF9]'
            }`}
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`flex-1 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'completed' ? 'bg-[#0F9D76] text-white shadow-xs' : 'bg-white text-[#4B5A54] border border-[#E4EAE7] hover:bg-[#F7FAF9]'
            }`}
          >
            Đã hoàn tất
          </button>
          <button
            type="button"
            onClick={() => setFilter('upcoming')}
            className={`flex-1 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'upcoming' ? 'bg-[#0F9D76] text-white shadow-xs' : 'bg-white text-[#4B5A54] border border-[#E4EAE7] hover:bg-[#F7FAF9]'
            }`}
          >
            Sắp tới
          </button>
        </div>

        {/* Entries List */}
        <div className="flex flex-col gap-2.5">
          {filteredEntries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E4EAE7] p-8 text-center text-xs text-[#8A9993]">
              Chưa có khoản chi phí nào trong mục này.
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const cfg = STATUS_CONFIG[entry.status] || STATUS_CONFIG.pending;
              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] flex items-center gap-3"
                >
                  <span className="w-10 h-10 rounded-2xl bg-[#F1FAF6] text-[#0F9D76] flex items-center justify-center shrink-0">
                    <Wallet className="w-4.5 h-4.5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-[#101B17] truncate">{entry.title}</span>
                    <span className="block text-[11px] text-[#8A9993] truncate">{entry.route}</span>
                    <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                      {entry.date} · {entry.code}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-bold font-mono text-[#101B17]">{fmt(entry.amount)} ₫</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.fg}`}>{cfg.label}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
