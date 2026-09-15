import React, { useEffect, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Navigation, Compass, Shield } from 'lucide-react';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

/**
 * Real-world route geometry (lng, lat) approximating the HCMC East Corridor:
 * Thủ Đức / Suối Tiên -> Xa lộ Hà Nội -> Cầu Sài Gòn -> Mai Chí Thọ -> Hầm Thủ Thiêm -> Bến Thành, Q.1
 */
const MAIN_ROUTE_COORDS = [
  [106.8033, 10.8712], // Suối Tiên, Thủ Đức
  [106.7797, 10.8046], // Xa lộ Hà Nội, An Phú
  [106.7508, 10.7910], // Cầu Sài Gòn
  [106.7295, 10.7828], // Mai Chí Thọ, Thủ Thiêm
  [106.7075, 10.7795], // Hầm Thủ Thiêm
  [106.6980, 10.7724], // Chợ Bến Thành, Q.1
];

// Decorative loop around Q.1 used as a subtle background in 'backdrop' mode
const BACKDROP_ROUTE_COORDS = [
  [106.7028, 10.7756], // Nguyễn Huệ
  [106.7005, 10.7742],
  [106.6975, 10.7726], // gần Chợ Bến Thành
  [106.7015, 10.7706], // Khu Bitexco
];

// Approx bounding box around Phú Mỹ Hưng, Q.7 (matches PickupPicker's static header text),
// used to place 'picker' mode pins from their legacy logical x/y coordinates.
const PICKER_BBOX = { minLng: 106.702, maxLng: 106.722, minLat: 10.722, maxLat: 10.738 };
const LOGICAL_W = 400;
const LOGICAL_H = 220;

function haversine([lng1, lat1], [lng2, lat2]) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function cumulativeLengths(coords) {
  const acc = [0];
  for (let i = 1; i < coords.length; i++) acc.push(acc[i - 1] + haversine(coords[i - 1], coords[i]));
  return acc;
}

function pointAtT(coords, cumulative, t) {
  const total = cumulative[cumulative.length - 1];
  const target = Math.min(1, Math.max(0, t)) * total;
  for (let i = 1; i < cumulative.length; i++) {
    if (target <= cumulative[i] || i === cumulative.length - 1) {
      const segStart = cumulative[i - 1];
      const segLen = cumulative[i] - segStart || 1;
      const segT = Math.min(1, Math.max(0, (target - segStart) / segLen));
      const [lng0, lat0] = coords[i - 1];
      const [lng1, lat1] = coords[i];
      return [lng0 + (lng1 - lng0) * segT, lat0 + (lat1 - lat0) * segT];
    }
  }
  return coords[coords.length - 1];
}

function sliceAtT(coords, cumulative, t) {
  const total = cumulative[cumulative.length - 1];
  const target = Math.min(1, Math.max(0, t)) * total;
  const slice = [coords[0]];
  for (let i = 1; i < cumulative.length; i++) {
    if (cumulative[i] <= target) {
      slice.push(coords[i]);
    } else {
      slice.push(pointAtT(coords, cumulative, t));
      break;
    }
  }
  return slice;
}

function xyToLngLat(x, y) {
  const { minLng, maxLng, minLat, maxLat } = PICKER_BBOX;
  const lng = minLng + (x / LOGICAL_W) * (maxLng - minLng);
  const lat = maxLat - (y / LOGICAL_H) * (maxLat - minLat);
  return [lng, lat];
}

function createPointMarkerEl({ isOrange, isWaypoint, isPicker, isSafe, isWarning, isSelected, label, onClick }) {
  const markerBg = isOrange ? 'bg-[#EE7A22]' : isWaypoint ? 'bg-[#0B7A5C]' : 'bg-[#0F9D76]';

  const wrap = document.createElement('div');
  wrap.className = 'flex flex-col items-center';

  if (isPicker) {
    const topLabel = document.createElement('div');
    topLabel.className = `mb-1 px-2 py-0.5 rounded-lg text-[9px] font-bold shadow-xs whitespace-nowrap ${
      isSelected
        ? 'bg-[#0F9D76] text-white ring-2 ring-white'
        : isSafe
          ? 'bg-white/95 text-[#0B7A5C] border border-[#BDE7D5]'
          : isWarning
            ? 'bg-white/95 text-[#C22B35] border border-[#F7D9D9]'
            : 'bg-white/95 text-[#101B17] border border-[#E4EAE7]'
    }`;
    topLabel.textContent = label || '';
    wrap.appendChild(topLabel);
  }

  const pinWrap = document.createElement('div');
  pinWrap.className = 'relative flex items-center justify-center';

  const pulse = document.createElement('span');
  pulse.className = `absolute w-6 h-6 rounded-full ${markerBg}/20 animate-pulse pointer-events-none`;
  pinWrap.appendChild(pulse);

  const pin = document.createElement('div');
  if (isPicker) {
    pin.className = `w-6 h-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white transition-all ${
      isSelected
        ? 'bg-[#0F9D76] ring-4 ring-[#0F9D76]/30 scale-110'
        : isSafe
          ? 'bg-[#0F9D76]'
          : isWarning
            ? 'bg-[#EE7A22]'
            : 'bg-[#0B7A5C]'
    }`;
    pin.textContent = isSafe ? '✓' : isWarning ? '!' : '●';
  } else if (isOrange) {
    pin.className = `h-4.5 w-4.5 rounded-md border-2 border-white ${markerBg} ring-3 ring-[#EE7A22]/25 shadow-[0_2px_8px_rgba(238,122,34,0.35)] flex items-center justify-center text-[7.5px] font-bold text-white shrink-0`;
    pin.textContent = '■';
  } else if (isWaypoint) {
    pin.className = 'h-3.5 w-3.5 rounded-full border-2 border-white bg-white ring-3 ring-[#0F9D76]/30 shadow-xs flex items-center justify-center shrink-0';
    const dot = document.createElement('span');
    dot.className = 'w-1.5 h-1.5 rounded-full bg-[#0F9D76]';
    pin.appendChild(dot);
  } else {
    pin.className = `h-4.5 w-4.5 rounded-full border-2 border-white ${markerBg} ring-3 ring-[#0F9D76]/25 shadow-[0_2px_8px_rgba(15,157,118,0.35)] flex items-center justify-center text-[7.5px] font-bold text-white shrink-0`;
    pin.textContent = '●';
  }
  pinWrap.appendChild(pin);
  wrap.appendChild(pinWrap);

  if (!isPicker && label) {
    const bottomLabel = document.createElement('div');
    bottomLabel.className = 'mt-1.5 max-w-[130px] rounded-lg bg-white/95 backdrop-blur-md px-2 py-0.5 text-[9.5px] font-bold text-[#101B17] shadow-[0_2px_8px_rgba(16,27,23,0.12)] border border-[#E4EAE7] flex items-center gap-1 pointer-events-none whitespace-nowrap';
    const dot2 = document.createElement('span');
    dot2.className = `w-1.5 h-1.5 rounded-full ${markerBg} shrink-0`;
    const text = document.createElement('span');
    text.className = 'truncate';
    text.textContent = label;
    bottomLabel.appendChild(dot2);
    bottomLabel.appendChild(text);
    wrap.appendChild(bottomLabel);
  }

  if (isPicker) {
    wrap.style.cursor = 'pointer';
    wrap.addEventListener('click', onClick);
  }

  return wrap;
}

function createCarMarkerEl() {
  const wrap = document.createElement('div');
  wrap.className = 'relative w-8 h-8 flex items-center justify-center';
  wrap.innerHTML = `
    <span class="absolute w-12 h-12 -left-2 -top-2 rounded-full bg-[#0F9D76]/25 animate-ping"></span>
    <span class="absolute w-9 h-9 -left-0.5 -top-0.5 rounded-full bg-[#0F9D76]/30 animate-pulse"></span>
    <div class="relative w-8 h-8 rounded-full bg-[#0F9D76] border-2 border-white shadow-[0_4px_14px_rgba(15,157,118,0.5)] flex items-center justify-center">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="#FFFFFF">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"></path>
        <circle cx="7.5" cy="14.5" r="1.5"></circle>
        <circle cx="16.5" cy="14.5" r="1.5"></circle>
      </svg>
    </div>
  `;
  return wrap;
}

/**
 * AppMap — Unified Master Map Component for RouteShare, backed by a real Mapbox GL map.
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
  customRouteCoords = null,
  fitBoundsPadding = null,
  interactive = true,
}) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const carMarkerRef = useRef(null);

  const isBackdrop = mode === 'backdrop';
  const isLive = mode === 'live';
  const isPicker = mode === 'picker';
  const isFullscreen = isBackdrop || isLive || className.includes('absolute inset-0');

  const routeCoords = customRouteCoords || MAIN_ROUTE_COORDS;
  const cumulative = useMemo(() => cumulativeLengths(routeCoords), [routeCoords]);
  const clampedProgress = Math.min(1, Math.max(0, progress));

  const dots = useMemo(() => {
    if (isPicker) {
      return points.map((p, i) => ({
        ...p,
        lngLat: p.x !== undefined && p.y !== undefined ? xyToLngLat(p.x, p.y) : xyToLngLat(80 + i * 90, 145 - i * 30),
        index: i,
      }));
    }
    if (points.length === 0) return [];
    const n = points.length;
    return points.map((p, i) => {
      let t;
      if (n === 1) t = 0.5;
      else if (n === 2) t = i === 0 ? 0.05 : 0.95;
      else if (n === 3) t = i === 0 ? 0.05 : i === 1 ? 0.5 : 0.95;
      else t = 0.05 + (i / (n - 1)) * 0.9;
      return { ...p, lngLat: pointAtT(routeCoords, cumulative, t), index: i, total: n };
    });
  }, [points, isPicker, routeCoords, cumulative]);

  const carLngLat = useMemo(() => {
    if (!isLive) return null;
    if (carPosition && carPosition.lat !== undefined && carPosition.lng !== undefined) {
      return [carPosition.lng, carPosition.lat];
    }
    if (carPosition && carPosition.x !== undefined && carPosition.y !== undefined) {
      return xyToLngLat(carPosition.x, carPosition.y);
    }
    return pointAtT(routeCoords, cumulative, clampedProgress);
  }, [isLive, carPosition, clampedProgress, routeCoords, cumulative]);

  // Resolve sensible padding based on mode if not explicitly provided
  const resolvedPadding = useMemo(() => {
    if (fitBoundsPadding) return fitBoundsPadding;
    if (isBackdrop) return { top: 165, bottom: 440, left: 35, right: 35 };
    if (isLive) return { top: 110, bottom: 220, left: 35, right: 35 };
    if (isFullscreen) return 80;
    return 40;
  }, [fitBoundsPadding, isBackdrop, isLive, isFullscreen]);

  // Initialize the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const center = isPicker
      ? [(PICKER_BBOX.minLng + PICKER_BBOX.maxLng) / 2, (PICKER_BBOX.minLat + PICKER_BBOX.maxLat) / 2]
      : routeCoords[Math.floor(routeCoords.length / 2)];

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center,
      zoom: isFullscreen ? 13.5 : 13,
      attributionControl: false,
      interactive: interactive,
      dragRotate: false,
      pitchWithRotate: false,
    });
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));
    mapRef.current = map;

    map.on('load', () => {
      try {
        if (map.getLayer('poi-label')) map.setLayoutProperty('poi-label', 'visibility', 'none');
        if (map.getLayer('water')) map.setPaintProperty('water', 'fill-color', '#C8E2DC');
      } catch {
        // style layer ids may differ across Mapbox style versions — non-critical
      }
      map.resize();
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (carMarkerRef.current) {
        carMarkerRef.current.remove();
        carMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the map sized to its (possibly resizing) container
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => mapRef.current?.resize());
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Draw the route polyline (skipped in 'picker' mode, which is a local pin cluster)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || isPicker) return;
    const draw = () => {
      const data = { type: 'Feature', geometry: { type: 'LineString', coordinates: routeCoords } };
      if (!map.getSource('route-glow')) {
        map.addSource('route-glow', { type: 'geojson', data });
        map.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route-glow',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#BDE7D5', 'line-width': isFullscreen ? 11 : 9, 'line-opacity': 0.9 },
        });
      } else {
        map.getSource('route-glow').setData(data);
      }
      if (!map.getSource('route-main')) {
        map.addSource('route-main', { type: 'geojson', data });
        map.addLayer({
          id: 'route-main',
          type: 'line',
          source: 'route-main',
          layout: { 'line-cap': 'round', 'line-join': 'round' },
          paint: { 'line-color': '#0F9D76', 'line-width': isFullscreen ? 5.5 : 4.5 },
        });
      } else if (!isLive) {
        map.getSource('route-main').setData(data);
      }
    };
    if (map.isStyleLoaded()) draw();
    else map.once('load', draw);
  }, [routeCoords, isFullscreen, isLive, isPicker]);

  // Live mode: grow the route-main line to the traveled portion only
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLive) return;
    const update = () => {
      const src = map.getSource('route-main');
      if (!src) return;
      const slice = sliceAtT(routeCoords, cumulative, clampedProgress);
      src.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: slice } });
    };
    if (map.isStyleLoaded()) update();
    else map.once('load', update);
  }, [isLive, clampedProgress, routeCoords, cumulative]);

  // Waypoint markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    dots.forEach((d, i) => {
      const isOrigin = d.type === 'origin' || i === 0;
      const isDestination = d.type === 'destination' || i === dots.length - 1;
      const isDropoff = d.type === 'dropoff' || isDestination;
      const isWaypoint = d.type === 'waypoint';
      const isSafe = d.isSafe || d.type === 'safe';
      const isWarning = d.type === 'warning';
      const isSelected = !!selectedPointId && (d.id === selectedPointId || d.name === selectedPointId);
      const isOrange = (isDropoff && !isOrigin) || isWarning;

      const el = createPointMarkerEl({
        isOrange,
        isWaypoint,
        isPicker,
        isSafe,
        isWarning,
        isSelected,
        label: d.label || d.name,
        onClick: () => onSelectPoint(d.id || d),
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat(d.lngLat).addTo(map);
      markersRef.current.push(marker);
    });
  }, [dots, isPicker, selectedPointId, onSelectPoint]);

  // Live driver vehicle marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!isLive || !carLngLat) {
      if (carMarkerRef.current) {
        carMarkerRef.current.remove();
        carMarkerRef.current = null;
      }
      return;
    }
    if (!carMarkerRef.current) {
      const el = createCarMarkerEl();
      el.style.transition = 'transform 700ms linear';
      carMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat(carLngLat).addTo(map);
    } else {
      carMarkerRef.current.setLngLat(carLngLat);
    }
  }, [isLive, carLngLat]);

  // Frame the route/markers when mode, bounds, or padding changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const fit = () => {
      const bounds = new mapboxgl.LngLatBounds();
      if (!isPicker) routeCoords.forEach((c) => bounds.extend(c));
      dots.forEach((d) => bounds.extend(d.lngLat));
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: resolvedPadding,
          duration: 350,
          maxZoom: 15.5,
        });
      }
    };
    if (map.isStyleLoaded()) fit();
    else map.once('load', fit);
  }, [mode, routeCoords, isPicker, dots, resolvedPadding]);

  const containerClasses = isFullscreen
    ? `absolute inset-0 w-full h-full overflow-hidden bg-[#EBF2EE] select-none ${className}`
    : `${heightClass} w-full shrink-0 overflow-hidden relative bg-[#EBF2EE] select-none ${className.includes('rounded-none') ? '' : 'rounded-3xl'} ${className.includes('border-none') ? '' : 'border border-[#D5E2DC]'} ${className.includes('shadow-none') ? '' : 'shadow-[0_2px_12px_rgba(16,27,23,0.06)]'} ${className}`;

  return (
    <div className={containerClasses}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

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
              onClick={() => mapRef.current?.easeTo({ bearing: 0, pitch: 0, duration: 400 })}
              className="w-7 h-7 rounded-full bg-white/95 backdrop-blur-md border border-[#D5E2DC] shadow-xs flex items-center justify-center text-[#0B7A5C] hover:bg-[#F1FAF6] transition-colors cursor-pointer"
              title="Định vị la bàn"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
