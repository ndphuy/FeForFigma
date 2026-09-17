import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CheckCircle2, Car, FileText, Plus, Check, Trash2, ArrowRight, Camera, Pencil, X, Clock } from 'lucide-react';

export const KYCVerify = () => {
  const navigate = useNavigate();
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, isDriverVerified, setIsDriverVerified } = useApp();
  const [justVerified, setJustVerified] = useState(false);

  const handleVerifyNow = () => {
    setIsDriverVerified(true);
    setJustVerified(true);
    setTimeout(() => navigate('/driver/create-trip'), 900);
  };

  // Modal State for Add & Edit Vehicle
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  const [formType, setFormType] = useState('car'); // 'car' | 'bike'
  const [formModel, setFormModel] = useState('');
  const [formPlate, setFormPlate] = useState('');
  const [formColor, setFormColor] = useState('');
  const [formSeats, setFormSeats] = useState(4);
  const [cavetUploaded, setCavetUploaded] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleOpenAddModal = () => {
    setEditingVehicleId(null);
    setFormType('car');
    setFormModel('');
    setFormPlate('');
    setFormColor('');
    setFormSeats(4);
    setCavetUploaded(true);
    setShowVehicleModal(true);
  };

  const handleOpenEditModal = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setFormType(vehicle.type || 'car');
    setFormModel(vehicle.model || '');
    setFormPlate(vehicle.plate || '');
    setFormColor(vehicle.color || '');
    setFormSeats(vehicle.seats || (vehicle.type === 'bike' ? 2 : 4));
    setCavetUploaded(Boolean(vehicle.hasCavet));
    setShowVehicleModal(true);
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (!formModel.trim() || !formPlate.trim()) return;

    const payload = {
      model: formModel.trim(),
      plate: formPlate.trim().toUpperCase(),
      color: formColor.trim() || 'Trắng ngọc trai',
      type: formType,
      typeLabel: formType === 'car' 
        ? `Ô tô ${formSeats} chỗ (${formSeats === 4 ? 'Sedan' : formSeats === 5 ? 'SUV' : 'MPV'})` 
        : 'Xe máy 2 chỗ (1 khách ghép)',
      seats: Number(formSeats),
      passengerCapacity: formType === 'bike' ? 1 : Number(formSeats) - 1,
      hasCavet: cavetUploaded,
      image: formType === 'bike' 
        ? "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80"
    };

    if (editingVehicleId) {
      updateVehicle(editingVehicleId, payload);
    } else {
      addVehicle(payload);
    }

    setShowVehicleModal(false);
    setEditingVehicleId(null);
  };

  const handleDelete = (vehicleId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phương tiện này khỏi danh sách?')) {
      deleteVehicle(vehicleId);
    }
  };

  const handleSaveAndExit = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      navigate('/profile');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-[#F4F7F5] overflow-y-auto rs-scroll pb-8 relative">
      <div className="flex flex-col gap-3.5">
        {/* Top Header */}
        <div className="bg-white p-3.5 px-4 rounded-2xl flex items-center justify-between border border-[#EEF2F0] shadow-xs">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-xl bg-white border border-[#EEF2F0] hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 cursor-pointer"
          >
            ‹
          </button>
          <span className="text-xs font-bold text-[#101B17] uppercase tracking-wider">
            Hồ sơ phương tiện ({vehicles.length}/3 xe)
          </span>
          <div className="w-10" />
        </div>

        {/* Legal documents verification status */}
        <div className="bg-white p-4 rounded-3xl border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.04)] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#101B17]">Giấy tờ pháp lý chủ xe</span>
            {!isDriverVerified && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF4E9] text-[#D96A16] border border-[#F7D9B8]">
                Chưa xác thực
              </span>
            )}
          </div>

          {/* CCCD */}
          <div className="bg-[#F7FAF9] p-3 rounded-2xl border border-[#EEF2F0] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#101B17]">Căn cước công dân (CCCD)</p>
                <p className={`text-[10.5px] font-semibold ${isDriverVerified ? 'text-[#0B7A5C]' : 'text-[#B45812]'}`}>
                  {isDriverVerified ? 'Đã đối soát BCA · Hợp lệ' : 'Chưa gửi để đối soát'}
                </p>
              </div>
            </div>
            {isDriverVerified
              ? <CheckCircle2 className="w-5 h-5 text-[#0F9D76] shrink-0" />
              : <Clock className="w-5 h-5 text-[#D96A16] shrink-0" />}
          </div>

          {/* GPLX */}
          <div className="bg-[#F7FAF9] p-3 rounded-2xl border border-[#EEF2F0] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#101B17]">Giấy phép lái xe (GPLX B2 & A1)</p>
                <p className={`text-[10.5px] font-semibold ${isDriverVerified ? 'text-[#0B7A5C]' : 'text-[#B45812]'}`}>
                  {isDriverVerified ? 'Còn hạn sử dụng đến 2029' : 'Chưa gửi để đối soát'}
                </p>
              </div>
            </div>
            {isDriverVerified
              ? <CheckCircle2 className="w-5 h-5 text-[#0F9D76] shrink-0" />
              : <Clock className="w-5 h-5 text-[#D96A16] shrink-0" />}
          </div>

          {!isDriverVerified && (
            <button
              type="button"
              onClick={handleVerifyNow}
              disabled={justVerified}
              className="h-11 mt-1 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] disabled:opacity-70 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              {justVerified ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã xác thực! Đang chuyển tới tạo chuyến...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Xác thực CCCD & GPLX ngay</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* VEHICLES LIST SECTION */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#101B17]">Danh sách phương tiện ({vehicles.length}/3)</span>
              <span className="text-[11px] text-[#8A9993]">Quản lý xe ô tô và xe máy để tạo chuyến đi ké</span>
            </div>

            {vehicles.length < 3 && (
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="h-8 px-3 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm xe</span>
              </button>
            )}
          </div>

          {/* Vehicles list cards */}
          <div className="flex flex-col gap-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_10px_rgba(16,27,23,0.04)] flex flex-col gap-3 transition-all hover:border-[#B2E2D0]"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xl flex items-center justify-center shrink-0 border border-[#B2E2D0]/60 mt-0.5">
                    {v.type === 'car' ? '🚗' : '🛵'}
                  </div>

                  {/* Middle: Vehicle details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <span className="text-sm font-bold text-[#101B17] leading-tight block truncate">
                      {v.model}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[#0B7A5C] bg-[#F1FAF6] border border-[#BDE7D5] px-2 py-0.5 rounded-md">
                        {v.plate}
                      </span>
                      <span className="text-xs text-[#8A9993]">
                        · {v.color}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#4B5A54]">
                      {v.typeLabel || (v.type === 'car' ? `Ô tô ${v.seats || 4} chỗ` : 'Xe máy 2 chỗ')} · Nhận tối đa {v.passengerCapacity || (v.type === 'car' ? 3 : 1)} khách
                    </span>
                  </div>

                  {/* Right: Clean Action Buttons (Edit & Delete) */}
                  <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(v)}
                      className="w-8 h-8 rounded-xl bg-[#F4F7F5] hover:bg-[#DDF3EA] text-[#4B5A54] hover:text-[#0B7A5C] flex items-center justify-center transition-colors cursor-pointer"
                      title="Chỉnh sửa thông tin xe"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {vehicles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDelete(v.id)}
                        className="w-8 h-8 rounded-xl bg-[#F4F7F5] hover:bg-[#FFF0F0] text-[#8A9993] hover:text-[#C22B35] flex items-center justify-center transition-colors cursor-pointer"
                        title="Xóa phương tiện này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Cavet Status Bar */}
                <div className="pt-2 border-t border-[#EEF2F0] flex items-center justify-between text-[11px]">
                  <span className="text-[#8A9993] flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#0B7A5C]" />
                    <span>Cà vẹt xe:</span>
                  </span>
                  <span className="text-[#0B7A5C] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9D76]" />
                    <span>Đã tải lên & hợp lệ</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Done & Save CTA Button */}
      <button
        type="button"
        onClick={handleSaveAndExit}
        className="w-full h-14 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-[15px] rounded-2xl shadow-[0_8px_20px_rgba(15,157,118,0.28)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer mt-4"
      >
        {savedSuccess ? (
          <>
            <Check className="w-5 h-5" />
            <span>Đã cập nhật hồ sơ phương tiện!</span>
          </>
        ) : (
          <>
            <span>Xác nhận & Quay lại Tài khoản</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* CENTER MODAL FOR ADD & EDIT VEHICLE */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[360px] bg-white rounded-3xl p-5 border border-[#E4EAE7] shadow-2xl flex flex-col gap-3.5 relative overflow-hidden animate-[rs-pop_0.25s_ease-out]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF2F0]">
              <span className="text-sm font-bold text-[#101B17]">
                {editingVehicleId ? 'Cập nhật phương tiện' : `Thêm xe mới (${vehicles.length + 1}/3)`}
              </span>
              <button
                type="button"
                onClick={() => setShowVehicleModal(false)}
                className="w-7 h-7 rounded-full bg-[#F4F7F5] hover:bg-[#E4EAE7] text-[#4B5A54] flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="flex flex-col gap-3">
              {/* Type Switcher */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormType('car');
                    setFormSeats(4);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    formType === 'car' ? 'bg-[#0F9D76] text-white shadow-xs' : 'bg-[#F4F7F5] text-[#4B5A54]'
                  }`}
                >
                  🚗 Ô tô (4-7 chỗ)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType('bike');
                    setFormSeats(2);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    formType === 'bike' ? 'bg-[#0F9D76] text-white shadow-xs' : 'bg-[#F4F7F5] text-[#4B5A54]'
                  }`}
                >
                  🛵 Xe máy (1 khách)
                </button>
              </div>

              {/* Model & Plate */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8A9993] block mb-1">Dòng xe (Model)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Mazda 3, SH..."
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl outline-none focus:border-[#0F9D76]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A9993] block mb-1">Biển số xe</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 51K-999.88"
                    value={formPlate}
                    onChange={(e) => setFormPlate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl outline-none focus:border-[#0F9D76] uppercase"
                  />
                </div>
              </div>

              {/* Color & Seats */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8A9993] block mb-1">Màu sơn</label>
                  <input
                    type="text"
                    placeholder="VD: Đen, Trắng..."
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl outline-none focus:border-[#0F9D76]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A9993] block mb-1">Tổng số chỗ ngồi</label>
                  <select
                    value={formSeats}
                    onChange={(e) => setFormSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-semibold bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl outline-none focus:border-[#0F9D76]"
                  >
                    {formType === 'bike' ? (
                      <option value={2}>2 chỗ (1 tài xế + 1 khách)</option>
                    ) : (
                      <>
                        <option value={4}>4 chỗ (Sedan)</option>
                        <option value={5}>5 chỗ (SUV/Crossover)</option>
                        <option value={7}>7 chỗ (MPV)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Cavet Photo Upload Field */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993] block">
                  Giấy đăng ký xe (Cà vẹt)
                </label>
                <div 
                  onClick={() => setCavetUploaded(!cavetUploaded)}
                  className={`p-2.5 rounded-2xl border-2 border-dashed flex items-center justify-between cursor-pointer transition-colors ${
                    cavetUploaded 
                      ? 'border-[#0F9D76] bg-[#F1FAF6]' 
                      : 'border-[#E4EAE7] bg-[#F7FAF9] hover:border-[#0F9D76]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#E4EAE7] text-[#0B7A5C] flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#101B17]">
                        {cavetUploaded ? 'Đã đính kèm ảnh cà vẹt' : 'Chụp / tải ảnh cà vẹt'}
                      </span>
                      <span className="text-[10px] text-[#8A9993]">
                        {cavetUploaded ? 'cavet_xe_chinhchu.jpg' : 'Mặt trước giấy đăng ký'}
                      </span>
                    </div>
                  </div>

                  {cavetUploaded && (
                    <CheckCircle2 className="w-5 h-5 text-[#0F9D76] shrink-0" />
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="flex-1 h-11 rounded-xl bg-[#F4F7F5] hover:bg-[#E4EAE7] text-[#4B5A54] font-bold text-xs transition-colors cursor-pointer"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {editingVehicleId ? 'Lưu thay đổi' : 'Lưu phương tiện'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
