import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  DollarSign,
  Check,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  Heart,
  TrendingUp,
  Info,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { RouteMapPreview } from '../../components/RouteMapPreview';

export const CreateTrip = () => {
  const navigate = useNavigate();
  const { publishTrip, vehicles, activeVehicle, setActiveVehicle } = useApp();

  const [currentStep, setCurrentStep] = useState(1); // 1 to 6

  // Form state
  const [origin, setOrigin] = useState('Thủ Đức · Khu Công Nghệ Cao');
  const [destination, setDestination] = useState('Quận 1 · Chợ Bến Thành');
  const [stops, setStops] = useState([
    { id: 'st_1', name: 'FPT University HCMC', time: '07:12' },
    { id: 'st_2', name: 'Quận 7 · Lotte Mart', time: '07:35' }
  ]);
  const [newStopName, setNewStopName] = useState('');
  
  const [departureDate, setDepartureDate] = useState('Thứ 6, 12 tháng 9');
  const [departureTime, setDepartureTime] = useState('07:00');
  const [isRecurring, setIsRecurring] = useState(true);
  const [recurringDays, setRecurringDays] = useState(['T2', 'T3', 'T4', 'T5', 'T6']);

  const [selectedVehId, setSelectedVehId] = useState(activeVehicle?.id || 'veh_01');
  const chosenVehicle = vehicles.find(v => v.id === selectedVehId) || activeVehicle;

  const maxSeats = chosenVehicle?.passengerCapacity || 3;
  const [seats, setSeats] = useState(maxSeats);
  const [ratePerKm, setRatePerKm] = useState(5000); // 5.000 đ/km
  const [wishlistDiscountPercent, setWishlistDiscountPercent] = useState(10);
  const [isWishlistDiscountEnabled, setIsWishlistDiscountEnabled] = useState(true);
  const distanceKm = 18.5;

  // System configured min / max per km (admin limits)
  const MIN_RATE = 3000;
  const MAX_RATE = 7000;

  // Calculated trip price
  const calculatedPricePerSeat = Math.round((distanceKm * ratePerKm) / (chosenVehicle?.type === 'bike' ? 1 : 2) / 1000) * 1000;

  const handleAddStop = () => {
    if (!newStopName.trim()) return;
    setStops(prev => [...prev, { id: `st_${Date.now()}`, name: newStopName, time: '07:20' }]);
    setNewStopName('');
  };

  const handleRemoveStop = (id) => {
    setStops(prev => prev.filter(s => s.id !== id));
  };

  const toggleDay = (day) => {
    if (recurringDays.includes(day)) {
      setRecurringDays(prev => prev.filter(d => d !== day));
    } else {
      setRecurringDays(prev => [...prev, day]);
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Publish trip
      publishTrip({
        origin,
        destination,
        stops: [
          { id: 'st_origin', name: origin, role: 'Xuất phát', time: departureTime, isPassengerStop: true },
          ...stops.map((s, idx) => ({ id: s.id, name: s.name, role: `Điểm đón ${idx + 1}`, time: s.time, isPassengerStop: false })),
          { id: 'st_dest', name: destination, role: 'Điểm kết thúc', time: '07:48', isPassengerStop: true }
        ],
        departureDate,
        departureTime,
        seats,
        totalSeats: chosenVehicle?.seats || 4,
        vehicleModel: chosenVehicle?.model,
        vehiclePlate: chosenVehicle?.plate,
        vehicleColor: chosenVehicle?.color,
        ratePerKm,
        priceVnd: calculatedPricePerSeat,
        distanceKm
      });
      navigate('/driver/home');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/driver/home');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Top Header & Progress Rail matching Create Trip Flow.dc.html */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="w-11 h-11 border border-[#EEF2F0] rounded-2xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors cursor-pointer"
          >
            ‹
          </button>

          <div className="flex-1 min-w-0 flex flex-col">
            <span className="text-[17px] font-bold text-[#101B17]">
              {currentStep === 1 && 'Lộ trình chính'}
              {currentStep === 2 && 'Điểm dừng ghé qua'}
              {currentStep === 3 && 'Lịch trình & Lặp lại'}
              {currentStep === 4 && 'Số chỗ & Xe'}
              {currentStep === 5 && 'Chi phí chia sẻ (/km)'}
              {currentStep === 6 && 'Xem lại & Đăng chuyến'}
            </span>
            <span className="text-xs text-[#8A9993]">Bước {currentStep} / 6</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/driver/home')}
            className="text-xs font-semibold text-[#8A9993] hover:text-[#101B17] shrink-0 cursor-pointer"
          >
            Lưu nháp
          </button>
        </div>

        {/* 6 Step Progress Rail */}
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5, 6].map(st => (
            <span
              key={st}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                st <= currentStep ? 'bg-[#0F9D76]' : 'bg-[#E4EAE7]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto rs-scroll p-4 pb-28 flex flex-col gap-3.5">
        {/* STEP 1: ROUTE */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-3.5">
            <div>
              <h2 className="text-lg font-bold text-[#101B17]">Bạn đi từ đâu đến đâu?</h2>
              <p className="text-xs text-[#8A9993] mt-0.5">
                Nhập chuyến bạn vốn đã định đi. Khách sẽ được ghép vào phần trùng tuyến.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">Điểm xuất phát · A</span>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full text-xs font-bold text-[#101B17] bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl p-3 outline-none focus:border-[#0F9D76]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">Điểm kết thúc · D</span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs font-bold text-[#101B17] bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl p-3 outline-none focus:border-[#0F9D76]"
                />
              </div>
            </div>

            <RouteMapPreview
              points={[
                { label: origin, type: 'origin' },
                { label: destination, type: 'destination' },
              ]}
              meta="Xem trước lộ trình"
            />

            {/* Corridor Insight */}
            <div className="bg-[#F1FAF6] border border-[#BDE7D5] rounded-2xl p-3.5 flex gap-2.5 items-start">
              <TrendingUp className="w-4 h-4 text-[#0F9D76] shrink-0 mt-0.5" />
              <span className="text-xs text-[#0B7A5C] leading-relaxed">
                Tuyến <strong>Thủ Đức → Quận 1</strong> lúc 07:00 có <strong>14 khách</strong> đang tìm chuyến tuần này.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: STOPS */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-3.5">
            <div>
              <h2 className="text-lg font-bold text-[#101B17]">Bạn có ghé đâu trên đường?</h2>
              <p className="text-xs text-[#8A9993] mt-0.5">
                Thêm điểm dừng giúp ghép được nhiều khách hơn mà không phải đi vòng.
              </p>
            </div>

            {/* Current Stops List */}
            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-2.5">
              <span className="text-xs font-bold text-[#101B17]">Điểm dừng trên tuyến</span>

              {stops.map((st, idx) => (
                <div key={st.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#F7FAF9] border border-[#E4EAE7]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-[#101B17]">{st.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(st.id)}
                    className="p-1.5 text-[#C22B35] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add New Stop Input */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#EEF2F0]">
                <input
                  type="text"
                  value={newStopName}
                  onChange={(e) => setNewStopName(e.target.value)}
                  placeholder="Nhập tên điểm dừng (VD: Cầu Sài Gòn)..."
                  className="flex-1 text-xs text-[#101B17] bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl p-2.5 outline-none focus:border-[#0F9D76]"
                />
                <button
                  type="button"
                  onClick={handleAddStop}
                  className="h-10 px-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer"
                >
                  + Thêm
                </button>
              </div>
            </div>

            <RouteMapPreview
              points={[
                { label: origin, type: 'origin' },
                ...stops.map((s) => ({ label: s.name, type: 'stop' })),
                { label: destination, type: 'destination' },
              ]}
              meta={`${stops.length + 2} điểm trên tuyến`}
            />
          </div>
        )}

        {/* STEP 3: SCHEDULE (Fixed horizontal overflow) */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-3.5">
            <div>
              <h2 className="text-lg font-bold text-[#101B17]">Thời gian khởi hành</h2>
              <p className="text-xs text-[#8A9993] mt-0.5">
                Thiết lập giờ xuất phát và ngày đi làm định kỳ.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
              <div className="flex gap-2.5">
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">Ngày đi</span>
                  <input
                    type="text"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full min-w-0 text-xs font-bold text-[#101B17] bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl p-3 outline-none focus:border-[#0F9D76] box-border"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">Giờ xuất phát</span>
                  <input
                    type="text"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full min-w-0 text-xs font-bold text-[#101B17] bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl p-3 outline-none focus:border-[#0F9D76] box-border"
                  />
                </div>
              </div>

              {/* Recurring commute toggle */}
              <div className="pt-3 border-t border-[#EEF2F0] flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#101B17]">Lặp lại định kỳ hàng tuần</span>
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 accent-[#0F9D76]"
                  />
                </div>

                {isRecurring && (
                  <div className="flex gap-1.5 justify-between">
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          recurringDays.includes(d)
                            ? 'bg-[#0F9D76] text-white'
                            : 'bg-[#F4F7F5] text-[#4B5A54]'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: VEHICLE & SEATS */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-3.5">
            <div>
              <h2 className="text-lg font-bold text-[#101B17]">Chọn phương tiện & Số chỗ</h2>
              <p className="text-xs text-[#8A9993] mt-0.5">
                Chọn phương tiện sử dụng cho chuyến đi (tối đa 3 xe đã đăng ký).
              </p>
            </div>

            {/* Vehicle selection list */}
            <div className="flex flex-col gap-2.5">
              {vehicles.map((v) => {
                const isSelected = selectedVehId === v.id;
                const isPending = v.verificationStatus === 'pending_review';
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      if (isPending) return;
                      setSelectedVehId(v.id);
                      setActiveVehicle(v.id);
                      setSeats(v.passengerCapacity || 1);
                    }}
                    className={`p-3.5 rounded-2xl border-[1.5px] transition-all bg-white flex items-start justify-between gap-2.5 ${
                      isPending
                        ? 'border-[#E4EAE7] opacity-60 cursor-not-allowed'
                        : isSelected
                          ? 'border-[#0F9D76] bg-[#F1FAF6]/50 shadow-xs cursor-pointer'
                          : 'border-[#E4EAE7] hover:border-[#BDE7D5] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-[#DDF3EA] text-[#0B7A5C] font-bold text-lg flex items-center justify-center shrink-0 mt-0.5">
                        {v.type === 'car' ? '🚗' : '🛵'}
                      </div>
                      <div className="flex flex-col min-w-0 gap-0.5">
                        <span className="text-xs font-bold text-[#101B17] leading-tight block">{v.model}</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-mono font-bold text-[#0B7A5C] bg-white px-1.5 py-0.5 rounded border border-[#BDE7D5]">{v.plate}</span>
                          <span className="text-[11px] text-[#8A9993]">· {v.color}</span>
                        </div>
                        <span className="text-[10px] text-[#8A9993]">{v.typeLabel}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0 mt-1">
                      {isPending ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#FFF4E9] text-[#B45812] text-[10px] font-bold whitespace-nowrap">
                          Chờ duyệt
                        </span>
                      ) : isSelected ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#0F9D76] text-white text-[10px] font-bold shadow-xs whitespace-nowrap">
                          ✓ Đang chọn
                        </span>
                      ) : (
                        <span className="text-xs text-[#8A9993] font-semibold hover:text-[#0B7A5C]">Chọn xe</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Number of seats to offer */}
            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#101B17]">Số ghế mở nhận khách</span>
                <span className="text-[10.5px] text-[#8A9993]">Tối đa {maxSeats} chỗ</span>
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
                  onClick={() => setSeats((prev) => Math.min(maxSeats, prev + 1))}
                  disabled={seats >= maxSeats}
                  className="w-12 h-12 rounded-xl bg-[#F4F7F5] hover:bg-[#EAEFEA] disabled:opacity-40 disabled:cursor-not-allowed text-[#101B17] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[2.5px]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: COST SHARING (/km INPUT) */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-3.5">
            <div>
              <h2 className="text-lg font-bold text-[#101B17]">Định mức chia sẻ chi phí (/km)</h2>
              <p className="text-xs text-[#8A9993] mt-0.5 leading-relaxed">
                Tài xế tự cấu hình đơn giá theo điều kiện chuyến đi ({MIN_RATE.toLocaleString('vi-VN')} – {MAX_RATE.toLocaleString('vi-VN')} ₫/km). Giá khách trả sẽ bằng: <strong>Số km thực tế khách đi × Đơn giá/km</strong>.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3.5">
              {/* Rate per km Input */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#8A9993]">
                  Đơn giá cấu hình / km
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRatePerKm(prev => Math.max(MIN_RATE, prev - 500))}
                    className="w-11 h-12 rounded-xl bg-[#F4F7F5] hover:bg-[#EAEFEA] text-[#101B17] font-bold text-lg flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    -
                  </button>

                  <div className="flex-1 min-w-0 h-12 px-3.5 bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl flex items-center justify-between">
                    <input
                      type="number"
                      min={MIN_RATE}
                      max={MAX_RATE}
                      step={500}
                      value={ratePerKm}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (!isNaN(val)) setRatePerKm(val);
                      }}
                      className="w-full text-base font-bold font-mono text-[#0F9D76] bg-transparent outline-none"
                    />
                    <span className="text-xs font-bold text-[#8A9993] shrink-0 font-mono pl-1">₫/km</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRatePerKm(prev => Math.min(MAX_RATE, prev + 500))}
                    className="w-11 h-12 rounded-xl bg-[#F4F7F5] hover:bg-[#EAEFEA] text-[#101B17] font-bold text-lg flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    +
                  </button>
                </div>

                <div className="flex justify-between items-center text-[11px] text-[#8A9993] pt-0.5">
                  <span>Tối thiểu: {MIN_RATE.toLocaleString('vi-VN')} ₫/km</span>
                  <span>Tối đa: {MAX_RATE.toLocaleString('vi-VN')} ₫/km</span>
                </div>
              </div>

              {/* Real-time Simulated Passenger Examples */}
              <div className="p-3.5 rounded-2xl bg-[#F1FAF6] border border-[#BDE7D5]/80 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B7A5C]">
                  <DollarSign className="w-4 h-4 text-[#0F9D76]" />
                  <span>Cách tính giá tiền khách thực tế:</span>
                </div>

                <div className="bg-white/80 rounded-xl p-2.5 flex flex-col gap-1.5 text-xs border border-[#BDE7D5]/40">
                  <div className="flex justify-between items-center text-[#4B5A54]">
                    <span>Khách đi 5 km:</span>
                    <span className="font-bold font-mono text-[#101B17]">
                      {new Intl.NumberFormat('vi-VN').format(5 * ratePerKm)} ₫
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#4B5A54]">
                    <span>Khách đi 10 km:</span>
                    <span className="font-bold font-mono text-[#101B17]">
                      {new Intl.NumberFormat('vi-VN').format(10 * ratePerKm)} ₫
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#0B7A5C] pt-1 border-t border-[#EEF2F0] font-semibold">
                    <span>Khách đi toàn tuyến ({distanceKm} km):</span>
                    <span className="font-bold font-mono text-[#0F9D76]">
                      {new Intl.NumberFormat('vi-VN').format(Math.round(distanceKm * ratePerKm))} ₫
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-[#8A9993]">
                  Hệ thống tự đo số km từ điểm đón đến điểm trả của khách × {ratePerKm.toLocaleString('vi-VN')} ₫/km.
                </span>
              </div>

              {/* Wishlist Passenger Discount Config */}
              <div className="p-3.5 rounded-2xl bg-[#FFF8F2] border border-[#F7D9B8] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#EE7A22]">
                    <Heart className="w-4 h-4 text-[#EE7A22] fill-[#EE7A22]/20" />
                    <span>Ưu đãi khách quen (Wishlist)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isWishlistDiscountEnabled}
                    onChange={(e) => setIsWishlistDiscountEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#EE7A22]"
                  />
                </div>

                {isWishlistDiscountEnabled && (
                  <div className="flex items-center justify-between pt-1 gap-2">
                    <span className="text-[11px] text-[#8A9993]">Phần trăm giảm cho khách quen:</span>
                    <div className="flex items-center gap-1.5 w-28">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={wishlistDiscountPercent}
                        onChange={(e) => setWishlistDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                        className="w-full px-2.5 py-1 text-xs font-mono font-bold text-[#EE7A22] bg-white border border-[#F7D9B8] rounded-lg outline-none focus:border-[#EE7A22] text-center"
                      />
                      <span className="text-xs font-bold text-[#EE7A22]">%</span>
                    </div>
                  </div>
                )}
                <span className="text-[10px] text-[#8A9993]">
                  Khách quen đã lưu bạn vào Wishlist sẽ được áp dụng mức giá ưu đãi này khi đặt chỗ (Chủ xe tự quyết định).
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: PREVIEW & PUBLISH */}
        {currentStep === 6 && (
          <div className="flex flex-col gap-3.5">
            <div>
              <h2 className="text-lg font-bold text-[#101B17]">Xem lại lộ trình trước khi đăng</h2>
              <p className="text-xs text-[#8A9993] mt-0.5">
                Kiểm tra thông tin chuyến đi trước khi mở nhận khách chia sẻ.
              </p>
            </div>

            <RouteMapPreview
              points={[
                { label: origin, type: 'origin' },
                ...stops.map((s) => ({ label: s.name, type: 'stop' })),
                { label: destination, type: 'destination' },
              ]}
              meta={`${distanceKm} km · ${departureTime}`}
            />

            <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.05)] flex flex-col gap-3">
              <div className="flex justify-between text-xs pb-2 border-b border-[#EEF2F0]">
                <span className="text-[#8A9993]">Lộ trình:</span>
                <span className="font-bold text-[#101B17]">{origin} → {destination}</span>
              </div>
              <div className="flex justify-between text-xs pb-2 border-b border-[#EEF2F0]">
                <span className="text-[#8A9993]">Phương tiện:</span>
                <span className="font-bold text-[#0B7A5C]">{chosenVehicle?.model} ({chosenVehicle?.plate})</span>
              </div>
              <div className="flex justify-between text-xs pb-2 border-b border-[#EEF2F0]">
                <span className="text-[#8A9993]">Khởi hành:</span>
                <span className="font-bold text-[#101B17]">{departureDate} · {departureTime} {isRecurring ? '(Lặp lại hàng tuần)' : ''}</span>
              </div>
              <div className="flex justify-between text-xs pb-2 border-b border-[#EEF2F0]">
                <span className="text-[#8A9993]">Số chỗ mở nhận:</span>
                <span className="font-bold text-[#0F9D76]">{seats} chỗ</span>
              </div>
              <div className="flex justify-between text-xs pb-2 border-b border-[#EEF2F0]">
                <span className="text-[#8A9993]">Đơn giá chia sẻ (/km):</span>
                <span className="font-bold text-[#0F9D76] font-mono">{ratePerKm.toLocaleString('vi-VN')} ₫/km</span>
              </div>
              {isWishlistDiscountEnabled && (
                <div className="flex justify-between text-xs pb-2 border-b border-[#EEF2F0]">
                  <span className="text-[#EE7A22] font-semibold">Ưu đãi Wishlist:</span>
                  <span className="font-bold text-[#EE7A22] font-mono">Giảm {wishlistDiscountPercent}% cho khách quen</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-[#8A9993]">Cơ chế tính giá:</span>
                <span className="font-semibold text-[#101B17] text-right">Km khách thực tế đi × Đơn giá</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions (Enlarged prominent button h-14) */}
      <div className="absolute left-0 right-0 bottom-0 bg-white p-4 border-t border-[#EEF2F0] shadow-2xl flex items-center justify-between gap-3 z-20">
        <button
          type="button"
          onClick={handleNext}
          className="w-full h-14 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-[15px] rounded-2xl shadow-[0_8px_20px_rgba(15,157,118,0.28)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
        >
          <span>{currentStep === 6 ? 'Đăng chuyến đi ngay' : 'Tiếp tục'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
