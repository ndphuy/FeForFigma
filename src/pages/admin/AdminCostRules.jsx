import React, { useState } from 'react';
import { ShieldCheck, PlusCircle, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { AdminTopbar } from './components/AdminTopbar';
import { StatusPill } from './components/StatusPill';
import { ConfirmModal } from './components/ConfirmModal';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_COST_RULE_CONFIG, ADMIN_COST_RULE_HISTORY } from '../../data/adminMockData';
import { formatVND, formatDateTime } from '../../utils/adminFormat';

export const AdminCostRules = () => {
  const { logAction } = useAdmin();
  const [regions, setRegions] = useState(ADMIN_COST_RULE_CONFIG.regions);
  const [toggleTarget, setToggleTarget] = useState(null); // { region, next }

  const confirmToggle = () => {
    if (!toggleTarget) return;
    const { region, next } = toggleTarget;
    logAction(
      next === 'active' ? 'Kích hoạt khung chi phí khu vực' : 'Chuyển khung chi phí về bản nháp',
      region.name,
      next === 'active' ? 'success' : 'neutral'
    );
    setRegions((prev) => prev.map((r) => (r.id === region.id ? { ...r, status: next } : r)));
    setToggleTarget(null);
  };

  return (
    <div>
      <AdminTopbar
        title="Quy tắc chi phí"
        contextLine="Khung đơn giá chia sẻ chi phí theo khu vực — không tạo lợi nhuận cho tài xế"
        onExportCsv={() => logAction('Xuất khung quy tắc chi phí (CSV)', `${regions.length} khu vực`)}
        primaryAction={{ label: 'Thêm khu vực mới', icon: PlusCircle, onClick: () => logAction('Mở tạo khu vực chi phí mới', 'Trang Quy tắc chi phí') }}
      />

      {/* Core principle banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-brand-200/70 bg-primary-tint px-5 py-4 mb-6">
        <span className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-[18px] h-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-primary-deep">Nguyên tắc cốt lõi: Tài xế không thu lợi nhuận</p>
          <p className="mt-1 text-sm text-textSecondary leading-relaxed">
            Mỗi khoản đóng góp của hành khách chỉ bù đắp <strong>nhiên liệu, phí BOT và hao mòn xe</strong> theo số km thực đi.
            RouteShare không thu phí nền tảng ({ADMIN_COST_RULE_CONFIG.platformFeePct}%) và giới hạn đơn giá/km trong khung do quản trị viên phê duyệt.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Regions table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-subtle shadow-card overflow-x-auto">
          <div className="px-5 py-4 border-b border-border-subtle">
            <h2 className="text-sm font-bold text-textPrimary">Khung đơn giá theo khu vực</h2>
          </div>
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-border-subtle text-left">
                <th className="px-5 py-3 text-xs font-semibold text-textTertiary uppercase tracking-wide">Khu vực</th>
                <th className="px-5 py-3 text-xs font-semibold text-textTertiary uppercase tracking-wide">Tối thiểu / km</th>
                <th className="px-5 py-3 text-xs font-semibold text-textTertiary uppercase tracking-wide">Tối đa / km</th>
                <th className="px-5 py-3 text-xs font-semibold text-textTertiary uppercase tracking-wide">Trạng thái</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {regions.map((r) => (
                <tr key={r.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-5 py-3.5 font-semibold text-textPrimary">{r.name}</td>
                  <td className="px-5 py-3.5 font-mono text-textSecondary">{formatVND(r.minRate)}</td>
                  <td className="px-5 py-3.5 font-mono text-textSecondary">{formatVND(r.maxRate)}</td>
                  <td className="px-5 py-3.5">
                    <StatusPill tone={r.status === 'active' ? 'success' : 'neutral'}>{r.status === 'active' ? 'Đang áp dụng' : 'Bản nháp'}</StatusPill>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => setToggleTarget({ region: r, next: r.status === 'active' ? 'draft' : 'active' })}
                      title={r.status === 'active' ? 'Chuyển về bản nháp' : 'Kích hoạt khu vực'}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-textSecondary hover:bg-canvas ml-auto"
                    >
                      {r.status === 'active' ? <ToggleRight className="w-5 h-5 text-primary" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl border border-border-subtle shadow-card p-5 md:p-6">
          <h2 className="text-sm font-bold text-textPrimary mb-4">Lịch sử thay đổi</h2>
          <div className="flex flex-col gap-4">
            {ADMIN_COST_RULE_HISTORY.map((h) => (
              <div key={h.id} className="flex flex-col gap-1 pb-4 border-b border-border-subtle last:border-0 last:pb-0">
                <p className="text-sm text-textPrimary leading-snug">{h.change}</p>
                <p className="text-xs text-textTertiary font-mono">{h.actor} · {formatDateTime(h.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global settings */}
      <div className="bg-white rounded-2xl border border-border-subtle shadow-card p-5 md:p-6 mt-5">
        <h2 className="text-sm font-bold text-textPrimary mb-4">Thiết lập toàn hệ thống</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border-subtle p-4">
            <p className="text-xs text-textTertiary mb-1">Tỷ lệ hao mòn xe</p>
            <p className="text-xl font-bold font-mono text-textPrimary">{ADMIN_COST_RULE_CONFIG.wearAndTearPct}%</p>
            <p className="text-xs text-textTertiary mt-1">trên tổng chi phí ước tính</p>
          </div>
          <div className="rounded-xl border border-border-subtle p-4">
            <p className="text-xs text-textTertiary mb-1">Chuyển tiếp phí BOT</p>
            <p className="text-xl font-bold text-textPrimary">{ADMIN_COST_RULE_CONFIG.tollPassThrough ? 'Bật' : 'Tắt'}</p>
            <p className="text-xs text-textTertiary mt-1">Thu đúng số tiền BOT thực tế</p>
          </div>
          <div className="rounded-xl border border-brand-200/70 bg-primary-tint p-4">
            <p className="text-xs text-primary-deep mb-1 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Phí nền tảng</p>
            <p className="text-xl font-bold font-mono text-primary-deep">{ADMIN_COST_RULE_CONFIG.platformFeePct}%</p>
            <p className="text-xs text-primary-deep/80 mt-1">Không thu phí — đúng tinh thần phi lợi nhuận</p>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={confirmToggle}
        tone={toggleTarget?.next === 'draft' ? 'danger' : 'primary'}
        title={toggleTarget?.next === 'active' ? 'Kích hoạt khung chi phí này?' : 'Chuyển về bản nháp?'}
        description={
          toggleTarget?.next === 'active'
            ? `Khung đơn giá cho ${toggleTarget?.region.name} sẽ áp dụng ngay cho các chuyến đi mới.`
            : `Các chuyến đi mới tại ${toggleTarget?.region.name} sẽ tạm dừng cho đến khi kích hoạt lại.`
        }
        confirmLabel={toggleTarget?.next === 'active' ? 'Kích hoạt' : 'Chuyển về nháp'}
      />
    </div>
  );
};
