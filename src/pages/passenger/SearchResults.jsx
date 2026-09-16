import React, { useMemo, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  PencilLine,
  Search,
  X,
  Heart,
  ArrowUpDown,
  Crosshair,
  CheckCircle2,
  Clock,
  Navigation,
  MapPin,
  Car,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppMap } from '../../components/AppMap';

const SORT_OPTIONS = [
  { value: 'match', label: 'Phù hợp nhất' },
  { value: 'walk', label: 'Gần điểm đón' },
  { value: 'price', label: 'Giá thấp' },
  { value: 'time', label: 'Khởi hành sớm' },
];

const RESULT_DETAILS = {
  trip_001: {
    pickup: 'ĐH FPT',
    dropoff: 'Chợ Bến Thành - Cổng Bắc',
    pickupTime: '07:20',
    dropoffTime: '08:04',
    departure: '07:30',
    distance: '16,2 km',
    detourKm: '2.1 km',
    walk: '120 m',
    flexibility: '±15 phút',
    initials: 'MA',
    ratingCount: 32,
  },
  trip_002: {
    pickup: 'Cổng trường FPT (đường Võ Chí Công)',
    dropoff: 'Nguyễn Huệ',
    pickupTime: '07:35',
    dropoffTime: '08:18',
    departure: '07:15',
    distance: '14,8 km',
    detourKm: '3.5 km',
    walk: '250 m',
    flexibility: '±10 phút',
    initials: 'QB',
    ratingCount: 21,
  },
  trip_003: {
    pickup: 'ĐH FPT ',
    dropoff: 'Chợ Bến Thành',
    pickupTime: '07:48',
    dropoffTime: '08:40',
    departure: '07:45',
    distance: '13,1 km',
    detourKm: '4.8 km',
    walk: '400 m',
    flexibility: '±20 phút',
    initials: 'HN',
    ratingCount: 18,
  },
};

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
  return {
    pickup: reference.pickup || trip.originDetail || `ĐH FPT (${shortLocation(trip.origin)})`,
    dropoff: reference.dropoff || trip.destinationDetail || shortLocation(trip.destination),
    pickupTime: reference.pickupTime || getTime(trip.originDetail, trip.departureTime),
    dropoffTime: reference.dropoffTime || getTime(trip.destinationDetail, '08:15'),
    departure: reference.departure || trip.departureTime,
    distance: reference.distance || `${String(trip.distanceKm || 15).replace('.', ',')} km`,
    detourKm: reference.detourKm || `${(Math.random() * 2 + 1.5).toFixed(1)} km`,
    walk: reference.walk || '200 m',
    flexibility: reference.flexibility || '±15 phút',
    initials: reference.initials || trip.driverInitials || trip.driverName?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || 'TX',
    ratingCount: reference.ratingCount || 25,
  };
};

// Interactive Trip Card matching the user's reference design
const TripCard = ({ trip, isBestMatch, onOpen, isRecurringMode, onSubscribeMonthly, isSubscribed }) => {
  const { isWishlisted, toggleWishlist } = useApp();
  const details = getTripDetails(trip);
  const driverId = trip.driverId || `drv_${(trip.driverName || 'driver').replace(/\s+/g, '_').toLowerCase()}`;
  const isFav = isWishlisted(driverId);
  const initials = details.initials || trip.driverInitials || 'TX';

  const singlePrice = trip.priceVnd || 35000;
  const monthlyTripsCount = 22;
  const rawMonthlyTotal = singlePrice * monthlyTripsCount;
  const discountRate = 0.15; // 15% discount for monthly subscription
  const discountedMonthlyTotal = Math.round(rawMonthlyTotal * (1 - discountRate));

  return (
    <article className="flex flex-col gap-2.5 rounded-2xl bg-white p-3.5 shadow-[0_2px_12px_rgba(16,27,23,0.06)] border border-[#E4EAE7] transition-all hover:border-[#BDE7D5]">
      {/* Top Header: Driver Initials Avatar + Info + Wishlist */}
      <div className="flex items-start gap-2.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#DDF3EA] text-sm font-bold text-[#0B7A5C] border border-[#B2E2D0]">
          {initials}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[13.5px] font-bold text-[#101B17]">{trip.driverName}</span>
            <CheckCircle2 className="h-3.5 w-3.5 fill-[#2563EB] text-white shrink-0" />
            {isBestMatch && (
              <span className="px-1.5 py-0.2 rounded-md bg-[#DDF3EA] text-[#0B7A5C] text-[9px] font-bold">
                Phù hợp nhất
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#4B5A54] mt-0.5">
            <span className="text-[#EE7A22] font-bold">★ {trip.driverTrustScore || 4.9}</span>
            <span className="text-[#8A9993]">({details.ratingCount} đánh giá)</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#8A9993] mt-0.5">
            <Car className="h-3 w-3 text-[#0F9D76] shrink-0" />
            <span className="truncate">{trip.vehicleModel || 'Toyota Vios 2021'}</span>
            <span>·</span>
            <span className="font-semibold text-[#0B7A5C]">Còn {trip.availableSeats || 3} chỗ trống</span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist({
              id: driverId,
              name: trip.driverName,
              role: 'driver',
              avatar: trip.driverInitials || 'TX',
              vehicle: trip.vehicleModel,
              rating: trip.driverTrustScore || 4.9,
              totalTrips: trip.driverCompletedTrips || 45,
              phone: '0901234567',
            });
          }}
          className="p-1 rounded-full hover:bg-[#F0F5F2] text-[#8A9993] hover:text-[#C22B35] transition-colors cursor-pointer shrink-0"
          title="Lưu tài xế yêu thích (kín đáo)"
        >
          <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isFav ? 'fill-[#C22B35] text-[#C22B35]' : 'text-[#8A9993]'}`} />
        </button>
      </div>

      {/* 3-Column Key Info Grid */}
      <div className="grid grid-cols-[1.1fr_1.1fr_1fr] gap-1.5 rounded-xl bg-[#F8FAF9] p-2.5 border border-[#EEF2F0] text-left">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-[10px] text-[#8A9993]">
            <Clock className="h-3 w-3 text-[#0F9D76]" />
            <span>Khởi hành</span>
          </div>
          <span className="text-xs font-bold text-[#101B17] font-mono mt-0.5">{details.departure}</span>
          <span className="text-[9px] text-[#8A9993] leading-tight mt-0.5">(linh hoạt {details.flexibility})</span>
        </div>

        <div className="flex flex-col border-l border-[#E4EAE7] pl-2">
          <div className="flex items-center gap-1 text-[10px] text-[#8A9993]">
            <Navigation className="h-3 w-3 text-[#0F9D76]" />
            <span>Độ lệch tuyến</span>
          </div>
          <span className="text-xs font-bold text-[#101B17] font-mono mt-0.5">~ {details.detourKm}</span>
          <span className="text-[9px] text-[#8A9993] leading-tight mt-0.5">(so với tuyến bạn)</span>
        </div>

        <div className="flex flex-col items-end justify-center border-l border-[#E4EAE7] pl-2">
          {isRecurringMode ? (
            <>
              <span className="text-[13px] font-bold font-mono text-[#0B7A5C] leading-none">
                {new Intl.NumberFormat('vi-VN').format(discountedMonthlyTotal)} ₫
              </span>
              <span className="text-[9px] text-[#8A9993] mt-1 line-through">
                {new Intl.NumberFormat('vi-VN').format(rawMonthlyTotal)} ₫
              </span>
              <span className="text-[8.5px] font-bold text-[#0F9D76]">22 chuyến / tháng</span>
            </>
          ) : (
            <>
              <span className="text-[14px] font-bold font-mono text-[#0B7A5C] leading-none">
                {trip.priceVnd.toLocaleString('vi-VN')} ₫
              </span>
              <span className="text-[9.5px] text-[#8A9993] mt-1">/người</span>
            </>
          )}
        </div>
      </div>

      {/* Pickup Station & CTA Button */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-[#4B5A54]">
          <MapPin className="h-3.5 w-3.5 text-[#0F9D76] shrink-0" />
          <span className="truncate font-medium">Điểm đón: <strong className="font-semibold text-[#101B17]">{details.pickup}</strong></span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          {isRecurringMode ? (
            <button
              type="button"
              disabled={isSubscribed}
              onClick={() => onSubscribeMonthly && onSubscribeMonthly(trip)}
              className={`h-8 rounded-xl px-3 text-[11.5px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs ${
                isSubscribed 
                  ? 'bg-[#DDF3EA] text-[#0B7A5C] border border-[#B2E2D0]' 
                  : 'bg-[#0F9D76] hover:bg-[#0B7A5C] text-white'
              }`}
            >
              <span>{isSubscribed ? '✓ Đã gửi yêu cầu' : 'Đăng ký trọn gói tháng'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpen}
              className="h-8 shrink-0 rounded-xl bg-[#0F9D76] px-3.5 text-[11.5px] font-bold text-white shadow-xs hover:bg-[#0B7A5C] transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Xem chi tiết chuyến</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
};


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
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#2563EB]" />
            <span className="truncate">{origin}</span>
            <span className="shrink-0 text-[#C9D3CF]">→</span>
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-[#EE7A22]" />
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
              <option value="70000">70.000 ₫</option>
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

          <div className="rounded-2xl border border-[#E4EAE7] bg-white px-3 py-2.5 flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8A9993]">Số chỗ đặt</span>
              <span className="text-xs font-bold text-[#101B17]">{values.seats || 1} người</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F4F7F5] p-1 rounded-xl border border-[#E4EAE7]">
              <button
                type="button"
                onClick={() => onChange('seats', Math.max(1, Number(values.seats || 1) - 1))}
                disabled={Number(values.seats || 1) <= 1}
                className="w-6 h-6 rounded-lg bg-white disabled:opacity-30 text-[#101B17] font-bold text-xs flex items-center justify-center hover:bg-[#DDF3EA] hover:text-[#0B7A5C] transition-colors cursor-pointer shadow-xs"
              >
                -
              </button>
              <span className="w-5 text-center text-xs font-bold font-mono text-[#101B17]">
                {values.seats || 1}
              </span>
              <button
                type="button"
                onClick={() => onChange('seats', Math.min(6, Number(values.seats || 1) + 1))}
                disabled={Number(values.seats || 1) >= 6}
                className="w-6 h-6 rounded-lg bg-white disabled:opacity-30 text-[#101B17] font-bold text-xs flex items-center justify-center hover:bg-[#DDF3EA] hover:text-[#0B7A5C] transition-colors cursor-pointer shadow-xs"
              >
                +
              </button>
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
  const location = useLocation();
  const { trips, searchFilter, setSearchParams, subscribeRecurringCommute, driverSchedules } = useApp();
  
  const queryParams = new URLSearchParams(location.search);
  const isRecurringMode = queryParams.get('mode') === 'recurring';
  const scheduleId = queryParams.get('scheduleId');

  const [sortBy, setSortBy] = useState('match');
  const [isExpanded, setIsExpanded] = useState(false); // 'half' (false) or 'full' (true)
  const [subscribedTrip, setSubscribedTrip] = useState(null);
  const [subscribedIds, setSubscribedIds] = useState([]);
  const touchStartY = useRef(null);

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

  // Filters actually narrow the list now — they used to only relabel the chips.
  const filteredTrips = useMemo(() => trips.filter((trip) => {
    if (filters.maxPrice !== 'all' && trip.priceVnd > Number(filters.maxPrice)) return false;
    if (filters.minRating !== 'all' && (trip.driverTrustScore || 0) < Number(filters.minRating)) return false;
    if (Number(filters.seats) > (trip.availableSeats || 0)) return false;
    const walk = parseInt(RESULT_DETAILS[trip.id]?.walk || '200', 10);
    if (walk > Number(filters.maxWalk)) return false;
    if (filters.timeFrom && filters.timeTo && trip.departureTime) {
      if (trip.departureTime < filters.timeFrom || trip.departureTime > filters.timeTo) return false;
    }
    return true;
  }), [trips, filters]);

  const sortedTrips = useMemo(() => [...filteredTrips].sort((a, b) => {
    if (sortBy === 'price') return a.priceVnd - b.priceVnd;
    if (sortBy === 'time') return a.departureTime.localeCompare(b.departureTime);
    if (sortBy === 'walk') {
      const walkA = parseInt(RESULT_DETAILS[a.id]?.walk || '200', 10);
      const walkB = parseInt(RESULT_DETAILS[b.id]?.walk || '200', 10);
      return walkA - walkB;
    }
    return b.matchPercentage - a.matchPercentage;
  }), [sortBy, filteredTrips]);

  const topMatch = Math.max(...filteredTrips.map((trip) => trip.matchPercentage), 0);
  const origin = queryParams.get('origin') || searchFilter.origin || 'Đại học FPT Thành phố Hồ Chí Minh';
  const destination = queryParams.get('destination') || searchFilter.destination || 'Chợ Bến Thành - Cổng Bắc';

  const handleSubscribeMonthly = (trip) => {
    const targetDriverSched = driverSchedules[0]?.id || 'dsch_01';
    subscribeRecurringCommute(targetDriverSched, 'Đăng ký đi chung định kỳ cả tháng (T2-T6)');
    setSubscribedIds(prev => [...prev, trip.id]);
    setSubscribedTrip(trip);
  };

  const openEditor = () => {
    setDraftFilters(filters);
    setIsEditing(true);
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

  const handleSwapPoints = () => {
    setSearchParams(prev => ({
      ...prev,
      origin: destination,
      destination: origin,
    }));
  };

  // Touch Swipe Handlers for expanding / collapsing the bottom sheet
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartY.current - currentY;

    // Swipe Up > 40px -> Expand
    if (diff > 40 && !isExpanded) {
      setIsExpanded(true);
      touchStartY.current = null;
    }
    // Swipe Down > 40px -> Collapse
    else if (diff < -40 && isExpanded) {
      setIsExpanded(false);
      touchStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#EBF2EE]">
      {/* 1. Top Floating Header & 2-Point Search Card */}
      <div className="absolute top-0 inset-x-0 z-30 flex flex-col gap-2 p-3 bg-gradient-to-b from-white/95 via-white/80 to-transparent pb-6 pointer-events-auto">
        {/* Top Navbar */}
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            aria-label="Quay lại"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/90 text-[20px] text-[#101B17] shadow-sm hover:bg-white active:scale-95 transition-all border border-[#E4EAE7]"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => navigate('/passenger/destination-search')}
            className="text-xs font-semibold text-[#2563EB] hover:underline px-1 py-1"
          >
            Chọn từ bản đồ
          </button>
        </div>

        {/* Floating 2-Point Route Card */}
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#E4EAE7] bg-white/95 p-3 shadow-md backdrop-blur-md">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#101B17]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2563EB] shrink-0" />
              <span className="truncate">{origin}</span>
            </div>
            <div className="h-px bg-[#EEF2F0] ml-4" />
            <div className="flex items-center gap-2 text-xs font-semibold text-[#101B17]">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#EE7A22] shrink-0" />
              <span className="truncate">{destination}</span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đổi chiều điểm đón và điểm đến"
            onClick={handleSwapPoints}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#DDF3EA] hover:text-[#0B7A5C] transition-colors border border-[#E4EAE7]"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Map Backdrop Layer */}
      <AppMap
        mode="backdrop"
        pickupName={origin}
        dropoffName={destination}
        pickupAddress={origin}
        dropoffAddress={destination}
        padding={
          isExpanded
            ? { top: 90, bottom: 80, left: 35, right: 35 }
            : { top: 165, bottom: 440, left: 35, right: 35 }
        }
      />

      {/* 3. Expandable Bottom Sheet */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 flex flex-col bg-white rounded-t-[28px] shadow-[0_-8px_30px_rgba(16,27,23,0.14)] transition-all duration-300 ease-out border-t border-[#DCE8E2] ${isExpanded ? 'top-[78px] h-[calc(100%-78px)]' : 'top-[50%] h-[50%]'
          }`}
      >
        {/* Grab Handle & Drag Area */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-col items-center pt-2 pb-1 cursor-pointer select-none group"
          title="Vuốt lên để xem toàn bộ danh sách, vuốt xuống để xem bản đồ"
        >
          <div className="h-1.5 w-12 rounded-full bg-[#D8E1DD] group-hover:bg-[#0F9D76] transition-colors" />
        </div>

        {/* Recurring Commute Banner (When in recurring mode) */}
        {isRecurringMode && (
          <div className="bg-[#DDF3EA] border border-[#B2E2D0] rounded-2xl p-2.5 mx-3.5 mb-1.5 flex items-center justify-between text-xs shrink-0 shadow-xs">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-base shrink-0">🔁</span>
              <div className="min-w-0">
                <span className="font-bold text-[#0B7A5C] block truncate">Đăng ký đi chung định kỳ cả tháng</span>
                <p className="text-[10.5px] text-[#4B5A54] truncate">Trọn gói 22 chuyến · Tiết kiệm thêm 15%</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => navigate('/passenger/schedules')} 
              className="text-[11px] font-bold text-[#0F9D76] hover:underline shrink-0 pl-2 cursor-pointer"
            >
              Lịch đã lưu →
            </button>
          </div>
        )}

        {/* Quick Filter Tabs Horizontal Strip */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 border-b border-[#EEF2F0] rs-scroll shrink-0">
          {SORT_OPTIONS.map((option) => {
            const isActive = sortBy === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSortBy(option.value)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${isActive
                  ? 'bg-[#DDF3EA] text-[#0B7A5C] border border-[#B2E2D0] shadow-2xs'
                  : 'bg-[#F4F7F5] text-[#4B5A54] border border-[#E4EAE7] hover:bg-[#EBF2EE]'
                  }`}
              >
                {option.value === 'match' && <span>✨</span>}
                {option.value === 'walk' && <span>📍</span>}
                <span>{option.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={openEditor}
            className="flex shrink-0 items-center gap-1 rounded-full border border-[#DCE8E2] bg-white px-3 py-1.5 text-xs font-semibold text-[#4B5A54] hover:bg-[#F4F7F5] ml-auto"
          >
            <PencilLine className="h-3 w-3 text-[#0F9D76]" />
            <span>Lọc nâng cao</span>
          </button>
        </div>

        {/* Trip Count and Hint Summary */}
        <div className="flex items-center justify-between px-4 py-2 text-[11.5px] text-[#8A9993] shrink-0">
          <span>Tìm thấy <strong className="font-semibold text-[#101B17]">{sortedTrips.length} chuyến</strong> đi qua lộ trình của bạn</span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#0F9D76] font-semibold text-[11px] hover:underline"
          >
            {isExpanded ? 'Thu gọn bản đồ ▾' : 'Xem danh sách đầy đủ ▴'}
          </button>
        </div>

        {/* Scrollable Trip List */}
        <div className="rs-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3.5 pb-6">
          {sortedTrips.length > 0 ? (
            sortedTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isBestMatch={trip.matchPercentage === topMatch}
                onOpen={() => navigate(`/shared/trip-detail/${trip.id}`)}
                isRecurringMode={isRecurringMode}
                onSubscribeMonthly={handleSubscribeMonthly}
                isSubscribed={subscribedIds.includes(trip.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Search className="h-10 w-10 text-[#8A9993] mb-2" />
              <p className="text-sm font-semibold text-[#101B17]">Không tìm thấy chuyến phù hợp</p>
              <button
                type="button"
                onClick={openEditor}
                className="mt-3 text-xs font-semibold text-[#0F9D76] underline"
              >
                Thay đổi bộ lọc tìm kiếm
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Subscription Celebration Modal */}
      {subscribedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-[#B2E2D0] text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#DDF3EA] text-[#0F9D76] font-bold flex items-center justify-center text-2xl mx-auto border border-[#B2E2D0]">
              🎉
            </div>

            <div>
              <h3 className="text-base font-bold text-[#101B17]">Đã gửi yêu cầu đăng ký định kỳ!</h3>
              <p className="text-xs text-[#4B5A54] mt-1 leading-relaxed">
                Yêu cầu đi chung trọn gói <strong>22 chuyến tháng 10</strong> đã được gửi tới <strong>{subscribedTrip.driverName}</strong>.
              </p>
            </div>

            <div className="bg-[#F1FAF6] p-3 rounded-2xl border border-[#DDF3EA] text-xs text-left space-y-1">
              <p className="font-bold text-[#0B7A5C]">Đã tự động cập nhật vào:</p>
              <p className="text-[#4B5A54]">✓ Trang Lịch trình cố định (/passenger/schedules)</p>
              <p className="text-[#4B5A54]">✓ Trang chủ & Lịch sử chuyến đi của bạn</p>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setSubscribedTrip(null)}
                className="flex-1 py-3 bg-[#F4F7F5] hover:bg-[#E4EAE7] text-[#4B5A54] font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Ở lại tìm kiếm
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubscribedTrip(null);
                  navigate('/passenger/schedules');
                }}
                className="flex-1 py-3 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
              >
                Xem lịch của tôi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Edit Filter Modal */}
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
