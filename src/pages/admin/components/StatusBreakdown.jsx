import React from 'react';
import { formatNumber } from '../../../utils/adminFormat';

// Status is a reserved palette (good/info/critical), never generic categorical hues.
const TONE_HEX = { success: '#0F9D76', info: '#0A6E7A', danger: '#C22B35', warning: '#EE7A22', neutral: '#8A9993' };

export const StatusBreakdown = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full h-3 rounded-full overflow-hidden gap-0.5 bg-[#EEF2F0]">
        {data.map((d) => (
          <div
            key={d.key}
            style={{ width: `${(d.count / total) * 100}%`, backgroundColor: TONE_HEX[d.tone] }}
            title={`${d.label}: ${formatNumber(d.count)} (${Math.round((d.count / total) * 100)}%)`}
            className="h-full first:rounded-l-full last:rounded-r-full"
          />
        ))}
      </div>

      <div className="flex flex-col gap-2.5">
        {data.map((d) => (
          <div key={d.key} className="flex items-center justify-between text-sm gap-3">
            <span className="flex items-center gap-2 text-textSecondary min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: TONE_HEX[d.tone] }} />
              <span className="truncate">{d.label}</span>
            </span>
            <span className="font-mono font-semibold text-textPrimary shrink-0">
              {formatNumber(d.count)} <span className="text-textTertiary font-normal">({Math.round((d.count / total) * 100)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
