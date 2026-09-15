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
  AlertCircle
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
  const trip = trips.find(t => t.id === id) || activeTrip || {
    id: id || 'trip_001',
    driverId: 'drv_01',
    driverName: 'Nguyễn Quốc Huy',
    driverInitials: 'QH',
    driverTrustScore: 4.9,
    driverTripsCount: 96,
    driverPhone: '0908 123 456',
    vehicleModel: 'Honda City',
    vehiclePlate: '51G-119.02',
    vehicleColor: 'Trắng ngọc trai',
    vehicleSeats: 4,
    vehicleImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80',
    origin: 'FPT University HCMC (Cổng 2)',
    destination: 'Chợ Bến Thành, Q.1',
    distanceKm: 18.5,
    departureDate: 'Hôm nay, 12/09/2026',
    departureTime: '07:00',
    priceVnd: 45000,
    ratePerKm: 5000,
    availableSeats: 2,
    totalSeats: 4,
    passengers: [
      {
        id: 'pas_01',
        name: 'Lê Minh Anh',
        initials: 'MA',
        phone: '0912 345 678',
        trustScore: 4.8,
        pickupPoint: 'FPT University · Cổng 2',
        dropoffPoint: 'Chợ Bến Thành, Q.1',
        fareVnd: 45000,
        originalFare: 45000,
        status: 'confirmed'
      },
      {
        id: 'pas_02',
        name: 'Trần Thu Thảo',
        initials: 'TT',
        phone: '0909 333 444',
        trustScore: 4.9,
        pickupPoint: 'Ngã 4 Thủ Đức',
        dropoffPoint: 'Hàng Xanh, Bình Thạnh',
        fareVnd: 35000,
        originalFare: 35000,
        status: 'confirmed'
      }
    ]
  };

  const passengersList = trip.passengers?.length > 0 ? trip.passengers : [
    {
      id: 'pas_01',
      name: 'Lê Minh Anh',
      initials: 'MA',
      phone: '0912 345 678',
      trustScore: 4.8,
      pickupPoint: 'FPT University · Cổng 2',
      dropoffPoint: 'Chợ Bến Thành, Q.1',
      fareVnd: 45000,
      originalFare: 45000,
      status: 'confirmed'
    }
  ];

  // Passenger's real booking status for THIS trip — drives the bottom CTA and header
  // badge instead of assuming every trip viewed is already booked.
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

  const currentPassengerFare = discountPassenger?.originalFare || discountPassenger?.fareVnd || 45000;
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

  // Build Dynamic Multi-Stop Map Points for Passenger vs Driver
  const mapPoints = currentRole === 'passenger' ? [
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
  ] : [
    { label: `Đón Minh Anh · ${cleanShortName(trip.origin, 'ĐH FPT')}`, type: 'origin' },
    ...passengersList.flatMap(p => [
      { label: `Đón ${p.name?.split(' ').slice(-1)[0] || 'Khách'} · ${cleanShortName(p.pickupPoint, 'Đón')}`, type: 'pickup' },
      { label: `Trả ${p.name?.split(' ').slice(-1)[0] || 'Khách'} · ${cleanShortName(p.dropoffPoint, 'Trả')}`, type: 'dropoff' }
    ]).slice(0, 2),
    { label: `Kết thúc · ${cleanShortName(trip.destination, 'Bến Thành')}`, type: 'destination' }
  ];

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
            <span className="text-sm font-bold text-[#101B17]">Chi tiết chuyến đi</span>
            <span className="text-[11px] text-[#8A9993] font-mono">
              {myBooking?.bookingCode ? `${myBooking.bookingCode} · ` : ''}{trip.departureDate}
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
      <div className="flex-1 overflow-y-auto rs-scroll p-4 pb-28 flex flex-col gap-3.5">
        {/* Visual Route Map Preview */}
        <RouteMapPreview
          points={mapPoints}
          meta={`${trip.distanceKm || 18.5} km · ${trip.departureTime || '07:00'}`}
          heightClass="h-60 min-h-[240px] shrink-0"
        />

        {/* ========================================================================= */}
        {/* DRIVER VIEW SPECIFIC SECTION */}
        {/* ========================================================================= */}
        {currentRole === 'driver' ? (
          <>
            {/* Trip Overview Stats */}
            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A9993]">
                  Thông tin chuyến xe
                </span>
                <span className="text-xs font-bold text-[#0F9D76] font-mono">
                  {trip.vehicleModel} · {trip.vehiclePlate}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#EEF2F0]">
                <div className="p-2.5 rounded-2xl bg-[#F7FAF9] border border-[#EEF2F0] flex flex-col">
                  <span className="text-[10.5px] text-[#8A9993]">Chỗ đã đặt:</span>
                  <span className="text-sm font-bold text-[#101B17]">
                    {passengersList.length} / {trip.totalSeats || 4} chỗ
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
                            onClick={() => navigate('/shared/chat/bk_01')}
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
                Điểm đón & Điểm trả của bạn
              </span>

              <div className="flex gap-3 p-3 rounded-2xl bg-[#F7FAF9] border border-[#EEF2F0]">
                <div className="flex flex-col items-center pt-1 gap-1 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
                  <span className="w-0.5 flex-1 min-h-[18px] bg-[#DFE7E3]" />
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-3 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#8A9993]">Điểm đón (07:10)</span>
                    <span className="font-bold text-[#101B17] truncate">{trip.origin}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#8A9993]">Điểm trả (07:48)</span>
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
                  {new Intl.NumberFormat('vi-VN').format(trip.priceVnd)} ₫
                </span>
              </div>
              <div className="pt-2 border-t border-[#EEF2F0] flex flex-col gap-1 text-[11px] text-[#4B5A54]">
                <div className="flex justify-between">
                  <span>Số km thực tế bạn đi:</span>
                  <span className="font-mono font-semibold">16.2 km</span>
                </div>
                <div className="flex justify-between">
                  <span>Định mức chia sẻ chi phí:</span>
                  <span className="font-mono font-semibold">5.000 ₫/km</span>
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
                onClick={() => navigate('/shared/chat/bk_01')}
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
