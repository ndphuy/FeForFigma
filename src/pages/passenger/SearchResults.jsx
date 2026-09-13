import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, PencilLine, Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SORT_OPTIONS = [
  { value: 'match', label: 'Trùng tuyến cao nhất' },
  { value: 'price', label: 'Giá thấp nhất' },
  { value: 'time', label: 'Đón sớm nhất' },
];

const RESULT_DETAILS = {
  trip_001: {
    pickup: 'FPT University',
    dropoff: 'Bến Thành',
    pickupTime: '07:20',
    dropoffTime: '08:04',
    departure: '07:10',
    distance: '16,2 km',
    walk: '120 m',
    railStart: 'A · Thủ Đức',
    railEnd: 'E · Q.4',
    rail: [2, 3, 2, 1],
    activeRail: [true, true, true, false],
  },
  trip_002: {
    pickup: 'Ngã tư Thủ Đức',
    dropoff: 'Nguyễn Huệ',
    pickupTime: '07:35',
    dropoffTime: '08:18',
    departure: '07:25',
    distance: '14,8 km',
    walk: '450 m',
    railStart: 'A · Dĩ An',
    railEnd: 'E · Q.7',
    rail: [2, 3, 2, 2],
    activeRail: [false, true, true, false],
  },
  trip_003: {
    pickup: 'Metro Suối Tiên',
    dropoff: 'Chợ Bến Thành',
    pickupTime: '07:48',
    dropoffTime: '08:40',
    departure: '07:30',
    distance: '13,1 km',
    walk: '800 m',
    railStart: 'A · Biên Hoà',
    railEnd: 'E · Bình Thạnh',
    rail: [3, 2, 2, 3],
    activeRail: [false, true, true, false],
  },
};

const EMPTY_SUGGESTIONS = [
  { tag: '+30′', title: 'Mở rộng khung giờ', body: '06:30–08:30 · 7 chuyến trùng tuyến' },
  { tag: '−1', title: 'Giảm còn 2 khách', body: '4 chuyến còn đủ chỗ' },
  { tag: '1 km', title: 'Chấp nhận đi bộ 1 km', body: '5 chuyến đi qua gần điểm đón' },
];

const shortLocation = (location = '') => location
  .replace(' HCMC', '')
  .replace('Chợ ', '')
  .replace(/, Q\.\d+$/, '')
  .trim();

const getTime = (value, fallback) => {
  const time = value?.match(/\b\d{2}:\d{2}\b/)?.[0];
  return time || fallback;
};

const getTripDetails = (trip) => {
  const reference = RESULT_DETAILS[trip.id] || {};
  const fallbackSegments = trip.segments?.length
    ? trip.segments.map((segment) => segment.km || 1)
    : [1, 3, 1];
  const fallbackActive = trip.segments?.length
    ? trip.segments.map((segment) => Boolean(segment.isUserLeg))
    : [false, true, false];

  return {
    pickup: reference.pickup || shortLocation(trip.origin),
    dropoff: reference.dropoff || shortLocation(trip.destination),
    pickupTime: reference.pickupTime || getTime(trip.originDetail, trip.departureTime),
    dropoffTime: reference.dropoffTime || getTime(trip.destinationDetail, '08:15'),
    departure: reference.departure || trip.departureTime,
    distance: reference.distance || `${String(trip.distanceKm).replace('.', ',')} km`,
    walk: reference.walk || '500 m',
    railStart: reference.railStart || `A · ${shortLocation(trip.origin)}`,
    railEnd: reference.railEnd || `E · ${shortLocation(trip.destination)}`,
    rail: reference.rail || fallbackSegments,
    activeRail: reference.activeRail || fallbackActive,
  };
};

const TripCard = ({ trip, isBestMatch, onOpen }) => {
  const details = getTripDetails(trip);
  const lowSeats = trip.availableSeats <= 1;
  const matchColor = trip.matchPercentage >= 85
    ? '#0B7A5C'
    : trip.matchPercentage >= 70
      ? '#101B17'
      : '#4B5A54';

  return (
    <article
      className={`flex flex-col gap-3.5 rounded-[24px] bg-white p-[18px] shadow-[0_2px_10px_rgba(16,27,23,0.05)] border-[1.5px] ${
        isBestMatch ? 'border-[#BDE7D5]' : 'border-transparent'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DDF3EA] text-base font-semibold text-[#0B7A5C]">
          {trip.driverInitials || 'TX'}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span className="truncate text-base font-semibold text-[#101B17]">{trip.driverName}</span>
          <span className="truncate text-[12.5px] text-[#8A9993]">
            <span className="text-[#F0A020]">★</span> {trip.driverTrustScore} · {trip.vehicleModel}
          </span>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-[3px]">
          <span className="text-xl font-bold leading-none" style={{ color: matchColor }}>
            {trip.matchPercentage}%
          </span>
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#8A9993]">
            Trùng tuyến
          </span>
        </div>
      </div>

      {isBestMatch && (
        <div className="flex self-start items-center gap-[7px] rounded-full bg-[#F1FAF6] px-3 py-[7px] text-[11.5px] font-semibold text-[#0B7A5C]">
          <span className="rounded-md bg-[#0F9D76] px-1.5 py-0.5 text-[9px] font-bold tracking-[0.06em] text-white">AI</span>
          Best Match
        </div>
      )}

      <div className="flex flex-col gap-[7px]">
        <div className="flex h-2 gap-0.5 overflow-hidden rounded-full bg-[#EEF2F0]">
          {details.rail.map((weight, index) => (
            <span
              key={`${trip.id}-segment-${index}`}
              className={details.activeRail[index] ? 'bg-[#0F9D76]' : 'bg-[#DFE7E3]'}
              style={{ flex: weight }}
            />
          ))}
        </div>
        <div className="flex justify-between font-mono text-[10.5px] text-[#8A9993]">
          <span>{details.railStart}</span>
          <span>{details.railEnd}</span>
        </div>
      </div>

      <div className="flex gap-3 rounded-2xl bg-[#F7FAF9] px-3.5 py-3">
        <div className="flex flex-col items-center gap-1 pt-[5px]">
          <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-[#0F9D76]" />
          <span className="min-h-5 w-0.5 flex-1 bg-[#DFE7E3]" />
          <span className="h-[9px] w-[9px] shrink-0 rounded-sm bg-[#EE7A22]" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex justify-between gap-2.5">
            <span className="flex min-w-0 flex-col">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#8A9993]">Điểm đón</span>
              <span className="truncate text-[13.5px] font-semibold text-[#101B17]">{details.pickup}</span>
            </span>
            <span className="shrink-0 text-[13.5px] font-semibold text-[#101B17]">{details.pickupTime}</span>
          </div>

          <div className="flex justify-between gap-2.5">
            <span className="flex min-w-0 flex-col">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#8A9993]">Điểm trả</span>
              <span className="truncate text-[13.5px] font-semibold text-[#101B17]">{details.dropoff}</span>
            </span>
            <span className="shrink-0 text-[13.5px] font-semibold text-[#101B17]">{details.dropoffTime}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-[#F4F7F5] px-[11px] py-1.5 text-[11.5px] font-semibold text-[#4B5A54]">
          Khởi hành {details.departure}
        </span>
        <span className="rounded-full bg-[#F4F7F5] px-[11px] py-1.5 text-[11.5px] font-semibold text-[#4B5A54]">
          {details.distance}
        </span>
        <span className={`rounded-full px-[11px] py-1.5 text-[11.5px] font-semibold ${
          lowSeats ? 'bg-[#FFF1E4] text-[#B45812]' : 'bg-[#F4F7F5] text-[#4B5A54]'
        }`}>
          Còn {trip.availableSeats} chỗ
        </span>
        <span className="rounded-full bg-[#F4F7F5] px-[11px] py-1.5 text-[11.5px] font-semibold text-[#4B5A54]">
          Đi bộ {details.walk}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#EEF2F0] pt-3.5">
        <div className="flex min-w-0 flex-col">
          <span className="text-[19px] font-bold text-[#0B7A5C]">
            {trip.priceVnd.toLocaleString('vi-VN')} ₫
          </span>
          <span className="truncate text-[11px] text-[#8A9993]">chi phí chia sẻ · mỗi người</span>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className={`h-[52px] shrink-0 rounded-[17px] px-[22px] text-[15px] font-semibold transition-colors ${
            isBestMatch
              ? 'bg-[#0F9D76] text-white shadow-[0_6px_16px_rgba(15,157,118,0.28)] hover:bg-[#0B8A66]'
              : 'bg-[#F1FAF6] text-[#0B7A5C] hover:bg-[#DDF3EA]'
          }`}
        >
          Xem chuyến
        </button>
      </div>
    </article>
  );
};

const EmptyResults = ({ onAdjust }) => (
  <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-6">
    <div className="flex flex-col items-center gap-3.5 rounded-[26px] bg-white px-6 py-8 text-center shadow-[0_2px_10px_rgba(16,27,23,0.05)]">
      <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#F1FAF6]">
        <Search className="h-[30px] w-[30px] text-[#0F9D76]" strokeWidth={1.8} />
      </span>
      <span className="text-[19px] font-semibold text-[#101B17]">Chưa có chuyến trùng tuyến</span>
      <span className="text-sm leading-[1.6] text-[#4B5A54]">
        Không tài xế nào đi qua cả hai điểm của bạn trong khung 07:00–07:15. Nới khung giờ hoặc giảm số khách thường tìm được chuyến.
      </span>
    </div>

    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#8A9993]">Thử điều chỉnh</span>
      {EMPTY_SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion.title}
          type="button"
          onClick={onAdjust}
          className="flex min-h-16 items-center gap-3.5 rounded-[20px] border-[1.5px] border-[#E4EAE7] bg-white px-4 py-3 text-left hover:border-[#BDE7D5] hover:bg-[#F7FAF9]"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#F1FAF6] text-[10px] font-bold text-[#0B7A5C]">
            {suggestion.tag}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[14.5px] font-semibold text-[#101B17]">{suggestion.title}</span>
            <span className="text-[12.5px] text-[#8A9993]">{suggestion.body}</span>
          </span>
          <ChevronRight className="h-[18px] w-[18px] shrink-0 text-[#C3CDC9]" />
        </button>
      ))}
    </div>

    <div className="mt-auto flex flex-col gap-3">
      <div className="flex items-start gap-2.5 rounded-2xl border border-[#F7D9B8] bg-[#FFF4E9] px-3.5 py-3">
        <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#EE7A22] text-xs font-bold text-white">!</span>
        <span className="text-[12.5px] leading-5 text-[#8A4A0B]">Giờ cao điểm 07:00–07:15 thường kín chỗ trước 1 ngày.</span>
      </div>
      <button type="button" className="h-[60px] rounded-[20px] bg-[#0F9D76] text-base font-semibold text-white shadow-[0_8px_20px_rgba(15,157,118,0.30)]">
        Tạo cảnh báo cho tuyến này
      </button>
    </div>
  </div>
);

const SearchEditForm = ({ values, onChange, onCancel, onApply, origin, destination }) => (
  <div className="absolute inset-0 z-[70] flex items-end bg-[#101B17]/35 backdrop-blur-[1px]">
    <button
      type="button"
      aria-label="Đóng form chỉnh sửa"
      onClick={onCancel}
      className="absolute inset-0"
    />

    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-edit-title"
      className="relative z-10 flex max-h-[92%] w-full flex-col overflow-hidden rounded-t-[30px] bg-white shadow-[0_-16px_40px_rgba(16,27,23,0.16)]"
    >
      <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-[#D8E1DD]" />

      <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-3">
        <div>
          <h2 id="search-edit-title" className="text-lg font-semibold text-[#101B17]">Chỉnh sửa tìm kiếm</h2>
          <p className="mt-0.5 text-[12px] text-[#8A9993]">Cập nhật điều kiện để tìm chuyến phù hợp hơn</p>
        </div>
        <button
          type="button"
          aria-label="Đóng"
          onClick={onCancel}
          className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#F4F7F5] text-[#4B5A54]"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="rs-scroll flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto border-y border-[#EEF2F0] bg-[#F7FAF9] px-5 py-4">
        <div className="rounded-[18px] border border-[#E4EAE7] bg-white px-4 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8A9993]">Tuyến đường</span>
          <div className="mt-1.5 flex min-w-0 items-center gap-2 text-[13px] font-semibold text-[#101B17]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#0F9D76]" />
            <span className="truncate">{origin}</span>
            <span className="shrink-0 text-[#C9D3CF]">→</span>
            <span className="h-2 w-2 shrink-0 rounded-sm bg-[#EE7A22]" />
            <span className="truncate">{destination}</span>
          </div>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-xs font-semibold text-[#4B5A54]">Khung giờ đi</legend>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <label className="rounded-2xl border border-[#E4EAE7] bg-white px-3 py-2">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A9993]">Từ</span>
              <input
                type="time"
                aria-label="Giờ bắt đầu"
                value={values.timeFrom}
                onChange={(event) => onChange('timeFrom', event.target.value)}
                className="mt-0.5 w-full bg-transparent text-sm font-semibold text-[#101B17] outline-none"
              />
            </label>
            <span className="text-[#8A9993]">–</span>
            <label className="rounded-2xl border border-[#E4EAE7] bg-white px-3 py-2">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A9993]">Đến</span>
              <input
                type="time"
                aria-label="Giờ kết thúc"
                value={values.timeTo}
                onChange={(event) => onChange('timeTo', event.target.value)}
                className="mt-0.5 w-full bg-transparent text-sm font-semibold text-[#101B17] outline-none"
              />
            </label>
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <label className="rounded-2xl border border-[#E4EAE7] bg-white px-3 py-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A9993]">Đi bộ tối đa</span>
            <select
              aria-label="Đi bộ tối đa"
              value={values.maxWalk}
              onChange={(event) => onChange('maxWalk', event.target.value)}
              className="mt-1 w-full bg-transparent text-[13px] font-semibold text-[#101B17] outline-none"
            >
              <option value="300">300 m</option>
              <option value="500">500 m</option>
              <option value="800">800 m</option>
              <option value="1000">1 km</option>
            </select>
          </label>

          <label className="rounded-2xl border border-[#E4EAE7] bg-white px-3 py-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A9993]">Giá tối đa</span>
            <select
              aria-label="Giá tối đa"
              value={values.maxPrice}
              onChange={(event) => onChange('maxPrice', event.target.value)}
              className="mt-1 w-full bg-transparent text-[13px] font-semibold text-[#101B17] outline-none"
            >
              <option value="all">Không giới hạn</option>
              <option value="30000">30.000 ₫</option>
              <option value="40000">40.000 ₫</option>
              <option value="50000">50.000 ₫</option>
            </select>
          </label>

          <label className="rounded-2xl border border-[#E4EAE7] bg-white px-3 py-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A9993]">Đánh giá từ</span>
            <select
              aria-label="Đánh giá tối thiểu"
              value={values.minRating}
              onChange={(event) => onChange('minRating', event.target.value)}
              className="mt-1 w-full bg-transparent text-[13px] font-semibold text-[#101B17] outline-none"
            >
              <option value="all">Tất cả</option>
              <option value="4.0">4.0+</option>
              <option value="4.5">4.5+</option>
              <option value="4.8">4.8+</option>
            </select>
          </label>

          <div className="rounded-2xl border border-[#E4EAE7] bg-white px-3 py-2.5">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A9993]">Số chỗ</span>
            <div className="mt-1 flex gap-1.5">
              {[1, 2, 3].map((seat) => (
                <button
                  key={seat}
                  type="button"
                  aria-label={`${seat} chỗ`}
                  aria-pressed={Number(values.seats) === seat}
                  onClick={() => onChange('seats', seat)}
                  className={`flex h-8 flex-1 items-center justify-center rounded-[10px] text-xs font-semibold ${
                    Number(values.seats) === seat
                      ? 'bg-[#0F9D76] text-white'
                      : 'bg-[#F4F7F5] text-[#4B5A54]'
                  }`}
                >
                  {seat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-[0.8fr_1.2fr] gap-3 px-5 pb-5 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-[52px] rounded-[17px] border border-[#DDE5E1] bg-white text-sm font-semibold text-[#4B5A54]"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={onApply}
          className="h-[52px] rounded-[17px] bg-[#0F9D76] text-sm font-semibold text-white shadow-[0_6px_16px_rgba(15,157,118,0.25)]"
        >
          Áp dụng
        </button>
      </div>
    </section>
  </div>
);

export const SearchResults = () => {
  const navigate = useNavigate();
  const { trips, searchFilter, setSearchParams } = useApp();
  const [sortBy, setSortBy] = useState('match');
  const initialFilters = {
    timeFrom: searchFilter.timeFrom || '07:00',
    timeTo: searchFilter.timeTo || '08:00',
    maxWalk: String(searchFilter.maxWalk || 500),
    maxPrice: String(searchFilter.maxPrice || 'all'),
    minRating: String(searchFilter.minRating || '4.5'),
    seats: searchFilter.seats || 1,
  };
  const [filters, setFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [isEditing, setIsEditing] = useState(false);
  const [showFilterSwipeHint, setShowFilterSwipeHint] = useState(true);

  const sortedTrips = useMemo(() => [...trips].sort((a, b) => {
    if (sortBy === 'price') return a.priceVnd - b.priceVnd;
    if (sortBy === 'time') return a.departureTime.localeCompare(b.departureTime);
    return b.matchPercentage - a.matchPercentage;
  }), [sortBy, trips]);

  const topMatch = Math.max(...trips.map((trip) => trip.matchPercentage), 0);
  const sortLabel = SORT_OPTIONS.find((option) => option.value === sortBy)?.label;
  const origin = shortLocation(searchFilter.origin) || 'FPT University';
  const destination = shortLocation(searchFilter.destination) || 'Bến Thành';

  const filterChips = [
    { id: 'time', label: `Giờ đi · ${filters.timeFrom}–${filters.timeTo}`, active: true },
    { id: 'walk', label: `Đi bộ · ≤ ${Number(filters.maxWalk) >= 1000 ? '1 km' : `${filters.maxWalk} m`}`, active: true },
    {
      id: 'price',
      label: filters.maxPrice === 'all' ? 'Giá' : `Giá · ≤ ${Number(filters.maxPrice).toLocaleString('vi-VN')} ₫`,
      active: filters.maxPrice !== 'all',
    },
    {
      id: 'rating',
      label: filters.minRating === 'all' ? 'Đánh giá' : `Đánh giá · ${filters.minRating}+`,
      active: filters.minRating !== 'all',
    },
    { id: 'seats', label: `Số chỗ · ${filters.seats}`, active: Number(filters.seats) > 1 },
    { id: 'edit', label: 'Sửa thông tin', active: false },
  ];

  const cycleSort = () => {
    const currentIndex = SORT_OPTIONS.findIndex((option) => option.value === sortBy);
    setSortBy(SORT_OPTIONS[(currentIndex + 1) % SORT_OPTIONS.length].value);
  };

  const openEditor = () => {
    setDraftFilters(filters);
    setIsEditing(true);
  };

  const handleFilterScroll = (event) => {
    const strip = event.currentTarget;
    const isAtEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 8;
    setShowFilterSwipeHint(!isAtEnd);
  };

  const changeDraftFilter = (field, value) => {
    setDraftFilters((current) => ({ ...current, [field]: value }));
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setSearchParams((current) => ({
      ...current,
      departureTime: `${draftFilters.timeFrom}–${draftFilters.timeTo}`,
      timeFrom: draftFilters.timeFrom,
      timeTo: draftFilters.timeTo,
      maxWalk: Number(draftFilters.maxWalk),
      maxPrice: draftFilters.maxPrice === 'all' ? null : Number(draftFilters.maxPrice),
      minRating: draftFilters.minRating === 'all' ? null : Number(draftFilters.minRating),
      seats: Number(draftFilters.seats),
    }));
    setIsEditing(false);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7F5]">
      <header className="flex shrink-0 flex-col gap-3 bg-white px-4 pb-3.5 pt-1">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Quay lại trang tìm chuyến"
            onClick={() => navigate('/passenger/home')}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#EEF2F0] bg-white text-[19px] text-[#101B17] hover:bg-[#F7FAF9]"
          >
            ‹
          </button>

          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <div className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-base font-semibold text-[#101B17]">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#0F9D76]" />
              <span className="truncate">{origin}</span>
              <span className="shrink-0 text-[#C9D3CF]">→</span>
              <span className="h-2 w-2 shrink-0 rounded-sm bg-[#EE7A22]" />
              <span className="truncate">{destination}</span>
            </div>
            <span className="truncate text-[12.5px] text-[#8A9993]">
              12/09 · {filters.timeFrom}–{filters.timeTo} · {filters.seats} khách
            </span>
          </div>

          <button
            type="button"
            onClick={openEditor}
            className="h-12 w-12 shrink-0 rounded-2xl bg-[#F1FAF6] text-[13px] font-semibold text-[#0B7A5C] hover:bg-[#DDF3EA]"
          >
            Sửa
          </button>
        </div>

        <div className="relative -mr-4">
          <div
            data-testid="filter-strip"
            aria-label="Danh sách bộ lọc, vuốt sang phải để xem nút sửa thông tin"
            onScroll={handleFilterScroll}
            className="rs-scroll flex snap-x snap-proximity gap-2 overflow-x-auto pb-0.5 pr-12"
          >
            {filterChips.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={openEditor}
                  className={`flex h-10 shrink-0 snap-start items-center gap-[7px] whitespace-nowrap rounded-full px-3.5 text-[13px] font-semibold ${
                    filter.id === 'edit'
                      ? 'border-[1.5px] border-[#BDE7D5] bg-[#F1FAF6] text-[#0B7A5C]'
                      : filter.active
                        ? 'bg-[#DDF3EA] text-[#0B7A5C]'
                        : 'border-[1.5px] border-[#E4EAE7] bg-white text-[#4B5A54]'
                  }`}
                >
                  {filter.id === 'edit' && <PencilLine className="h-3.5 w-3.5" strokeWidth={2.2} />}
                  {filter.label}
                  {filter.id !== 'edit' && (
                    <ChevronDown className="h-2.5 w-2.5 opacity-70" strokeWidth={2.5} />
                  )}
                </button>
            ))}
          </div>

          {showFilterSwipeHint && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex w-[72px] items-center justify-end bg-gradient-to-r from-white/0 via-white/90 to-white pr-3">
              <span className="animate-rs-swipe-hint flex h-8 w-8 items-center justify-center rounded-full border border-[#D7E9E1] bg-white/95 text-[#0B7A5C] shadow-[0_3px_10px_rgba(16,27,23,0.10)]">
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </div>
          )}
        </div>
      </header>

      {sortedTrips.length > 0 ? (
        <>
          <div className="flex shrink-0 items-center justify-between gap-2 px-4 pb-2.5 pt-3.5 text-[13px]">
            <span className="whitespace-nowrap text-[#4B5A54]">
              <strong className="font-semibold">{sortedTrips.length} chuyến</strong> trùng tuyến của bạn
            </span>
            <button
              type="button"
              onClick={cycleSort}
              aria-label={`Sắp xếp: ${sortLabel}`}
              className="flex min-w-0 items-center gap-1.5 font-semibold text-[#0B7A5C]"
            >
              <span className="truncate">{sortLabel}</span>
              <ChevronDown className="h-2.5 w-2.5 shrink-0" strokeWidth={2.5} />
            </button>
          </div>

          <div className="rs-scroll flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-4 pb-6">
            {sortedTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isBestMatch={trip.matchPercentage === topMatch}
                onOpen={() => navigate(`/passenger/trip/${trip.id}`)}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyResults onAdjust={() => navigate('/passenger/home')} />
      )}

      {isEditing && (
        <SearchEditForm
          values={draftFilters}
          onChange={changeDraftFilter}
          onCancel={() => setIsEditing(false)}
          onApply={applyFilters}
          origin={origin}
          destination={destination}
        />
      )}
    </div>
  );
};
