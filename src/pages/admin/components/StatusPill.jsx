import React from 'react';

const TONE_CLASSES = {
  success: 'bg-primary-soft text-primary-deep border-brand-200/70',
  warning: 'bg-highlight-light text-highlight-dark border-accent-border',
  danger: 'bg-danger-light text-danger border-danger/20',
  info: 'bg-info-soft text-info border-info/20',
  neutral: 'bg-[#EEF2F0] text-textSecondary border-border-subtle',
};

export const StatusPill = ({ tone = 'neutral', children, dot = true }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${TONE_CLASSES[tone] || TONE_CLASSES.neutral}`}
  >
    {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
    {children}
  </span>
);
