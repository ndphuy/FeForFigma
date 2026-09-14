import React, { useMemo, useState } from 'react';
import { XCircle, Eye, ListChecks } from 'lucide-react';
import { AdminTopbar } from './components/AdminTopbar';
import { SearchInput, FilterChip } from './components/SearchInput';
import { StatusPill } from './components/StatusPill';
import { SidePanel, PanelField } from './components/SidePanel';
import { ConfirmModal } from './components/ConfirmModal';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_BOOKINGS } from '../../data/adminMockData';
import { formatVND } from '../../utils/adminFormat';

const STATUS_CONFIG = {
  pending: { tone: 'warning', label: 'Chờ duyệt' },
  confirmed: { tone: 'info', label: 'Đã xác nhận' },
  completed: { tone: 'success', label: 'Hoàn thành' },
  rejected: { tone: 'danger', label: 'Bị từ chối' },
};

export const AdminBookings = () => {
  const { logAction } = useAdmin();
  const [bookings, setBookings] = useState(ADMIN_BOOKINGS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [voidTarget, setVoidTarget] = useState(null);

  const filtered = useMemo(
    () =>
      bookings.filter((b) => {
        if (statusFilter !== 'all' && b.status !== statusFilter) return false;
        if (search && !`${b.code} ${b.passengerName} ${b.driverName}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [bookings, statusFilter, search]
  );

  const confirmVoid = () => {
    if (!voidTarget) return;
    logAction('Huỷ đặt chỗ (quản trị)', `${voidTarget.code} · ${voidTarget.passengerName}`, 'danger');
    setBookings((prev) => prev.map((b) => (b.id === voidTarget.id ? { ...b, status: 'rejected', rejectReason: 'Huỷ bởi quản trị viên' } : b)));
    setVoidTarget(null);
    setSelected(null);
  };

  return (
    <div>
      <AdminTopbar
        title="Đặt chỗ"
        contextLine={`${filtered.length} / ${bookings.length} yêu cầu đặt chỗ trên toàn hệ thống`}
        onExportCsv={() => logAction('Xuất danh sách đặt chỗ (CSV)', `${filtered.length} đặt chỗ`)}
        primaryAction={{ label: 'Đối soát chi phí', icon: ListChecks, onClick: () => logAction('Mở đối soát chi phí đặt chỗ', 'Trang Đặt chỗ') }}
        filters={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo mã, hành khách hoặc tài xế..." />
            <FilterChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>Tất cả</FilterChip>
            <FilterChip active={statusFilter === 'pending'} onClick={() => setStatusFilter('pending')}>Chờ duyệt</FilterChip>
            <FilterChip active={statusFilter === 'confirmed'} onClick={() => setStatusFilter('confirmed')}>Đã xác nhận</FilterChip>
            <FilterChip active={statusFilter === 'completed'} onClick={() => setStatusFilter('completed')}>Hoàn thành</FilterChip>
            <FilterChip active={statusFilter === 'rejected'} onClick={() => setStatusFilter('rejected')}>Bị từ chối</FilterChip>
          </>
        }
      />

      <div className="bg-white rounded-2xl border border-border-subtle shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[920px]">
          <thead>
            <tr className="border-b border-border-subtle text-left">
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Mã đặt chỗ</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Hành khách</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Tài xế</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Tuyến</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Chi phí</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Trạng thái</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-border-subtle last:border-0 hover:bg-canvas/60 transition-colors">
                <td className="px-5 py-3.5">
                  <button type="button" onClick={() => setSelected(b)} className="font-mono font-semibold text-primary-deep hover:underline">
                    {b.code}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-textPrimary truncate">{b.passengerName}</td>
                <td className="px-5 py-3.5 text-textSecondary truncate">{b.driverName}</td>
                <td className="px-5 py-3.5 text-textSecondary max-w-[220px] truncate">{b.route}</td>
                <td className="px-5 py-3.5 font-mono text-textPrimary font-semibold">{formatVND(b.fareVnd)}</td>
                <td className="px-5 py-3.5"><StatusPill tone={STATUS_CONFIG[b.status].tone}>{STATUS_CONFIG[b.status].label}</StatusPill></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button type="button" onClick={() => setSelected(b)} title="Xem chi tiết" className="w-8 h-8 rounded-lg flex items-center justify-center text-textSecondary hover:bg-canvas">
                      <Eye className="w-4 h-4" />
                    </button>
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button type="button" onClick={() => setVoidTarget(b)} title="Huỷ đặt chỗ" className="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:bg-canvas">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SidePanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.code}
        subtitle={selected?.route}
        footer={
          selected && (selected.status === 'pending' || selected.status === 'confirmed') && (
            <button type="button" onClick={() => setVoidTarget(selected)} className="h-11 px-4 rounded-xl text-sm font-semibold text-white bg-danger hover:bg-danger-hover transition-colors">
              Huỷ đặt chỗ
            </button>
          )
        }
      >
        {selected && (
          <>
            <StatusPill tone={STATUS_CONFIG[selected.status].tone}>{STATUS_CONFIG[selected.status].label}</StatusPill>
            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Chi tiết đặt chỗ</h3>
              <PanelField label="Hành khách" value={selected.passengerName} />
              <PanelField label="Tài xế" value={selected.driverName} />
              <PanelField label="Mã chuyến liên kết" value={selected.tripCode} mono />
              <PanelField label="Thời gian tạo" value={selected.createdAt} mono />
              <PanelField label="Chi phí chia sẻ" value={formatVND(selected.fareVnd)} mono />
            </div>
            {selected.rejectReason && (
              <div className="rounded-xl bg-danger-light border border-danger/20 px-3.5 py-2.5 text-xs text-danger leading-relaxed">
                Lý do: {selected.rejectReason}
              </div>
            )}
          </>
        )}
      </SidePanel>

      <ConfirmModal
        open={!!voidTarget}
        onClose={() => setVoidTarget(null)}
        onConfirm={confirmVoid}
        tone="danger"
        title="Huỷ đặt chỗ này?"
        description={`${voidTarget?.passengerName} sẽ được thông báo và hoàn lại chi phí đã tạm giữ (nếu có).`}
        confirmLabel="Huỷ đặt chỗ"
      />
    </div>
  );
};
