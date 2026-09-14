import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Trash2, Car, Bike, PlusCircle } from 'lucide-react';
import { AdminTopbar } from './components/AdminTopbar';
import { SearchInput, FilterChip } from './components/SearchInput';
import { StatusPill } from './components/StatusPill';
import { SidePanel, PanelField } from './components/SidePanel';
import { ConfirmModal } from './components/ConfirmModal';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_VEHICLES } from '../../data/adminMockData';
import { maskPlate } from '../../utils/adminFormat';

const STATUS_CONFIG = {
  verified: { tone: 'success', label: 'Đã xác thực' },
  pending_review: { tone: 'warning', label: 'Chờ duyệt' },
  rejected: { tone: 'danger', label: 'Bị từ chối' },
};

export const AdminVehicles = () => {
  const { logAction } = useAdmin();
  const [vehicles, setVehicles] = useState(ADMIN_VEHICLES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const filtered = useMemo(
    () =>
      vehicles.filter((v) => {
        if (statusFilter !== 'all' && v.status !== statusFilter) return false;
        if (search && !`${v.model} ${v.ownerName} ${v.plate}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [vehicles, statusFilter, search]
  );

  const approve = (v) => {
    logAction('Duyệt đăng ký phương tiện', `${v.model} · ${maskPlate(v.plate)}`, 'success');
    setVehicles((prev) => prev.map((x) => (x.id === v.id ? { ...x, status: 'verified' } : x)));
    setSelected(null);
  };

  const confirmReject = () => {
    if (!rejectTarget) return;
    logAction('Từ chối đăng ký phương tiện', `${rejectTarget.model} · ${maskPlate(rejectTarget.plate)}`, 'danger');
    setVehicles((prev) => prev.map((x) => (x.id === rejectTarget.id ? { ...x, status: 'rejected' } : x)));
    setRejectTarget(null);
    setSelected(null);
  };

  const confirmRemove = () => {
    if (!removeTarget) return;
    logAction('Gỡ phương tiện khỏi hệ thống', `${removeTarget.model} · ${maskPlate(removeTarget.plate)} (${removeTarget.id})`, 'danger');
    setVehicles((prev) => prev.filter((x) => x.id !== removeTarget.id));
    setRemoveTarget(null);
    setSelected(null);
  };

  return (
    <div>
      <AdminTopbar
        title="Phương tiện"
        contextLine={`${filtered.length} / ${vehicles.length} phương tiện đăng ký · Biển số được ẩn một phần`}
        onExportCsv={() => logAction('Xuất danh sách phương tiện (CSV)', `${filtered.length} phương tiện`)}
        primaryAction={{ label: 'Thêm quy định kiểm định', icon: PlusCircle, onClick: () => logAction('Mở cấu hình kiểm định phương tiện', 'Trang Phương tiện') }}
        filters={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo xe, chủ xe hoặc biển số..." />
            <FilterChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>Tất cả</FilterChip>
            <FilterChip active={statusFilter === 'pending_review'} onClick={() => setStatusFilter('pending_review')}>Chờ duyệt</FilterChip>
            <FilterChip active={statusFilter === 'verified'} onClick={() => setStatusFilter('verified')}>Đã xác thực</FilterChip>
            <FilterChip active={statusFilter === 'rejected'} onClick={() => setStatusFilter('rejected')}>Bị từ chối</FilterChip>
          </>
        }
      />

      <div className="bg-white rounded-2xl border border-border-subtle shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[880px]">
          <thead>
            <tr className="border-b border-border-subtle text-left">
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Phương tiện</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Biển số</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Chủ xe</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Hạn đăng kiểm</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Trạng thái</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => {
              const VIcon = v.type === 'bike' ? Bike : Car;
              return (
                <tr key={v.id} className="border-b border-border-subtle last:border-0 hover:bg-canvas/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <button type="button" onClick={() => setSelected(v)} className="flex items-center gap-3 text-left">
                      <span className="w-9 h-9 rounded-lg bg-primary-tint text-primary flex items-center justify-center shrink-0">
                        <VIcon className="w-4 h-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-textPrimary truncate">{v.model}</span>
                        <span className="block text-xs text-textTertiary truncate">{v.seats} chỗ · {v.id}</span>
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-textSecondary">{maskPlate(v.plate)}</td>
                  <td className="px-5 py-3.5 text-textSecondary truncate">{v.ownerName}</td>
                  <td className="px-5 py-3.5 font-mono text-xs">
                    <span className={v.expiringSoon ? 'text-highlight-dark font-semibold' : 'text-textSecondary'}>{v.inspectionExpiry}</span>
                  </td>
                  <td className="px-5 py-3.5"><StatusPill tone={STATUS_CONFIG[v.status].tone}>{STATUS_CONFIG[v.status].label}</StatusPill></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      {v.status === 'pending_review' && (
                        <>
                          <button type="button" onClick={() => approve(v)} title="Duyệt phương tiện" className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-deep hover:bg-canvas">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => setRejectTarget(v)} title="Từ chối" className="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:bg-canvas">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {v.status === 'verified' && (
                        <button type="button" onClick={() => setRemoveTarget(v)} title="Gỡ phương tiện" className="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:bg-canvas">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SidePanel open={!!selected} onClose={() => setSelected(null)} title={selected?.model} subtitle={selected ? maskPlate(selected.plate) : ''}>
        {selected && (
          <>
            <StatusPill tone={STATUS_CONFIG[selected.status].tone}>{STATUS_CONFIG[selected.status].label}</StatusPill>
            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Thông tin phương tiện</h3>
              <PanelField label="Chủ xe" value={selected.ownerName} />
              <PanelField label="Loại xe" value={selected.type === 'bike' ? 'Xe máy' : 'Ô tô'} />
              <PanelField label="Số chỗ" value={selected.seats} />
              <PanelField label="Biển số" value={maskPlate(selected.plate)} mono />
              <PanelField label="Hạn đăng kiểm" value={selected.inspectionExpiry} mono />
              <PanelField label="Ngày đăng ký" value={selected.registeredAt} mono />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Giấy tờ xe</h3>
              <div className="aspect-[16/9] rounded-xl bg-canvas border border-border-subtle flex items-center justify-center text-[11px] text-textTertiary">Ảnh cà vẹt / đăng ký xe</div>
            </div>
          </>
        )}
      </SidePanel>

      <ConfirmModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={confirmReject}
        tone="danger"
        title="Từ chối phương tiện này?"
        description={`${rejectTarget?.model} · ${rejectTarget ? maskPlate(rejectTarget.plate) : ''} sẽ không thể dùng để mở chuyến đi.`}
        confirmLabel="Từ chối"
      />

      <ConfirmModal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={confirmRemove}
        tone="danger"
        title="Gỡ phương tiện khỏi hệ thống?"
        description={`Thao tác không thể hoàn tác. ${removeTarget?.model} · ${removeTarget ? maskPlate(removeTarget.plate) : ''} sẽ bị xoá khỏi hồ sơ của ${removeTarget?.ownerName}.`}
        confirmLabel="Gỡ phương tiện"
      />
    </div>
  );
};
