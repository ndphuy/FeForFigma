import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { SEED_AUDIT_LOG } from '../data/adminMockData';

const AdminContext = createContext(null);

const ADMIN_USER = {
  name: 'Trần Công Tâm',
  initials: 'TT',
  role: 'Quản trị viên cấp cao',
  email: 'trancongtam613@gmail.com',
};

export const AdminProvider = ({ children }) => {
  const [auditLog, setAuditLog] = useState(SEED_AUDIT_LOG);
  const [toast, setToast] = useState(null);

  const logAction = useCallback((action, target, tone = 'neutral') => {
    const entry = {
      id: `log_${Date.now()}_${Math.round(Math.random() * 1000)}`,
      actor: ADMIN_USER.name,
      action,
      target,
      timestamp: new Date(),
      tone,
    };
    setAuditLog((prev) => [entry, ...prev]);
    setToast(entry);
    return entry;
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const value = useMemo(
    () => ({ adminUser: ADMIN_USER, auditLog, logAction, toast, dismissToast }),
    [auditLog, toast, dismissToast, logAction]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
