import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Mail, Plus, CalendarClock, Ban, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Repeat } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CancelTripSheet } from '../../components/CancelTripSheet';
import { RescheduleTripSheet } from '../../components/RescheduleTripSheet';

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const TODAY_TRIP_STATUS = {
  'Đang mở': { label: 'Đã xác nhận', bg: 'bg-[#DDF1F4]', fg: 'text-[#0A6E7A]', dot: 'bg-[#0A6E7A]' },
  'Đã huỷ': { label: 'Đã huỷ chuyến', bg: 'bg-[#FCEBEB]', fg: 'text-[#C22B35]', dot: 'bg-[#C22B35]' },
  'Hoàn thành': { label: 'Hoàn thành', bg: 'bg-[#DDF3EA]', fg: 'text-[#0B7A5C]', dot: 'bg-[#0F9D76]' },
};

export const DriverHome = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    driverSchedules, 
    toggleDriverSchedule, 
    trips, 
    pendingBookingsForDriver, 
    respondBooking 
  } = useApp();
  const [activeTripIndex, setActiveTripIndex] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [bookingConfirmModal, setBookingConfirmModal] = useState(null);

  const primaryDriverSched = driverSchedules[0] || {
    id: 'dsch_01',
    title: 'Sáng đi làm',
    origin: 'Phan Văn Trị, Gò Vấp',
    destination: 'Khu Công Nghệ Cao, Q.9',
    time: '07:00',
    availableSeats: 1,
    vehicleModel: 'Honda SH 150i',
    active: true
  };

  // Today's trips list for driver (Card 1: Primary Demo Single Trip, Card 2: Recurring Trip)
  const defaultTodayTrips = [
    {
      id: 'trip_001',
      tripKind: 'single',
      kindLabel: 'Chuyến lẻ',
      statusText: (trips.find(t => t.id === 'trip_001')?.statusText) || 'Đang mở',
      countdown: 'Khởi hành sau 1 giờ 19 phút',
      origin: 'FPT University HCMC',
      departureTime: '07:00',
      destination: 'Chợ Bến Thành, Q.1',
      arrivalTime: '08:00',
      totalSeats: 4,
      passengers: (trips.find(t => t.id === 'trip_001')?.passengers || [
        { id: 'p1', initials: 'TL', name: 'Thùy Linh', fareVnd: 35000 },
        { id: 'p2', initials: 'MA', name: 'Minh Anh', fareVnd: 45000 },
      ]).map(p => ({
        id: p.id,
        initials: p.initials,
        shortName: p.name ? p.name.split(' ').at(-1) : 'Khách',
        fareVnd: p.fareVnd,
      })),
    },
    {
      id: primaryDriverSched.id || 'trip_002',
      tripKind: 'recurring',
      kindLabel: 'Lịch định kỳ',
      statusText: primaryDriverSched.active ? 'Đang mở' : 'Tạm dừng',
      countdown: `Khởi hành lúc ${primaryDriverSched.time || '17:30'}`,
      origin: primaryDriverSched.origin || 'Nhà · Phú Mỹ Hưng',
      departureTime: primaryDriverSched.time || '17:30',
      destination: primaryDriverSched.destination || 'FPT University HCMC',
      arrivalTime: '18:18',
      totalSeats: primaryDriverSched.totalSeats || 2,
      passengers: (primaryDriverSched.subscribers || [
        { id: 'p3', initials: 'MA', name: 'Minh Anh', shortName: 'Minh Anh', fareVnd: 35000 },
      ]).map(p => ({
        id: p.id,
        initials: p.avatar || 'MA',
        shortName: p.name ? p.name.split(' ').at(-1) : 'Khách',
        fareVnd: p.fareVnd || 35000,
      })),
    }
  ];

  // Merge any dynamically created trips from context
  const dynamicDriverTrips = trips.filter(t => t.id !== 'trip_001' && t.id !== 'trip_002');
  const todayTripsList = [
    ...defaultTodayTrips,
    ...dynamicDriverTrips.map(t => ({
      id: t.id,
      tripKind: 'single',
      kindLabel: 'Chuyến lẻ',
      statusText: t.statusText || 'Đang mở',
      countdown: `Khởi hành lúc ${t.departureTime || '07:00'}`,
      origin: t.origin,
      departureTime: t.departureTime || '07:00',
      destination: t.destination,
      arrivalTime: t.arrivalTime || '08:00',
      totalSeats: t.totalSeats || 4,
      passengers: (t.passengers || []).map(p => ({
        id: p.id,
        initials: p.initials || 'KH',
        shortName: p.name ? p.name.split(' ').at(-1) : 'Khách',
        fareVnd: p.fareVnd || 45000,
      })),
    }))
  ];

  const safeTripIndex = Math.min(activeTripIndex, todayTripsList.length - 1);
  const currentActiveTrip = todayTripsList[safeTripIndex] || todayTripsList[0];
  const currentBookedPassengers = currentActiveTrip.passengers || [];
  const currentBookedSeats = currentBookedPassengers.length;
  const currentTotalSeats = currentActiveTrip.totalSeats || 4;
  const currentTotalVnd = currentBookedPassengers.reduce((sum, p) => sum + (p.fareVnd || 0), 0);
  const currentStatus = TODAY_TRIP_STATUS[currentActiveTrip.statusText] || TODAY_TRIP_STATUS['Đang mở'];

  const workSchedule = driverSchedules[0] || primaryDriverSched;
  const isScheduleActive = workSchedule?.active ?? true;

  const toggleWorkSchedule = () => {
    if (workSchedule) toggleDriverSchedule(workSchedule.id);
  };

  return (
    <div className="w-full min-h-full bg-[#F4F7F5] flex flex-col">
      <header className="flex-none bg-white px-5 pt-1 pb-[18px] flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="w-12 h-12 rounded-full bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center text-base font-semibold shrink-0"
          aria-label="Mở hồ sơ tài xế"
        >
          {currentUser.initials || 'QH'}
        </button>

        <div className="flex-1 min-w-0 flex flex-col gap-px">
          <span className="text-xs font-medium text-[#8A9993]">Chào buổi sáng</span>
          <span className="flex items-center gap-[7px] text-lg font-semibold text-[#101B17] leading-tight min-w-0">
            <span className="truncate">{currentUser.name || 'Quốc Huy'}</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-label="Tài xế đã xác thực">
              <circle cx="12" cy="12" r="10" fill="#0F9D76" />
              <polyline points="7.5,12.5 10.5,15.5 16.5,9" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-[11.5px] text-[#8A9993] truncate">
            <span className="text-[#F0A020]">★</span> {currentUser.trustScore || '4.8'} · {currentUser.vehicle?.model || 'Honda City'} · {currentUser.vehicle?.plate || '51G-119.02'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/driver/notifications')}
          className="relative w-12 h-12 border border-[#EEF2F0] rounded-2xl bg-white flex items-center justify-center shrink-0 hover:bg-[#F7FAF9] transition-colors"
          aria-label="Mở thông báo"
        >
          <svg viewBox="0 0 24 24" className="w-[21px] h-[21px]" fill="none" stroke="#4B5A54" strokeWidth="1.9" strokeLinecap="round">
            <rect x="5" y="4.5" width="14" height="15" rx="4" />
            <line x1="9" y1="9.5" x2="15" y2="9.5" />
            <line x1="9" y1="14" x2="13" y2="14" />
          </svg>
          {pendingBookingsForDriver.length > 0 && (
            <span className="absolute top-[9px] right-[9px] w-2.5 h-2.5 rounded-full bg-[#EE7A22] border-2 border-white" />
          )}
        </button>
      </header>

      <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
        <button
          type="button"
          onClick={() => navigate('/driver/create-trip')}
          className="w-full h-16 rounded-[20px] bg-[#0F9D76] hover:bg-[#0B8A66] text-white text-[17px] font-semibold flex items-center justify-center gap-2.5 shadow-[0_8px_22px_rgba(15,157,118,0.30)] active:scale-[0.99] transition-all"
        >
          <span className="w-[26px] h-[26px] rounded-full bg-white/20 flex items-center justify-center text-[17px] leading-none">+</span>
          Tạo chuyến đi
        </button>

        {pendingBookingsForDriver.length > 0 && (
          <div
            onClick={() => navigate('/driver/requests')}
            className="rounded-[22px] bg-[#FFF4E9] border border-[#F7D9B8] p-4 flex items-center gap-3.5 cursor-pointer hover:bg-[#FFEEDB] active:scale-[0.99] transition-all"
          >
            <span className="flex shrink-0">
              {pendingBookingsForDriver.slice(0, 2).map((booking, index) => (
                <span
                  key={booking.id}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-[#FFF4E9] ${
                    index === 0 ? 'bg-[#DDF3EA] text-[#0B7A5C]' : '-ml-3.5 bg-white text-[#4B5A54]'
                  }`}
                >
                  {booking.passengerInitials}
                </span>
              ))}
            </span>

            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[14.5px] font-semibold text-[#8A4A0B]">{pendingBookingsForDriver.length} yêu cầu chờ bạn duyệt</span>
              <span className="text-xs leading-[1.35] text-[#8A4A0B] truncate">
                {pendingBookingsForDriver[0]?.createdAt || 'Vừa xong'} · chuyến {pendingBookingsForDriver[0]?.departureTime || '07:00'} hôm nay
              </span>
            </span>

            <span className="flex flex-col gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBookingConfirmModal({ type: 'accept', booking: pendingBookingsForDriver[0] });
                }}
                className="h-9 px-4 rounded-[14px] bg-[#EE7A22] hover:bg-[#D96A16] text-white text-[13.5px] font-semibold transition-colors cursor-pointer"
              >
                Duyệt
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBookingConfirmModal({ type: 'reject', booking: pendingBookingsForDriver[0] });
                }}
                className="h-9 px-4 rounded-[14px] bg-white border border-[#F7D9B8] hover:bg-[#FFF0F0] text-[#C22B35] text-[13.5px] font-semibold transition-colors cursor-pointer"
              >
                Không duyệt
              </button>
            </span>
          </div>
        )}

        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold text-[#101B17]">Chuyến hôm nay</h1>
              {todayTripsList.length > 1 && (
                <div className="flex items-center gap-1 bg-[#DDF3EA] px-2 py-0.5 rounded-full border border-[#B2E2D0]/50">
                  <span className="text-[11px] font-bold text-[#0B7A5C]">
                    {safeTripIndex + 1}/{todayTripsList.length}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {todayTripsList.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTripIndex(prev => Math.max(0, prev - 1))}
                    disabled={safeTripIndex === 0}
                    aria-label="Chuyến trước"
                    className="w-7 h-7 rounded-lg bg-white border border-[#E4EAE7] flex items-center justify-center text-[#101B17] disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#F4F7F5] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTripIndex(prev => Math.min(todayTripsList.length - 1, prev + 1))}
                    disabled={safeTripIndex === todayTripsList.length - 1}
                    aria-label="Chuyến sau"
                    className="w-7 h-7 rounded-lg bg-white border border-[#E4EAE7] flex items-center justify-center text-[#101B17] disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#F4F7F5] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => navigate('/driver/history')}
                className="text-[13px] font-semibold text-[#0B7A5C] hover:underline cursor-pointer"
              >
                Quản lý
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-[18px] shadow-[0_4px_16px_rgba(16,27,23,0.07)] flex flex-col gap-3.5 border border-[#E4EAE7]/70">
            {/* Top row: Badges and Countdown */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`h-7 px-2.5 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 shrink-0 ${
                  currentActiveTrip.tripKind === 'recurring'
                    ? 'bg-[#DDF3EA] text-[#0B7A5C] border border-[#B2E2D0]/60'
                    : 'bg-[#FFF4E9] text-[#EE7A22] border border-[#F7D9B8]'
                }`}>
                  {currentActiveTrip.tripKind === 'recurring' ? (
                    <>
                      <Repeat className="w-3 h-3 stroke-[2.5]" />
                      <span>Định kỳ</span>
                    </>
                  ) : (
                    <>
                      <span>🚗 Chuyến lẻ</span>
                    </>
                  )}
                </span>

                <span className={`h-7 px-2.5 rounded-full ${currentStatus.bg} ${currentStatus.fg} text-[11px] font-semibold inline-flex items-center gap-1.5 shrink-0`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
                  {currentStatus.label}
                </span>
              </div>

              <span className="text-[11.5px] text-[#8A9993] text-right truncate">
                {currentActiveTrip.statusText === 'Đã huỷ' ? 'Hành khách đã được thông báo' : currentActiveTrip.countdown}
              </span>
            </div>

            {/* Route row */}
            <div className="flex gap-3.5">
              <div className="flex flex-col items-center pt-[5px] gap-1 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
                <span className="w-0.5 flex-1 min-h-7 bg-[#DFE7E3]" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#EE7A22]" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <div className="flex justify-between gap-2.5">
                  <span className="min-w-0 text-[15px] font-semibold text-[#101B17] truncate">{currentActiveTrip.origin}</span>
                  <span className="text-[15px] font-bold text-[#101B17] shrink-0">{currentActiveTrip.departureTime}</span>
                </div>
                <div className="flex justify-between gap-2.5">
                  <span className="min-w-0 text-[15px] font-semibold text-[#101B17] truncate">{currentActiveTrip.destination}</span>
                  <span className="text-[15px] font-semibold text-[#8A9993] shrink-0">{currentActiveTrip.arrivalTime}</span>
                </div>
              </div>
            </div>

            {/* Passengers row */}
            <div className="flex flex-col gap-2.5 border-t border-[#EEF2F0] pt-3.5">
              <div className="flex items-center justify-between gap-3 text-[12.5px]">
                <span className="font-semibold text-[#4B5A54]">
                  {currentBookedSeats}/{currentTotalSeats} chỗ đã đặt · còn {currentTotalSeats - currentBookedSeats} chỗ
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`/shared/cost-breakdown/${todayTrip.id}`)}
                  className="font-semibold text-[#0B7A5C] shrink-0 hover:underline"
                >
                  Chia lại {currentTotalVnd.toLocaleString('vi-VN')} ₫
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {currentBookedPassengers.map((passenger) => (
                  <button
                    key={passenger.id}
                    type="button"
                    onClick={() => navigate('/driver/messages')}
                    className="h-11 rounded-[14px] bg-[#F1FAF6] text-[#0B7A5C] flex items-center justify-center gap-[7px] text-xs font-semibold"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#0F9D76] text-white flex items-center justify-center text-[9px] font-bold">
                      {passenger.initials}
                    </span>
                    <span className="truncate">{passenger.shortName}</span>
                  </button>
                ))}
                {currentBookedSeats < currentTotalSeats && (
                  <button
                    type="button"
                    onClick={() => navigate('/driver/requests')}
                    className="h-11 rounded-[14px] border-[1.5px] border-dashed border-[#DFE7E3] bg-white text-[#8A9993] flex items-center justify-center gap-[7px] text-xs font-semibold"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#EEF2F0] flex items-center justify-center text-[9px] font-bold">+</span>
                    Còn trống
                  </button>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => navigate(`/shared/trip-detail/${currentActiveTrip.id}`)}
                className="h-[50px] rounded-2xl border-[1.5px] border-[#E4EAE7] bg-white text-[#101B17] text-sm font-semibold hover:border-[#BDE7D5] hover:bg-[#F7FAF9] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CalendarClock className="w-4 h-4 text-[#0B7A5C]" />
                <span>Chi tiết & Lộ trình</span>
              </button>
              {canModifyTrip && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTripId(todayTrip.id);
                    navigate('/driver/active-trip');
                  }}
                  className="h-[50px] rounded-2xl bg-[#0F9D76] text-white text-sm font-semibold hover:bg-[#0B7A5C] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(15,157,118,0.25)] cursor-pointer"
                >
                  <span>Bắt đầu chuyến</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowCancel(true)}
              className="h-10 w-full rounded-2xl border border-[#E4EAE7] bg-white text-[#C22B35] text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-[#F4C6C6] hover:bg-[#FCEBEB] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Huỷ chuyến đi</span>
            </button>
          </div>

          {/* Dots pagination indicator when having multiple trips */}
          {todayTripsList.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-0.5">
              {todayTripsList.map((trip, idx) => (
                <button
                  key={trip.id}
                  type="button"
                  onClick={() => setActiveTripIndex(idx)}
                  aria-label={`Chuyển sang chuyến ${idx + 1}`}
                  className={`transition-all rounded-full cursor-pointer ${
                    safeTripIndex === idx
                      ? 'w-6 h-1.5 bg-[#0F9D76]'
                      : 'w-1.5 h-1.5 bg-[#D7E0DC] hover:bg-[#B2C4BD]'
                  }`}
                />
              ))}
            </div>
          )}
        </section>

        <section className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/driver/create-trip')}
            className="min-h-24 rounded-[20px] border-[1.5px] border-[#E4EAE7] bg-white flex flex-col items-center justify-center gap-2 px-2 text-[#101B17] font-semibold text-xs active:scale-[0.98] hover:border-[#BDE7D5] hover:bg-[#F7FAF9] transition-all"
          >
            <span className="w-9 h-9 rounded-xl bg-[#F1FAF6] text-[#0B7A5C] flex items-center justify-center">
              <Plus className="w-4 h-4 stroke-[2.5px]" />
            </span>
            Tạo chuyến
          </button>

          <button
            type="button"
            onClick={() => navigate('/driver/history')}
            className="relative min-h-24 rounded-[20px] border-[1.5px] border-[#E4EAE7] bg-white flex flex-col items-center justify-center gap-2 px-2 text-[#101B17] font-semibold text-xs active:scale-[0.98] hover:border-[#BDE7D5] hover:bg-[#F7FAF9] transition-all"
          >
            <span className="w-9 h-9 rounded-xl bg-[#F1FAF6] text-[#0B7A5C] flex items-center justify-center">
              <List className="w-4 h-4 stroke-[2.5px]" />
            </span>
            <span className="absolute top-2.5 right-2.5 min-w-5 h-5 px-1.5 rounded-full bg-[#0F9D76] text-white text-[11px] font-bold flex items-center justify-center">4</span>
            Chuyến của tôi
          </button>

          <button
            type="button"
            onClick={() => navigate('/driver/requests')}
            className="relative min-h-24 rounded-[20px] border-[1.5px] border-[#E4EAE7] bg-white flex flex-col items-center justify-center gap-2 px-2 text-[#101B17] font-semibold text-xs leading-[1.3] active:scale-[0.98] hover:border-[#BDE7D5] hover:bg-[#F7FAF9] transition-all"
          >
            <span className="w-9 h-9 rounded-xl bg-[#F1FAF6] text-[#0B7A5C] flex items-center justify-center">
              <Mail className="w-4 h-4 stroke-2" />
            </span>
            {pendingBookingsForDriver.length > 0 && (
              <span className="absolute top-2.5 right-2.5 min-w-5 h-5 px-1.5 rounded-full bg-[#EE7A22] text-white text-[11px] font-bold flex items-center justify-center">{pendingBookingsForDriver.length}</span>
            )}
            <span>Yêu cầu đặt<br />chỗ</span>
          </button>
        </section>

        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-[#101B17]">Lịch đi làm cố định</h2>
              <span className="px-2 py-0.5 rounded-lg bg-[#DDF3EA] text-[#0B7A5C] text-[10.5px] font-semibold">Tự động</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/driver/schedules')}
              className="text-[13px] font-semibold text-[#0B7A5C] hover:underline cursor-pointer"
            >
              Sửa
            </button>
          </div>

          <div className={`rounded-[22px] bg-white p-[18px] shadow-[0_2px_10px_rgba(16,27,23,0.05)] transition-opacity ${
            isScheduleActive ? 'opacity-100' : 'opacity-60'
          }`}>
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-[15px] bg-[#F1FAF6] text-[#0B7A5C] flex items-center justify-center text-[11px] font-bold shrink-0">
                T2–T6
              </span>
              <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="text-[14.5px] font-semibold text-[#101B17] truncate">Nhà → FPT University</span>
                <span className="text-xs text-[#8A9993]">07:00 · 3 chỗ mỗi chuyến</span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isScheduleActive}
                onClick={toggleWorkSchedule}
                aria-label="Bật hoặc tắt lịch đi làm cố định"
                className={`relative w-[46px] h-7 rounded-full transition-colors shrink-0 ${isScheduleActive ? 'bg-[#0F9D76]' : 'bg-[#D9E2DE]'}`}
              >
                <span className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-all ${isScheduleActive ? 'left-[21px]' : 'left-[3px]'}`} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 border-t border-[#EEF2F0] pt-3.5 mt-3.5">
              {WEEK_DAYS.map((day, index) => {
                const active = index < 5 && isScheduleActive;
                return (
                  <span
                    key={day}
                    className={`h-10 rounded-xl flex items-center justify-center text-xs font-semibold ${
                      active ? 'bg-[#DDF3EA] text-[#0B7A5C]' : 'bg-[#F7FAF9] text-[#C3CDC9]'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>

            <p className="text-xs leading-[1.5] text-[#8A9993] mt-3.5">
              Tự đăng chuyến lúc 20:00 tối hôm trước. 6 khách thường xuyên đi tuyến này.
            </p>
          </div>
        </section>
      </div>

      {currentActiveTrip && (
        <>
          <CancelTripSheet
            open={showCancel}
            onClose={() => setShowCancel(false)}
            tripId={currentActiveTrip.id}
            tripLabel={`${currentActiveTrip.origin} → ${currentActiveTrip.destination} · ${currentActiveTrip.departureTime}`}
          />
          <RescheduleTripSheet
            open={showReschedule}
            onClose={() => setShowReschedule(false)}
            tripId={currentActiveTrip.id}
            tripLabel={`${currentActiveTrip.origin} → ${currentActiveTrip.destination}`}
            currentDate="Hôm nay, 12/09"
            currentTime={currentActiveTrip.departureTime}
          />
        </>
      )}

      {/* Booking Action Confirmation Modal */}
      {bookingConfirmModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#07110D]/60 backdrop-blur-[3px] animate-rs-backdrop-in"
          onClick={() => setBookingConfirmModal(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[340px] bg-white rounded-[26px] p-5 shadow-[0_20px_50px_rgba(16,27,23,0.25)] border border-[#E4EAE7] flex flex-col gap-4 animate-rs-pop"
          >
            {/* Header / Icon */}
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  bookingConfirmModal.type === 'accept'
                    ? 'bg-[#DDF3EA] text-[#0F9D76]'
                    : 'bg-[#FCEBEB] text-[#C22B35]'
                }`}
              >
                {bookingConfirmModal.type === 'accept' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-bold text-[#101B17]">
                  {bookingConfirmModal.type === 'accept' ? 'Xác nhận duyệt yêu cầu' : 'Xác nhận từ chối'}
                </h3>
                <p className="text-xs text-[#8A9993]">
                  {bookingConfirmModal.type === 'accept' ? 'Thêm khách vào chuyến đi' : 'Từ chối đón hành khách'}
                </p>
              </div>
            </div>

            {/* Passenger Info Card */}
            <div className="bg-[#F7FAF9] rounded-2xl p-3 border border-[#EEF2F0] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#DDF3EA] text-[#0B7A5C] text-xs font-bold flex items-center justify-center shrink-0 border border-[#B2E2D0]/50">
                    {bookingConfirmModal.booking?.passengerInitials || 'MA'}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#101B17] block truncate">
                      {bookingConfirmModal.booking?.passengerName || 'Minh Anh'}
                    </span>
                    <span className="text-[10.5px] text-[#8A9993] block">
                      ★ {bookingConfirmModal.booking?.passengerTrustScore || 4.9} · {bookingConfirmModal.booking?.passengerPhone || '0912 345 678'}
                    </span>
                  </div>
                </div>
                {bookingConfirmModal.type === 'accept' && (
                  <span className="text-xs font-bold font-mono text-[#0F9D76] shrink-0">
                    +{Number(bookingConfirmModal.booking?.fareVnd || 45000).toLocaleString('vi-VN')} ₫
                  </span>
                )}
              </div>

              <div className="border-t border-[#EEF2F0] pt-2 flex flex-col gap-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#4B5A54] truncate">
                  <span className="w-2 h-2 rounded-full bg-[#0F9D76] shrink-0" />
                  <span className="truncate">{bookingConfirmModal.booking?.pickupPoint || 'Điểm đón dọc tuyến'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#4B5A54] truncate">
                  <span className="w-2 h-2 rounded-[2px] bg-[#EE7A22] shrink-0" />
                  <span className="truncate">{bookingConfirmModal.booking?.dropoffPoint || 'Điểm trả'}</span>
                </div>
              </div>
            </div>

            {/* Confirmation Question */}
            <p className="text-xs text-[#4B5A54] leading-relaxed">
              {bookingConfirmModal.type === 'accept'
                ? `Bạn có chắc chắn muốn duyệt và đón ${bookingConfirmModal.booking?.passengerName || 'hành khách'} cho chuyến này?`
                : `Bạn có chắc chắn muốn từ chối yêu cầu đặt chỗ của ${bookingConfirmModal.booking?.passengerName || 'hành khách'}?`}
            </p>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1.5">
              <button
                type="button"
                onClick={() => setBookingConfirmModal(null)}
                className="h-12 rounded-2xl border-[1.5px] border-[#E4EAE7] bg-white text-[#4B5A54] hover:bg-[#F4F7F5] font-bold text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => {
                  const bookingId = bookingConfirmModal.booking?.id;
                  const decision = bookingConfirmModal.type;
                  setBookingConfirmModal(null);
                  if (bookingId) {
                    respondBooking(bookingId, decision);
                  }
                }}
                className={`h-12 rounded-2xl text-white font-bold text-sm transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center ${
                  bookingConfirmModal.type === 'accept'
                    ? 'bg-[#0F9D76] hover:bg-[#0B7A5C] shadow-[0_6px_18px_rgba(15,157,118,0.28)]'
                    : 'bg-[#C22B35] hover:bg-[#A8232C] shadow-[0_6px_18px_rgba(194,43,53,0.28)]'
                }`}
              >
                {bookingConfirmModal.type === 'accept' ? 'Duyệt đón' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
