import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  ChevronRight,
  ArrowRight,
  Car,
  User,
  Repeat,
  CalendarClock,
  Plus,
  Edit3
} from 'lucide-react';

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const formatScheduleDays = (days = []) => {
  const selectedIndexes = WEEK_DAYS
    .map((day, index) => (days.includes(day) ? index : -1))
    .filter((index) => index !== -1);

  if (selectedIndexes.length === 0) return 'Chưa chọn ngày';
  if (selectedIndexes.length === 7) return 'Mỗi ngày';

  const ranges = [];
  let start = selectedIndexes[0];
  let previous = selectedIndexes[0];

  selectedIndexes.slice(1).forEach((index) => {
    if (index === previous + 1) {
      previous = index;
      return;
    }
    ranges.push(start === previous ? WEEK_DAYS[start] : `${WEEK_DAYS[start]}–${WEEK_DAYS[previous]}`);
    start = index;
    previous = index;
  });
  ranges.push(start === previous ? WEEK_DAYS[start] : `${WEEK_DAYS[start]}–${WEEK_DAYS[previous]}`);

  return ranges.join(', ');
};

const formatCompactPrice = (price) => {
  const amount = Number(price) || 35000;
  return amount >= 1000 ? `${(amount / 1000).toLocaleString('vi-VN')}k` : `${amount.toLocaleString('vi-VN')} ₫`;
};

export const TripHistory = () => {
  const navigate = useNavigate();
  const {
    switchRole,
    driverSchedules,
    passengerSchedules,
    toggleDriverSchedule,
    togglePassengerSchedule,
    setSearchParams
  } = useApp();
  const [tripType, setTripType] = useState('single'); // 'single' | 'recurring'
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'completed' | 'upcoming'

  const goToTrip = (item) => {
    switchRole(item.roleTag);
    navigate(`/shared/trip-detail/${item.id}`);
  };

  // Mock single trip history list — merged across both roles, newest first
  const driverTripsData = [
    {
      id: 'hist_drv_01',
      roleTag: 'driver',
      date: 'Hôm nay, 12/09/2026',
      time: '07:00',
      origin: 'FPT University HCMC',
      destination: 'Chợ Bến Thành, Q.1',
      status: 'upcoming',
      statusLabel: 'Sắp khởi hành',
      statusColor: 'bg-[#DDF1F4] text-[#0A6E7A]',
      vehicle: 'Honda City · 51G-119.02',
      passengersCount: 2,
      amountVnd: 80000,
      distanceKm: 18.5
    },
    {
      id: 'hist_drv_02',
      roleTag: 'driver',
      date: 'Hôm qua, 11/09/2026',
      time: '17:30',
      origin: 'Chợ Bến Thành, Q.1',
      destination: 'FPT University HCMC',
      status: 'completed',
      statusLabel: 'Đã hoàn thành',
      statusColor: 'bg-[#DDF3EA] text-[#0B7A5C]',
      vehicle: 'Honda City · 51G-119.02',
      passengersCount: 2,
      amountVnd: 80000,
      distanceKm: 19.2,
      rating: 5.0
    },
    {
      id: 'hist_drv_03',
      roleTag: 'driver',
      date: 'Thứ 4, 10/09/2026',
      time: '07:00',
      origin: 'FPT University HCMC',
      destination: 'Landmark 81, Bình Thạnh',
      status: 'completed',
      statusLabel: 'Đã hoàn thành',
      statusColor: 'bg-[#DDF3EA] text-[#0B7A5C]',
      vehicle: 'Honda City · 51G-119.02',
      passengersCount: 1,
      amountVnd: 40000,
      distanceKm: 14.5,
      rating: 4.9
    }
  ];

  const passengerTripsData = [
    {
      id: 'hist_pas_01',
      roleTag: 'passenger',
      date: 'Hôm nay, 12/09/2026',
      time: '07:00',
      origin: 'FPT University HCMC (Cổng 2)',
      destination: 'Chợ Bến Thành, Q.1',
      status: 'upcoming',
      statusLabel: 'Đã giữ chỗ',
      statusColor: 'bg-[#DDF1F4] text-[#0A6E7A]',
      driverName: 'Nguyễn Minh',
      driverInitials: 'NM',
      driverPhone: '0933 222 111',
      vehicle: 'Mazda 3 · 51K-882.91',
      amountVnd: 45000,
      seats: 1,
      code: '#RS-4821',
      distanceKm: 19.0
    },
    {
      id: 'hist_pas_02',
      roleTag: 'passenger',
      date: 'Hôm qua, 11/09/2026',
      time: '17:30',
      origin: 'Chợ Bến Thành, Q.1',
      destination: 'FPT University HCMC',
      status: 'completed',
      statusLabel: 'Đã hoàn thành',
      statusColor: 'bg-[#DDF3EA] text-[#0B7A5C]',
      driverName: 'Nguyễn Minh',
      driverInitials: 'NM',
      driverPhone: '0933 222 111',
      vehicle: 'Mazda 3 · 51K-882.91',
      amountVnd: 45000,
      seats: 1,
      code: '#RS-3391',
      distanceKm: 19.2
    }
  ];

  // Interleave by recency rank so "Hôm nay" items surface first regardless of role
  const dateRank = (item) => (item.date.startsWith('Hôm nay') ? 0 : item.date.startsWith('Hôm qua') ? 1 : 2);
  const singleTripsData = [...driverTripsData, ...passengerTripsData].sort((a, b) => dateRank(a) - dateRank(b));

  const filteredHistory = singleTripsData.filter(item => {
    if (activeFilter === 'completed') return item.status === 'completed';
    if (activeFilter === 'upcoming') return item.status === 'upcoming';
    return true;
  });

  const currentSchedulesCount = driverSchedules.length + passengerSchedules.length;

  return (
    <div className="w-full min-h-full flex flex-col bg-[#F4F7F5] pb-8">
      {/* Top Sticky Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-[#101B17] tracking-tight">Chuyến đi</h1>
            <span className="text-[11px] text-[#8A9993]">
              Chuyến bạn lái & chuyến bạn đi · chuyến lẻ & lịch trình cố định
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-[#DDF3EA] text-[#0B7A5C] text-xs font-bold border border-[#B2E2D0]/50">
            {tripType === 'single' ? `${singleTripsData.length} chuyến` : `${currentSchedulesCount} lịch`}
          </span>
        </div>

        {/* Primary Segmented Tab for Both Roles */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F4F7F5] border border-[#E4EAE7] gap-1">
          <button
            type="button"
            onClick={() => setTripType('single')}
            className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tripType === 'single'
                ? 'bg-white text-[#0B7A5C] shadow-xs'
                : 'text-[#4B5A54] hover:text-[#101B17]'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Chuyến đi lẻ ({singleTripsData.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTripType('recurring')}
            className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tripType === 'recurring'
                ? 'bg-white text-[#0B7A5C] shadow-xs'
                : 'text-[#4B5A54] hover:text-[#101B17]'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Chuyến định kỳ ({currentSchedulesCount})</span>
          </button>
        </div>

        {/* Sub-filter Tabs for Single Trips */}
        {tripType === 'single' && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`flex-1 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#0F9D76] text-white shadow-xs'
                  : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#EAEFEA]'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('upcoming')}
              className={`flex-1 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'upcoming'
                  ? 'bg-[#0F9D76] text-white shadow-xs'
                  : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#EAEFEA]'
              }`}
            >
              Sắp đi
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('completed')}
              className={`flex-1 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'completed'
                  ? 'bg-[#0F9D76] text-white shadow-xs'
                  : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#EAEFEA]'
              }`}
            >
              Đã xong
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-3.5 flex-1 flex flex-col gap-3.5">
        {/* ===================== TAB 1: CHUYẾN ĐI LẺ ===================== */}
        {tripType === 'single' && (
          <>
            {filteredHistory.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-[#8A9993]">
                Không có chuyến đi lẻ nào trong mục này.
              </div>
            ) : (
              filteredHistory.map((item) => {
                const isDriver = item.roleTag === 'driver';
                return (
                  <div
                    key={item.id}
                    onClick={() => goToTrip(item)}
                    className="bg-white rounded-2xl p-3.5 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.04)] flex flex-col gap-3 cursor-pointer hover:border-[#BDE7D5] hover:shadow-[0_6px_18px_rgba(16,27,23,0.08)] active:scale-[0.99] transition-all"
                  >
                    {/* Header: role avatar + date/time  ·  status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDriver ? 'bg-[#EAF2FF] text-[#2F6FCE]' : 'bg-[#FFF4E9] text-[#D96A16]'
                        }`}>
                          {isDriver ? <Car className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </span>
                        <div className="min-w-0 flex flex-col">
                          <span className={`text-[9.5px] font-bold uppercase tracking-wide ${isDriver ? 'text-[#2F6FCE]' : 'text-[#D96A16]'}`}>
                            {isDriver ? 'Bạn lái' : 'Bạn đi'}
                          </span>
                          <span className="text-xs font-bold text-[#101B17] truncate flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#8A9993] shrink-0" />
                            {item.date} · {item.time}
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold shrink-0 ${item.statusColor}`}>
                        {item.statusLabel}
                      </span>
                    </div>

                    {/* Route, single compact line */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-[#101B17] truncate flex-1">{item.origin}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C3CDC9] shrink-0" />
                      <span className="font-semibold text-[#101B17] truncate flex-1 text-right">{item.destination}</span>
                    </div>

                    {/* Footer: vehicle + price */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-[#EEF2F0]">
                      <div className="flex items-center gap-1.5 text-[#4B5A54] min-w-0">
                        <Car className="w-3.5 h-3.5 text-[#0B7A5C] shrink-0" />
                        <span className="text-[11px] truncate">{item.vehicle}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-bold font-mono text-[#0B7A5C] text-sm">
                          {new Intl.NumberFormat('vi-VN').format(item.amountVnd)} ₫
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#8A9993]" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* ===================== TAB 2: CHUYẾN ĐỊNH KỲ ===================== */}
        {tripType === 'recurring' && (
          <>
            {/* DRIVER VIEW */}
            <>
              <div className="px-1 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[#EAF2FF] text-[#2F6FCE]">Bạn lái</span>
                <h3 className="text-xs font-bold text-[#101B17]">Lịch trình bạn đăng làm tài xế</h3>
              </div>
              {driverSchedules.length === 0 ? (
                /* EMPTY STATE - TÀI XẾ CHƯA TẠO LỊCH */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto min-h-[360px] animate-rs-pop">
                  <div className="w-18 h-18 rounded-3xl bg-[#F1FAF6] border border-[#BDE7D5] text-[#0F9D76] flex items-center justify-center shadow-[0_6px_20px_rgba(15,157,118,0.15)] mb-4">
                    <CalendarClock className="w-9 h-9 stroke-[1.8]" />
                  </div>

                  <h2 className="text-[16px] font-bold text-[#101B17] mb-1.5">
                    Bạn chưa tạo chuyến đi định kỳ
                  </h2>

                  <p className="text-xs text-[#8A9993] max-w-[280px] leading-relaxed mb-6">
                    Tạo lịch đi làm cố định hàng tuần (T2–T6) để hệ thống tự động đăng chuyến, ghép hành khách quen và tiết kiệm tiền xăng mỗi ngày.
                  </p>

                  <button
                    type="button"
                    onClick={() => { switchRole('driver'); navigate('/driver/schedules'); }}
                    className="w-full max-w-[260px] h-12 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-sm shadow-[0_6px_18px_rgba(15,157,118,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Tạo lịch định kỳ ngay</span>
                  </button>
                </div>
              ) : (
                /* DRIVER RECURRING LIST */
                <div className="flex flex-col gap-4 animate-rs-sheet-up">
                  {driverSchedules.map((sch) => {
                    const isActive = sch.active ?? true;
                    return (
                      <div
                        key={sch.id}
                        className={`bg-white rounded-[26px] p-4 border border-[#E4EAE7] shadow-[0_8px_24px_rgba(16,27,23,0.05)] flex flex-col overflow-hidden transition-all ${
                          isActive ? 'opacity-100' : 'opacity-70 bg-[#FAFBFB]'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-[#EEF2F0]">
                          <div className="min-w-0">
                            <h2 className="text-[15px] leading-tight font-bold text-[#101B17] truncate">
                              {sch.title}
                            </h2>
                            <p className="mt-1 text-[10.5px] font-medium text-[#718079] truncate">
                              {isActive ? 'Đang chạy' : 'Đang tạm dừng'} · {formatScheduleDays(sch.days)}
                            </p>
                          </div>

                          <button
                            type="button"
                            role="switch"
                            aria-checked={isActive}
                            onClick={() => toggleDriverSchedule(sch.id)}
                            aria-label={`Bật hoặc tạm dừng ${sch.title}`}
                            className={`relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer ${
                              isActive ? 'bg-[#0F9D76]' : 'bg-[#D9E2DE]'
                            }`}
                          >
                            <span
                              className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-all ${
                                isActive ? 'left-[23px]' : 'left-[3px]'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Route */}
                        <div className="py-3.5 border-b border-[#EEF2F0]">
                          <div className="flex gap-3">
                            <div className="flex flex-col items-center pt-1.5 gap-1 shrink-0">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
                              <span className="w-px flex-1 min-h-7 bg-[#D9E8E1]" />
                              <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col gap-4 text-xs">
                              <div className="flex justify-between items-center gap-3">
                                <span className="font-semibold text-[14px] text-[#101B17] truncate">{sch.origin}</span>
                                <span className="rounded-lg bg-[#EAF8F2] px-2 py-1 font-mono text-[12px] font-bold text-[#087B5B] shrink-0">{sch.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-[14px] text-[#101B17] truncate">{sch.destination}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Schedule details */}
                        <div className="grid grid-cols-2 gap-2 py-3.5 border-b border-[#EEF2F0]">
                          <div className="min-w-0 rounded-xl bg-[#F7FAF9] px-2.5 py-2">
                            <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#8A9993] block">Phương tiện</span>
                            <span className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-[#44534C] truncate">
                              <Car className="w-3.5 h-3.5 text-[#0B7A5C] shrink-0" />
                              <span className="truncate">{sch.vehicleModel || 'Xe máy'} · {sch.availableSeats || 1} chỗ</span>
                            </span>
                          </div>
                          <div className="min-w-0 rounded-xl bg-[#F7FAF9] px-2.5 py-2">
                            <span className="text-[9.5px] font-bold uppercase tracking-wide text-[#8A9993] block">Hiệu lực</span>
                            <span className="mt-1 block text-[11px] font-semibold text-[#44534C] truncate">Đến {sch.duration?.endDate || '31/12/2026'}</span>
                          </div>
                        </div>

                        {/* Regular passengers */}
                        {sch.subscribers && sch.subscribers.length > 0 ? (
                          <div className="flex flex-col gap-2 pt-3.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8A9993]">
                                Khách quen ({sch.subscribers.length}/{sch.availableSeats || 1})
                              </span>
                              {sch.wishlistDiscountPercent > 0 && (
                                <span className="text-[11px] font-bold text-[#0B7A5C]">
                                  -{sch.wishlistDiscountPercent}% khách quen
                                </span>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              {sch.subscribers.map((p, idx) => (
                                <div
                                  key={idx}
                                  className="bg-[#F4FAF7] rounded-xl px-3 py-2.5 flex items-center justify-between text-xs"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-8 h-8 rounded-full bg-[#0F9D76] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                      {p.avatar || 'MA'}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <span className="font-bold text-[12px] text-[#101B17] block truncate">{p.name}</span>
                                      <span className="text-[10px] text-[#4B5A54] block truncate">{p.pickup} → {p.dropoff}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {/* Price and action */}
                        <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-[#EEF2F0]">
                          <div className="min-w-0">
                            <span className="block text-[10px] font-medium text-[#8A9993]">Giá mỗi ghế</span>
                            <strong className="mt-0.5 block font-mono text-[16px] leading-none text-[#0B7A5C] whitespace-nowrap">
                              {formatCompactPrice(sch.pricePerTrip)}
                            </strong>
                          </div>
                          <button
                            type="button"
                            onClick={() => { switchRole('driver'); navigate('/driver/schedules'); }}
                            className="h-9 px-3.5 rounded-xl border border-[#A4DFC9] bg-white hover:bg-[#F1FAF6] text-[#0B7A5C] font-bold text-[11px] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <Edit3 className="w-3.5 h-3.5 shrink-0" />
                            <span>Quản lý</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Button to add another schedule */}
                  <button
                    type="button"
                    onClick={() => { switchRole('driver'); navigate('/driver/schedules'); }}
                    className="w-full h-12 rounded-2xl border-2 border-dashed border-[#BDE7D5] bg-[#F1FAF6] hover:bg-[#E3F6ED] text-[#0B7A5C] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer mt-1"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Thêm lịch trình định kỳ</span>
                  </button>
                </div>
              )}
            </>

            {/* PASSENGER VIEW */}
            <>
              <div className="px-1 flex items-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-[#FFF4E9] text-[#D96A16]">Bạn đi</span>
                <h3 className="text-xs font-bold text-[#101B17]">Lịch trình bạn lưu làm hành khách</h3>
              </div>
              {passengerSchedules.length === 0 ? (
                /* EMPTY STATE - HÀNH KHÁCH CHƯA CÓ LỊCH */
                <div className="rounded-2xl border-2 border-dashed border-[#BDE7D5] bg-[#F1FAF6] p-4 flex flex-col items-center text-center gap-1.5 animate-rs-pop">
                  <CalendarClock className="w-6 h-6 text-[#0F9D76]" />
                  <p className="text-xs font-bold text-[#101B17]">Bạn chưa lưu lịch trình cố định</p>
                  <p className="text-[10.5px] text-[#8A9993] max-w-[260px] leading-relaxed">
                    Lưu lộ trình đi học/đi làm hàng ngày để 1 chạm tra cứu tài xế.
                  </p>
                  <button
                    type="button"
                    onClick={() => { switchRole('passenger'); navigate('/passenger/schedules'); }}
                    className="h-9 px-4 mt-1 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Thêm lịch cố định ngay</span>
                  </button>
                </div>
              ) : (
                /* PASSENGER RECURRING LIST */
                <div className="flex flex-col gap-4 animate-rs-sheet-up">
                  {passengerSchedules.map((sch) => {
                    const isActive = sch.active ?? true;
                    const goFindDriver = () => {
                      switchRole('passenger');
                      setSearchParams(prev => ({
                        ...prev,
                        origin: sch.origin,
                        destination: sch.destination,
                        departureTime: sch.time,
                        seats: 1
                      }));
                      navigate(`/passenger/results?mode=recurring&scheduleId=${sch.id}&origin=${encodeURIComponent(sch.origin)}&destination=${encodeURIComponent(sch.destination)}&time=${encodeURIComponent(sch.time)}`);
                    };
                    return (
                      <div
                        key={sch.id}
                        className={`bg-white rounded-2xl p-3.5 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-2.5 transition-all ${
                          isActive ? 'opacity-100' : 'opacity-70 bg-[#FAFBFB]'
                        }`}
                      >
                        {/* Header & Switch */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-9 h-9 rounded-xl bg-[#F1FAF6] text-base flex items-center justify-center shrink-0 border border-[#BDE7D5]/50">
                              {sch.icon || '🏢'}
                            </span>
                            <div className="min-w-0">
                              <h2 className="text-[13.5px] font-bold text-[#101B17] truncate">
                                {sch.title}
                              </h2>
                              <p className="text-[10.5px] text-[#0B7A5C] font-semibold truncate">
                                {sch.purpose || 'Đi làm'} · {isActive ? 'Đang kích hoạt' : 'Tạm dừng'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => { switchRole('passenger'); navigate('/passenger/schedules'); }}
                              aria-label={`Quản lý ${sch.title}`}
                              className="w-8 h-8 rounded-lg border border-[#E4EAE7] bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-[#4B5A54] cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isActive}
                              onClick={() => togglePassengerSchedule(sch.id)}
                              aria-label={`Bật hoặc tạm dừng ${sch.title}`}
                              className={`relative w-10 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
                                isActive ? 'bg-[#0F9D76]' : 'bg-[#D9E2DE]'
                              }`}
                            >
                              <span
                                className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all ${
                                  isActive ? 'left-[19px]' : 'left-[3px]'
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Route + schedule, condensed to 2 lines */}
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-semibold text-[#101B17] truncate">{sch.origin} → {sch.destination}</span>
                            <span className="font-mono font-bold text-[#0B7A5C] shrink-0">{sch.time}</span>
                          </div>
                          <span className="text-[10.5px] text-[#8A9993] truncate">
                            {formatScheduleDays(sch.days)} · {sch.duration?.durationLabel || '01/10 → 31/10/2026'}
                          </span>
                        </div>

                        {/* Matched Driver status */}
                        {sch.matchedDriver ? (
                          <div className="bg-[#F1FAF6] rounded-xl p-2.5 border border-[#B2E2D0] flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-7 h-7 rounded-full bg-[#0F9D76] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                {sch.matchedDriver.avatar || 'QH'}
                              </span>
                              <p className="font-bold text-[#101B17] truncate">{sch.matchedDriver.name}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => { switchRole('passenger'); navigate(`/shared/chat/${sch.matchedDriver.id || 'drv_02'}`); }}
                              className="px-2.5 py-1 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold rounded-lg text-[11px] transition-colors shrink-0 cursor-pointer"
                            >
                              Nhắn tin
                            </button>
                          </div>
                        ) : (
                          <div className="bg-[#FFF9F3] p-2.5 rounded-xl border border-[#FFE4CC] flex items-center justify-between text-xs">
                            <span className="text-[#8A4A0B] text-[10.5px] font-medium">Chưa có tài xế ghép đôi</span>
                            <button
                              type="button"
                              onClick={goFindDriver}
                              className="px-2.5 py-1 bg-[#EE7A22] hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                            >
                              Tìm tài xế
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => { switchRole('passenger'); navigate('/passenger/schedules'); }}
                    className="w-full h-12 rounded-2xl border-2 border-dashed border-[#BDE7D5] bg-[#F1FAF6] hover:bg-[#E3F6ED] text-[#0B7A5C] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer mt-1"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Thêm lịch trình cố định</span>
                  </button>
                </div>
              )}
            </>
          </>
        )}
      </div>
    </div>
  );
};
