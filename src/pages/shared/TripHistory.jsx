import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  ChevronRight,
  Car,
  Wallet,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const TripHistory = () => {
  const navigate = useNavigate();
  const { currentRole } = useApp();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'completed' | 'upcoming'

  // Mock comprehensive history list
  const historyData = currentRole === 'driver' ? [
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

  const filteredHistory = historyData.filter(item => {
    if (activeFilter === 'completed') return item.status === 'completed';
    if (activeFilter === 'upcoming') return item.status === 'upcoming';
    return true;
  });

  return (
    <div className="w-full flex flex-col bg-[#F4F7F5] pb-6">
      {/* Top Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-base font-bold text-[#101B17] tracking-tight">Lịch sử chuyến đi</h1>
            <span className="text-[11px] text-[#8A9993]">
              {currentRole === 'driver' ? 'Chuyến bạn đã lái & mở chỗ' : 'Chuyến bạn đã tham gia'}
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-[#DDF3EA] text-[#0B7A5C] text-xs font-bold border border-[#B2E2D0]/50">
            {historyData.length} chuyến
          </span>
        </div>

        {/* Filter Tabs */}
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
      </div>

      {/* Main List */}
      <div className="p-3.5 flex flex-col gap-3">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/shared/trip-detail/${item.id}`)}
            className="bg-white rounded-2xl p-3.5 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] flex flex-col gap-2.5 cursor-pointer hover:border-[#BDE7D5] active:scale-[0.99] transition-all"
          >
            {/* Top row: Date + Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#101B17] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0F9D76]" />
                <span>{item.date} · {item.time}</span>
              </span>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.statusColor}`}>
                {item.statusLabel}
              </span>
            </div>

            {/* Middle: Route Info */}
            <div className="flex gap-2.5 bg-[#F7FAF9] rounded-xl p-2.5">
              <div className="flex flex-col items-center pt-1 gap-0.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#0F9D76]" />
                <span className="w-0.5 h-4 bg-[#DFE7E3]" />
                <span className="w-2 h-2 rounded-xs bg-[#EE7A22]" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1 text-xs">
                <span className="font-semibold text-[#101B17] truncate">{item.origin}</span>
                <span className="font-semibold text-[#101B17] truncate">{item.destination}</span>
              </div>
            </div>

            {/* Bottom Row: Details and Price */}
            <div className="flex items-center justify-between pt-1 border-t border-[#EEF2F0] text-xs">
              <div className="flex items-center gap-2 text-[#4B5A54] truncate">
                <Car className="w-3.5 h-3.5 text-[#0B7A5C] shrink-0" />
                <span className="text-[11px] truncate">{item.vehicle}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-bold font-mono text-[#0B7A5C]">
                  {new Intl.NumberFormat('vi-VN').format(currentRole === 'driver' ? item.totalEarnings : item.fareVnd)} ₫
                </span>
                <ChevronRight className="w-4 h-4 text-[#8A9993]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
