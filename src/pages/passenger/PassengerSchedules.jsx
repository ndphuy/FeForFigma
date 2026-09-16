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
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X,
  Phone,
  MessageCircle,
  UserCheck,
  ChevronRight
} from 'lucide-react';

export const PassengerSchedules = () => {
  const navigate = useNavigate();
  const { 
    passengerSchedules, 
    addPassengerSchedule, 
    updatePassengerSchedule, 
    deletePassengerSchedule, 
    togglePassengerSchedule,
    setSearchParams
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState('Đi làm');
  const [icon, setIcon] = useState('🏢');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedDays, setSelectedDays] = useState(['T2', 'T3', 'T4', 'T5', 'T6']);
  const [time, setTime] = useState('07:00');
  const [startDate, setStartDate] = useState('01/10/2026');
  const [endDate, setEndDate] = useState('31/10/2026');
  const [preferredVehicle, setPreferredVehicle] = useState('all');

  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const purposePresets = [
    { label: 'Đi làm', icon: '🏢', defaultTitle: 'Sáng đi làm' },
    { label: 'Đi học', icon: '🎓', defaultTitle: 'Sáng đi học' },
    { label: 'Về nhà', icon: '🏠', defaultTitle: 'Chiều về nhà' },
    { label: 'Khác', icon: '☕', defaultTitle: 'Đi lại cá nhân' },
  ];

  const handleOpenAddModal = () => {
    setEditingSchedule(null);
    setPurpose('Đi làm');
    setIcon('🏢');
    setTitle('Sáng đi làm');
    setOrigin('Phan Văn Trị, Gò Vấp');
    setDestination('Đại học FPT, Khu CNC Q.9');
    setSelectedDays(['T2', 'T3', 'T4', 'T5', 'T6']);
    setTime('07:00');
    setStartDate('01/10/2026');
    setEndDate('31/10/2026');
    setPreferredVehicle('all');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sched) => {
    setEditingSchedule(sched);
    setPurpose(sched.purpose || 'Đi làm');
    setIcon(sched.icon || '🏢');
    setTitle(sched.title || '');
    setOrigin(sched.origin || '');
    setDestination(sched.destination || '');
    setSelectedDays(sched.days || ['T2', 'T3', 'T4', 'T5', 'T6']);
    setTime(sched.time || '07:00');
    setStartDate(sched.duration?.startDate || '01/10/2026');
    setEndDate(sched.duration?.endDate || '31/10/2026');
    setPreferredVehicle(sched.preferredVehicle || 'all');
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

  const handlePurposeSelect = (p) => {
    setPurpose(p.label);
    setIcon(p.icon);
    if (!editingSchedule || !title) {
      setTitle(p.defaultTitle);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    const scheduleData = {
      title,
      purpose,
      icon,
      origin,
      destination,
      days: selectedDays,
      time,
      duration: {
        startDate,
        endDate,
        durationLabel: `${startDate} → ${endDate}`
      },
      preferredVehicle
    };

    if (editingSchedule) {
      updatePassengerSchedule(editingSchedule.id, scheduleData);
    } else {
      addPassengerSchedule(scheduleData);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    deletePassengerSchedule(id);
    setDeleteConfirmId(null);
  };

  // 1-Click Search matching recurring drivers from this schedule
  const handleFindDriver = (sched) => {
    setSearchParams(prev => ({
      ...prev,
      origin: sched.origin,
      destination: sched.destination,
      departureTime: sched.time,
      seats: 1
    }));
    navigate(`/passenger/results?mode=recurring&scheduleId=${sched.id}&origin=${encodeURIComponent(sched.origin)}&destination=${encodeURIComponent(sched.destination)}&time=${encodeURIComponent(sched.time)}`);
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
            <h1 className="text-sm font-bold text-[#101B17]">Lịch trình quen thuộc</h1>
            <p className="text-[11px] text-[#4B5A54]">Nhu cầu đi lại định kỳ của bạn</p>
          </div>
        </div>

        <button 
          type="button"
          onClick={handleOpenAddModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm lịch</span>
        </button>
      </div>

      {/* Main Content List */}
      <div className="flex-1 p-4 space-y-3.5 overflow-y-auto rs-scroll pb-24">
        {/* Banner Insight */}
        <div className="bg-gradient-to-r from-[#DDF3EA] to-[#F1FAF6] rounded-2xl p-3.5 border border-[#B2E2D0] flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#0F9D76] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
            🎓
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#0B7A5C]">Đi chung định kỳ cả tháng (22 chuyến)</h4>
            <p className="text-[11px] text-[#4B5A54] mt-0.5 leading-relaxed">
              Lưu khung giờ đi học/đi làm quen thuộc để 1 chạm tra cứu tài xế đi cùng tuyến. Tiết kiệm tới 65% chi phí so với gọi xe riêng!
            </p>
          </div>
        </div>

        {/* Schedules Count & Status */}
        <div className="flex items-center justify-between text-xs font-semibold text-[#4B5A54] px-1">
          <span>Lịch trình đã lưu ({passengerSchedules.length})</span>
          <span className="text-[#0F9D76] font-bold">
            {passengerSchedules.filter(s => s.active).length} đang kích hoạt
          </span>
        </div>

        {/* Empty State */}
        {passengerSchedules.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#E4EAE7] text-center space-y-3 mt-4">
            <div className="w-14 h-14 rounded-full bg-[#DDF3EA] text-[#0F9D76] flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#101B17]">Chưa có lịch trình quen thuộc nào</h3>
              <p className="text-xs text-[#4B5A54] mt-1 max-w-xs mx-auto">
                Thêm tuyến đường đi học, đi làm hàng ngày để tìm tài xế ghép chuyến trọn gói cả tháng.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="mt-2 px-5 py-2.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold rounded-xl transition-colors shadow-xs inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm lịch quen thuộc đầu tiên</span>
            </button>
          </div>
        ) : (
          /* List of Passenger Schedule Cards */
          passengerSchedules.map((sched) => (
            <div 
              key={sched.id} 
              className={`bg-white rounded-3xl p-4 border transition-all duration-200 shadow-xs space-y-3.5 ${
                sched.active ? 'border-[#B2E2D0] ring-1 ring-[#0F9D76]/10' : 'border-[#E4EAE7] opacity-80'
              }`}
            >
              {/* Header: Icon + Title + Active Toggle Switch */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="text-base">{sched.icon || '🏢'}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#101B17] truncate">{sched.title}</h3>
                    <span className="text-[10px] text-[#0B7A5C] font-semibold">{sched.purpose || 'Đi làm'}</span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => togglePassengerSchedule(sched.id)}
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
                      <span className="text-[10px] font-bold text-[#0F9D76] uppercase tracking-wider block">Điểm đón</span>
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
                    <span className="text-[11px]">Giờ đón:</span>
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

                {/* Duration & Vehicle Preference */}
                <div className="bg-[#F4F7F5] p-2.5 rounded-2xl border border-[#EEF2F0] space-y-1">
                  <div className="flex items-center space-x-1 text-[#4B5A54] truncate">
                    <Car className="w-3.5 h-3.5 text-[#0B7A5C]" />
                    <span className="text-[11px] font-semibold text-[#101B17] truncate">
                      {sched.preferredVehicle === 'bike' ? 'Ưu tiên Xe máy' : sched.preferredVehicle === 'car' ? 'Ưu tiên Ô tô' : 'Tất cả phương tiện'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#0F9D76] font-bold mt-1 truncate">
                    🗓️ {sched.duration?.durationLabel || '01/10 → 31/10/2026'}
                  </p>
                </div>
              </div>

              {/* Matched Driver Card OR Search Driver CTA */}
              {sched.matchedDriver ? (
                <div className="bg-[#F1FAF6] rounded-2xl p-3 border border-[#B2E2D0] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0B7A5C] flex items-center space-x-1">
                      <UserCheck className="w-3.5 h-3.5 mr-1" />
                      <span>Tài xế đi cùng cố định</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#0F9D76] bg-[#DDF3EA] px-2 py-0.5 rounded-md">
                      22 chuyến / tháng
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#DDF3EA]">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold flex items-center justify-center text-xs shrink-0">
                        {sched.matchedDriver.avatar || 'QH'}
                      </div>
                      <div className="min-w-0 text-xs">
                        <p className="font-bold text-[#101B17] truncate">{sched.matchedDriver.name}</p>
                        <p className="text-[11px] text-[#4B5A54] truncate">{sched.matchedDriver.vehicle}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate('/shared/chat/drv_01')}
                      className="px-2.5 py-1.5 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 shrink-0 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Nhắn tin</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FFF9F3] rounded-2xl p-3 border border-[#FFE4CC] flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-bold text-[#101B17]">Chưa ghép đôi tài xế</p>
                    <p className="text-[10px] text-[#8A9993]">Tìm tài xế trùng tuyến đi làm T2-T6</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFindDriver(sched)}
                    className="px-3 py-1.5 bg-[#EE7A22] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 shadow-xs cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Tìm tài xế</span>
                  </button>
                </div>
              )}

              {/* Action Buttons: Find Driver / Edit / Delete */}
              <div className="flex items-center justify-between pt-1 border-t border-[#EEF2F0]">
                <button
                  type="button"
                  onClick={() => handleFindDriver(sched)}
                  className="text-xs font-bold text-[#0F9D76] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Tra cứu chuyến đi cùng tuyến</span>
                </button>

                <div className="flex items-center space-x-1.5">
                  {deleteConfirmId === sched.id ? (
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] text-[#C22B35] font-bold">Xác nhận?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(sched.id)}
                        className="px-2.5 py-1 bg-[#C22B35] hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Xóa
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-1 bg-gray-100 text-[#4B5A54] rounded-lg text-xs cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(sched)}
                        className="p-1.5 text-[#4B5A54] hover:bg-[#E4EAE7] rounded-lg transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(sched.id)}
                        className="p-1.5 text-[#C22B35] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
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
          <span>+ Thêm lịch trình quen thuộc</span>
        </button>
      </div>

      {/* Center Modal: Add / Edit Passenger Schedule */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[90vh] flex flex-col shadow-2xl border border-[#E4EAE7] overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-[#EEF2F0] flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-[#101B17]">
                  {editingSchedule ? 'Chỉnh sửa lịch quen thuộc' : 'Thêm lịch quen thuộc mới'}
                </h3>
                <p className="text-[11px] text-[#4B5A54]">Nhu cầu đi lại cố định để tìm tài xế</p>
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
              {/* Purpose Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#101B17] mb-1.5">
                  Mục đích đi lại
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {purposePresets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handlePurposeSelect(p)}
                      className={`p-2 rounded-xl text-center transition-all cursor-pointer ${
                        purpose === p.label
                          ? 'bg-[#0F9D76] text-white font-bold shadow-xs'
                          : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#E4EAE7]'
                      }`}
                    >
                      <span className="text-base block mb-0.5">{p.icon}</span>
                      <span className="text-[10px] block truncate">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title input */}
              <div>
                <label className="block text-[11px] font-bold text-[#101B17] mb-1">
                  Tên gợi nhớ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Sáng đi học ĐH FPT"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4EAE7] bg-[#F8FAF9] text-[#101B17] focus:outline-hidden focus:border-[#0F9D76] focus:bg-white"
                />
              </div>

              {/* Pickup & Destination */}
              <div className="space-y-2 bg-[#F8FAF9] p-3 rounded-2xl border border-[#E4EAE7]">
                <div>
                  <label className="block text-[10px] font-bold text-[#0F9D76] uppercase tracking-wider mb-1">
                    🟢 Điểm đón bạn
                  </label>
                  <input
                    type="text"
                    required
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Nhập địa chỉ đón (VD: Phan Văn Trị, Gò Vấp)"
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
                    placeholder="Nhập địa chỉ đến (VD: Đại học FPT, Khu CNC)"
                    className="w-full px-3 py-2 rounded-xl border border-[#E4EAE7] bg-white text-[#101B17] focus:outline-hidden focus:border-[#0F9D76]"
                  />
                </div>
              </div>

              {/* Days of Week Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#101B17] mb-1.5">
                  Các ngày cần đi trong tuần <span className="text-red-500">*</span>
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
                    Giờ đón mong muốn
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
                    Thời gian áp dụng
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
                      placeholder="31/10/2026"
                      className="w-1/2 px-2 py-2 rounded-xl border border-[#E4EAE7] bg-white font-mono text-[10px] text-center focus:outline-hidden focus:border-[#0F9D76]"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Vehicle */}
              <div>
                <label className="block text-[11px] font-bold text-[#101B17] mb-1">
                  Phương tiện mong muốn
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'car', label: 'Ô tô' },
                    { id: 'bike', label: 'Xe máy' },
                  ].map((veh) => (
                    <button
                      key={veh.id}
                      type="button"
                      onClick={() => setPreferredVehicle(veh.id)}
                      className={`py-2 rounded-xl font-semibold text-xs text-center transition-colors cursor-pointer ${
                        preferredVehicle === veh.id
                          ? 'bg-[#0F9D76] text-white font-bold'
                          : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#E4EAE7]'
                      }`}
                    >
                      {veh.label}
                    </button>
                  ))}
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
                  {editingSchedule ? 'Lưu thay đổi' : 'Thêm lịch ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
