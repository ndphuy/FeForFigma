import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

// Default proximity bias: Ho Chi Minh City center
const DEFAULT_PROXIMITY = [106.7009, 10.7769];

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

/**
 * Drop-in replacement for a plain <input> that shows live Mapbox address
 * suggestions as the user types (e.g. typing "12 nguyen" surfaces nearby
 * street names/addresses containing "12 Nguyễn...").
 */
export const AddressAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = '',
  inputClassName = '',
  proximity = DEFAULT_PROXIMITY,
  bbox = null, // [minLng, minLat, maxLng, maxLat] — restricts results to within this city
  autoFocus = false,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    const query = (value || '').trim();
    if (query.length < 2 || !MAPBOX_TOKEN) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      setIsLoading(true);
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json` +
          `?access_token=${MAPBOX_TOKEN}&country=vn&language=vi&autocomplete=true&limit=5` +
          `&types=address,poi&proximity=${proximity[0]},${proximity[1]}` +
          (bbox ? `&bbox=${bbox.join(',')}` : '');
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        setSuggestions(data.features || []);
        setIsOpen(true);
      } catch (err) {
        if (err.name !== 'AbortError') setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, proximity, bbox]);

  const handleSelect = (feature) => {
    const label = feature.text_vi || feature.text || feature.place_name;
    onChange(label);
    setIsOpen(false);
    setSuggestions([]);
    if (onSelect) onSelect(feature);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          className={inputClassName}
        />
        {isLoading && (
          <Loader2 className="w-3.5 h-3.5 text-[#8A9993] animate-spin absolute right-3 pointer-events-none" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-2xl border border-[#E4EAE7] shadow-[0_10px_28px_rgba(16,27,23,0.14)] overflow-hidden max-h-64 overflow-y-auto rs-scroll">
          {suggestions.map((f) => {
            const parts = (f.place_name_vi || f.place_name || '').split(',');
            const primary = parts[0]?.trim();
            const secondary = parts.slice(1).join(',').trim();
            return (
              <button
                type="button"
                key={f.id}
                onClick={() => handleSelect(f)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-[#F1FAF6] active:bg-[#DDF3EA] flex items-start gap-2.5 border-b border-[#EEF2F0] last:border-b-0 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0F9D76] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#101B17] truncate">{primary}</div>
                  {secondary && (
                    <div className="text-[10.5px] text-[#8A9993] truncate">{secondary}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
