import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const StatCard = ({ icon: Icon, label, value, delta, sub, tone = 'primary' }) => (
  <div className="bg-white rounded-2xl border border-border-subtle p-5 flex flex-col gap-3 shadow-card min-w-0">
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] font-semibold text-textSecondary uppercase tracking-wide truncate">{label}</span>
      {Icon && (
        <span
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            tone === 'warning'
              ? 'bg-highlight-light text-highlight-dark'
              : tone === 'danger'
                ? 'bg-danger-light text-danger'
                : 'bg-primary-tint text-primary'
          }`}
        >
          <Icon className="w-[18px] h-[18px]" />
        </span>
      )}
    </div>

    <span className="text-[26px] font-bold font-mono text-textPrimary leading-none truncate">{value}</span>

    {(delta || sub) && (
      <div className="flex items-center gap-1.5 text-xs">
        {delta && (
          <span className={`inline-flex items-center gap-0.5 font-semibold ${delta.positive ? 'text-primary-deep' : 'text-danger'}`}>
            {delta.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {delta.pct}%
          </span>
        )}
        {sub && <span className="text-textTertiary truncate">{sub}</span>}
      </div>
    )}
  </div>
);
