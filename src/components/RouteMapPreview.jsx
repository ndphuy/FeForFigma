import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from 'lucide-react';

// Same fixed-curve simulated map style used across the app (PickupPicker, LiveTracking,
// RoutePreview). Not a real map SDK — just a decorative canvas that spreads `points`
// evenly along one SVG path so any number of stops lays out sensibly.
const PATH_D = 'M 65 155 C 115 138, 150 118, 185 95 S 250 88, 275 40';

export const RouteMapPreview = ({ points = [], meta, heightClass = 'h-44' }) => {
  const pathRef = useRef(null);
  const [dots, setDots] = useState([]);

  useEffect(() => {
    if (!pathRef.current || points.length === 0) {
      setDots([]);
      return;
    }
    const total = pathRef.current.getTotalLength();
    const n = points.length;
    setDots(points.map((p, i) => {
      const t = n === 1 ? 0 : i / (n - 1);
      const pt = pathRef.current.getPointAtLength(t * total);
      return { ...p, x: pt.x, y: pt.y };
    }));
  }, [points]);

  return (
    <div className={`${heightClass} rounded-3xl overflow-hidden relative bg-[repeating-linear-gradient(135deg,#E4EBE8_0_8px,#EDF2F0_8px_16px)] border border-[#E4EAE7] shadow-inner`}>
      <svg viewBox="0 0 340 190" className="absolute inset-0 w-full h-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path ref={pathRef} d={PATH_D} stroke="#0F9D76" strokeWidth="5" />
      </svg>

      {dots.map((d, i) => (
        <div
          key={`${d.label}-${i}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
          style={{ left: d.x, top: d.y }}
        >
          {d.label && (
            <span className="max-w-[110px] truncate rounded-lg bg-white px-2 py-0.5 text-[9.5px] font-bold text-[#101B17] shadow-md whitespace-nowrap">
              {d.label}
            </span>
          )}
          <span
            className={
              d.type === 'destination'
                ? 'h-3.5 w-3.5 rounded-sm border-2 border-white bg-[#EE7A22] shadow-md'
                : d.type === 'origin'
                  ? 'h-3.5 w-3.5 rounded-full border-2 border-white bg-[#0F9D76] shadow-md'
                  : 'h-2.5 w-2.5 rounded-full border-2 border-white bg-[#0B7A5C] shadow-md'
            }
          />
        </div>
      ))}

      {meta && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-[#E4EAE7] bg-white/95 px-2.5 py-1 text-[10px] font-bold text-[#0B7A5C]">
          <Navigation className="h-3 w-3" />
          {meta}
        </div>
      )}
    </div>
  );
};
