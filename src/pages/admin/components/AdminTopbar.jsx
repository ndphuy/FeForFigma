import React from 'react';
import { Download } from 'lucide-react';

export const AdminTopbar = ({ title, contextLine, filters, onExportCsv, primaryAction }) => (
  <div className="flex flex-col gap-4 pb-6 mb-6 border-b border-border-subtle">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-textPrimary tracking-tight">{title}</h1>
        {contextLine && <p className="mt-1 text-sm text-textSecondary">{contextLine}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        {onExportCsv && (
          <button
            type="button"
            onClick={onExportCsv}
            className="h-10 md:h-11 px-4 rounded-xl border border-border bg-white text-sm font-semibold text-textPrimary hover:bg-canvas transition-colors inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất CSV
          </button>
        )}
        {primaryAction && (
          <button
            type="button"
            onClick={primaryAction.onClick}
            className={`h-10 md:h-11 px-4 rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-button transition-colors ${
              primaryAction.tone === 'danger'
                ? 'bg-danger text-white hover:bg-danger-hover shadow-dangerButton'
                : 'bg-primary text-white hover:bg-primary-hover'
            }`}
          >
            {primaryAction.icon && <primaryAction.icon className="w-4 h-4" />}
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>

    {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
  </div>
);
