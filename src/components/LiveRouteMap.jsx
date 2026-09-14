import React, { useEffect, useRef, useState } from 'react';

// Full-screen decorative live-tracking map. Still not a real map SDK, but unlike a
// couple of fixed pixel pins it plots every real stop along one path and animates
// the driver's marker by actual pickup/dropoff progress (0..1), not a fake phase.
//
// The SVG viewBox is 0–100 on both axes (i.e. coordinates ARE percentages), so pin/car
// positions — rendered as plain absolutely-positioned HTML, not inside the <svg> — can
// use the exact same numbers as left/top percentages. That keeps them aligned with the
// (viewBox-scaled) path regardless of the container's actual rendered pixel size, which
// varies here because the map sits behind the status card and passenger sheet rather
// than filling a fixed-size box.
//
// The path itself is kept inside the y=[26,60] band so it stays visible in the gap
// between those two opaque cards instead of hiding underneath them.
const PATH_D = 'M 24 50 C 36 48, 47 46, 57 44 C 68 42, 79 38, 87 34';

const PIN_STYLE = {
  pickup: { active: '#0F9D76', done: '#BDE7D5', shape: 'circle' },
  dropoff: { active: '#EE7A22', done: '#F7D9B8', shape: 'square' },
  waypoint: { active: '#C3CDC9', done: '#C3CDC9', shape: 'dot' },
};

export const LiveRouteMap = ({ points = [], progress = 0 }) => {
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [dots, setDots] = useState([]);
  const [carPos, setCarPos] = useState(null);

  const clampedProgress = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    if (!pathRef.current) return;
    const total = pathRef.current.getTotalLength();
    setPathLength(total);

    const n = points.length;
    setDots(points.map((p, i) => {
      const t = n <= 1 ? 0 : i / (n - 1);
      const pt = pathRef.current.getPointAtLength(t * total);
      return { ...p, xPct: pt.x, yPct: pt.y };
    }));

    const carPt = pathRef.current.getPointAtLength(clampedProgress * total);
    setCarPos({ xPct: carPt.x, yPct: carPt.y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, clampedProgress]);

  return (
    <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,#E4EBE8_0_8px,#EDF2F0_8px_16px)] overflow-hidden">
      <div className="absolute left-0 right-0 top-[38%] h-3.5 bg-[#DCE5E1]" />
      <div className="absolute left-0 right-0 top-[55%] h-2.5 bg-[#DCE5E1]" />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={PATH_D} stroke="#C3CDC9" strokeWidth="1.4" strokeDasharray="0.6 2.6" vectorEffect="non-scaling-stroke" />
        <path
          ref={pathRef}
          d={PATH_D}
          stroke="#0F9D76"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeDasharray={pathLength || 1}
          strokeDashoffset={pathLength * (1 - clampedProgress)}
          style={{ transition: 'stroke-dashoffset 700ms ease' }}
        />
      </svg>

      {dots.map((d, i) => {
        const style = PIN_STYLE[d.type] || PIN_STYLE.waypoint;
        const color = d.done ? style.done : style.active;
        return (
          <div
            key={`${d.label}-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10"
            style={{ left: `${d.xPct}%`, top: `${d.yPct}%` }}
          >
            {d.label && (
              <span
                className="max-w-[108px] truncate rounded-xl bg-white px-2.5 py-1 text-[10.5px] font-bold shadow-[0_5px_16px_rgba(16,27,23,0.16)] whitespace-nowrap"
                style={{ color: d.done ? '#8A9993' : '#101B17' }}
              >
                {d.label}
              </span>
            )}
            {style.shape === 'square' ? (
              <span className="h-5 w-5 rounded-md border-4 border-white shadow-[0_4px_12px_rgba(16,27,23,0.22)]" style={{ backgroundColor: color }} />
            ) : style.shape === 'circle' ? (
              <span className="h-5 w-5 rounded-full border-4 border-white shadow-[0_4px_12px_rgba(16,27,23,0.22)]" style={{ backgroundColor: color }} />
            ) : (
              <span className="h-2.5 w-2.5 rounded-full border-2 border-white" style={{ backgroundColor: color }} />
            )}
          </div>
        );
      })}

      {carPos && (
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center"
          style={{ left: `${carPos.xPct}%`, top: `${carPos.yPct}%`, transition: 'left 700ms ease, top 700ms ease' }}
        >
          <span className="absolute w-11 h-11 rounded-full bg-[#0F9D76]/30 animate-[rs-pulse2_2.2s_ease-out_infinite]" />
          <div className="relative w-8 h-8 rounded-full bg-[#0F9D76] border-4 border-white shadow-[0_4px_12px_rgba(15,157,118,0.45)] flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#FFFFFF">
              <path d="M5 15.5v2a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1v-1h7v1a1 1 0 0 0 1 1H18a1 1 0 0 0 1-1v-2l-1.4-5a2 2 0 0 0-1.9-1.4H8.3A2 2 0 0 0 6.4 10.5z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
