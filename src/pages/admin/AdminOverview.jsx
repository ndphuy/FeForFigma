import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Car, Route, Coins, Percent, XCircle, ShieldAlert, IdCard, Star, UserPlus, ChevronRight, FileText,
} from 'lucide-react';
import { AdminTopbar } from './components/AdminTopbar';
import { StatCard } from './components/StatCard';
import { WeeklyBarChart } from './components/WeeklyBarChart';
import { StatusBreakdown } from './components/StatusBreakdown';
import { useAdmin } from '../../context/AdminContext';
import {
  ADMIN_OVERVIEW_STATS, ADMIN_WEEKLY_TRIP_VOLUME, ADMIN_TRIP_STATUS_BREAKDOWN, ADMIN_RECENT_ACTIVITY,
} from '../../data/adminMockData';
import { formatNumber, formatVND } from '../../utils/adminFormat';

const ACTIVITY_ICON = {
  safety: { icon: ShieldAlert, tone: 'text-danger bg-danger-light' },
  kyc: { icon: IdCard, tone: 'text-highlight-dark bg-highlight-light' },
  trip: { icon: Route, tone: 'text-primary-deep bg-primary-soft' },
  user: { icon: UserPlus, tone: 'text-primary-deep bg-primary-soft' },
  report: { icon: Star, tone: 'text-highlight-dark bg-highlight-light' },
  vehicle: { icon: Car, tone: 'text-highlight-dark bg-highlight-light' },
};

export const AdminOverview = () => {
  const { logAction } = useAdmin();
  const s = ADMIN_OVERVIEW_STATS;

  const handleExport = () => logAction('Xuất báo cáo tổng quan (CSV)', 'Toàn bộ chỉ số Tổng quan');

  return (
    <div>
      <AdminTopbar
        title="Tổng quan"
        contextLine="Chỉ số hoạt động nền tảng · Cập nhật 14/09/2026, 08:30"
        onExportCsv={handleExport}
        primaryAction={{ label: 'Xem nhật ký hệ thống', icon: FileText, onClick: () => logAction('Mở nhật ký hệ thống', 'Trang Tổng quan') }}
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Tổng người dùng" value={formatNumber(s.totalUsers)} delta={{ positive: true, pct: s.totalUsersDeltaPct }} />
        <StatCard icon={Car} label="Tài xế hoạt động" value={formatNumber(s.activeDrivers)} delta={{ positive: true, pct: s.activeDriversDeltaPct }} />
        <StatCard icon={Route} label="Chuyến đi hôm nay" value={formatNumber(s.tripsToday)} sub={`${formatNumber(s.completedTripsToday)} đã xong`} />
        <StatCard icon={Coins} label="Chi phí đã chia sẻ" value={formatVND(s.costSharedToday)} delta={{ positive: true, pct: s.costSharedDeltaPct }} tone="primary" />
        <StatCard icon={Percent} label="Độ trùng tuyến TB" value={`${s.avgOverlapPercent}%`} sub="toàn hệ thống" />
        <StatCard icon={XCircle} label="Tỷ lệ huỷ chuyến" value={`${s.cancelRatePct}%`} sub="7 ngày qua" tone={s.cancelRatePct > 5 ? 'warning' : 'primary'} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-subtle p-5 md:p-6 shadow-card">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-bold text-textPrimary">Lưu lượng chuyến đi 7 ngày qua</h2>
            <span className="text-xs text-textTertiary">Số chuyến / ngày</span>
          </div>
          <WeeklyBarChart data={ADMIN_WEEKLY_TRIP_VOLUME} />
        </div>

        <div className="bg-white rounded-2xl border border-border-subtle p-5 md:p-6 shadow-card">
          <h2 className="text-sm font-bold text-textPrimary mb-4">Trạng thái chuyến đi hôm nay</h2>
          <StatusBreakdown data={ADMIN_TRIP_STATUS_BREAKDOWN} />
        </div>
      </div>

      {/* Activity + action needed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-subtle p-5 md:p-6 shadow-card">
          <h2 className="text-sm font-bold text-textPrimary mb-4">Hoạt động gần đây</h2>
          <div className="flex flex-col divide-y divide-border-subtle">
            {ADMIN_RECENT_ACTIVITY.map((a) => {
              const cfg = ACTIVITY_ICON[a.type] || ACTIVITY_ICON.trip;
              const Icon = cfg.icon;
              return (
                <div key={a.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.tone}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-sm text-textPrimary flex-1 min-w-0 truncate">{a.text}</span>
                  <span className="text-xs text-textTertiary shrink-0 font-mono">{a.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border-subtle p-5 md:p-6 shadow-card flex flex-col gap-2.5">
          <h2 className="text-sm font-bold text-textPrimary mb-1.5">Cần xử lý</h2>

          <Link to="/admin/safety-reports" className="flex items-center justify-between gap-2 rounded-xl border border-border-subtle p-3 hover:bg-canvas transition-colors">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-textPrimary">Báo cáo an toàn mở</p>
              <p className="text-xs text-textTertiary">Cần xác minh & phản hồi</p>
            </div>
            <span className="shrink-0 min-w-[26px] h-[26px] px-1.5 rounded-full bg-highlight-light text-highlight-dark text-xs font-bold flex items-center justify-center">
              {s.openSafetyReports}
            </span>
          </Link>

          <Link to="/admin/drivers" className="flex items-center justify-between gap-2 rounded-xl border border-border-subtle p-3 hover:bg-canvas transition-colors">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-textPrimary">Hồ sơ KYC chờ duyệt</p>
              <p className="text-xs text-textTertiary">CCCD & GPLX tài xế mới</p>
            </div>
            <span className="shrink-0 min-w-[26px] h-[26px] px-1.5 rounded-full bg-highlight-light text-highlight-dark text-xs font-bold flex items-center justify-center">
              {s.pendingKyc}
            </span>
          </Link>

          <Link to="/admin/reviews" className="flex items-center justify-between gap-2 rounded-xl border border-border-subtle p-3 hover:bg-canvas transition-colors">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-textPrimary">Đánh giá bị gắn cờ</p>
              <p className="text-xs text-textTertiary">Cần kiểm duyệt nội dung</p>
            </div>
            <ChevronRight className="w-4 h-4 text-textTertiary shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
};
