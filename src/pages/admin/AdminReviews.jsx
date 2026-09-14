import React, { useMemo, useState } from 'react';
import { Star, CheckCircle2, Trash2, Flag } from 'lucide-react';
import { AdminTopbar } from './components/AdminTopbar';
import { SearchInput, FilterChip } from './components/SearchInput';
import { StatusPill } from './components/StatusPill';
import { SidePanel, PanelField } from './components/SidePanel';
import { ConfirmModal } from './components/ConfirmModal';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_REVIEWS } from '../../data/adminMockData';

const STATUS_CONFIG = {
  pending: { tone: 'warning', label: 'Chờ kiểm duyệt' },
  published: { tone: 'success', label: 'Đang hiển thị' },
  reviewed: { tone: 'info', label: 'Đã xem xét' },
  removed: { tone: 'danger', label: 'Đã gỡ bỏ' },
};

const StarRow = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-highlight fill-highlight' : 'text-border'}`} />
    ))}
  </div>
);

export const AdminReviews = () => {
  const { logAction } = useAdmin();
  const [reviews, setReviews] = useState(ADMIN_REVIEWS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const filtered = useMemo(
    () =>
      reviews.filter((r) => {
        if (filter === 'flagged' && !r.flagged) return false;
        if (filter === 'pending' && r.status !== 'pending') return false;
        if (search && !`${r.authorName} ${r.targetName} ${r.comment}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [reviews, filter, search]
  );

  const keepReview = (r) => {
    logAction('Giữ nguyên đánh giá sau kiểm duyệt', `${r.id} · ${r.authorName} → ${r.targetName}`, 'success');
    setReviews((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: 'reviewed' } : x)));
    setSelected(null);
  };

  const confirmRemove = () => {
    if (!removeTarget) return;
    logAction('Gỡ bỏ đánh giá vi phạm', `${removeTarget.id} · ${removeTarget.authorName} → ${removeTarget.targetName}`, 'danger');
    setReviews((prev) => prev.map((x) => (x.id === removeTarget.id ? { ...x, status: 'removed' } : x)));
    setRemoveTarget(null);
    setSelected(null);
  };

  return (
    <div>
      <AdminTopbar
        title="Đánh giá"
        contextLine={`${reviews.filter((r) => r.flagged && r.status === 'pending').length} đánh giá bị gắn cờ đang chờ kiểm duyệt`}
        onExportCsv={() => logAction('Xuất danh sách đánh giá (CSV)', `${filtered.length} đánh giá`)}
        primaryAction={{ label: 'Thiết lập từ khoá cấm', icon: Flag, onClick: () => logAction('Mở cấu hình từ khoá kiểm duyệt', 'Trang Đánh giá') }}
        filters={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo người đánh giá, nội dung..." />
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>Tất cả</FilterChip>
            <FilterChip active={filter === 'flagged'} onClick={() => setFilter('flagged')}>Bị gắn cờ</FilterChip>
            <FilterChip active={filter === 'pending'} onClick={() => setFilter('pending')}>Chờ kiểm duyệt</FilterChip>
          </>
        }
      />

      <div className="bg-white rounded-2xl border border-border-subtle shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[980px]">
          <thead>
            <tr className="border-b border-border-subtle text-left">
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Người đánh giá</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Đối tượng</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Đánh giá</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Nội dung</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Trạng thái</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border-subtle last:border-0 hover:bg-canvas/60 transition-colors">
                <td className="px-5 py-3.5">
                  <button type="button" onClick={() => setSelected(r)} className="text-left">
                    <span className="block font-semibold text-textPrimary truncate">{r.authorName}</span>
                    <span className="block text-xs text-textTertiary">{r.authorRole === 'driver' ? 'Tài xế' : 'Hành khách'}</span>
                  </button>
                </td>
                <td className="px-5 py-3.5 text-textSecondary truncate">{r.targetName}</td>
                <td className="px-5 py-3.5"><StarRow rating={r.rating} /></td>
                <td className="px-5 py-3.5 text-textSecondary max-w-[280px] truncate">{r.comment}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <StatusPill tone={STATUS_CONFIG[r.status].tone}>{STATUS_CONFIG[r.status].label}</StatusPill>
                    {r.flagged && <Flag className="w-3.5 h-3.5 text-danger" />}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    {r.status === 'pending' && (
                      <>
                        <button type="button" onClick={() => keepReview(r)} title="Giữ nguyên" className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-deep hover:bg-canvas">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => setRemoveTarget(r)} title="Gỡ bỏ đánh giá" className="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:bg-canvas">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
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
        title={`${selected?.authorName} → ${selected?.targetName}`}
        subtitle={selected?.tripCode}
        footer={
          selected?.status === 'pending' && (
            <>
              <button type="button" onClick={() => setRemoveTarget(selected)} className="h-11 px-4 rounded-xl text-sm font-semibold text-danger bg-danger-light hover:bg-danger/10 transition-colors">Gỡ bỏ</button>
              <button type="button" onClick={() => keepReview(selected)} className="h-11 px-4 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover transition-colors">Giữ nguyên</button>
            </>
          )
        }
      >
        {selected && (
          <>
            <StarRow rating={selected.rating} />
            <p className="text-sm text-textPrimary leading-relaxed bg-canvas border border-border-subtle rounded-xl p-3.5">{selected.comment}</p>
            <div>
              <PanelField label="Người đánh giá" value={`${selected.authorName} (${selected.authorRole === 'driver' ? 'Tài xế' : 'Hành khách'})`} />
              <PanelField label="Chuyến đi" value={selected.tripCode} mono />
              <PanelField label="Thời gian" value={selected.createdAt} mono />
              <PanelField label="Trạng thái" value={STATUS_CONFIG[selected.status].label} />
            </div>
          </>
        )}
      </SidePanel>

      <ConfirmModal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={confirmRemove}
        tone="danger"
        title="Gỡ bỏ đánh giá này?"
        description="Đánh giá sẽ bị ẩn khỏi hồ sơ công khai. Người dùng sẽ không thấy nội dung này nữa."
        confirmLabel="Gỡ bỏ"
      />
    </div>
  );
};
