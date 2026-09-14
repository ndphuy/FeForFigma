import React, { useState } from 'react';
import { UserPlus, Trash2, ShieldCheck } from 'lucide-react';
import { AdminTopbar } from './components/AdminTopbar';
import { StatusPill } from './components/StatusPill';
import { ConfirmModal } from './components/ConfirmModal';
import { useAdmin } from '../../context/AdminContext';
import { formatDateTime } from '../../utils/adminFormat';

const TEAM_SEED = [
  { id: 'adm_01', name: 'Trần Công Tâm', initials: 'TT', role: 'Quản trị viên cấp cao', email: 'trancongtam613@gmail.com', status: 'active' },
  { id: 'adm_02', name: 'Ngọc Bích', initials: 'NB', role: 'Vận hành & An toàn', email: 'ngocbich.rs@gmail.com', status: 'active' },
  { id: 'adm_03', name: 'Minh Quân', initials: 'MQ', role: 'Kiểm duyệt nội dung', email: 'minhquan.rs@gmail.com', status: 'active' },
  { id: 'adm_04', name: 'Hải Đăng', initials: 'HĐ', role: 'Tài chính & Đối soát', email: 'haidang.rs@gmail.com', status: 'pending' },
];

const Switch = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`w-11 h-6 rounded-full shrink-0 relative transition-colors ${checked ? 'bg-primary' : 'bg-[#DFE7E3]'}`}
  >
    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
  </button>
);

export const AdminSettings = () => {
  const { logAction, auditLog } = useAdmin();
  const [team, setTeam] = useState(TEAM_SEED);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [toggles, setToggles] = useState({
    newDriverSignups: true,
    maintenanceMode: false,
    sosHotline: true,
  });

  const handleToggle = (key, label) => {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      logAction(`${next[key] ? 'Bật' : 'Tắt'} ${label}`, 'Cấu hình hệ thống', key === 'maintenanceMode' ? 'danger' : 'neutral');
      return next;
    });
  };

  const confirmRemove = () => {
    if (!removeTarget) return;
    logAction('Thu hồi quyền quản trị viên', `${removeTarget.name} (${removeTarget.id})`, 'danger');
    setTeam((prev) => prev.filter((m) => m.id !== removeTarget.id));
    setRemoveTarget(null);
  };

  return (
    <div>
      <AdminTopbar
        title="Cài đặt hệ thống"
        contextLine="Đội ngũ quản trị, cấu hình vận hành & nhật ký hoạt động"
        primaryAction={{ label: 'Mời quản trị viên', icon: UserPlus, onClick: () => logAction('Gửi lời mời quản trị viên mới', 'Trang Cài đặt hệ thống') }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Team */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-subtle shadow-card overflow-x-auto">
          <div className="px-5 py-4 border-b border-border-subtle">
            <h2 className="text-sm font-bold text-textPrimary">Đội ngũ quản trị</h2>
          </div>
          <table className="w-full text-sm min-w-[520px]">
            <tbody>
              {team.map((m) => (
                <tr key={m.id} className="border-b border-border-subtle last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-primary-soft text-primary-deep flex items-center justify-center text-xs font-bold shrink-0">{m.initials}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-textPrimary truncate">{m.name}</p>
                        <p className="text-xs text-textTertiary truncate">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-textSecondary">{m.role}</td>
                  <td className="px-5 py-3.5"><StatusPill tone={m.status === 'active' ? 'success' : 'warning'}>{m.status === 'active' ? 'Đang hoạt động' : 'Chờ chấp nhận'}</StatusPill></td>
                  <td className="px-5 py-3.5">
                    <button
                      type="button"
                      onClick={() => setRemoveTarget(m)}
                      title="Thu hồi quyền"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-danger hover:bg-canvas ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* System toggles */}
        <div className="bg-white rounded-2xl border border-border-subtle shadow-card p-5 md:p-6 flex flex-col gap-5">
          <h2 className="text-sm font-bold text-textPrimary">Cấu hình vận hành</h2>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-textPrimary">Cho phép tài xế đăng ký mới</p>
              <p className="text-xs text-textTertiary mt-0.5">Mở/đóng luồng đăng ký tài xế</p>
            </div>
            <Switch checked={toggles.newDriverSignups} onChange={() => handleToggle('newDriverSignups', 'đăng ký tài xế mới')} />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-textPrimary">Đường dây nóng an toàn 24/7</p>
              <p className="text-xs text-textTertiary mt-0.5">Kích hoạt nút SOS trong ứng dụng</p>
            </div>
            <Switch checked={toggles.sosHotline} onChange={() => handleToggle('sosHotline', 'đường dây nóng an toàn')} />
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border-subtle">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-danger">Chế độ bảo trì</p>
              <p className="text-xs text-textTertiary mt-0.5">Tạm ngưng toàn bộ ứng dụng người dùng</p>
            </div>
            <Switch checked={toggles.maintenanceMode} onChange={() => handleToggle('maintenanceMode', 'chế độ bảo trì')} />
          </div>
        </div>
      </div>

      {/* Audit log */}
      <div className="bg-white rounded-2xl border border-border-subtle shadow-card p-5 md:p-6 mt-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-textPrimary">Nhật ký hoạt động</h2>
          <span className="text-xs text-textTertiary">Mọi hành động không thể hoàn tác đều được ghi lại kèm người thực hiện & thời gian</span>
        </div>
        <div className="flex flex-col divide-y divide-border-subtle max-h-[420px] overflow-y-auto rs-scroll">
          {auditLog.map((log) => (
            <div key={log.id} className="flex items-center gap-3 py-3 first:pt-0">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  log.tone === 'danger' ? 'bg-danger' : log.tone === 'success' ? 'bg-primary' : 'bg-textTertiary'
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-textPrimary truncate"><span className="font-semibold">{log.action}</span> · {log.target}</p>
              </div>
              <span className="text-xs text-textTertiary font-mono shrink-0">{log.actor} · {formatDateTime(log.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={confirmRemove}
        tone="danger"
        title="Thu hồi quyền quản trị viên?"
        description={`${removeTarget?.name} sẽ mất toàn bộ quyền truy cập vào Admin Console ngay lập tức.`}
        confirmLabel="Thu hồi quyền"
      />
    </div>
  );
};
