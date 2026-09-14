import React, { useMemo, useState } from 'react';
import { Eye, ShieldCheck, Search as SearchIcon, Siren } from 'lucide-react';
import { AdminTopbar } from './components/AdminTopbar';
import { SearchInput, FilterChip } from './components/SearchInput';
import { StatusPill } from './components/StatusPill';
import { SidePanel, PanelField } from './components/SidePanel';
import { ConfirmModal } from './components/ConfirmModal';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_SAFETY_REPORTS } from '../../data/adminMockData';

const SEVERITY_CONFIG = {
  low: { tone: 'neutral', label: 'Thấp' },
  medium: { tone: 'warning', label: 'Trung bình' },
  high: { tone: 'warning', label: 'Cao' },
  critical: { tone: 'danger', label: 'Nghiêm trọng' },
};

const STATUS_CONFIG = {
  open: { tone: 'warning', label: 'Mới mở' },
  investigating: { tone: 'info', label: 'Đang xác minh' },
  resolved: { tone: 'success', label: 'Đã xử lý' },
};

export const AdminSafetyReports = () => {
  const { logAction } = useAdmin();
  const [reports, setReports] = useState(ADMIN_SAFETY_REPORTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');
  const [selected, setSelected] = useState(null);
  const [resolveTarget, setResolveTarget] = useState(null);

  const filtered = useMemo(
    () =>
      reports.filter((r) => {
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (search && !`${r.id} ${r.reporterName} ${r.targetName} ${r.category}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [reports, statusFilter, search]
  );

  const startInvestigating = (r) => {
    logAction('Bắt đầu xác minh báo cáo an toàn', r.id, 'neutral');
    setReports((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: 'investigating' } : x)));
    setSelected((prev) => (prev?.id === r.id ? { ...prev, status: 'investigating' } : prev));
  };

  const confirmResolve = () => {
    if (!resolveTarget) return;
    logAction('Đóng báo cáo an toàn', `${resolveTarget.id} · ${resolveTarget.targetName}`, 'success');
    setReports((prev) =>
      prev.map((x) =>
        x.id === resolveTarget.id ? { ...x, status: 'resolved', resolvedAt: 'Vừa xong', resolutionNote: 'Đã xác minh và xử lý theo quy trình an toàn.' } : x
      )
    );
    setResolveTarget(null);
    setSelected(null);
  };

  return (
    <div>
      <AdminTopbar
        title="Báo cáo an toàn"
        contextLine={`${reports.filter((r) => r.status !== 'resolved').length} báo cáo cần xử lý · Ưu tiên theo mức độ nghiêm trọng`}
        onExportCsv={() => logAction('Xuất danh sách báo cáo an toàn (CSV)', `${filtered.length} báo cáo`)}
        primaryAction={{ label: 'Đường dây nóng an toàn', icon: Siren, onClick: () => logAction('Mở kênh liên hệ đường dây nóng an toàn', 'Trang Báo cáo an toàn') }}
        filters={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo mã báo cáo, người liên quan..." />
            <FilterChip active={statusFilter === 'open'} onClick={() => setStatusFilter('open')}>Mới mở</FilterChip>
            <FilterChip active={statusFilter === 'investigating'} onClick={() => setStatusFilter('investigating')}>Đang xác minh</FilterChip>
            <FilterChip active={statusFilter === 'resolved'} onClick={() => setStatusFilter('resolved')}>Đã xử lý</FilterChip>
            <FilterChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>Tất cả</FilterChip>
          </>
        }
      />

      <div className="bg-white rounded-2xl border border-border-subtle shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[960px]">
          <thead>
            <tr className="border-b border-border-subtle text-left">
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Mã báo cáo</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Danh mục</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Đối tượng bị báo cáo</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Mức độ</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Thời gian</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Trạng thái</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border-subtle last:border-0 hover:bg-canvas/60 transition-colors">
                <td className="px-5 py-3.5">
                  <button type="button" onClick={() => setSelected(r)} className="font-mono font-semibold text-primary-deep hover:underline">
                    {r.id}
                  </button>
                </td>
                <td className="px-5 py-3.5 text-textPrimary max-w-[200px] truncate">{r.category}</td>
                <td className="px-5 py-3.5 text-textSecondary truncate">{r.targetName}</td>
                <td className="px-5 py-3.5"><StatusPill tone={SEVERITY_CONFIG[r.severity].tone}>{SEVERITY_CONFIG[r.severity].label}</StatusPill></td>
                <td className="px-5 py-3.5 font-mono text-xs text-textSecondary">{r.createdAt}</td>
                <td className="px-5 py-3.5"><StatusPill tone={STATUS_CONFIG[r.status].tone}>{STATUS_CONFIG[r.status].label}</StatusPill></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    {r.status === 'open' && (
                      <button type="button" onClick={() => startInvestigating(r)} title="Bắt đầu xác minh" className="w-8 h-8 rounded-lg flex items-center justify-center text-info hover:bg-canvas">
                        <SearchIcon className="w-4 h-4" />
                      </button>
                    )}
                    {r.status !== 'resolved' && (
                      <button type="button" onClick={() => setResolveTarget(r)} title="Đóng báo cáo" className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-deep hover:bg-canvas">
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button type="button" onClick={() => setSelected(r)} title="Xem chi tiết" className="w-8 h-8 rounded-lg flex items-center justify-center text-textSecondary hover:bg-canvas">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-textTertiary">Không có báo cáo phù hợp bộ lọc.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SidePanel
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.id}
        subtitle={selected?.category}
        footer={
          selected &&
          selected.status !== 'resolved' && (
            <>
              {selected.status === 'open' && (
                <button type="button" onClick={() => startInvestigating(selected)} className="h-11 px-4 rounded-xl text-sm font-semibold text-info bg-info-soft hover:bg-info/10 transition-colors">
                  Bắt đầu xác minh
                </button>
              )}
              <button type="button" onClick={() => setResolveTarget(selected)} className="h-11 px-4 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors">
                Đóng báo cáo
              </button>
            </>
          )
        }
      >
        {selected && (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusPill tone={SEVERITY_CONFIG[selected.severity].tone}>Mức độ: {SEVERITY_CONFIG[selected.severity].label}</StatusPill>
              <StatusPill tone={STATUS_CONFIG[selected.status].tone}>{STATUS_CONFIG[selected.status].label}</StatusPill>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Diễn biến</h3>
              <p className="text-sm text-textPrimary leading-relaxed">{selected.description}</p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Chi tiết</h3>
              <PanelField label="Chuyến đi liên quan" value={selected.tripCode} mono />
              <PanelField label="Người báo cáo" value={`${selected.reporterName} (${selected.reporterRole === 'driver' ? 'Tài xế' : 'Hành khách'})`} />
              <PanelField label="Đối tượng bị báo cáo" value={selected.targetName} />
              <PanelField label="Thời gian ghi nhận" value={selected.createdAt} mono />
              {selected.resolvedAt && <PanelField label="Thời gian xử lý" value={selected.resolvedAt} mono />}
            </div>

            {selected.resolutionNote && (
              <div className="rounded-xl bg-primary-tint border border-primary/20 px-3.5 py-2.5 text-xs text-primary-deep leading-relaxed">
                Kết luận xử lý: {selected.resolutionNote}
              </div>
            )}
          </>
        )}
      </SidePanel>

      <ConfirmModal
        open={!!resolveTarget}
        onClose={() => setResolveTarget(null)}
        onConfirm={confirmResolve}
        tone="primary"
        title="Đóng báo cáo này?"
        description={`Báo cáo ${resolveTarget?.id} sẽ được đánh dấu đã xử lý và lưu vào lịch sử an toàn.`}
        confirmLabel="Đóng báo cáo"
      />
    </div>
  );
};
