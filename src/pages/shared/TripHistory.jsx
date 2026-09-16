import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  ChevronRight,
  Car,
  Repeat,
  CalendarClock,
  Plus,
  Edit3,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  Check,
  ToggleLeft,
  ToggleRight,
  Info
} from 'lucide-react';

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export const TripHistory = () => {
  const navigate = useNavigate();
  const { 
    currentRole, 
    driverSchedules, 
    passengerSchedules, 
    toggleDriverSchedule, 
    togglePassengerSchedule,
    setSearchParams 
  } = useApp();
  const [tripType, setTripType] = useState('single'); // 'single' | 'recurring'
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'completed' | 'upcoming'

  // Mock single trip history list
  const singleTripsData = currentRole === 'driver' ? [
    {
      id: 'hist_drv_01',
      date: 'Hôm nay, 12/09/2026',
      time: '07:00',
      origin: 'FPT University HCMC',
      destination: 'Chợ Bến Thành, Q.1',
      status: 'upcoming',
      statusLabel: 'Sắp khởi hành',
      statusColor: 'bg-[#DDF1F4] text-[#0A6E7A]',
      vehicle: 'Honda City · 51G-119.02',
      passengersCount: 2,
      totalEarnings: 80000,
      distanceKm: 18.5
    },
    {
      id: 'hist_drv_02',
      date: 'Hôm qua, 11/09/2026',
      time: '17:30',
      origin: 'Chợ Bến Thành, Q.1',
      destination: 'FPT University HCMC',
      status: 'completed',
      statusLabel: 'Đã hoàn thành',
      statusColor: 'bg-[#DDF3EA] text-[#0B7A5C]',
      vehicle: 'Honda City · 51G-119.02',
      passengersCount: 2,
      totalEarnings: 80000,
      distanceKm: 19.2,
      rating: 5.0
    },
    {
      id: 'hist_drv_03',
      date: 'Thứ 4, 10/09/2026',
      time: '07:00',
      origin: 'FPT University HCMC',
      destination: 'Landmark 81, Bình Thạnh',
      status: 'completed',
      statusLabel: 'Đã hoàn thành',
      statusColor: 'bg-[#DDF3EA] text-[#0B7A5C]',
      vehicle: 'Honda City · 51G-119.02',
      passengersCount: 1,
      totalEarnings: 40000,
      distanceKm: 14.5,
      rating: 4.9
    }
  ] : [
    {
      id: 'hist_pas_01',
      date: 'Hôm nay, 12/09/2026',
      time: '07:00',
      origin: 'FPT University HCMC (Cổng 2)',
      destination: 'Chợ Bến Thành, Q.1',
      status: 'upcoming',
      statusLabel: 'Đã giữ chỗ',
      statusColor: 'bg-[#DDF1F4] text-[#0A6E7A]',
      driverName: 'Quốc Huy',
      driverInitials: 'QH',
      driverPhone: '0908 123 456',
      vehicle: 'Honda City · 51G-119.02',
      fareVnd: 45000,
      seats: 1,
      code: '#RS-4821',
      distanceKm: 18.5
    },
    {
      id: 'hist_pas_02',
      date: 'Hôm qua, 11/09/2026',
      time: '17:30',
      origin: 'Chợ Bến Thành, Q.1',
      destination: 'FPT University HCMC',
      status: 'completed',
      statusLabel: 'Đã hoàn thành',
      statusColor: 'bg-[#DDF3EA] text-[#0B7A5C]',
      driverName: 'Quốc Huy',
      driverInitials: 'QH',
      driverPhone: '0908 123 456',
      vehicle: 'Honda City · 51G-119.02',
      fareVnd: 45000,
      seats: 1,
      code: '#RS-3391',
      distanceKm: 19.2
    }
  ];

  const filteredHistory = singleTripsData.filter(item => {
    if (activeFilter === 'completed') return item.status === 'completed';
    if (activeFilter === 'upcoming') return item.status === 'upcoming';
    return true;
  });

  const currentSchedulesCount = currentRole === 'driver' ? driverSchedules.length : passengerSchedules.length;

  return (
    <div className="w-full min-h-full flex flex-col bg-[#F4F7F5] pb-8">
      {/* Top Sticky Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-[#101B17] tracking-tight">Chuyến đi</h1>
            <span className="text-[11px] text-[#8A9993]">
              {currentRole === 'driver' ? 'Quản lý chuyến lẻ & lịch trình cố định' : 'Chuyến đi lẻ & lịch trình cố định'}
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
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/shared/trip-detail/${item.id}`)}
                  className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.04)] flex flex-col gap-3 cursor-pointer hover:border-[#BDE7D5] active:scale-[0.99] transition-all"
                >
                  {/* Top row: Date + Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#101B17] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0F9D76]" />
                      <span>{item.date} · {item.time}</span>
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${item.statusColor}`}>
                      {item.statusLabel}
                    </span>
                  </div>

                  {/* Middle: Route Info */}
                  <div className="flex gap-2.5 bg-[#F7FAF9] rounded-2xl p-3 border border-[#EEF2F0]">
                    <div className="flex flex-col items-center pt-1 gap-1 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
                      <span className="w-0.5 flex-1 min-h-5 bg-[#DFE7E3]" />
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-1.5 text-xs">
                      <span className="font-semibold text-[#101B17] truncate">{item.origin}</span>
                      <span className="font-semibold text-[#101B17] truncate">{item.destination}</span>
                    </div>
                  </div>

                  {/* Bottom Row: Details and Price */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#EEF2F0] text-xs">
                    <div className="flex items-center gap-2 text-[#4B5A54] truncate">
                      <Car className="w-3.5 h-3.5 text-[#0B7A5C] shrink-0" />
                      <span className="text-[11.5px] truncate">{item.vehicle}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-bold font-mono text-[#0B7A5C] text-sm">
                        {new Intl.NumberFormat('vi-VN').format(currentRole === 'driver' ? item.totalEarnings : item.fareVnd)} ₫
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#8A9993]" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ===================== TAB 2: CHUYẾN ĐỊNH KỲ ===================== */}
        {tripType === 'recurring' && (
          <>
            {/* DRIVER VIEW */}
            {currentRole === 'driver' && (
              <>
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
                      onClick={() => navigate('/driver/schedules')}
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
                          className={`bg-white rounded-3xl p-4.5 border border-[#E4EAE7] shadow-[0_4px_16px_rgba(16,27,23,0.06)] flex flex-col gap-3.5 transition-all ${
                            isActive ? 'opacity-100' : 'opacity-70 bg-[#FAFBFB]'
                          }`}
                        >
                          {/* ① Header & Switch */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-10 h-10 rounded-2xl bg-[#F1FAF6] text-[#0B7A5C] flex items-center justify-center shrink-0 border border-[#BDE7D5]/50">
                                <Repeat className="w-5 h-5 stroke-[2.2]" />
                              </span>
                              <div className="min-w-0">
                                <h2 className="text-[14.5px] font-bold text-[#101B17] truncate">
                                  {sch.title}
                                </h2>
                                <p className="text-[11px] text-[#8A9993] truncate">
                                  {isActive ? 'Tự đăng chuyến lúc 20:00 tối hôm trước' : 'Đang tạm dừng tự động đăng chuyến'}
                                </p>
                              </div>
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

                          {/* ② Route Rail & Timeline */}
                          <div className="bg-[#F7FAF9] rounded-2xl p-3 border border-[#EEF2F0] flex flex-col gap-2.5">
                            <div className="flex gap-2.5">
                              <div className="flex flex-col items-center pt-1 gap-1 shrink-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
                                <span className="w-0.5 flex-1 min-h-6 bg-[#DFE7E3]" />
                                <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
                              </div>

                              <div className="flex-1 min-w-0 flex flex-col gap-2 text-xs">
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-semibold text-[#101B17] truncate">{sch.origin}</span>
                                  <span className="font-mono font-bold text-[#101B17] shrink-0">{sch.time}</span>
                                </div>

                                <span className="text-[11px] text-[#8A9993]">
                                  {sch.vehicleModel || 'Xe máy'} · {sch.vehiclePlate || '59-X3 892.12'} · {sch.availableSeats || 1} chỗ nhận
                                </span>

                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-semibold text-[#101B17] truncate">{sch.destination}</span>
                                  <span className="font-mono font-semibold text-[#8A9993] shrink-0">
                                    {sch.duration?.durationLabel || '01/10 → 31/12/2026'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ③ Day of week badges */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8A9993]">
                              Lịch trình trong tuần
                            </span>
                            <div className="grid grid-cols-7 gap-1.5">
                              {WEEK_DAYS.map((day) => {
                                const isRunDay = (sch.days || []).includes(day) && isActive;
                                return (
                                  <span
                                    key={day}
                                    className={`h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                                      isRunDay
                                        ? 'bg-[#DDF3EA] text-[#0B7A5C] border border-[#B2E2D0]/60'
                                        : 'bg-[#F7FAF9] text-[#C3CDC9] border border-[#EEF2F0]'
                                    }`}
                                  >
                                    {day}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* ④ Regular passengers */}
                          <div className="flex flex-col gap-2 pt-1 border-t border-[#EEF2F0]">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8A9993]">
                                Khách quen đăng ký ({sch.subscribers?.length || 0}/{sch.availableSeats || 1})
                              </span>
                              {sch.wishlistDiscountPercent > 0 && (
                                <span className="text-[11px] font-bold text-[#0B7A5C]">
                                  Ưu đãi khách quen: -{sch.wishlistDiscountPercent}%
                                </span>
                              )}
                            </div>

                            {sch.subscribers && sch.subscribers.length > 0 ? (
                              <div className="space-y-1.5">
                                {sch.subscribers.map((p, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-[#F1FAF6] rounded-xl p-2.5 border border-[#BDE7D5]/60 flex items-center justify-between text-xs"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <span className="w-7 h-7 rounded-full bg-[#0F9D76] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                        {p.avatar || 'MA'}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <span className="font-bold text-[#101B17] block truncate">{p.name}</span>
                                        <span className="text-[10px] text-[#4B5A54] block truncate">{p.pickup} → {p.dropoff}</span>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-[#0B7A5C] bg-[#DDF3EA] px-2 py-0.5 rounded-md shrink-0">
                                      Trọn gói T10
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-[11px] text-[#8A9993] italic px-1">
                                Chưa có hành khách đăng ký trọn gói.
                              </div>
                            )}
                          </div>

                          {/* ⑤ Pricing Summary & Action Footer */}
                          <div className="flex items-center justify-between pt-1 border-t border-[#EEF2F0] text-xs">
                            <span className="text-xs font-medium text-[#4B5A54]">
                              Đơn giá: <strong className="font-mono text-[#0B7A5C]">{(sch.pricePerTrip || 35000).toLocaleString('vi-VN')} ₫</strong>/ghế
                            </span>

                            <span className="px-2 py-0.5 rounded-md bg-[#DDF3EA] text-[#0B7A5C] text-[10.5px] font-semibold">
                              Tự động ghép khách
                            </span>
                          </div>

                          {/* ⑥ Actions */}
                          <div className="grid grid-cols-2 gap-2.5 pt-1">
                            <button
                              type="button"
                              onClick={() => navigate('/driver/schedules')}
                              className="h-11 rounded-2xl border-[1.5px] border-[#E4EAE7] bg-white text-[#101B17] hover:bg-[#F7FAF9] font-bold text-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#4B5A54]" />
                              <span>Quản lý lịch trình</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => navigate('/driver/home')}
                              className="h-11 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(15,157,118,0.25)]"
                            >
                              <span>Xem trên Trang chủ</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Button to add another schedule */}
                    <button
                      type="button"
                      onClick={() => navigate('/driver/schedules')}
                      className="w-full h-12 rounded-2xl border-2 border-dashed border-[#BDE7D5] bg-[#F1FAF6] hover:bg-[#E3F6ED] text-[#0B7A5C] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer mt-1"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>+ Thêm lịch trình định kỳ</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* PASSENGER VIEW */}
            {currentRole === 'passenger' && (
              <>
                {passengerSchedules.length === 0 ? (
                  /* EMPTY STATE - HÀNH KHÁCH CHƯA CÓ LỊCH */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto min-h-[360px] animate-rs-pop">
                    <div className="w-18 h-18 rounded-3xl bg-[#F1FAF6] border border-[#BDE7D5] text-[#0F9D76] flex items-center justify-center shadow-[0_6px_20px_rgba(15,157,118,0.15)] mb-4">
                      <CalendarClock className="w-9 h-9 stroke-[1.8]" />
                    </div>

                    <h2 className="text-[16px] font-bold text-[#101B17] mb-1.5">
                      Bạn chưa lưu lịch trình cố định
                    </h2>

                    <p className="text-xs text-[#8A9993] max-w-[280px] leading-relaxed mb-6">
                      Lưu lộ trình đi học/đi làm hàng ngày để 1 chạm tra cứu tài xế và nhận ưu đãi đi chung trọn gói cả tháng.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate('/passenger/schedules')}
                      className="w-full max-w-[260px] h-12 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-sm shadow-[0_6px_18px_rgba(15,157,118,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Thêm lịch cố định ngay</span>
                    </button>
                  </div>
                ) : (
                  /* PASSENGER RECURRING LIST */
                  <div className="flex flex-col gap-4 animate-rs-sheet-up">
                    {passengerSchedules.map((sch) => {
                      const isActive = sch.active ?? true;
                      return (
                        <div
                          key={sch.id}
                          className={`bg-white rounded-3xl p-4.5 border border-[#E4EAE7] shadow-[0_4px_16px_rgba(16,27,23,0.06)] flex flex-col gap-3.5 transition-all ${
                            isActive ? 'opacity-100' : 'opacity-70 bg-[#FAFBFB]'
                          }`}
                        >
                          {/* ① Header & Switch */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-10 h-10 rounded-2xl bg-[#F1FAF6] text-xl flex items-center justify-center shrink-0 border border-[#BDE7D5]/50">
                                {sch.icon || '🏢'}
                              </span>
                              <div className="min-w-0">
                                <h2 className="text-[14.5px] font-bold text-[#101B17] truncate">
                                  {sch.title}
                                </h2>
                                <p className="text-[11px] text-[#0B7A5C] font-semibold truncate">
                                  {sch.purpose || 'Đi làm'} · {isActive ? 'Đang kích hoạt' : 'Tạm dừng'}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              role="switch"
                              aria-checked={isActive}
                              onClick={() => togglePassengerSchedule(sch.id)}
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

                          {/* ② Route Rail */}
                          <div className="bg-[#F7FAF9] rounded-2xl p-3 border border-[#EEF2F0] flex flex-col gap-2.5">
                            <div className="flex gap-2.5">
                              <div className="flex flex-col items-center pt-1 gap-1 shrink-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
                                <span className="w-0.5 flex-1 min-h-6 bg-[#DFE7E3]" />
                                <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
                              </div>

                              <div className="flex-1 min-w-0 flex flex-col gap-2 text-xs">
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-semibold text-[#101B17] truncate">{sch.origin}</span>
                                  <span className="font-mono font-bold text-[#101B17] shrink-0">{sch.time}</span>
                                </div>

                                <span className="text-[11px] text-[#8A9993]">
                                  Hiệu lực: {sch.duration?.durationLabel || '01/10 → 31/10/2026'}
                                </span>

                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-semibold text-[#101B17] truncate">{sch.destination}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ③ Day of week badges */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8A9993]">
                              Các ngày cần đi
                            </span>
                            <div className="grid grid-cols-7 gap-1.5">
                              {WEEK_DAYS.map((day) => {
                                const isRunDay = (sch.days || []).includes(day) && isActive;
                                return (
                                  <span
                                    key={day}
                                    className={`h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-colors ${
                                      isRunDay
                                        ? 'bg-[#DDF3EA] text-[#0B7A5C] border border-[#B2E2D0]/60'
                                        : 'bg-[#F7FAF9] text-[#C3CDC9] border border-[#EEF2F0]'
                                    }`}
                                  >
                                    {day}
                                  </span>
                                );
                              })}
                            </div>
                          </div>

                          {/* ④ Matched Driver status */}
                          {sch.matchedDriver ? (
                            <div className="bg-[#F1FAF6] rounded-2xl p-3 border border-[#B2E2D0] flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <span className="w-8 h-8 rounded-full bg-[#0F9D76] text-white font-bold flex items-center justify-center shrink-0">
                                  {sch.matchedDriver.avatar || 'QH'}
                                </span>
                                <div className="min-w-0">
                                  <p className="font-bold text-[#101B17] truncate">{sch.matchedDriver.name}</p>
                                  <p className="text-[10px] text-[#4B5A54] truncate">{sch.matchedDriver.status || 'Đã ghép đôi T10'}</p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => navigate('/shared/chat/drv_01')}
                                className="px-3 py-1.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                              >
                                Nhắn tin
                              </button>
                            </div>
                          ) : (
                            <div className="bg-[#FFF9F3] p-2.5 rounded-2xl border border-[#FFE4CC] flex items-center justify-between text-xs">
                              <span className="text-[#8A4A0B] text-[11px] font-medium">Chưa có tài xế ghép đôi</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchParams(prev => ({
                                    ...prev,
                                    origin: sch.origin,
                                    destination: sch.destination,
                                    departureTime: sch.time,
                                    seats: 1
                                  }));
                                  navigate(`/passenger/results?mode=recurring&scheduleId=${sch.id}&origin=${encodeURIComponent(sch.origin)}&destination=${encodeURIComponent(sch.destination)}&time=${encodeURIComponent(sch.time)}`);
                                }}
                                className="px-3 py-1 bg-[#EE7A22] hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                              >
                                Tìm tài xế
                              </button>
                            </div>
                          )}

                          {/* ⑤ Actions */}
                          <div className="grid grid-cols-2 gap-2.5 pt-1">
                            <button
                              type="button"
                              onClick={() => navigate('/passenger/schedules')}
                              className="h-11 rounded-2xl border-[1.5px] border-[#E4EAE7] bg-white text-[#101B17] hover:bg-[#F7FAF9] font-bold text-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#4B5A54]" />
                              <span>Quản lý lịch</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSearchParams(prev => ({
                                  ...prev,
                                  origin: sch.origin,
                                  destination: sch.destination,
                                  departureTime: sch.time,
                                  seats: 1
                                }));
                                navigate(`/passenger/results?mode=recurring&scheduleId=${sch.id}&origin=${encodeURIComponent(sch.origin)}&destination=${encodeURIComponent(sch.destination)}&time=${encodeURIComponent(sch.time)}`);
                              }}
                              className="h-11 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-xs transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(15,157,118,0.25)]"
                            >
                              <span>Tra cứu tài xế</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => navigate('/passenger/schedules')}
                      className="w-full h-12 rounded-2xl border-2 border-dashed border-[#BDE7D5] bg-[#F1FAF6] hover:bg-[#E3F6ED] text-[#0B7A5C] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer mt-1"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>+ Thêm lịch trình cố định</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
