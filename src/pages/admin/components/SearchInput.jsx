import React from 'react';
import { Search } from 'lucide-react';

export const SearchInput = ({ value, onChange, placeholder = 'Tìm kiếm...' }) => (
  <div className="relative">
    <Search className="w-4 h-4 text-textTertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 md:h-11 w-full sm:w-[260px] pl-10 pr-3.5 rounded-xl border border-border bg-white text-sm text-textPrimary placeholder:text-textTertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
    />
  </div>
);

export const FilterChip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-10 md:h-11 px-3.5 rounded-xl text-sm font-semibold border transition-colors whitespace-nowrap ${
      active
        ? 'bg-primary-tint border-primary/30 text-primary-deep'
        : 'bg-white border-border text-textSecondary hover:bg-canvas'
    }`}
  >
    {children}
  </button>
);
