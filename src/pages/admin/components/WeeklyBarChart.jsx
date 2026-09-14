import React from 'react';
import { formatNumber } from '../../../utils/adminFormat';

// Single-series magnitude by fixed weekday order — one hue, thin bars, rounded
// data-ends, baseline-anchored. Peak value is direct-labeled; others reveal on hover.
export const WeeklyBarChart = ({ data, valueKey = 'trips', labelKey = 'day' }) => {
  const max = Math.max(...data.map((d) => d[valueKey]));
  const peakIndex = data.findIndex((d) => d[valueKey] === max);

  return (
    <div className="flex items-end gap-3 h-[140px] px-1">
      {data.map((d, i) => {
        const heightPct = Math.max(6, Math.round((d[valueKey] / max) * 100));
        const isPeak = i === peakIndex;
        return (
          <div key={d[labelKey]} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full h-[104px] flex items-end justify-center relative">
              <span
                className={`absolute -top-5 text-[11px] font-mono font-semibold text-primary-deep transition-opacity ${
                  isPeak ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {formatNumber(d[valueKey])}
              </span>
              <div
                className={`w-full max-w-[28px] rounded-t-[4px] transition-colors ${isPeak ? 'bg-primary' : 'bg-brand-200 group-hover:bg-primary'}`}
                style={{ height: `${heightPct}%` }}
                title={`${d[labelKey]}: ${formatNumber(d[valueKey])} chuyến`}
              />
            </div>
            <span className="text-[11px] font-medium text-textTertiary">{d[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
};
