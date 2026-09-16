import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, MessageSquare, Info, ArrowRight, MapPin, Minus, Plus, Phone } from 'lucide-react';

export const RequestBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, requestBooking, setActiveBookingId } = useApp();

  const trip = trips.find((t) => t.id === id) || trips[0];
  const stops = trip.stops?.length >= 2
    ? trip.stops
    : [
      { id: 'st_o', name: trip.origin, time: trip.departureTime || '07:00' },
      { id: 'st_d', name: trip.destination, time: '08:00' },
    ];

  const [seats, setSeats] = useState(1);
  const [pickupIdx, setPickupIdx] = useState(0);
  const [dropoffIdx, setDropoffIdx] = useState(stops.length - 1);
  const [message, setMessage] = useState('Chào anh, em mang balo nhỏ, đứng ở cổng 2 nhé.');
  const [submitError, setSubmitError] = useState('');

  const pickupStop = stops[pickupIdx] || stops[0];
  const dropoffStop = stops[dropoffIdx] || stops[stops.length - 1];

  const handlePickupChange = (idx) => {
    setPickupIdx(idx);
    if (dropoffIdx <= idx) {
      setDropoffIdx(Math.min(idx + 1, stops.length - 1));
    }
  };

  const totalFare = trip.priceVnd * seats;
  const formattedFare = new Intl.NumberFormat('vi-VN').format(totalFare);

  const handleSubmitRequest = () => {
    const result = requestBooking(trip.id, seats, message, {
      pickupPoint: pickupStop.name,
      dropoffPoint: dropoffStop.name,
    });
    if (!result.ok) {
      setSubmitError(result.message);
      return;
    }
    setActiveBookingId(result.booking.id);
    navigate(`/passenger/booking-pending/${trip.id}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-11 h-11 border border-[#EEF2F0] rounded-2xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors"
        >
          ‹
        </button>

        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-[17px] font-bold text-[#101B17]">Gửi yêu cầu tham gia</span>
          <span className="text-xs text-[#8A9993]">Bước 2 / 2 · Chưa trừ tiền trong ví</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto rs-scroll p-4 pb-28 flex flex-col gap-3.5">
        {/* Trip Summary Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#101B17]">Tóm tắt chuyến đi</span>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-xs font-bold text-[#0B7A5C] hover:underline"
            >
              Sửa
            </button>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1.5 gap-1 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
              <span className="w-0.5 flex-1 min-h-[36px] bg-[#DFE7E3]" />
              <span className="w-2.5 h-2.5 rounded-xs bg-[#EE7A22]" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8A9993] tracking-wider">Điểm đón</span>
                  <span className="text-xs font-bold text-[#101B17] truncate">{pickupStop.name}</span>
                </div>
                <span className="text-xs font-bold text-[#101B17] font-mono">{pickupStop.time}</span>
              </div>

              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-[#8A9993] tracking-wider">Điểm trả</span>
                  <span className="text-xs font-bold text-[#101B17] truncate">{dropoffStop.name}</span>
                </div>
                <span className="text-xs font-bold text-[#101B17] font-mono">{dropoffStop.time}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#EEF2F0]">
            <span className="px-2.5 py-1 rounded-full bg-[#F4F7F5] text-[#4B5A54] text-[11px] font-semibold">
              {trip.departureDate || 'Thứ 6, 12/09'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#F1FAF6] text-[#0B7A5C] text-[11px] font-semibold">
              Đón {trip.departureTime}
            </span>
          </div>
        </div>

        {/* Driver Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-base flex items-center justify-center shrink-0 border border-[#B2E2D0]/50">
            {trip.driverInitials || 'QH'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#101B17] truncate">{trip.driverName}</span>
              <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8A9993] mt-0.5">
              <span><span className="text-[#EE7A22]">★</span> {trip.driverTrustScore} · {trip.vehicleModel}</span>
              <span>•</span>
              <span className="text-[#0B7A5C] font-semibold flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#0F9D76]" />
                {trip.driverPhone || '0908 123 456'}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-1 rounded-lg bg-[#F4F7F5] text-[#4B5A54] shrink-0">
            {trip.vehiclePlate}
          </span>
        </div>

        {/* Number of Seats Selection */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#101B17]">Số chỗ bạn cần</span>
            <span className="text-xs text-[#8A9993]">Tối đa {trip.availableSeats} chỗ</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSeats((prev) => Math.max(1, prev - 1))}
              disabled={seats <= 1}
              className="w-12 h-12 rounded-xl bg-[#F4F7F5] hover:bg-[#EAEFEA] disabled:opacity-40 disabled:cursor-not-allowed text-[#101B17] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Minus className="w-4 h-4 stroke-[2.5px]" />
            </button>

            <div className="flex-1 h-12 rounded-xl bg-[#F1FAF6] border border-[#BDE7D5] flex items-center justify-center gap-1.5">
              <span className="text-lg font-bold font-mono text-[#0F9D76]">{seats}</span>
              <span className="text-xs font-semibold text-[#0B7A5C]">chỗ</span>
            </div>

            <button
              type="button"
              onClick={() => setSeats((prev) => Math.min(trip.availableSeats, prev + 1))}
              disabled={seats >= trip.availableSeats}
              className="w-12 h-12 rounded-xl bg-[#F4F7F5] hover:bg-[#EAEFEA] disabled:opacity-40 disabled:cursor-not-allowed text-[#101B17] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5px]" />
            </button>
          </div>

          {/* Pricing breakdown info */}
          <div className="bg-[#F7FAF9] rounded-2xl p-3 flex flex-col gap-1.5 text-xs text-[#4B5A54] border border-[#EEF2F0]">
            <div className="flex justify-between">
              <span>Cự ly thực tế chặng đón - trả:</span>
              <span className="font-bold text-[#101B17] font-mono">9,0 km</span>
            </div>
            <div className="flex justify-between">
              <span>Đơn giá cấu hình:</span>
              <span className="font-semibold text-[#0B7A5C] font-mono">{(trip.ratePerKm || 5000).toLocaleString('vi-VN')} ₫/km</span>
            </div>
            <div className="flex justify-between">
              <span>Đơn giá mỗi ghế:</span>
              <span className="font-semibold text-[#101B17] font-mono">{new Intl.NumberFormat('vi-VN').format(trip.priceVnd)} ₫</span>
            </div>
            <div className="h-[1px] bg-[#E4EAE7] my-0.5" />
            <div className="flex justify-between items-center text-[#101B17] font-bold">
              <span>Tổng cộng ({seats} ghế):</span>
              <span className="text-[#0F9D76] font-mono text-sm">{formattedFare} ₫</span>
            </div>
          </div>
        </div>

        {/* Message to Driver */}
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#101B17]">
            <MessageSquare className="w-4 h-4 text-[#0B7A5C]" />
            <span>Lời nhắn gửi tài xế (tùy chọn)</span>
          </div>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ví dụ: Em đứng ở cổng chính, mặc áo khoác đỏ..."
            className="w-full text-xs text-[#101B17] bg-[#F7FAF9] border border-[#E4EAE7] rounded-2xl p-3 outline-none focus:border-[#0F9D76] resize-none"
          />
        </div>

        {/* Non-charging policy note */}
        <div className="bg-[#FFF4E9] border border-[#F7D9B8] rounded-2xl p-3 flex gap-2.5 items-start">
          <Info className="w-4 h-4 text-[#EE7A22] shrink-0 mt-0.5" />
          <span className="text-[11px] text-[#8A4A0B] leading-relaxed">
            Chưa thanh toán ngay: Tiền chỉ được chuyển khi tài xế duyệt yêu cầu và bạn lên xe an toàn.
          </span>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute left-0 right-0 bottom-0 bg-white p-4 border-t border-[#EEF2F0] shadow-2xl flex items-center justify-between gap-3 z-20">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#8A9993] uppercase font-bold tracking-wider">Tổng cộng ({seats} chỗ)</span>
          <span className="text-xl font-bold text-[#101B17] font-mono leading-tight">{formattedFare} ₫</span>
        </div>

        <button
          type="button"
          onClick={handleSubmitRequest}
          className="flex-1 h-14 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-[15px] rounded-2xl shadow-[0_8px_20px_rgba(15,157,118,0.28)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
        >
          <span>Gửi yêu cầu đặt chỗ</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      {submitError && (
        <div role="alert" className="absolute bottom-[92px] left-4 right-4 z-30 rounded-xl bg-[#FCEBEB] border border-[#F4C6C6] px-3 py-2 text-[11px] font-semibold text-[#8A1F27] shadow-sm">
          {submitError}
        </div>
      )}
    </div>
  );
};
