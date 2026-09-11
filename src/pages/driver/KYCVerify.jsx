import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Upload, CheckCircle2, ChevronLeft, Car, FileText, Plus, Check, Trash2, ArrowRight, Camera, Image } from 'lucide-react';

export const KYCVerify = () => {
  const navigate = useNavigate();
  const { vehicles, activeVehicle, setActiveVehicle, addVehicle, deleteVehicle } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState('car'); // 'car' | 'bike'
  const [newModel, setNewModel] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newSeats, setNewSeats] = useState(4);
  const [cavetUploaded, setCavetUploaded] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddNewVehicle = (e) => {
    e.preventDefault();
    if (!newModel.trim() || !newPlate.trim()) return;

    addVehicle({
      model: newModel,
      plate: newPlate.toUpperCase(),
      color: newColor || 'Trắng ngọc trai',
      type: newType,
      typeLabel: newType === 'car' ? `Ô tô ${newSeats} chỗ (${newSeats === 4 ? 'Sedan' : newSeats === 5 ? 'SUV' : 'MPV'})` : 'Xe máy 1 chỗ',
      seats: Number(newSeats),
      passengerCapacity: newType === 'bike' ? 1 : Number(newSeats) - 1,
      hasCavet: cavetUploaded,
      image: newType === 'bike' 
        ? "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80"
    });

    setShowAddModal(false);
    setNewModel('');
    setNewPlate('');
    setNewColor('');
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
    <div className="flex-1 flex flex-col justify-between p-4 bg-[#F4F7F5] overflow-y-auto rs-scroll pb-8">
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
          <span className="text-xs font-bold text-[#101B17]">Giấy tờ pháp lý tài xế</span>

          {/* CCCD */}
          <div className="bg-[#F7FAF9] p-3 rounded-2xl border border-[#EEF2F0] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#101B17]">Căn cước công dân (CCCD)</p>
                <p className="text-[10.5px] text-[#0B7A5C] font-semibold">Đã đối soát BCA · Hợp lệ</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-[#0F9D76] shrink-0" />
          </div>

          {/* GPLX */}
          <div className="bg-[#F7FAF9] p-3 rounded-2xl border border-[#EEF2F0] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#101B17]">Giấy phép lái xe (GPLX B2 & A1)</p>
                <p className="text-[10.5px] text-[#0B7A5C] font-semibold">Còn hạn sử dụng đến 2029</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-[#0F9D76] shrink-0" />
          </div>
        </div>

        {/* VEHICLES LIST SECTION (Max 3 vehicles - Fixed layout without text squeeze) */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#101B17]">Danh sách phương tiện ({vehicles.length}/3)</span>
              <span className="text-[11px] text-[#8A9993]">Chọn 1 xe Đang sử dụng để làm căn cứ tạo chuyến</span>
            </div>

            {vehicles.length < 3 && (
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="h-8 px-3 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm xe</span>
              </button>
            )}
          </div>

          {/* Vehicles list */}
          <div className="flex flex-col gap-3">
            {vehicles.map((v) => {
              const isActive = v.active;
              return (
                <div
                  key={v.id}
                  className={`bg-white rounded-3xl p-4 border-[1.5px] transition-all shadow-[0_2px_10px_rgba(16,27,23,0.04)] flex flex-col gap-3 ${
                    isActive ? 'border-[#0F9D76] bg-[#F1FAF6]/40' : 'border-[#E4EAE7]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left: Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-[#DDF3EA] text-[#0B7A5C] font-bold text-xl flex items-center justify-center shrink-0 border border-[#B2E2D0]/60 mt-0.5">
                      {v.type === 'car' ? '🚗' : '🛵'}
                    </div>

                    {/* Middle: Vehicle details cleanly stacked */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <span className="text-sm font-bold text-[#101B17] leading-tight block">
                        {v.model}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono font-bold text-[#0B7A5C] bg-white border border-[#BDE7D5] px-2 py-0.5 rounded-md">
                          {v.plate}
                        </span>
                        <span className="text-xs text-[#8A9993]">
                          · {v.color}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#4B5A54]">
                        {v.typeLabel} · Nhận tối đa {v.passengerCapacity} khách
                      </span>
                    </div>

                    {/* Right: Active status or Activate button + Delete button */}
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      {isActive ? (
                        <span className="px-3 py-1 rounded-full bg-[#0F9D76] text-white text-[11px] font-bold shadow-xs whitespace-nowrap">
                          ✓ Đang sử dụng
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveVehicle(v.id)}
                          className="h-8 px-3 rounded-xl border border-[#E4EAE7] hover:border-[#0F9D76] hover:bg-[#F1FAF6] text-[#4B5A54] hover:text-[#0B7A5C] text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                        >
                          Kích hoạt xe này
                        </button>
                      )}

                      {vehicles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDelete(v.id)}
                          className="p-1 text-[#8A9993] hover:text-[#C22B35] transition-colors cursor-pointer"
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
                      <span>Đã tải lên & duyệt hợp lệ</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Vehicle Modal / Inline Form with Cavet upload */}
        {showAddModal && (
          <div className="bg-white rounded-3xl p-5 border border-[#BDE7D5] shadow-xl flex flex-col gap-3.5 animate-[rs-pop_0.3s_ease-out]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#101B17]">Thêm phương tiện mới (Xe {vehicles.length + 1}/3)</span>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs text-[#8A9993] hover:text-[#101B17] font-bold cursor-pointer"
              >
                Huỷ
              </button>
            </div>

            <form onSubmit={handleAddNewVehicle} className="flex flex-col gap-3">
              {/* Type Switcher */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewType('car');
                    setNewSeats(4);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    newType === 'car' ? 'bg-[#0F9D76] text-white' : 'bg-[#F4F7F5] text-[#4B5A54]'
                  }`}
                >
                  🚗 Ô tô (4-7 chỗ)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewType('bike');
                    setNewSeats(2);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    newType === 'bike' ? 'bg-[#0F9D76] text-white' : 'bg-[#F4F7F5] text-[#4B5A54]'
                  }`}
                >
                  🛵 Xe máy (1 chỗ ghép)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8A9993] block mb-1">Dòng xe (Model)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Mazda 3, Honda SH..."
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl outline-none focus:border-[#0F9D76]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A9993] block mb-1">Biển số xe</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 51K-999.88"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl outline-none focus:border-[#0F9D76] uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-[#8A9993] block mb-1">Màu sơn</label>
                  <input
                    type="text"
                    placeholder="VD: Đen, Trắng..."
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl outline-none focus:border-[#0F9D76]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8A9993] block mb-1">Tổng số chỗ ngồi</label>
                  <select
                    value={newSeats}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-semibold bg-[#F7FAF9] border border-[#E4EAE7] rounded-xl outline-none focus:border-[#0F9D76]"
                  >
                    {newType === 'bike' ? (
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
                  Chụp / Tải ảnh Giấy đăng ký xe (Cà vẹt)
                </label>
                <div 
                  onClick={() => setCavetUploaded(!cavetUploaded)}
                  className={`p-3 rounded-2xl border-2 border-dashed flex items-center justify-between cursor-pointer transition-colors ${
                    cavetUploaded 
                      ? 'border-[#0F9D76] bg-[#F1FAF6]' 
                      : 'border-[#E4EAE7] bg-[#F7FAF9] hover:border-[#0F9D76]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#E4EAE7] text-[#0B7A5C] flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#101B17]">
                        {cavetUploaded ? 'Đã đính kèm ảnh cà vẹt xe' : 'Nhấn để chụp / tải ảnh cà vẹt'}
                      </span>
                      <span className="text-[10px] text-[#8A9993]">
                        {cavetUploaded ? 'cavet_xe_chinhchu.jpg (2.4 MB)' : 'Mặt trước giấy đăng ký có biển số rõ ràng'}
                      </span>
                    </div>
                  </div>

                  {cavetUploaded && (
                    <CheckCircle2 className="w-5 h-5 text-[#0F9D76] shrink-0" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer mt-1"
              >
                Lưu phương tiện vào danh sách
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Done & Save CTA (Enlarged prominent button h-14) */}
      <button
        type="button"
        onClick={handleSaveAndExit}
        className="w-full h-14 bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-[15px] rounded-2xl shadow-[0_8px_20px_rgba(15,157,118,0.28)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer mt-4"
      >
        {savedSuccess ? (
          <>
            <Check className="w-5 h-5" />
            <span>Đã lưu hồ sơ phương tiện!</span>
          </>
        ) : (
          <>
            <span>Xác nhận & Cập nhật phương tiện</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};
