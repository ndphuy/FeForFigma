import React, { useMemo, useState } from 'react';
import { Ban, Eye, MapPinned } from 'lucide-react';
import { AdminTopbar } from './components/AdminTopbar';
import { SearchInput, FilterChip } from './components/SearchInput';
import { StatusPill } from './components/StatusPill';
import { SidePanel, PanelField } from './components/SidePanel';
import { ConfirmModal } from './components/ConfirmModal';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_TRIPS } from '../../data/adminMockData';
import { formatVND } from '../../utils/adminFormat';

const STATUS_CONFIG = {
  scheduled: { tone: 'info', label: 'Đã lên lịch' },
  ongoing: { tone: 'warning', label: 'Đang diễn ra' },
  completed: { tone: 'success', label: 'Đã hoàn thành' },
  cancelled: { tone: 'danger', label: 'Đã huỷ' },
};

export const AdminTrips = () => {
  const { logAction } = useAdmin();
  const [trips, setTrips] = useState(ADMIN_TRIPS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const filtered = useMemo(
    () =>
      trips.filter((t) => {
        if (statusFilter !== 'all' && t.status !== statusFilter) return false;
        if (search && !`${t.code} ${t.driverName} ${t.route}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [trips, statusFilter, search]
  );

  const confirmCancel = () => {
    if (!cancelTarget) return;
    logAction('Huỷ chuyến đi (quản trị)', `${cancelTarget.code} · ${cancelTarget.driverName}`, 'danger');
    setTrips((prev) => prev.map((t) => (t.id === cancelTarget.id ? { ...t, status: 'cancelled', cancelReason: 'Huỷ bởi quản trị viên' } : t)));
    setCancelTarget(null);
    setSelected(null);
  };

  return (
    <div>
      <AdminTopbar
        title="Chuyến đi"
        contextLine={`${filtered.length} / ${trips.length} chuyến · Chi phí chia sẻ minh bạch theo km thực đi`}
        onExportCsv={() => logAction('Xuất danh sách chuyến đi (CSV)', `${filtered.length} chuyến`)}
        primaryAction={{ label: 'Xem bản đồ trực tiếp', icon: MapPinned, onClick: () => logAction('Mở bản đồ theo dõi trực tiếp', 'Trang Chuyến đi') }}
        filters={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo mã chuyến, tài xế hoặc tuyến..." />
            <FilterChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>Tất cả</FilterChip>
            <FilterChip active={statusFilter === 'ongoing'} onClick={() => setStatusFilter('ongoing')}>Đang diễn ra</FilterChip>
            <FilterChip active={statusFilter === 'scheduled'} onClick={() => setStatusFilter('scheduled')}>Đã lên lịch</FilterChip>
            <FilterChip active={statusFilter === 'completed'} onClick={() => setStatusFilter('completed')}>Hoàn thành</FilterChip>
            <FilterChip active={statusFilter === 'cancelled'} onClick={() => setStatusFilter('cancelled')}>Đã huỷ</FilterChip>
          </>
        }
      />

      <div className="bg-white rounded-2xl border border-border-subtle shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[960px]">
          <thead>
            <tr className="border-b border-border-subtle text-left">
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Mã chuyến</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Tuyến đường</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Tài xế</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Ngày · giờ</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Ghế</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Trùng tuyến</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Trạng thái</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-border-subtle last:border-0 hover:bg-canvas/60 transition-colors">
                <td className="px-5 py-3.5">
                  <button type="button" onClick={() => setSelected(t)} className="font-mono font-semibold text-primary-deep hover:underline">
                    {t.code}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-textPrimary max-w-[260px] truncate">{t.route}</td>
                <td className="px-5 py-3.5 text-textSecondary truncate">{t.driverName}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-textSecondary">{t.date} · {t.time}</td>
                <td className="px-5 py-3.5 font-mono text-textSecondary">{t.seatsBooked}/{t.seatsTotal}</td>
                <td className="px-5 py-3.5 font-mono text-textSecondary">{t.overlapPct > 0 ? `${t.overlapPct}%` : '—'}</td>
                <td className="px-5 py-3.5"><StatusPill tone={STATUS_CONFIG[t.status].tone}>{STATUS_CONFIG[t.status].label}</StatusPill></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button type="button" onClick={() => setSelected(t)} title="Xem chi tiết" className="w-8 h-8 rounded-lg flex items-center justify-center text-textSecondary hover:bg-canvas">
                      <Eye className="w-4 h-4" />
                    </button>
                    {(t.status === 'scheduled' || t.status === 'ongoing') && (
                      <button type="button" onClick={() => setCancelTarget(t)} title="Huỷ chuyến" className="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:bg-canvas">
                        <Ban className="w-4 h-4" />
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
          selected && (selected.status === 'scheduled' || selected.status === 'ongoing') && (
            <button type="button" onClick={() => setCancelTarget(selected)} className="h-11 px-4 rounded-xl text-sm font-semibold text-white bg-danger hover:bg-danger-hover transition-colors">
              Huỷ chuyến đi
            </button>
          )
        }
      >
        {selected && (
          <>
            <StatusPill tone={STATUS_CONFIG[selected.status].tone}>{STATUS_CONFIG[selected.status].label}</StatusPill>
            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Thông tin chuyến đi</h3>
              <PanelField label="Tài xế" value={selected.driverName} />
              <PanelField label="Ngày · giờ khởi hành" value={`${selected.date} · ${selected.time}`} mono />
              <PanelField label="Quãng đường" value={`${selected.distanceKm} km`} mono />
              <PanelField label="Ghế đã đặt" value={`${selected.seatsBooked} / ${selected.seatsTotal}`} mono />
              <PanelField label="Độ trùng tuyến" value={selected.overlapPct > 0 ? `${selected.overlapPct}%` : 'Chưa có khách'} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Chi phí chia sẻ</h3>
              <PanelField label="Đơn giá / km" value={formatVND(selected.costPerKm)} mono />
              <PanelField label="Tổng chi phí ước tính" value={formatVND(Math.round(selected.costPerKm * selected.distanceKm))} mono />
            </div>
            {selected.cancelReason && (
              <div className="rounded-xl bg-danger-light border border-danger/20 px-3.5 py-2.5 text-xs text-danger leading-relaxed">
                Lý do huỷ: {selected.cancelReason}
              </div>
            )}
          </>
        )}
      </SidePanel>

      <ConfirmModal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
        tone="danger"
        title="Huỷ chuyến đi này?"
        description={`Tất cả hành khách đã đặt chỗ trên chuyến ${cancelTarget?.code} sẽ được thông báo huỷ tự động.`}
        confirmLabel="Huỷ chuyến"
      />
    </div>
  );
};
