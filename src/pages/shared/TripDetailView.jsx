import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Star,
  Car,
  Users,
  MapPin,
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Heart,
  Percent,
  ArrowRight,
  CalendarClock,
  Ban,
  Flag,
  X,
  Check,
  AlertCircle,
  Navigation,
  Shield
} from 'lucide-react';
import { RouteMapPreview } from '../../components/RouteMapPreview';
import { CancelTripSheet } from '../../components/CancelTripSheet';
import { RescheduleTripSheet } from '../../components/RescheduleTripSheet';
import { ReportModal } from '../../components/ReportModal';

export const TripDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentRole,
    trips,
    activeTrip,
    isWishlisted,
    toggleWishlist,
    applyDirectDiscount,
    bookings,
    currentUser,
    setActiveTripId,
    setActiveBookingId
  } = useApp();

  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [showRescheduleSheet, setShowRescheduleSheet] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Discount Modal State (Driver only)
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountPassenger, setDiscountPassenger] = useState(null);
  const [discountMode, setDiscountMode] = useState('percent'); // 'percent' | 'amount'
  const [discountPercentVal, setDiscountPercentVal] = useState(20);
  const [discountAmountVal, setDiscountAmountVal] = useState(15000);

  // Match trip from context or fallback
  const trip = trips.find(t => t.id === id) || (id === 'hist_drv_01' || !id ? trips.find(t => t.id === 'trip_001') : null) || activeTrip || trips[0];

  // Confirmed / active passengers on this trip
  const passengersList = (trip.passengers && trip.passengers.length > 0)
    ? trip.passengers
    : [
      {
        id: 'pas_02',
        name: 'Thùy Linh',
        initials: 'TL',
        phone: '0988 776 655',
        trustScore: 4.9,
        pickupPoint: 'Ngã 4 Thủ Đức',
        dropoffPoint: 'Hàng Xanh, Bình Thạnh',
        fareVnd: 35000,
        originalFare: 35000,
        status: 'confirmed'
      }
    ];

  // Passenger's real booking status for THIS trip
  const myBooking = currentRole === 'passenger'
    ? bookings.find((b) => b.tripId === trip.id && b.passengerId === currentUser.id
      && ['pending', 'confirmed', 'pending_reschedule', 'completed'].includes(b.status))
    : null;

  const bookingStatusBadge = !myBooking
    ? { label: 'Chưa đặt chỗ', bg: 'bg-[#F4F7F5]', fg: 'text-[#4B5A54]', border: 'border-[#E4EAE7]' }
    : myBooking.status === 'pending'
      ? { label: 'Chờ tài xế duyệt', bg: 'bg-[#FFF4E9]', fg: 'text-[#B45812]', border: 'border-[#F7D9B8]' }
      : myBooking.status === 'pending_reschedule'
        ? { label: 'Cần xác nhận lịch mới', bg: 'bg-[#FFF4E9]', fg: 'text-[#B45812]', border: 'border-[#F7D9B8]' }
        : { label: 'Đã giữ chỗ', bg: 'bg-[#DDF3EA]', fg: 'text-[#0B7A5C]', border: 'border-[#B2E2D0]' };

  const handlePrimaryAction = () => {
    setActiveTripId(trip.id);
    if (currentRole === 'driver') {
      navigate('/driver/active-trip');
      return;
    }
    if (!myBooking) {
      navigate(`/passenger/request-booking/${trip.id}`);
    } else if (myBooking.status === 'pending') {
      setActiveBookingId(myBooking.id);
      navigate(`/passenger/booking-pending/${trip.id}`);
    } else if (myBooking.status === 'pending_reschedule') {
      setActiveBookingId(myBooking.id);
      navigate(`/passenger/booking-confirm/${trip.id}`);
    } else {
      setActiveBookingId(myBooking.id);
      navigate('/passenger/live-tracking');
    }
  };

  const primaryActionLabel = currentRole === 'driver'
    ? 'Bắt đầu hành trình'
    : !myBooking
      ? 'Đặt chỗ ngay'
      : myBooking.status === 'pending'
        ? 'Xem trạng thái yêu cầu'
        : myBooking.status === 'pending_reschedule'
          ? 'Xem lịch mới cần xác nhận'
          : 'Theo dõi trực tiếp';

  const handleOpenDiscount = (passenger) => {
    setDiscountPassenger(passenger);
    setDiscountPercentVal(20);
    setDiscountAmountVal(15000);
    setShowDiscountModal(true);
  };

  const handleConfirmDiscount = (e) => {
    e.preventDefault();
    if (!discountPassenger) return;

    if (discountMode === 'percent') {
      applyDirectDiscount(trip.id, discountPassenger.id, 'percent', Number(discountPercentVal));
    } else {
      applyDirectDiscount(trip.id, discountPassenger.id, 'amount', Number(discountAmountVal));
    }

    setShowDiscountModal(false);
    setDiscountPassenger(null);
  };

  const currentPassengerFare = discountPassenger?.originalFare || discountPassenger?.fareVnd || 35000;
  const calculatedDiscountedFare = discountMode === 'percent'
    ? Math.max(0, Math.round(currentPassengerFare * (1 - discountPercentVal / 100)))
    : Math.max(0, currentPassengerFare - discountAmountVal);

  const cleanShortName = (str, fallback = '') => {
    if (!str) return fallback;
    return str
      .replace(/\s*\(.*?\)\s*/g, '')
      .replace(/University/gi, '')
      .replace(/HCMC/gi, '')
      .replace(/Chợ/gi, '')
      .replace(/,.*$/, '')
      .trim() || fallback;
  };

  // =========================================================================
  // DYNAMIC MAP POINTS GENERATION
  // - If Passenger view: Origin + Destination
  // - If Driver view:
  //   * 1 Passenger (Default = Thùy Linh): Origin -> Đón Thùy Linh -> Trả Thùy Linh -> Destination
  //   * 2 Passengers (Driver approves Minh Anh): Xuất phát & Đón Minh Anh -> Đón Thùy Linh -> Trả Thùy Linh -> Trả Minh Anh & Kết thúc
  // =========================================================================
  const buildMapPoints = () => {
    if (currentRole === 'passenger') {
      return [
        {
          label: `Điểm đón · ${cleanShortName(trip.origin, 'ĐH FPT')}`,
          type: 'origin',
          isPrimary: true
        },
        {
          label: `Điểm trả · ${cleanShortName(trip.destination, 'Bến Thành')}`,
          type: 'destination',
          isPrimary: true
        }
      ];
    }

    // Driver View
    const confirmedPassengers = passengersList;
    const hasMinhAnh = confirmedPassengers.some(p => p.name?.includes('Minh Anh') || p.id === 'pas_01');
    const hasThuyLinh = confirmedPassengers.some(p => p.name?.includes('Linh') || p.id === 'pas_02');

    // Case 2: Driver approved Minh Anh (Total 2 passengers: Thùy Linh + Minh Anh)
    if (confirmedPassengers.length >= 2 && hasMinhAnh) {
      return [
        { label: 'Xuất phát & Đón Minh Anh · ĐH FPT', type: 'origin' },
        { label: 'Đón Thùy Linh · Ngã 4 Thủ Đức', type: 'pickup' },
        { label: 'Trả Thùy Linh · Hàng Xanh', type: 'dropoff' },
        { label: 'Trả Minh Anh & Kết thúc · Bến Thành', type: 'destination' }
      ];
    }

    // Case 1 (Default): 1 Passenger (Thùy Linh)
    if (hasThuyLinh || confirmedPassengers.length === 1) {
      const p = confirmedPassengers.find(p => p.name?.includes('Linh') || p.id === 'pas_02') || confirmedPassengers[0];
      const pName = p?.name?.includes('Linh') ? 'Thùy Linh' : (p?.name || 'Thùy Linh');
      const pPickup = p?.pickupPoint ? cleanShortName(p.pickupPoint, 'Ngã 4 Thủ Đức') : 'Ngã 4 Thủ Đức';
      const pDropoff = p?.dropoffPoint ? cleanShortName(p.dropoffPoint, 'Hàng Xanh') : 'Hàng Xanh';
      return [
        { label: `Xuất phát · ${cleanShortName(trip.origin, 'ĐH FPT')}`, type: 'origin' },
        { label: `Đón ${pName} · ${pPickup}`, type: 'pickup' },
        { label: `Trả ${pName} · ${pDropoff}`, type: 'dropoff' },
        { label: `Điểm đến · ${cleanShortName(trip.destination, 'Bến Thành')}`, type: 'destination' }
      ];
    }

    // Generic fallback if multiple custom passengers
    return [
      { label: `Xuất phát · ${cleanShortName(trip.origin, 'ĐH FPT')}`, type: 'origin' },
      ...confirmedPassengers.flatMap(p => [
        { label: `Đón ${p.name?.split(' ').slice(-1)[0] || 'Khách'} · ${cleanShortName(p.pickupPoint, 'Đón')}`, type: 'pickup' },
        { label: `Trả ${p.name?.split(' ').slice(-1)[0] || 'Khách'} · ${cleanShortName(p.dropoffPoint, 'Trả')}`, type: 'dropoff' }
      ]),
      { label: `Điểm đến · ${cleanShortName(trip.destination, 'Bến Thành')}`, type: 'destination' }
    ];
  };

  const mapPoints = buildMapPoints();

  // =========================================================================
  // DYNAMIC STOP-BY-STOP ITINERARY FOR DRIVER VIEW
  // =========================================================================
  const buildDriverItinerary = () => {
    const confirmedPassengers = passengersList;
    const hasMinhAnh = confirmedPassengers.some(p => p.name?.includes('Minh Anh') || p.id === 'pas_01');

    if (confirmedPassengers.length >= 2 && hasMinhAnh) {
      return [
        {
          id: 'stop_1',
          time: trip.departureTime || '07:00',
          role: 'Xuất phát & Đón Khách 1',
          name: trip.origin || 'FPT University HCMC (Cổng 2)',
          detail: 'Đón Lê Minh Anh',
          isOrigin: true,
          badge: 'Đón Minh Anh',
          badgeColor: 'bg-[#DDF3EA] text-[#0B7A5C]'
        },
        {
          id: 'stop_2',
          time: '07:15',
          role: 'Trạm đón Khách 2',
          name: 'Ngã 4 Thủ Đức (Trạm dừng an toàn)',
          detail: 'Đón Thùy Linh',
          badge: 'Đón Thùy Linh',
          badgeColor: 'bg-[#DDF3EA] text-[#0B7A5C]'
        },
        {
          id: 'stop_3',
          time: '07:35',
          role: 'Trạm trả Khách 2',
          name: 'Hàng Xanh, Bình Thạnh',
          detail: 'Trả Thùy Linh',
          badge: 'Trả Thùy Linh',
          badgeColor: 'bg-[#FFF4E9] text-[#EE7A22]'
        },
        {
          id: 'stop_4',
          time: '08:00',
          role: 'Điểm kết thúc & Trả Khách 1',
          name: trip.destination || 'Chợ Bến Thành, Q.1',
          detail: 'Trả Lê Minh Anh & Kết thúc hành trình',
          isDestination: true,
          badge: 'Trả Minh Anh',
          badgeColor: 'bg-[#FFF4E9] text-[#EE7A22]'
        }
      ];
    }

    // Default 1 passenger (Thùy Linh)
    return [
      {
        id: 'stop_1',
        time: trip.departureTime || '07:00',
        role: 'Điểm xuất phát',
        name: trip.origin || 'FPT University HCMC',
        detail: 'Đón tài xế khởi hành',
        isOrigin: true
      },
      {
        id: 'stop_2',
        time: '07:20',
        role: 'Trạm đón khách',
        name: 'Ngã 4 Thủ Đức',
        detail: 'Đón Thùy Linh',
        badge: 'Đón Thùy Linh',
        badgeColor: 'bg-[#DDF3EA] text-[#0B7A5C]'
      },
      {
        id: 'stop_3',
        time: '07:45',
        role: 'Trạm trả khách',
        name: 'Hàng Xanh, Bình Thạnh',
        detail: 'Trả Thùy Linh',
        badge: 'Trả Thùy Linh',
        badgeColor: 'bg-[#FFF4E9] text-[#EE7A22]'
      },
      {
        id: 'stop_4',
        time: '08:00',
        role: 'Điểm kết thúc',
        name: trip.destination || 'Chợ Bến Thành, Q.1',
        detail: 'Kết thúc chuyến đi',
        isDestination: true
      }
    ];
  };

  const driverItinerary = buildDriverItinerary();

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Top App Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 border border-[#EEF2F0] rounded-xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 cursor-pointer"
          >
            ‹
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#101B17]">
              {currentRole === 'driver' ? 'Chi tiết & Lộ trình' : 'Chi tiết chuyến đi'}
            </span>
            <span className="text-[11px] text-[#8A9993] font-mono">
              {myBooking?.bookingCode ? `${myBooking.bookingCode} · ` : '#RS-4821 · '}{trip.departureDate || 'Hôm nay'}
            </span>
          </div>
        </div>

        {currentRole === 'driver' ? (
          <span className="px-2.5 py-1 rounded-full bg-[#DDF3EA] text-[#0B7A5C] text-[11px] font-bold border border-[#B2E2D0]">
            Chuyến của bạn
          </span>
        ) : (
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${bookingStatusBadge.bg} ${bookingStatusBadge.fg} ${bookingStatusBadge.border}`}>
            {bookingStatusBadge.label}
          </span>
        )}
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto rs-scroll pb-28 flex flex-col">
        {/* Full-bleed Edge-to-Edge Route Map */}
        <div className="w-full h-64 shrink-0 relative overflow-hidden border-b border-[#D5E2DC]">
          <RouteMapPreview
            points={mapPoints}
            meta={`${trip.distanceKm || 18.5} km · ${trip.departureTime || '07:00'}`}
            tag={currentRole === 'driver' ? 'Lộ trình chi tiết' : 'Chặng đi của bạn'}
            heightClass="h-full"
            className="rounded-none border-none shadow-none"
          />
        </div>

        {/* Content Details with padding */}
        <div className="p-4 flex flex-col gap-3.5">
          {/* ========================================================================= */}
          {/* DRIVER VIEW SPECIFIC SECTION (Merged Preview & Management Details) */}
          {/* ========================================================================= */}
          {currentRole === 'driver' ? (
            <>
            {/* Trip Meta Chips */}
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1.5 rounded-full bg-white border border-[#E4EAE7] text-[#4B5A54] text-[11.5px] font-semibold flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#0F9D76]" />
                {trip.vehicleModel} · <span className="font-mono font-bold text-[#0B7A5C]">{trip.vehiclePlate}</span>
              </span>
              <span className="px-2.5 py-1.5 rounded-full bg-white border border-[#E4EAE7] text-[#4B5A54] text-[11.5px] font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#0B7A5C]" />
                Còn {Math.max(0, (trip.totalSeats || 4) - passengersList.length)}/{trip.totalSeats || 4} chỗ
              </span>
              <span className="px-2.5 py-1.5 rounded-full bg-[#F1FAF6] border border-[#BDE7D5] text-[#0B7A5C] text-[11.5px] font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0F9D76] animate-pulse" />
                {trip.statusText || 'Đang mở'}
              </span>
            </div>

            {/* Trip Overview Stats */}
            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A9993]">
                  Tổng quan chi phí & Chỗ ngồi
                </span>
                <span className="text-xs font-bold text-[#0F9D76] font-mono">
                  {trip.ratePerKm || 5000} ₫/km
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#EEF2F0]">
                <div className="p-2.5 rounded-2xl bg-[#F7FAF9] border border-[#EEF2F0] flex flex-col">
                  <span className="text-[10.5px] text-[#8A9993]">Hành khách đã nhận:</span>
                  <span className="text-sm font-bold text-[#101B17]">
                    {passengersList.length} / {trip.totalSeats || 4} khách
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#F1FAF6] border border-[#BDE7D5] flex flex-col">
                  <span className="text-[10.5px] text-[#0B7A5C]">Tổng thu đóng góp:</span>
                  <span className="text-sm font-bold font-mono text-[#0F9D76]">
                    {new Intl.NumberFormat('vi-VN').format(passengersList.reduce((s, p) => s + (p.fareVnd || 0), 0))} ₫
                  </span>
                </div>
              </div>
            </div>

            {/* Stop-by-stop detailed itinerary timeline */}
            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A9993]">
                  Lộ trình chi tiết ({driverItinerary.length} trạm)
                </span>
                <span className="text-xs font-semibold text-[#0B7A5C] font-mono">
                  {trip.distanceKm || 18.5} km · {trip.departureTime || '07:00'}–08:00
                </span>
              </div>

              <div className="flex gap-3 pt-1">
                <div className="flex flex-col items-center pt-2 gap-1 shrink-0">
                  {driverItinerary.map((stop, idx) => (
                    <React.Fragment key={stop.id || idx}>
                      <span
                        className={
                          idx === driverItinerary.length - 1
                            ? 'w-2.5 h-2.5 rounded-xs bg-[#EE7A22] shrink-0'
                            : idx === 0
                              ? 'w-2.5 h-2.5 rounded-full bg-[#0F9D76] shrink-0'
                              : 'w-2 h-2 rounded-full bg-[#0B7A5C] shrink-0'
                        }
                      />
                      {idx < driverItinerary.length - 1 && (
                        <span className="w-0.5 flex-1 min-h-[36px] bg-[#DFE7E3]" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between gap-3.5">
                  {driverItinerary.map((stop, idx) => (
                    <div key={stop.id || idx} className="flex justify-between items-start gap-2">
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase font-bold text-[#8A9993] tracking-wider">
                            {stop.role}
                          </span>
                          {stop.badge && (
                            <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold ${stop.badgeColor}`}>
                              {stop.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#101B17] truncate">{stop.name}</span>
                        {stop.detail && (
                          <span className="text-[11px] text-[#4B5A54] truncate">{stop.detail}</span>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#101B17] font-mono shrink-0">{stop.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Confirmed Passengers List with Direct Discount Action */}
            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#0B7A5C]" />
                  <span className="text-xs font-bold text-[#101B17]">
                    Danh sách hành khách ({passengersList.length})
                  </span>
                </div>
                <span className="text-[10.5px] text-[#8A9993]">Tài xế có thể giảm giá riêng</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {passengersList.map((passenger) => {
                  const hasDiscount = passenger.discountApplied;
                  const isFav = isWishlisted(passenger.id);

                  return (
                    <div
                      key={passenger.id}
                      className="p-3.5 rounded-2xl bg-[#F7FAF9] border border-[#EEF2F0] flex flex-col gap-2.5 transition-all hover:border-[#BDE7D5]"
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-sm flex items-center justify-center shrink-0 border border-[#B2E2D0]">
                            {passenger.initials || 'KH'}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#101B17] truncate">{passenger.name}</span>
                              <span className="text-[10.5px] text-[#EE7A22] font-semibold flex items-center">
                                ★ {passenger.trustScore || 4.9}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-mono text-[#0B7A5C] font-semibold">
                              <Phone className="w-3 h-3 text-[#0F9D76]" />
                              <span>{passenger.phone || '0988 776 655'}</span>
                            </div>
                            <span className="text-[11px] text-[#4B5A54] truncate">
                              Đón: {passenger.pickupPoint}
                            </span>
                            <span className="text-[11px] text-[#8A9993] truncate">
                              Trả: {passenger.dropoffPoint}
                            </span>
                          </div>
                        </div>

                        {/* Silent Heart + Discount Icon */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Silent Wishlist Heart Button */}
                          <button
                            type="button"
                            onClick={() => toggleWishlist({ id: passenger.id, name: passenger.name, role: 'passenger', avatar: passenger.initials })}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${isFav ? 'bg-[#FFF0F0] text-[#C22B35]' : 'bg-white text-[#8A9993] hover:text-[#C22B35] border border-[#EEF2F0]'
                              }`}
                            title="Lưu vào danh sách khách quen (Wishlist)"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-[#C22B35]' : ''}`} />
                          </button>

                          {/* Direct Discount Icon Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDiscount(passenger)}
                            className="w-8 h-8 rounded-xl bg-white border border-[#EEF2F0] hover:border-[#EE7A22] hover:bg-[#FFF8F2] text-[#EE7A22] flex items-center justify-center transition-colors cursor-pointer"
                            title="Thiết lập giảm giá trực tiếp cho khách này"
                          >
                            <Percent className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Fare details + Quick chat & call */}
                      <div className="pt-2 border-t border-[#EAEFEA] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#8A9993]">Cước chia sẻ:</span>
                          {hasDiscount ? (
                            <div className="flex items-center gap-1">
                              <span className="line-through text-[#8A9993] text-[11px] font-mono">
                                {new Intl.NumberFormat('vi-VN').format(passenger.originalFare)} ₫
                              </span>
                              <span className="font-bold font-mono text-[#0F9D76]">
                                {new Intl.NumberFormat('vi-VN').format(passenger.fareVnd)} ₫
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-[#FFF4E9] text-[#EE7A22] text-[9.5px] font-bold">
                                {passenger.discountApplied.type === 'percent' ? `-${passenger.discountApplied.value}%` : `-${passenger.discountApplied.value / 1000}k`}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold font-mono text-[#101B17]">
                              {new Intl.NumberFormat('vi-VN').format(passenger.fareVnd)} ₫
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => navigate('/driver/messages')}
                            className="p-1.5 rounded-lg bg-white border border-[#EEF2F0] text-[#0B7A5C] hover:bg-[#F1FAF6] cursor-pointer"
                            title="Nhắn tin"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`tel:${passenger.phone || '0901234567'}`}
                            className="p-1.5 rounded-lg bg-white border border-[#EEF2F0] text-[#0B7A5C] hover:bg-[#F1FAF6] cursor-pointer"
                            title="Gọi điện"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Driver Actions Toolbar */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setShowRescheduleSheet(true)}
                className="h-12 rounded-2xl border border-[#E4EAE7] bg-white text-[#4B5A54] hover:bg-[#F7FAF9] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CalendarClock className="w-4 h-4 text-[#0B7A5C]" />
                <span>Đổi ngày/giờ đi</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCancelSheet(true)}
                className="h-12 rounded-2xl border border-[#E4EAE7] bg-white text-[#C22B35] hover:bg-[#FFF0F0] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Ban className="w-4 h-4 text-[#C22B35]" />
                <span>Huỷ chuyến đi</span>
              </button>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* PASSENGER VIEW SPECIFIC SECTION */
          /* ========================================================================= */
          <>
            {/* Driver Profile Card */}
            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-xs flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-base flex items-center justify-center shrink-0 border border-[#B2E2D0]">
                    {trip.driverInitials || 'QH'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#101B17] truncate">{trip.driverName}</span>
                      <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#8A9993]">
                      <span className="text-[#EE7A22] font-bold">★ {trip.driverTrustScore}</span>
                      <span>·</span>
                      <span>{trip.driverTripsCount} chuyến lái</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#0B7A5C] mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-[#0F9D76]" />
                      <span>{trip.driverPhone || '0908 123 456'}</span>
                    </div>
                  </div>
                </div>

                {/* Silent Heart for Passenger */}
                <button
                  type="button"
                  onClick={() => toggleWishlist({ id: trip.driverId || 'drv_01', name: trip.driverName, role: 'driver', avatar: trip.driverInitials, vehicle: `${trip.vehicleModel} · ${trip.vehiclePlate}` })}
                  className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${isWishlisted(trip.driverId || 'drv_01')
                    ? 'bg-[#FFF0F0] text-[#C22B35] border-[#F7D9D9]'
                    : 'bg-[#F4F7F5] text-[#8A9993] hover:text-[#C22B35] border-[#E4EAE7]'
                    }`}
                  title="Lưu tài xế yêu thích (Wishlist)"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted(trip.driverId || 'drv_01') ? 'fill-[#C22B35]' : ''}`} />
                  <span className="text-[11px]">{isWishlisted(trip.driverId || 'drv_01') ? 'Đã lưu' : 'Lưu'}</span>
                </button>
              </div>

              {/* Vehicle Row */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F7FAF9] border border-[#EEF2F0] text-xs">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#0B7A5C]" />
                  <span className="font-bold text-[#101B17]">{trip.vehicleModel} · {trip.vehicleColor}</span>
                </div>
                <span className="font-mono font-bold text-[#0B7A5C] bg-white px-2 py-0.5 rounded border border-[#BDE7D5]">
                  {trip.vehiclePlate}
                </span>
              </div>
            </div>

            {/* Passenger Route & Pick-up Details */}
            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-xs flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A9993]">
                Điểm đón & Điểm trả của bạnn
              </span>

              <div className="flex gap-3 p-3 rounded-2xl bg-[#F7FAF9] border border-[#EEF2F0]">
                <div className="flex flex-col items-center pt-1 gap-1 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
                  <span className="w-0.5 flex-1 min-h-[18px] bg-[#DFE7E3]" />
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#8A9993]">Điểm đón ({trip.departureTime || '07:00'})</span>
                    <span className="font-bold text-[#101B17] truncate">{trip.origin}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#8A9993]">Điểm trả (08:00)</span>
                    <span className="font-bold text-[#101B17] truncate">{trip.destination}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Transparency Breakdown */}
            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#101B17]">
                <span>Chi phí chia sẻ</span>
                <span className="text-base font-bold font-mono text-[#0B7A5C]">
                  {new Intl.NumberFormat('vi-VN').format(trip.priceVnd || 45000)} ₫
                </span>
              </div>
              <div className="pt-2 border-t border-[#EEF2F0] flex flex-col gap-1 text-[11px] text-[#4B5A54]">
                <div className="flex justify-between">
                  <span>Số km thực tế bạn đi:</span>
                  <span className="font-mono font-semibold">{trip.distanceKm || 18.5} km</span>
                </div>
                <div className="flex justify-between">
                  <span>Định mức chia sẻ chi phí:</span>
                  <span className="font-mono font-semibold">{trip.ratePerKm || 5000} ₫/km</span>
                </div>
                <div className="flex justify-between text-[#0B7A5C] font-semibold pt-1 border-t border-[#EEF2F0]">
                  <span>Phí nền tảng (0%):</span>
                  <span>Miễn phí</span>
                </div>
              </div>
            </div>

            {/* Passenger Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/passenger/messages')}
                className="h-12 rounded-2xl bg-[#F1FAF6] hover:bg-[#DDF3EA] text-[#0B7A5C] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Nhắn tin với tài xế</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="h-12 rounded-2xl border border-[#E4EAE7] bg-white text-[#8A4A0B] hover:bg-[#FFF4E9] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span>Báo cáo sự cố</span>
              </button>
            </div>
          </>
        )}
        </div>
      </div>

      {/* Sticky Bottom Action — reflects the passenger's real booking status for this trip */}
      <div className="absolute left-0 right-0 bottom-0 bg-white p-4 border-t border-[#EEF2F0] shadow-2xl z-20">
        <button
          type="button"
          onClick={handlePrimaryAction}
          className="w-full h-14 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-[15px] rounded-2xl shadow-[0_8px_20px_rgba(15,157,118,0.28)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
        >
          <span>{primaryActionLabel}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* DIRECT DISCOUNT MODAL (Driver configuring custom discount) */}
      {/* ========================================================================= */}
      {showDiscountModal && discountPassenger && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[360px] bg-white rounded-3xl p-5 border border-[#E4EAE7] shadow-2xl flex flex-col gap-3.5 relative overflow-hidden animate-[rs-pop_0.25s_ease-out]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF2F0]">
              <span className="text-sm font-bold text-[#101B17] flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-[#EE7A22]" />
                Giảm giá cho {discountPassenger.name}
              </span>
              <button
                type="button"
                onClick={() => setShowDiscountModal(false)}
                className="w-7 h-7 rounded-full bg-[#F4F7F5] text-[#4B5A54] flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDiscount} className="flex flex-col gap-3">
              {/* Discount Mode Switcher */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountMode('percent')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${discountMode === 'percent' ? 'bg-[#EE7A22] text-white shadow-xs' : 'bg-[#F4F7F5] text-[#4B5A54]'
                    }`}
                >
                  Giảm theo %
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountMode('amount')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${discountMode === 'amount' ? 'bg-[#EE7A22] text-white shadow-xs' : 'bg-[#F4F7F5] text-[#4B5A54]'
                    }`}
                >
                  Trừ tiền thẳng (₫)
                </button>
              </div>

              {/* Input Value */}
              {discountMode === 'percent' ? (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">
                    Phần trăm giảm giá (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      required
                      value={discountPercentVal}
                      onChange={(e) => setDiscountPercentVal(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="flex-1 px-3.5 py-2.5 text-sm font-mono font-bold bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl outline-none focus:border-[#EE7A22]"
                    />
                    <span className="text-sm font-bold text-[#8A9993]">%</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">
                    Số tiền giảm (₫)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="5000"
                      min="0"
                      max={currentPassengerFare}
                      required
                      value={discountAmountVal}
                      onChange={(e) => setDiscountAmountVal(Number(e.target.value))}
                      className="flex-1 px-3.5 py-2.5 text-sm font-mono font-bold bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl outline-none focus:border-[#EE7A22]"
                    />
                    <span className="text-xs font-bold text-[#8A9993]">₫</span>
                  </div>
                </div>
              )}

              {/* Price Calculation Preview */}
              <div className="p-3 rounded-2xl bg-[#F7FAF9] border border-[#EEF2F0] flex flex-col gap-1 text-xs">
                <div className="flex justify-between text-[#8A9993]">
                  <span>Giá gốc của khách:</span>
                  <span className="font-mono">{new Intl.NumberFormat('vi-VN').format(currentPassengerFare)} ₫</span>
                </div>
                <div className="flex justify-between text-[#0F9D76] font-bold text-sm pt-1 border-t border-[#EEF2F0]">
                  <span>Giá khách phải trả sau giảm:</span>
                  <span className="font-mono">{new Intl.NumberFormat('vi-VN').format(calculatedDiscountedFare)} ₫</span>
                </div>
              </div>

              {/* CRITICAL WARNING NOTE */}
              <div className="p-3 rounded-2xl bg-[#FFF8F2] border border-[#F7D9B8] flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-[#EE7A22] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#8A4A0B] leading-relaxed font-semibold">
                  Bạn sẽ chịu phần phí chênh lệch của Khách hàng.
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDiscountModal(false)}
                  className="flex-1 h-11 rounded-xl bg-[#F4F7F5] text-[#4B5A54] font-bold text-xs cursor-pointer"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#EE7A22] hover:bg-[#D96A16] text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
                >
                  Xác nhận giảm giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sheets & Modals */}
      <CancelTripSheet
        open={showCancelSheet}
        onClose={() => setShowCancelSheet(false)}
        tripId={trip.id}
        hasConfirmedPassengers={passengersList.length > 0}
      />

      <RescheduleTripSheet
        open={showRescheduleSheet}
        onClose={() => setShowRescheduleSheet(false)}
        tripId={trip.id}
        currentDate={trip.departureDate}
        currentTime={trip.departureTime}
        passengersCount={passengersList.length}
      />

      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportedName={currentRole === 'driver' ? 'Hành khách trên chuyến' : trip.driverName}
        tripCode={trip.id}
      />
    </div>
  );
};
