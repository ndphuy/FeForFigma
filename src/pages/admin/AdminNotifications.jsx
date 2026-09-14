import React, { useMemo, useState } from 'react';
import { CheckCheck, ShieldAlert, IdCard, CheckCircle2, Settings2 } from 'lucide-react';
import { AdminTopbar } from './components/AdminTopbar';
import { FilterChip } from './components/SearchInput';
import { useAdmin } from '../../context/AdminContext';
import { ADMIN_NOTIFICATIONS } from '../../data/adminMockData';

const TONE_ICON = {
  danger: { icon: ShieldAlert, cls: 'bg-danger-light text-danger' },
  warning: { icon: IdCard, cls: 'bg-highlight-light text-highlight-dark' },
  success: { icon: CheckCircle2, cls: 'bg-primary-soft text-primary-deep' },
  neutral: { icon: Settings2, cls: 'bg-[#EEF2F0] text-textSecondary' },
};

export const AdminNotifications = () => {
  const { logAction } = useAdmin();
  const [items, setItems] = useState(ADMIN_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => items.filter((n) => (filter === 'unread' ? n.unread : true)), [items, filter]);
  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () => {
    logAction('Đánh dấu đã đọc tất cả thông báo', `${unreadCount} thông báo`, 'neutral');
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markRead = (n) => {
    if (!n.unread) return;
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
  };

  return (
    <div>
      <AdminTopbar
        title="Thông báo"
        contextLine={`${unreadCount} thông báo chưa đọc trong hộp thư vận hành`}
        primaryAction={{ label: 'Đánh dấu đã đọc tất cả', icon: CheckCheck, onClick: markAllRead }}
        filters={
          <>
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>Tất cả</FilterChip>
            <FilterChip active={filter === 'unread'} onClick={() => setFilter('unread')}>Chưa đọc ({unreadCount})</FilterChip>
          </>
        }
      />

      <div className="bg-white rounded-2xl border border-border-subtle shadow-card divide-y divide-border-subtle">
        {filtered.map((n) => {
          const cfg = TONE_ICON[n.tone] || TONE_ICON.neutral;
          const Icon = cfg.icon;
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => markRead(n)}
              className="w-full flex items-start gap-3.5 px-5 py-4 text-left hover:bg-canvas/60 transition-colors"
            >
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.cls}`}>
                <Icon className="w-4 h-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm truncate ${n.unread ? 'font-bold text-textPrimary' : 'font-semibold text-textSecondary'}`}>{n.title}</p>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-highlight shrink-0" />}
                </div>
                <p className="text-sm text-textSecondary mt-0.5 leading-snug">{n.body}</p>
              </div>
              <span className="text-xs text-textTertiary font-mono shrink-0 pt-0.5">{n.time}</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-textTertiary">Không có thông báo nào.</div>
        )}
      </div>
    </div>
  );
};
