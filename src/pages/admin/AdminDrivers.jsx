import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Eye, FileCheck } from 'lucide-react';
import { AdminTopbar } from './components/AdminTopbar';
import { SearchInput, FilterChip } from './components/SearchInput';
import { StatusPill } from './components/StatusPill';
import { SidePanel, PanelField } from './components/SidePanel';
import { ConfirmModal } from './components/ConfirmModal';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_DRIVERS } from '../../data/adminMockData';
import { formatVND, maskPlate } from '../../utils/adminFormat';

const KYC_CONFIG = {
  verified: { tone: 'success', label: 'Đã xác thực' },
  pending_review: { tone: 'warning', label: 'Chờ duyệt' },
  rejected: { tone: 'danger', label: 'Bị từ chối' },
};

const STATUS_CONFIG = {
  active: { tone: 'success', label: 'Đang hoạt động' },
  pending: { tone: 'warning', label: 'Chờ kích hoạt' },
  suspended: { tone: 'danger', label: 'Tạm ngưng' },
};

export const AdminDrivers = () => {
  const { logAction } = useAdmin();
  const [drivers, setDrivers] = useState(ADMIN_DRIVERS);
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const filtered = useMemo(
    () =>
      drivers.filter((d) => {
        if (kycFilter !== 'all' && d.kycStatus !== kycFilter) return false;
        if (search && !`${d.name} ${d.id}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [drivers, kycFilter, search]
  );

  const approveDriver = (driver) => {
    logAction('Duyệt xác thực GPLX & CCCD', `${driver.name} (${driver.id})`, 'success');
    setDrivers((prev) => prev.map((d) => (d.id === driver.id ? { ...d, kycStatus: 'verified', status: 'active' } : d)));
    setSelected(null);
  };

  const rejectDriver = () => {
    if (!rejectTarget) return;
    logAction('Từ chối hồ sơ xác thực tài xế', `${rejectTarget.name} (${rejectTarget.id})`, 'danger');
    setDrivers((prev) =>
      prev.map((d) => (d.id === rejectTarget.id ? { ...d, kycStatus: 'rejected', status: 'suspended' } : d))
    );
    setRejectTarget(null);
    setSelected(null);
  };

  return (
    <div>
      <AdminTopbar
        title="Tài xế"
        contextLine={`${filtered.length} / ${drivers.length} tài xế · ${drivers.filter((d) => d.kycStatus === 'pending_review').length} hồ sơ chờ duyệt`}
        onExportCsv={() => logAction('Xuất danh sách tài xế (CSV)', `${filtered.length} tài xế`)}
        primaryAction={{ label: 'Duyệt hàng loạt', icon: FileCheck, onClick: () => logAction('Mở duyệt KYC hàng loạt', 'Trang Tài xế') }}
        filters={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo tên hoặc mã tài xế..." />
            <FilterChip active={kycFilter === 'all'} onClick={() => setKycFilter('all')}>Tất cả</FilterChip>
            <FilterChip active={kycFilter === 'pending_review'} onClick={() => setKycFilter('pending_review')}>Chờ duyệt</FilterChip>
            <FilterChip active={kycFilter === 'verified'} onClick={() => setKycFilter('verified')}>Đã xác thực</FilterChip>
            <FilterChip active={kycFilter === 'rejected'} onClick={() => setKycFilter('rejected')}>Bị từ chối</FilterChip>
          </>
        }
      />

      <div className="bg-white rounded-2xl border border-border-subtle shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-border-subtle text-left">
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Tài xế</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Phương tiện</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">KYC</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Điểm tin cậy</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Chi phí đã nhận</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Trạng thái</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => {
              const [vehicleModel, vehiclePlate] = d.vehicle.split('·').map((s) => s.trim());
              return (
              <tr key={d.id} className="border-b border-border-subtle last:border-0 hover:bg-canvas/60 transition-colors">
                <td className="px-5 py-3.5">
                  <button type="button" onClick={() => setSelected(d)} className="flex items-center gap-3 text-left">
                    <span className="w-9 h-9 rounded-full bg-primary-soft text-primary-deep flex items-center justify-center text-xs font-bold shrink-0">
                      {d.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-textPrimary truncate">{d.name}</span>
                      <span className="block text-xs text-textTertiary font-mono truncate">{d.id}</span>
                    </span>
                  </button>
                </td>
                <td className="px-5 py-3.5 text-textSecondary text-xs">{vehicleModel} · <span className="font-mono">{maskPlate(vehiclePlate)}</span></td>
                <td className="px-5 py-3.5"><StatusPill tone={KYC_CONFIG[d.kycStatus].tone}>{KYC_CONFIG[d.kycStatus].label}</StatusPill></td>
                <td className="px-5 py-3.5 font-mono font-semibold text-textPrimary">{d.trustScore ? d.trustScore.toFixed(1) : '—'}</td>
                <td className="px-5 py-3.5 font-mono text-textSecondary">{formatVND(d.costReceived)}</td>
                <td className="px-5 py-3.5"><StatusPill tone={STATUS_CONFIG[d.status].tone}>{STATUS_CONFIG[d.status].label}</StatusPill></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    {d.kycStatus === 'pending_review' ? (
                      <>
                        <button type="button" onClick={() => approveDriver(d)} title="Duyệt hồ sơ" className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-deep hover:bg-canvas">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => setRejectTarget(d)} title="Từ chối hồ sơ" className="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:bg-canvas">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setSelected(d)} title="Xem chi tiết" className="w-8 h-8 rounded-lg flex items-center justify-center text-textSecondary hover:bg-canvas">
                        <Eye className="w-4 h-4" />
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

      <SidePanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        subtitle={selected?.id}
        footer={
          selected?.kycStatus === 'pending_review' && (
            <>
              <button type="button" onClick={() => setRejectTarget(selected)} className="h-11 px-4 rounded-xl text-sm font-semibold text-danger bg-danger-light hover:bg-danger/10 transition-colors">Từ chối</button>
              <button type="button" onClick={() => approveDriver(selected)} className="h-11 px-4 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors">Duyệt hồ sơ</button>
            </>
          )
        }
      >
        {selected && (
          <>
            <div className="flex items-center gap-3">
              <span className="w-14 h-14 rounded-full bg-primary-soft text-primary-deep flex items-center justify-center text-lg font-bold shrink-0">{selected.initials}</span>
              <div className="flex flex-col gap-1.5">
                <StatusPill tone={KYC_CONFIG[selected.kycStatus].tone}>{KYC_CONFIG[selected.kycStatus].label}</StatusPill>
                {selected.rejectReason && <span className="text-xs text-danger">{selected.rejectReason}</span>}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Phương tiện đăng ký</h3>
              <PanelField label="Xe" value={selected.vehicle.split('·')[0]?.trim()} />
              <PanelField label="Biển số" value={maskPlate(selected.vehicle.split('·')[1]?.trim())} mono />
            </div>

            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Hồ sơ xác thực</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="aspect-[4/3] rounded-xl bg-canvas border border-border-subtle flex items-center justify-center text-[11px] text-textTertiary">CCCD mặt trước</div>
                <div className="aspect-[4/3] rounded-xl bg-canvas border border-border-subtle flex items-center justify-center text-[11px] text-textTertiary">GPLX hạng B2</div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Hoạt động</h3>
              <PanelField label="Chuyến đã hoàn thành" value={selected.tripsCompleted} />
              <PanelField label="Chi phí đã nhận" value={formatVND(selected.costReceived)} mono />
              <PanelField label="Ngày tham gia" value={selected.joinedAt} />
            </div>
          </>
        )}
      </SidePanel>

      <ConfirmModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={rejectDriver}
        tone="danger"
        title="Từ chối hồ sơ xác thực?"
        description={`${rejectTarget?.name} sẽ không thể mở chuyến đi cho đến khi nộp lại hồ sơ hợp lệ.`}
        confirmLabel="Từ chối hồ sơ"
      />
    </div>
  );
};
