import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Car, 
  Users, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X,
  Phone,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const DriverSchedules = () => {
  const navigate = useNavigate();
  const { 
    driverSchedules, 
    addDriverSchedule, 
    updateDriverSchedule, 
    deleteDriverSchedule, 
    toggleDriverSchedule,
    vehicles,
    activeVehicle 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedDays, setSelectedDays] = useState(['T2', 'T3', 'T4', 'T5', 'T6']);
  const [time, setTime] = useState('07:00');
  const [startDate, setStartDate] = useState('01/10/2026');
  const [endDate, setEndDate] = useState('31/12/2026');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'veh_01');
  const [seats, setSeats] = useState(1);
  const [pricePerTrip, setPricePerTrip] = useState(35000);
  const [wishlistDiscount, setWishlistDiscount] = useState(15);

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const handleOpenAddModal = () => {
    setEditingSchedule(null);
    setTitle('Sáng đi làm');
    setOrigin('Phan Văn Trị, Gò Vấp');
    setDestination('Khu Công Nghệ Cao, Q.9');
    setSelectedDays(['T2', 'T3', 'T4', 'T5', 'T6']);
    setTime('07:00');
    setStartDate('01/10/2026');
    setEndDate('31/12/2026');
    const defaultVeh = activeVehicle || vehicles[0];
    setSelectedVehicleId(defaultVeh?.id || 'veh_01');
    setSeats(defaultVeh?.type === 'bike' ? 1 : 3);
    setPricePerTrip(35000);
    setWishlistDiscount(15);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sched) => {
    setEditingSchedule(sched);
    setTitle(sched.title || '');
    setOrigin(sched.origin || '');
    setDestination(sched.destination || '');
    setSelectedDays(sched.days || ['T2', 'T3', 'T4', 'T5', 'T6']);
    setTime(sched.time || '07:00');
    setStartDate(sched.duration?.startDate || '01/10/2026');
    setEndDate(sched.duration?.endDate || '31/12/2026');
    setSelectedVehicleId(sched.vehicleId || vehicles[0]?.id || 'veh_01');
    setSeats(sched.availableSeats || 1);
    setPricePerTrip(sched.pricePerTrip || 35000);
    setWishlistDiscount(sched.wishlistDiscountPercent || 15);
    setIsModalOpen(true);
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0] || {};

    const scheduleData = {
      title,
      origin,
      destination,
      days: selectedDays,
      time,
      duration: {
        startDate,
        endDate,
        durationLabel: `${startDate} → ${endDate}`
      },
      vehicleId: veh.id || selectedVehicleId,
      vehicleModel: veh.model || 'Honda City',
      vehicleType: veh.type || 'car',
      vehiclePlate: veh.plate || '51G-119.02',
      availableSeats: Number(seats),
      totalSeats: veh.seats || 4,
      pricePerTrip: Number(pricePerTrip),
      wishlistDiscountPercent: Number(wishlistDiscount)
    };

    if (editingSchedule) {
      updateDriverSchedule(editingSchedule.id, scheduleData);
    } else {
      addDriverSchedule(scheduleData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteDriverSchedule(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] h-full overflow-hidden">
      {/* Top Header */}
      <div className="bg-white px-4 py-3.5 border-b border-[#E4EAE7] flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={() => navigate('/profile')} 
            className="w-9 h-9 rounded-full bg-[#F4F7F5] border border-[#E4EAE7] flex items-center justify-center text-[#101B17] hover:bg-[#E4EAE7] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#101B17]">Lịch trình định kỳ</h1>
            <p className="text-[11px] text-[#4B5A54]">Tuyến cố định nhận khách quen cả tháng</p>
          </div>
        </div>

        <button 
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tạo lịch</span>
        </button>
      </div>

      {/* Main Content List */}
      <div className="flex-1 p-4 space-y-3.5 overflow-y-auto rs-scroll pb-24">
        {/* Banner Insight */}
        <div className="bg-gradient-to-r from-[#DDF3EA] to-[#F1FAF6] rounded-2xl p-3.5 border border-[#B2E2D0] flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#0F9D76] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
            🔁
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#0B7A5C]">Cấu hình lịch chạy cố định</h4>
            <p className="text-[11px] text-[#4B5A54] mt-0.5 leading-relaxed">
              Hành khách có thể đăng ký đi chung trọn gói theo tháng (22 chuyến). Hệ thống tự động tạo chuyến hàng ngày theo khung giờ đã chọn.
            </p>
          </div>
        </div>

        {/* Schedules Count & Status */}
        <div className="flex items-center justify-between text-xs font-semibold text-[#4B5A54] px-1">
          <span>Danh sách lịch của bạn ({driverSchedules.length})</span>
          <span className="text-[#0F9D76] font-bold">
            {driverSchedules.filter(s => s.active).length} đang kích hoạt
          </span>
        </div>

        {/* Empty State */}
        {driverSchedules.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#E4EAE7] text-center space-y-3 mt-4">
            <div className="w-14 h-14 rounded-full bg-[#DDF3EA] text-[#0F9D76] flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#101B17]">Bạn chưa tạo lịch định kỳ nào</h3>
              <p className="text-xs text-[#4B5A54] mt-1 max-w-xs mx-auto">
                Tạo lịch đi làm hoặc về nhà cố định để hành khách quen đăng ký đi chung trọn gói hàng tháng.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-2 px-5 py-2.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold rounded-xl transition-colors shadow-xs inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo lịch định kỳ đầu tiên</span>
            </button>
          </div>
        ) : (
          /* List of Driver Schedule Cards */
          driverSchedules.map((sched) => (
            <div 
              key={sched.id} 
              className={`bg-white rounded-3xl p-4 border transition-all duration-200 shadow-xs space-y-3.5 ${
                sched.active ? 'border-[#B2E2D0] ring-1 ring-[#0F9D76]/10' : 'border-[#E4EAE7] opacity-80'
              }`}
            >
              {/* Header: Title + Active Toggle Switch */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76] shrink-0" />
                  <h3 className="text-sm font-bold text-[#101B17] truncate">{sched.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    sched.active 
                      ? 'bg-[#DDF3EA] text-[#0B7A5C] border-[#B2E2D0]' 
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {sched.active ? 'Đang kích hoạt' : 'Tạm dừng'}
                  </span>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleDriverSchedule(sched.id)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                    sched.active ? 'bg-[#0F9D76]' : 'bg-[#DFE7E3]'
                  }`}
                  aria-label="Toggle schedule active status"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      sched.active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Route Visualizer */}
              <div className="bg-[#F8FAF9] rounded-2xl p-3 border border-[#E4EAE7] space-y-2">
                <div className="flex items-start space-x-2.5">
                  <div className="flex flex-col items-center mt-0.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0F9D76]" />
                    <span className="w-0.5 h-6 bg-[#DFE7E3] my-0.5" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#EE7A22]" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-[#0F9D76] uppercase tracking-wider block">Điểm xuất phát</span>
                      <p className="font-semibold text-[#101B17] truncate">{sched.origin}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#EE7A22] uppercase tracking-wider block">Điểm đến</span>
                      <p className="font-semibold text-[#101B17] truncate">{sched.destination}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commute Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Time & Days */}
                <div className="bg-[#F4F7F5] p-2.5 rounded-2xl border border-[#EEF2F0] space-y-1">
                  <div className="flex items-center space-x-1 text-[#4B5A54]">
                    <Clock className="w-3.5 h-3.5 text-[#0F9D76]" />
                    <span className="text-[11px]">Giờ xuất phát:</span>
                    <span className="font-bold text-[#101B17] font-mono">{sched.time}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {daysOfWeek.map((day) => {
                      const isSelected = sched.days?.includes(day);
                      return (
                        <span 
                          key={day}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                            isSelected 
                              ? 'bg-[#0F9D76] text-white' 
                              : 'bg-white text-[#8A9993] border border-[#E4EAE7]'
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Duration & Vehicle */}
                <div className="bg-[#F4F7F5] p-2.5 rounded-2xl border border-[#EEF2F0] space-y-1">
                  <div className="flex items-center space-x-1 text-[#4B5A54] truncate">
                    <Car className="w-3.5 h-3.5 text-[#0B7A5C]" />
                    <span className="text-[11px] font-semibold text-[#101B17] truncate">
                      {sched.vehicleModel || 'Xe máy'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#4B5A54] font-mono truncate">
                    {sched.vehiclePlate || '59-X3 892.12'} · {sched.availableSeats || 1} chỗ nhận
                  </p>
                  <p className="text-[10px] text-[#0F9D76] font-bold mt-1 truncate">
                    🗓️ {sched.duration?.durationLabel || '01/10 → 31/12/2026'}
                  </p>
                </div>
              </div>

              {/* Price & Wishlist Discount */}
              <div className="flex items-center justify-between pt-1 px-1 border-t border-[#EEF2F0] text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[#4B5A54]">Đơn giá:</span>
                  <span className="font-bold text-[#0F9D76] font-mono">
                    {new Intl.NumberFormat('vi-VN').format(sched.pricePerTrip || 35000)} ₫/chuyến
                  </span>
                </div>
                {sched.wishlistDiscountPercent > 0 && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Ưu đãi khách quen: -{sched.wishlistDiscountPercent}%
                  </span>
                )}
              </div>

              {/* Subscribers / Regular Commuters */}
              {sched.subscribers && sched.subscribers.length > 0 ? (
                <div className="bg-[#F1FAF6] rounded-2xl p-2.5 border border-[#B2E2D0]/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#0B7A5C] flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 mr-1" />
                      <span>Khách quen đã đăng ký ({sched.subscribers.length})</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#0F9D76]">Trọn gói tháng 10</span>
                  </div>

                  {sched.subscribers.map((sub, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-[#DDF3EA] text-xs">
                      <div className="flex items-center space-x-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold flex items-center justify-center text-[10px] shrink-0">
                          {sub.avatar || 'MA'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#101B17] truncate">{sub.name}</p>
                          <p className="text-[10px] text-[#4B5A54] truncate">{sub.pickup} → {sub.dropoff}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#0B7A5C] bg-[#DDF3EA] px-2 py-0.5 rounded-md shrink-0">
                        22 chuyến
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] text-[#8A9993] italic px-1">
                  Chưa có hành khách đăng ký trọn gói cho lịch này.
                </div>
              )}

              {/* Action Buttons: Edit / Delete */}
              <div className="flex items-center justify-end space-x-2 pt-1 border-t border-[#EEF2F0]">
                {deleteConfirmId === sched.id ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-[#C22B35] font-bold">Xác nhận xóa?</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(sched.id)}
                      className="px-3 py-1 bg-[#C22B35] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Xóa luôn
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[#4B5A54] rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(sched)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-[#F4F7F5] hover:bg-[#E4EAE7] text-[#101B17] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#4B5A54]" />
                      <span>Chỉnh sửa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(sched.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#C22B35] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Bottom CTA */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-t border-[#E4EAE7] shrink-0">
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="w-full py-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold rounded-2xl text-xs transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tạo lịch trình định kỳ mới</span>
        </button>
      </div>

      {/* Center Modal: Add / Edit Driver Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[90vh] flex flex-col shadow-2xl border border-[#E4EAE7] overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#EEF2F0] flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-[#101B17]">
                  {editingSchedule ? 'Chỉnh sửa lịch định kỳ' : 'Tạo lịch định kỳ mới'}
                </h3>
                <p className="text-[11px] text-[#4B5A54]">Cố định tuyến và khung giờ chạy hàng ngày</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4F7F5] flex items-center justify-center text-[#4B5A54] hover:bg-[#E4EAE7] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Scrollable */}
            <form onSubmit={handleSave} className="flex-1 p-5 space-y-4 overflow-y-auto rs-scroll text-xs">
              {/* Title input */}
              <div>
                <label className="block text-[11px] font-bold text-[#101B17] mb-1">
                  Tên lịch trình <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  {['Sáng đi làm', 'Chiều về nhà', 'Chạy cuối tuần'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTitle(preset)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer ${
                        title === preset 
                          ? 'bg-[#0F9D76] text-white' 
                          : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#E4EAE7]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Sáng đi làm Gò Vấp - Q9"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4EAE7] bg-[#F8FAF9] text-[#101B17] focus:outline-hidden focus:border-[#0F9D76] focus:bg-white"
                />
              </div>

              {/* Origin & Destination */}
              <div className="space-y-2 bg-[#F8FAF9] p-3 rounded-2xl border border-[#E4EAE7]">
                <div>
                  <label className="block text-[10px] font-bold text-[#0F9D76] uppercase tracking-wider mb-1">
                    🟢 Điểm xuất phát
                  </label>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Nhập địa chỉ bắt đầu (VD: Phan Văn Trị, Gò Vấp)"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4EAE7] bg-white text-[#101B17] focus:outline-hidden focus:border-[#0F9D76]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#EE7A22] uppercase tracking-wider mb-1">
                    🟧 Điểm đến
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Nhập địa chỉ đến (VD: Khu Công Nghệ Cao, Q.9)"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4EAE7] bg-white text-[#101B17] focus:outline-hidden focus:border-[#0F9D76]"
                  />
                </div>
              </div>

              {/* Days of Week Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#101B17] mb-1.5">
                  Các ngày chạy trong tuần <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {daysOfWeek.map((day) => {
                    const active = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          active
                            ? 'bg-[#0F9D76] text-white shadow-xs'
                            : 'bg-[#F4F7F5] text-[#8A9993] hover:bg-[#E4EAE7]'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Departure Time & Duration Range */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#101B17] mb-1">
                    Giờ xuất phát
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4EAE7] bg-white font-mono font-bold text-[#101B17] focus:outline-hidden focus:border-[#0F9D76]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#101B17] mb-1">
                    Từ ngày → Đến ngày
                  </label>
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="01/10/2026"
                      className="w-1/2 px-2 py-2 rounded-xl border border-[#E4EAE7] bg-white font-mono text-[10px] text-center focus:outline-hidden focus:border-[#0F9D76]"
                    />
                    <span className="text-[#8A9993]">→</span>
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="31/12/2026"
                      className="w-1/2 px-2 py-2 rounded-xl border border-[#E4EAE7] bg-white font-mono text-[10px] text-center focus:outline-hidden focus:border-[#0F9D76]"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle & Seats Selection */}
              <div className="space-y-2 bg-[#F8FAF9] p-3 rounded-2xl border border-[#E4EAE7]">
                <div>
                  <label className="block text-[11px] font-bold text-[#101B17] mb-1">
                    Chọn phương tiện chạy tuyến này
                  </label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => {
                      setSelectedVehicleId(e.target.value);
                      const chosen = vehicles.find(v => v.id === e.target.value);
                      if (chosen?.type === 'bike') setSeats(1);
                      else setSeats(3);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4EAE7] bg-white text-[#101B17] font-semibold focus:outline-hidden focus:border-[#0F9D76]"
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.model} ({v.plate}) · {v.type === 'car' ? 'Ô tô' : 'Xe máy'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EEF2F0]">
                  <span className="font-semibold text-[#101B17]">Số chỗ nhận tối đa:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={seats <= 1}
                      onClick={() => setSeats(Math.max(1, seats - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-[#E4EAE7] flex items-center justify-center font-bold text-sm text-[#101B17] disabled:opacity-40 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-sm text-[#101B17] w-6 text-center">{seats}</span>
                    <button
                      type="button"
                      onClick={() => setSeats(seats + 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-[#E4EAE7] flex items-center justify-center font-bold text-sm text-[#101B17] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Fare & Wishlist Discount */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#101B17] mb-1">
                    Đơn giá (₫/chuyến)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={pricePerTrip}
                    onChange={(e) => setPricePerTrip(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4EAE7] bg-white font-mono font-bold text-[#0F9D76] focus:outline-hidden focus:border-[#0F9D76]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#101B17] mb-1">
                    Ưu đãi khách quen (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={wishlistDiscount}
                    onChange={(e) => setWishlistDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E4EAE7] bg-white font-mono font-bold text-amber-600 focus:outline-hidden focus:border-[#0F9D76]"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-[#F4F7F5] hover:bg-[#E4EAE7] text-[#4B5A54] font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
                >
                  {editingSchedule ? 'Lưu thay đổi' : 'Tạo lịch ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
