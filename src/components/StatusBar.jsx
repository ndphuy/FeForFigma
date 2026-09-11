import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const StatusBar = ({ dark = false, time = "09:41" }) => {
  return (
    <div className={`w-full px-7 pt-3 pb-2 flex items-center justify-between text-xs font-semibold select-none z-50 ${dark ? 'text-white' : 'text-slate-900'}`}>
      <span className="tracking-tight font-medium text-[13px]">{time}</span>
      <div className="flex items-center space-x-1.5">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center">
          <Battery className="w-4 h-4 fill-current" />
        </div>
      </div>
    </div>
  );
};
