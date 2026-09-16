import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Mail, Plus, CalendarClock, Ban } from 'lucide-react';
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
  const { currentUser, schedules, toggleSchedule, trips, pendingBookingsForDriver, respondBooking } = useApp();
  const todayTrip = trips.find((t) => t.id === 'trip_001') || trips[0];
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const canModifyTrip = todayTrip && todayTrip.statusText !== 'Đã huỷ' && todayTrip.statusText !== 'Hoàn thành';
  const todayStatus = TODAY_TRIP_STATUS[todayTrip?.statusText] || TODAY_TRIP_STATUS['Đang mở'];
  const workSchedule = schedules[0];
  const isScheduleActive = workSchedule?.active ?? true;
  const bookedPassengers = (todayTrip?.passengers || []).map((p) => ({
    id: p.id,
    initials: p.initials,
    shortName: p.name.split(' ').at(-1),
    fareVnd: p.fareVnd,
  }));
  const bookedSeats = bookedPassengers.length;
  const totalSeats = todayTrip?.totalSeats || 3;
  const bookedTotalVnd = bookedPassengers.reduce((sum, p) => sum + (p.fareVnd || 0), 0);

  const toggleWorkSchedule = () => {
    if (workSchedule) toggleSchedule(workSchedule.id);
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
          <div className="rounded-[22px] bg-[#FFF4E9] border border-[#F7D9B8] p-4 flex items-center gap-3.5">
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

            <span className="flex flex-col gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/driver/requests')}
                className="h-9 px-4 rounded-[14px] bg-[#EE7A22] hover:bg-[#D96A16] text-white text-[13.5px] font-semibold transition-colors"
              >
                Duyệt
              </button>
              <button
                type="button"
                onClick={() => respondBooking(pendingBookingsForDriver[0].id, 'reject')}
                className="h-9 px-4 rounded-[14px] bg-white border border-[#F7D9B8] hover:bg-[#FFF0F0] text-[#C22B35] text-[13.5px] font-semibold transition-colors"
              >
                Không duyệt
              </button>
            </span>
          </div>
        )}

        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h1 className="text-[15px] font-semibold text-[#101B17]">Chuyến hôm nay</h1>
            <button
              type="button"
              onClick={() => navigate('/driver/history')}
              className="text-[13px] font-semibold text-[#0B7A5C] hover:underline"
            >
              Quản lý
            </button>
          </div>

          <div className="bg-white rounded-3xl p-[18px] shadow-[0_4px_16px_rgba(16,27,23,0.07)] flex flex-col gap-3.5">
            <div className="flex items-center justify-between gap-2.5">
              <span className={`h-[30px] px-3 rounded-full ${todayStatus.bg} ${todayStatus.fg} text-[11.5px] font-semibold inline-flex items-center gap-1.5 shrink-0`}>
                <span className={`w-1.5 h-1.5 rounded-full ${todayStatus.dot}`} />
                {todayStatus.label}
              </span>
              <span className="text-[12.5px] text-[#8A9993] text-right">
                {todayTrip?.statusText === 'Đã huỷ' ? 'Hành khách đã được thông báo' : 'Khởi hành sau 1 giờ 19 phút'}
              </span>
            </div>

            <div className="flex gap-3.5">
              <div className="flex flex-col items-center pt-[5px] gap-1 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
                <span className="w-0.5 flex-1 min-h-7 bg-[#DFE7E3]" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-[#EE7A22]" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <div className="flex justify-between gap-2.5">
                  <span className="min-w-0 text-[15px] font-semibold text-[#101B17] truncate">Nhà · Phú Mỹ Hưng</span>
                  <span className="text-[15px] font-bold text-[#101B17] shrink-0">07:00</span>
                </div>
                <div className="flex justify-between gap-2.5">
                  <span className="min-w-0 text-[15px] font-semibold text-[#101B17] truncate">FPT University HCMC</span>
                  <span className="text-[15px] font-semibold text-[#8A9993] shrink-0">07:48</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-[#EEF2F0] pt-3.5">
              <div className="flex items-center justify-between gap-3 text-[12.5px]">
                <span className="font-semibold text-[#4B5A54]">{bookedSeats}/{totalSeats} chỗ đã đặt · còn {totalSeats - bookedSeats} chỗ</span>
                <button
                  type="button"
                  onClick={() => navigate('/shared/cost-breakdown')}
                  className="font-semibold text-[#0B7A5C] shrink-0 hover:underline"
                >
                  Chia lại {bookedTotalVnd.toLocaleString('vi-VN')} ₫
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {bookedPassengers.map((passenger) => (
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
                <button
                  type="button"
                  onClick={() => navigate('/driver/requests')}
                  className="h-11 rounded-[14px] border-[1.5px] border-dashed border-[#DFE7E3] bg-white text-[#8A9993] flex items-center justify-center gap-[7px] text-xs font-semibold"
                >
                  <span className="w-5 h-5 rounded-full bg-[#EEF2F0] flex items-center justify-center text-[9px] font-bold">+</span>
                  Còn trống
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/shared/trip-detail/trip_001')}
                className="h-[50px] rounded-2xl border-[1.5px] border-[#E4EAE7] bg-white text-[#101B17] text-sm font-semibold hover:border-[#BDE7D5] hover:bg-[#F7FAF9] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CalendarClock className="w-4 h-4 text-[#0B7A5C]" />
                <span>Chi tiết & Lộ trình</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/driver/active-trip')}
                className="h-[50px] rounded-2xl bg-[#0F9D76] text-white text-sm font-semibold hover:bg-[#0B7A5C] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(15,157,118,0.25)] cursor-pointer"
              >
                <span>Bắt đầu chuyến</span>
              </button>
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
              onClick={() => navigate('/shared/schedule')}
              className="text-[13px] font-semibold text-[#0B7A5C] hover:underline"
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

      {todayTrip && (
        <>
          <CancelTripSheet
            open={showCancel}
            onClose={() => setShowCancel(false)}
            tripId={todayTrip.id}
            tripLabel={`${todayTrip.origin} → ${todayTrip.destination} · ${todayTrip.departureTime}`}
          />
          <RescheduleTripSheet
            open={showReschedule}
            onClose={() => setShowReschedule(false)}
            tripId={todayTrip.id}
            tripLabel={`${todayTrip.origin} → ${todayTrip.destination}`}
            currentDate={todayTrip.departureDate}
            currentTime={todayTrip.departureTime}
          />
        </>
      )}
    </div>
  );
};
