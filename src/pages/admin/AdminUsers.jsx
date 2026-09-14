import React, { useMemo, useState } from 'react';
import { Lock, Unlock, Eye, BadgeCheck } from 'lucide-react';
import { AdminTopbar } from './components/AdminTopbar';
import { SearchInput, FilterChip } from './components/SearchInput';
import { StatusPill } from './components/StatusPill';
import { SidePanel, PanelField } from './components/SidePanel';
import { ConfirmModal } from './components/ConfirmModal';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_USERS } from '../../data/adminMockData';
import { maskPhone } from '../../utils/adminFormat';

const STATUS_CONFIG = {
  active: { tone: 'success', label: 'Đang hoạt động' },
  pending: { tone: 'warning', label: 'Chờ xác thực' },
  suspended: { tone: 'danger', label: 'Đã khoá' },
};

const ROLE_LABEL = { passenger: 'Hành khách', driver: 'Tài xế' };

export const AdminUsers = () => {
  const { logAction } = useAdmin();
  const [users, setUsers] = useState(ADMIN_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { user, next }

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;
      if (search && !`${u.name} ${u.id}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [users, roleFilter, statusFilter, search]);

  const handleToggleStatus = (user) => {
    const next = user.status === 'suspended' ? 'active' : 'suspended';
    setConfirmAction({ user, next });
  };

  const confirmToggle = () => {
    if (!confirmAction) return;
    const { user, next } = confirmAction;
    logAction(
      next === 'suspended' ? 'Khóa tài khoản người dùng' : 'Mở khóa tài khoản người dùng',
      `${user.name} (${user.id})`,
      next === 'suspended' ? 'danger' : 'success'
    );
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: next } : u)));
    setConfirmAction(null);
    setSelectedUser(null);
  };

  return (
    <div>
      <AdminTopbar
        title="Người dùng"
        contextLine={`${filtered.length} / ${users.length} tài khoản · Hành khách & Tài xế`}
        onExportCsv={() => logAction('Xuất danh sách người dùng (CSV)', `${filtered.length} tài khoản`)}
        primaryAction={{ label: 'Mời quản trị viên', icon: BadgeCheck, onClick: () => logAction('Gửi lời mời quản trị viên mới', 'Trang Người dùng') }}
        filters={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Tìm theo tên hoặc mã người dùng..." />
            <FilterChip active={roleFilter === 'all'} onClick={() => setRoleFilter('all')}>Tất cả vai trò</FilterChip>
            <FilterChip active={roleFilter === 'passenger'} onClick={() => setRoleFilter('passenger')}>Hành khách</FilterChip>
            <FilterChip active={roleFilter === 'driver'} onClick={() => setRoleFilter('driver')}>Tài xế</FilterChip>
            <FilterChip active={statusFilter === 'pending'} onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}>Chờ xác thực</FilterChip>
            <FilterChip active={statusFilter === 'suspended'} onClick={() => setStatusFilter(statusFilter === 'suspended' ? 'all' : 'suspended')}>Đã khoá</FilterChip>
          </>
        }
      />

      <div className="bg-white rounded-2xl border border-border-subtle shadow-card overflow-x-auto">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="border-b border-border-subtle text-left">
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Người dùng</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Vai trò</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Ngày tham gia</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Chuyến đi</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Điểm tin cậy</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-textTertiary uppercase tracking-wide">Trạng thái</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border-subtle last:border-0 hover:bg-canvas/60 transition-colors">
                <td className="px-5 py-3.5">
                  <button type="button" onClick={() => setSelectedUser(u)} className="flex items-center gap-3 text-left">
                    <span className="w-9 h-9 rounded-full bg-primary-soft text-primary-deep flex items-center justify-center text-xs font-bold shrink-0">
                      {u.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-textPrimary truncate">{u.name}</span>
                      <span className="block text-xs text-textTertiary font-mono truncate">{u.id}</span>
                    </span>
                  </button>
                </td>
                <td className="px-5 py-3.5 text-textSecondary">{ROLE_LABEL[u.role]}</td>
                <td className="px-5 py-3.5 text-textSecondary font-mono text-xs">{u.joinedAt}</td>
                <td className="px-5 py-3.5 text-textSecondary font-mono">{u.trips}</td>
                <td className="px-5 py-3.5 font-mono font-semibold text-textPrimary">{u.trustScore ? u.trustScore.toFixed(1) : '—'}</td>
                <td className="px-5 py-3.5">
                  <StatusPill tone={STATUS_CONFIG[u.status].tone}>{STATUS_CONFIG[u.status].label}</StatusPill>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedUser(u)}
                      title="Xem chi tiết"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-textSecondary hover:bg-canvas"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u)}
                      title={u.status === 'suspended' ? 'Mở khoá' : 'Khoá tài khoản'}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center hover:bg-canvas ${u.status === 'suspended' ? 'text-primary-deep' : 'text-danger'}`}
                    >
                      {u.status === 'suspended' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-textTertiary">Không tìm thấy người dùng phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SidePanel
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser?.name}
        subtitle={selectedUser ? `${ROLE_LABEL[selectedUser.role]} · ${selectedUser.id}` : ''}
        footer={
          selectedUser && (
            <button
              type="button"
              onClick={() => handleToggleStatus(selectedUser)}
              className={`h-11 px-4 rounded-xl text-sm font-semibold text-white transition-colors ${selectedUser.status === 'suspended' ? 'bg-primary hover:bg-primary-hover' : 'bg-danger hover:bg-danger-hover'}`}
            >
              {selectedUser.status === 'suspended' ? 'Mở khoá tài khoản' : 'Khoá tài khoản'}
            </button>
          )
        }
      >
        {selectedUser && (
          <>
            <div className="flex items-center gap-3">
              <span className="w-14 h-14 rounded-full bg-primary-soft text-primary-deep flex items-center justify-center text-lg font-bold shrink-0">
                {selectedUser.initials}
              </span>
              <div className="min-w-0">
                <StatusPill tone={STATUS_CONFIG[selectedUser.status].tone}>{STATUS_CONFIG[selectedUser.status].label}</StatusPill>
                {selectedUser.verified && (
                  <span className="ml-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary-deep">
                    <BadgeCheck className="w-3.5 h-3.5" /> Đã xác thực
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Thông tin tài khoản</h3>
              <PanelField label="Mã người dùng" value={selectedUser.id} mono />
              <PanelField label="Vai trò" value={ROLE_LABEL[selectedUser.role]} />
              <PanelField label="Ngày tham gia" value={selectedUser.joinedAt} />
              <PanelField label="Liên hệ" value={maskPhone(selectedUser.phone)} mono />
              <PanelField label="Email" value={selectedUser.email} />
            </div>

            <div>
              <h3 className="text-xs font-semibold text-textTertiary uppercase tracking-wide mb-1">Hoạt động</h3>
              <PanelField label="Tổng chuyến đi" value={selectedUser.trips} />
              <PanelField label="Điểm tin cậy" value={selectedUser.trustScore ? `${selectedUser.trustScore.toFixed(1)} / 5.0` : 'Chưa có dữ liệu'} />
            </div>

            <div className="rounded-xl bg-canvas border border-border-subtle px-3.5 py-2.5 text-[11px] text-textTertiary leading-relaxed">
              Số điện thoại và địa chỉ đầy đủ không được hiển thị để bảo vệ quyền riêng tư người dùng.
            </div>
          </>
        )}
      </SidePanel>

      <ConfirmModal
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={confirmToggle}
        tone={confirmAction?.next === 'suspended' ? 'danger' : 'primary'}
        title={confirmAction?.next === 'suspended' ? 'Khoá tài khoản này?' : 'Mở khoá tài khoản này?'}
        description={
          confirmAction?.next === 'suspended'
            ? `${confirmAction?.user.name} sẽ không thể đăng nhập, đặt chỗ hoặc mở chuyến đi mới cho đến khi được mở khoá.`
            : `${confirmAction?.user.name} sẽ có thể sử dụng lại đầy đủ tính năng của RouteShare.`
        }
        confirmLabel={confirmAction?.next === 'suspended' ? 'Khoá tài khoản' : 'Mở khoá'}
      />
    </div>
  );
};
