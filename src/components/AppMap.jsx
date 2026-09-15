import React, { useEffect, useRef, useState } from 'react';
import { Navigation, Compass, Shield, Check, MapPin, AlertTriangle } from 'lucide-react';

/**
 * Unified Urban Map Geometry
 * Standard S-curve path representing HCMC East Corridor (Thủ Đức / Q.9 -> Q.1 / Bến Thành)
 */
const PREVIEW_PATH_D = 'M 55 165 C 120 165, 160 145, 200 135 C 245 125, 290 110, 345 100';
const BACKDROP_PATH_D = 'M 315 160 C 265 185, 215 220, 165 260 C 120 295, 90 325, 75 345';
const LIVE_FULLSCREEN_PATH_D = 'M 320 115 C 275 165, 225 215, 180 255 C 140 295, 100 325, 65 345';

/**
 * AppMap — Unified Master Map Component for RouteShare
 * 
 * @param {'preview' | 'backdrop' | 'live' | 'picker'} mode - Map rendering mode
 * @param {Array} points - Waypoint markers [{ id, label, type, x, y, isSafe, ... }]
 * @param {number} progress - Vehicle progress from 0 to 1 (for 'live' mode)
 * @param {string} meta - Stats pill label e.g. "18.5 km · 07:00"
 * @param {string} tag - Tag pill e.g. "Lộ trình tối ưu"
 * @param {string} heightClass - Container height class (e.g. 'h-60 min-h-[240px]', 'h-full')
 * @param {string} selectedPointId - Currently selected point in 'picker' mode
 * @param {Function} onSelectPoint - Callback when a point is clicked in 'picker' mode
 * @param {string} className - Additional container styling
 */
export const AppMap = ({
  mode = 'preview',
  points = [],
  progress = 0,
  carPosition = null,
  meta = '',
  tag = '',
  heightClass = 'h-60 min-h-[240px]',
  selectedPointId = '',
  onSelectPoint = () => {},
  className = '',
  showControls = true,
}) => {
  const pathRef = useRef(null);
  const [dots, setDots] = useState([]);
  const [carPos, setCarPos] = useState(null);
  const [pathLength, setPathLength] = useState(0);

  const isBackdrop = mode === 'backdrop';
  const isLive = mode === 'live';
  const isPicker = mode === 'picker';
  const isPreview = mode === 'preview';
  const isFullscreen = isBackdrop || isLive || className.includes('absolute inset-0');

  const activePathD = isBackdrop
    ? BACKDROP_PATH_D
    : (isLive || className.includes('absolute inset-0'))
      ? LIVE_FULLSCREEN_PATH_D
      : PREVIEW_PATH_D;
  const clampedProgress = Math.min(1, Math.max(0, progress));

  // Compute Waypoints along SVG Path
  useEffect(() => {
    if (!pathRef.current) return;
    const total = pathRef.current.getTotalLength();
    setPathLength(total);

    if (isPicker) {
      // In picker mode, predefined coordinate layout if not specified
      setDots(points.map((p, i) => {
        const defaultPositions = [
          { x: 95, y: 145 },
          { x: 195, y: 105 },
          { x: 285, y: 75 },
          { x: 335, y: 55 },
        ];
        const pos = p.x !== undefined && p.y !== undefined ? { x: p.x, y: p.y } : (defaultPositions[i % defaultPositions.length] || { x: 200, y: 100 });
        return { ...p, ...pos, index: i };
      }));
      return;
    }

    if (points.length === 0) {
      setDots([]);
      return;
    }

    const n = points.length;
    setDots(points.map((p, i) => {
      let t = 0;
      if (n === 1) t = 0.5;
      else if (n === 2) t = i === 0 ? 0.05 : 0.95;
      else if (n === 3) t = i === 0 ? 0.05 : i === 1 ? 0.5 : 0.95;
      else t = 0.05 + (i / (n - 1)) * 0.90;

      const pt = pathRef.current.getPointAtLength(t * total);
      return { ...p, x: pt.x, y: pt.y, index: i, total: n };
    }));

    // For Live Mode: Calculate Car position along path
    if (isLive) {
      if (carPosition) {
        setCarPos(carPosition);
      } else {
        const carPt = pathRef.current.getPointAtLength(clampedProgress * total);
        setCarPos({ x: carPt.x, y: carPt.y });
      }
    }
  }, [points, isPicker, isLive, clampedProgress, carPosition, activePathD]);

  // Container Classes
  const containerClasses = isFullscreen
    ? `absolute inset-0 w-full h-full overflow-hidden bg-[#EBF2EE] select-none ${className}`
    : `${heightClass} w-full shrink-0 rounded-3xl overflow-hidden relative bg-[#EBF2EE] border border-[#D5E2DC] shadow-[0_2px_12px_rgba(16,27,23,0.06)] select-none ${className}`;

  // ViewBox Dimensions
  const viewBox = isFullscreen ? '0 0 390 844' : '0 0 400 220';
  const width = isFullscreen ? 390 : 400;
  const height = isFullscreen ? 844 : 220;

  return (
    <div className={containerClasses}>
      {/* ========================================================================= */}
      {/* UNIFIED URBAN CANVAS SVG (River, Grid, Corridors, Polyline) */}
      {/* ========================================================================= */}
      <svg viewBox={viewBox} className="absolute inset-0 w-full h-full" fill="none">
        {/* Sông Sài Gòn (Soft winding river) */}
        {isFullscreen ? (
          <path
            d="M -30 190 C 70 230, 150 280, 240 340 C 310 390, 360 450, 420 520"
            stroke="#C8E2DC"
            strokeWidth="36"
            strokeLinecap="round"
            opacity="0.8"
          />
        ) : (
          <path
            d="M -20 145 C 70 175, 150 205, 250 240"
            stroke="#C8E2DC"
            strokeWidth="28"
            strokeLinecap="round"
            opacity="0.8"
          />
        )}
        <text 
          x={isFullscreen ? 65 : 80} 
          y={isFullscreen ? 245 : 190} 
          fill="#88B2A7" 
          fontSize={isFullscreen ? 9 : 8.5} 
          fontWeight="700" 
          fontStyle="italic" 
          letterSpacing="0.06em"
        >
          SÔNG SÀI GÒN
        </text>

        {/* Secondary Urban Road Grid */}
        {isFullscreen ? (
          <>
            <path d="M -20 140 L 420 140" stroke="#DFEBE5" strokeWidth="7" />
            <path d="M -20 220 L 420 220" stroke="#DFEBE5" strokeWidth="7" />
            <path d="M -20 300 L 420 300" stroke="#DFEBE5" strokeWidth="7" />
            <path d="M -20 380 L 420 380" stroke="#DFEBE5" strokeWidth="7" />
            <path d="M 100 -20 L 100 860" stroke="#DFEBE5" strokeWidth="5" />
            <path d="M 260 -20 L 260 860" stroke="#DFEBE5" strokeWidth="5" />
            <path d="M -20 310 C 110 240, 240 160, 410 110" stroke="#D3E3DC" strokeWidth="12" />
            <path d="M 30 90 C 130 180, 250 280, 390 390" stroke="#D3E3DC" strokeWidth="11" />
          </>
        ) : (
          <>
            <path d="M 0 65 L 400 65" stroke="#DFEBE5" strokeWidth="5" />
            <path d="M 0 150 L 400 150" stroke="#DFEBE5" strokeWidth="5" />
            <path d="M 130 0 L 130 220" stroke="#DFEBE5" strokeWidth="4" />
            <path d="M 270 0 L 270 220" stroke="#DFEBE5" strokeWidth="4" />
            <path d="M 0 195 C 130 150, 260 80, 400 20" stroke="#D3E3DC" strokeWidth="10" />
          </>
        )}

        {/* Major Road Labels */}
        <text x={isFullscreen ? 255 : 275} y={isFullscreen ? 155 : 135} fill="#9FB2A9" fontSize={isFullscreen ? 8.5 : 8} fontWeight="700">
          QL52 (Xa lộ Hà Nội)
        </text>
        <text x={isFullscreen ? 55 : 135} y={isFullscreen ? 175 : 55} fill="#9FB2A9" fontSize={isFullscreen ? 8.5 : 8} fontWeight="700">
          Mai Chí Thọ
        </text>

        {/* Route Polyline (Glow Outer Line) */}
        <path
          d={activePathD}
          stroke="#BDE7D5"
          strokeWidth={isFullscreen ? 11 : 9}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Active Route Stroke with Live Progress */}
        <path
          ref={pathRef}
          d={activePathD}
          stroke="#0F9D76"
          strokeWidth={isFullscreen ? 5.5 : 4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={isLive && pathLength ? pathLength : undefined}
          strokeDashoffset={isLive && pathLength ? pathLength * (1 - clampedProgress) : undefined}
          style={isLive ? { transition: 'stroke-dashoffset 700ms ease' } : undefined}
        />
      </svg>

      {/* ========================================================================= */}
      {/* FLOATING HEADER CONTROLS (Preview & Live Modes) */}
      {/* ========================================================================= */}
      {showControls && (meta || tag) && (
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          {meta && (
            <div className="flex items-center gap-1.5 rounded-full border border-[#BDE7D5] bg-white/95 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold text-[#0B7A5C] shadow-xs">
              <Navigation className="h-3.5 w-3.5 text-[#0F9D76] fill-[#0F9D76]" />
              <span className="font-mono">{meta}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {tag && (
              <div className="flex items-center gap-1 rounded-full border border-[#E4EAE7] bg-white/90 backdrop-blur-md px-2.5 py-1 text-[9.5px] font-semibold text-[#4B5A54] shadow-xs">
                <Shield className="h-3 w-3 text-[#0F9D76]" />
                <span>{tag}</span>
              </div>
            )}
            <button
              type="button"
              className="w-7 h-7 rounded-full bg-white/95 backdrop-blur-md border border-[#D5E2DC] shadow-xs flex items-center justify-center text-[#0B7A5C] hover:bg-[#F1FAF6] transition-colors cursor-pointer"
              title="Định vị la bàn"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WAYPOINT MARKERS & SMART STAGGERED LABELS */}
      {/* ========================================================================= */}
      {dots.map((d, i) => {
        const isOrigin = d.type === 'origin' || i === 0;
        const isDestination = d.type === 'destination' || i === dots.length - 1;
        const isDropoff = d.type === 'dropoff' || isDestination;
        const isWaypoint = d.type === 'waypoint';
        const isSafe = d.isSafe || d.type === 'safe';
        const isWarning = d.type === 'warning';
        const isSelected = selectedPointId && (d.id === selectedPointId || d.name === selectedPointId);

        const isOrange = (isDropoff && !isOrigin) || isWarning;
        const markerBg = isOrange ? 'bg-[#EE7A22]' : isWaypoint ? 'bg-[#0B7A5C]' : 'bg-[#0F9D76]';
        const ringColor = isOrange ? 'ring-[#EE7A22]/25' : isWaypoint ? 'ring-[#0B7A5C]/20' : 'ring-[#0F9D76]/25';

        // Smart dynamic alignment based on X position to prevent edge overflow
        const xRatio = d.x / width;
        let horizontalAlign = 'items-center -translate-x-1/2';
        if (xRatio > 0.65 && !isPicker) {
          horizontalAlign = 'items-end -translate-x-[85%]';
        } else if (xRatio < 0.35 && !isPicker) {
          horizontalAlign = 'items-start -translate-x-[15%]';
        }

        return (
          <div
            key={`${d.id || d.label || d.name || 'pt'}-${i}`}
            onClick={isPicker ? () => onSelectPoint(d.id || d) : undefined}
            className={`absolute -translate-y-1/2 flex flex-col z-10 transition-all duration-300 ${horizontalAlign} ${
              isPicker ? 'cursor-pointer group' : ''
            }`}
            style={{ left: `${(d.x / width) * 100}%`, top: `${(d.y / height) * 100}%` }}
          >
            {/* Top Label (Used in Picker when selected or for prominent tags) */}
            {isPicker && (
              <div
                className={`mb-1 px-2 py-0.5 rounded-lg text-[9px] font-bold shadow-xs whitespace-nowrap transition-transform group-hover:scale-105 ${
                  isSelected
                    ? 'bg-[#0F9D76] text-white ring-2 ring-white'
                    : isSafe
                      ? 'bg-white/95 text-[#0B7A5C] border border-[#BDE7D5]'
                      : isWarning
                        ? 'bg-white/95 text-[#C22B35] border border-[#F7D9D9]'
                        : 'bg-white/95 text-[#101B17] border border-[#E4EAE7]'
                }`}
              >
                {d.name || d.label}
              </div>
            )}

            {/* Marker Pin Icon */}
            <div className="relative flex items-center justify-center">
              <span className={`absolute w-6 h-6 rounded-full ${markerBg}/20 animate-pulse pointer-events-none`} />
              
              {isPicker ? (
                // Picker Pin with Checkmark
                <div
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white transition-all ${
                    isSelected
                      ? 'bg-[#0F9D76] ring-4 ring-[#0F9D76]/30 scale-110'
                      : isSafe
                        ? 'bg-[#0F9D76]'
                        : isWarning
                          ? 'bg-[#EE7A22]'
                          : 'bg-[#0B7A5C]'
                  }`}
                >
                  {isSafe ? '✓' : isWarning ? '!' : '●'}
                </div>
              ) : isOrange ? (
                // Dropoff / End Pin (Square Orange)
                <div className={`h-4.5 w-4.5 rounded-md border-2 border-white ${markerBg} ring-3 ${ringColor} shadow-[0_2px_8px_rgba(238,122,34,0.35)] flex items-center justify-center text-[7.5px] font-bold text-white shrink-0`}>
                  ■
                </div>
              ) : isWaypoint ? (
                // Waypoint Pin (White ring with dot)
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white bg-white ring-3 ring-[#0F9D76]/30 shadow-xs flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0F9D76]" />
                </div>
              ) : (
                // Origin / Pickup Pin (Circle Emerald)
                <div className={`h-4.5 w-4.5 rounded-full border-2 border-white ${markerBg} ring-3 ${ringColor} shadow-[0_2px_8px_rgba(15,157,118,0.35)] flex items-center justify-center text-[7.5px] font-bold text-white shrink-0`}>
                  ●
                </div>
              )}
            </div>

            {/* Bottom Label Tag (Non-picker mode) */}
            {!isPicker && (d.label || d.name) && (
              <div className="mt-1 max-w-[155px] rounded-lg bg-white/95 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-[#101B17] shadow-[0_2px_8px_rgba(16,27,23,0.12)] border border-[#E4EAE7] flex items-center gap-1 pointer-events-none whitespace-nowrap">
                <span className={`w-1.5 h-1.5 rounded-full ${markerBg} shrink-0`} />
                <span className="truncate">{d.label || d.name}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* ========================================================================= */}
      {/* LIVE DRIVER VEHICLE PIN WITH PULSING RADAR (Live Mode) */}
      {/* ========================================================================= */}
      {isLive && carPos && (
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center pointer-events-none transition-all duration-700 ease-linear"
          style={{ left: `${(carPos.x / width) * 100}%`, top: `${(carPos.y / height) * 100}%` }}
        >
          <span className="absolute w-12 h-12 rounded-full bg-[#0F9D76]/25 animate-ping" />
          <span className="absolute w-9 h-9 rounded-full bg-[#0F9D76]/30 animate-pulse" />
          <div className="relative w-8 h-8 rounded-full bg-[#0F9D76] border-2 border-white shadow-[0_4px_14px_rgba(15,157,118,0.5)] flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#FFFFFF">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z" />
              <circle cx="7.5" cy="14.5" r="1.5" />
              <circle cx="16.5" cy="14.5" r="1.5" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
