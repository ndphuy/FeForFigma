import React from 'react';

export const RouteRail = ({ 
  origin = "Q.7 · Phú Mỹ Hưng", 
  originDetail = "07:15 · đón tận nơi",
  destination = "Q.1 · Bến Thành", 
  destinationDetail = "07:55 · dự kiến · 12,6 km"
}) => {
  return (
    <div className="w-full space-y-3">
      {/* Origin */}
      <div className="flex items-start space-x-3">
        <div className="flex flex-col items-center mt-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0F9D76] ring-4 ring-[#DDF3EA] shrink-0" />
          <div className="w-0.5 h-7 border-l border-dashed border-[#8A9993]/50 my-1" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-medium text-[#8A9993] block">Điểm đón</span>
          <p className="text-sm font-bold text-[#101B17] truncate">{origin}</p>
          {originDetail && (
            <p className="text-xs text-[#4B5A54] mt-0.5">{originDetail}</p>
          )}
        </div>
      </div>

      {/* Destination */}
      <div className="flex items-start space-x-3 -mt-1">
        <div className="flex flex-col items-center mt-1">
          <div className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22] ring-4 ring-[#FDF1E9] shrink-0" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-medium text-[#8A9993] block">Điểm đến</span>
          <p className="text-sm font-bold text-[#101B17] truncate">{destination}</p>
          {destinationDetail && (
            <p className="text-xs text-[#4B5A54] mt-0.5">{destinationDetail}</p>
          )}
        </div>
      </div>
    </div>
  );
};
