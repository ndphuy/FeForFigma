import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  ChevronRight,
  Car,
  Wallet,
  X,
  Phone,
  Flag
} from 'lucide-react';
import { ReportModal } from '../../components/ReportModal';

export const TripHistory = () => {
  const { currentRole } = useApp();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'completed' | 'upcoming'
  const [selectedHistoryTrip, setSelectedHistoryTrip] = useState(null);
  const [showReport, setShowReport] = useState(false);

  // Mock comprehensive history list with clean vehicle strings
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
      passengers: [
        { name: 'Thùy Linh', initials: 'TL', phone: '0988 776 655', pickup: 'Ngã 4 Thủ Đức', dropoff: 'Hàng Xanh', fare: 35000 },
        { name: 'Minh Anh', initials: 'MA', phone: '0912 345 678', pickup: 'Cổng 2 ĐH FPT', dropoff: 'Chợ Bến Thành', fare: 45000 }
      ],
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
      passengersCount: 3,
      passengers: [
        { name: 'Hoàng Nam', initials: 'HN', phone: '0933 111 222', pickup: 'Chợ Bến Thành', dropoff: 'KTX Khu B', fare: 45000 },
        { name: 'Thu Thảo', initials: 'TT', phone: '0909 333 444', pickup: 'Hàng Xanh', dropoff: 'FPT University', fare: 35000 }
      ],
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
      passengersCount: 2,
      passengers: [
        { name: 'Bảo Trâm', initials: 'BT', phone: '0977 888 999', pickup: 'Cổng ĐH FPT', dropoff: 'Landmark 81', fare: 40000 }
      ],
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
      vehicleDetail: 'Honda City (Trắng ngọc trai)',
      fareVnd: 45000,
      seats: 1,
      code: '#RS-4821',
      pin: '4821',
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
      driverName: 'Nguyễn Minh',
      driverInitials: 'NM',
      driverPhone: '0933 222 111',
      vehicle: 'Mazda 3 · 51K-882.91',
      vehicleDetail: 'Mazda 3 (Đỏ pha lê)',
      fareVnd: 45000,
      seats: 1,
      code: '#RS-3190',
      distanceKm: 19.0,
      ratingGiven: 5
    },
    {
      id: 'hist_pas_03',
      date: 'Thứ 4, 10/09/2026',
      time: '07:15',
      origin: 'Ngã 4 Thủ Đức',
      destination: 'Landmark 81, Bình Thạnh',
      status: 'completed',
      statusLabel: 'Đã hoàn thành',
      statusColor: 'bg-[#DDF3EA] text-[#0B7A5C]',
      driverName: 'Hoàng Tùng',
      driverInitials: 'HT',
      driverPhone: '0977 123 999',
      vehicle: 'Kia Seltos · 51H-445.67',
      vehicleDetail: 'Kia Seltos (Đen huyền bí)',
      fareVnd: 40000,
      seats: 1,
      code: '#RS-1842',
      distanceKm: 14.2,
      ratingGiven: 5
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
            <span className="text-base font-bold text-[#101B17] tracking-tight">Lịch sử chuyến đi</span>
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
            onClick={() => setSelectedHistoryTrip(item)}
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

            {/* Route */}
            <div className="flex gap-2.5 pt-0.5">
              <div className="flex flex-col items-center pt-1 gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#0F9D76]" />
                <span className="w-0.5 flex-1 min-h-[18px] bg-[#DFE7E3]" />
                <span className="w-2 h-2 rounded-xs bg-[#EE7A22]" />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between gap-1 text-xs">
                <span className="font-semibold text-[#101B17] truncate">{item.origin}</span>
                <span className="font-semibold text-[#101B17] truncate">{item.destination}</span>
              </div>
            </div>

            {/* Bottom info row (Clean vehicle plate & formatted fare) */}
            <div className="pt-2 border-t border-[#EEF2F0] flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[#4B5A54] min-w-0 flex-1 pr-2">
                <Car className="w-3.5 h-3.5 text-[#0B7A5C] shrink-0" />
                <span className="truncate text-[11px] font-medium">
                  {item.vehicle || (item.driverName ? `Tài xế: ${item.driverName}` : '')}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className="font-bold font-mono text-[#0F9D76] text-xs">
                  {new Intl.NumberFormat('vi-VN').format(currentRole === 'driver' ? item.totalEarnings : item.fareVnd)} ₫
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#8A9993]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TRIP DETAIL MODAL */}
      {selectedHistoryTrip && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#07110D]/55 backdrop-blur-[2.5px] animate-rs-backdrop-in"
          onClick={() => setSelectedHistoryTrip(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="trip-detail-title"
            onClick={(event) => event.stopPropagation()}
            className="animate-rs-sheet-up flex max-h-[86vh] w-full max-w-[390px] flex-col overflow-hidden rounded-t-[30px] bg-white shadow-[0_-18px_48px_rgba(7,17,13,0.22)]"
          >
            <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-[#D7E0DC]" />

            {/* Header */}
            <div className="flex shrink-0 items-start justify-between border-b border-[#EEF2F0] px-4 pb-3.5 pt-2.5">
              <div className="flex flex-col">
                <h2 id="trip-detail-title" className="text-[19px] font-semibold leading-6 text-[#101B17]">Chi tiết chuyến đi</h2>
                <span className="mt-0.5 text-sm text-[#8A9993]">{selectedHistoryTrip.date} · {selectedHistoryTrip.time}</span>
              </div>
              <button
                type="button"
                aria-label="Đóng chi tiết chuyến đi"
                onClick={() => setSelectedHistoryTrip(null)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F4F7F5] text-[#101B17] transition-colors hover:bg-[#E4EAE7]"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <div className="rs-scroll flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-4 py-3.5">
              {/* Status & Code */}
              <div className="flex min-h-[48px] shrink-0 items-center justify-between rounded-[18px] border border-[#E4EAE7] bg-[#F7FAF9] px-3.5 py-2.5">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${selectedHistoryTrip.statusColor}`}>
                  {selectedHistoryTrip.statusLabel}
                </span>
                <span className="font-mono text-[13px] font-bold text-[#0B7A5C]">
                  {selectedHistoryTrip.code || `#RS-${selectedHistoryTrip.id.slice(-4).toUpperCase()}`}
                </span>
              </div>

              {/* Itinerary */}
              <div className="flex shrink-0 flex-col gap-3 rounded-[20px] border border-[#DDE5E1] bg-[#F9FBFA] px-3.5 py-4">
                <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[#8A9993]">Lộ trình di chuyển</span>
                <div className="flex items-stretch gap-3">
                  <div className="flex flex-col items-center py-1">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#0F9D76]" />
                    <span className="my-1 min-h-7 w-0.5 flex-1 bg-[#DFE7E3]" />
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-[#EE7A22]" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#8A9993]">Điểm xuất phát</span>
                      <span className="text-[14px] font-semibold leading-5 text-[#101B17]">{selectedHistoryTrip.origin}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-[#8A9993]">Điểm đến</span>
                      <span className="text-[14px] font-semibold leading-5 text-[#101B17]">{selectedHistoryTrip.destination}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver / Passenger Info */}
              {currentRole === 'driver' ? (
                <div className="flex flex-col gap-2 rounded-[20px] border border-[#DDE5E1] bg-white p-3.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[#8A9993]">
                    Hành khách tham gia ({selectedHistoryTrip.passengers?.length || 0})
                  </span>
                  <div className="flex flex-col gap-2">
                    {selectedHistoryTrip.passengers?.map((passenger) => (
                      <div key={`${selectedHistoryTrip.id}-${passenger.phone}`} className="flex items-center justify-between rounded-2xl bg-[#F7FAF9] p-2.5">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDF3EA] text-xs font-bold text-[#0B7A5C]">
                            {passenger.initials}
                          </div>
                          <div className="min-w-0">
                            <span className="block truncate text-[13px] font-semibold text-[#101B17]">{passenger.name}</span>
                            <span className="block truncate text-[10.5px] text-[#8A9993]">{passenger.pickup} → {passenger.dropoff}</span>
                          </div>
                        </div>
                        <span className="shrink-0 pl-2 font-mono text-xs font-bold text-[#0F9D76]">
                          {new Intl.NumberFormat('vi-VN').format(passenger.fare)} ₫
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[72px] shrink-0 items-center justify-between rounded-[20px] border border-[#DDE5E1] bg-white px-3.5 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DDF3EA] text-base font-semibold text-[#0B7A5C]">
                      {selectedHistoryTrip.driverInitials}
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-[14px] font-semibold text-[#101B17]">Tài xế: {selectedHistoryTrip.driverName}</span>
                      <span className="mt-0.5 block truncate text-xs text-[#8A9993]">{selectedHistoryTrip.vehicleDetail || selectedHistoryTrip.vehicle}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${selectedHistoryTrip.driverPhone}`}
                    aria-label={`Gọi tài xế ${selectedHistoryTrip.driverName}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#F1FAF6] text-[#0B7A5C]"
                  >
                    <Phone className="h-[18px] w-[18px]" strokeWidth={2} />
                  </a>
                </div>
              )}

              {/* Payment Summary */}
              <div className="flex min-h-[52px] shrink-0 items-center justify-between rounded-[18px] border border-[#BDE7D5] bg-[#F1FAF6] px-3.5 py-3">
                <div className="flex items-center gap-2.5">
                  <Wallet className="h-[18px] w-[18px] text-[#0F9D76]" strokeWidth={2} />
                  <span className="text-[14px] font-semibold text-[#101B17]">
                    {currentRole === 'driver' ? 'Tổng tiền thu được:' : 'Chi phí chia sẻ:'}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-[14px] font-bold text-[#0F9D76]">
                  {new Intl.NumberFormat('vi-VN').format(currentRole === 'driver' ? selectedHistoryTrip.totalEarnings : selectedHistoryTrip.fareVnd)} ₫
                </span>
              </div>

              {/* Report Trip Issue */}
              <button
                type="button"
                onClick={() => setShowReport(true)}
                className="flex h-11 w-full shrink-0 items-center justify-center gap-1.5 rounded-[16px] border border-[#F7D9B8] bg-[#FFF4E9] text-[13px] font-semibold text-[#8A4A0B] transition-colors hover:bg-[#FFEEDB]"
              >
                <Flag className="h-3.5 w-3.5" />
                Báo cáo sự cố chuyến đi
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedHistoryTrip(null)}
                className="h-12 w-full shrink-0 rounded-[18px] bg-[#F4F7F5] text-[14px] font-semibold text-[#101B17] transition-colors hover:bg-[#E4EAE7]"
              >
                Đóng chi tiết
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        open={showReport}
        onClose={() => setShowReport(false)}
        reportedName={selectedHistoryTrip ? (currentRole === 'driver' ? (selectedHistoryTrip.passengers?.[0]?.name || 'hành khách') : selectedHistoryTrip.driverName) : ''}
        tripCode={selectedHistoryTrip?.code || selectedHistoryTrip?.id}
      />
    </div>
  );
};
