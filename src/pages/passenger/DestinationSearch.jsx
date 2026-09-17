import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowUpDown, ArrowRight, Search, MapPin, Car, Repeat } from 'lucide-react';

export const DestinationSearch = () => {
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useApp();

  const [tripType, setTripType] = useState('single'); // 'single' | 'recurring'
  const [origin, setOrigin] = useState(searchParams?.origin || 'Đại học FPT Thành phố Hồ Chí Minh');
  const [destination, setDestination] = useState(searchParams?.destination || 'Chợ Bến Thành - Cổng Bắc');
  const [activeField, setActiveField] = useState('destination'); // 'origin' | 'destination'

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleProceedToResults = (e) => {
    if (e) e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    setSearchParams(prev => ({
      ...prev,
      origin: origin.trim(),
      destination: destination.trim(),
    }));
    if (tripType === 'recurring') {
      navigate(`/passenger/results?mode=recurring&origin=${encodeURIComponent(origin.trim())}&destination=${encodeURIComponent(destination.trim())}`);
    } else {
      navigate(`/passenger/results?mode=single&origin=${encodeURIComponent(origin.trim())}&destination=${encodeURIComponent(destination.trim())}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Top Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/passenger/home')}
            className="w-10 h-10 border border-[#EEF2F0] rounded-xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 cursor-pointer"
          >
            ‹
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-[#101B17]">Bạn muốn đi đâu?</h1>
            <span className="text-[11px] text-[#8A9993]">Nhập điểm đón & điểm đến tiện đường</span>
          </div>
        </div>
      </div>

      {/* Inputs Container */}
      <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto rs-scroll">
        <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-xs flex flex-col gap-3.5">
          {/* Trip Type Selector */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#EEF2F0] rounded-2xl">
            <button
              type="button"
              onClick={() => setTripType('single')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tripType === 'single'
                  ? 'bg-white text-[#0B7A5C] shadow-xs'
                  : 'text-[#4B5A54] hover:text-[#101B17]'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-[#0F9D76]" />
              <span>Chuyến lẻ</span>
            </button>

            <button
              type="button"
              onClick={() => setTripType('recurring')}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tripType === 'recurring'
                  ? 'bg-[#0F9D76] text-white shadow-xs'
                  : 'text-[#4B5A54] hover:text-[#101B17]'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Đi định kỳ (T2–T6)</span>
            </button>
          </div>

          <div className="relative flex flex-col gap-2.5">
            {/* Origin Input */}
            <div
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                activeField === 'origin'
                  ? 'border-[#0F9D76] ring-2 ring-[#0F9D76]/15 bg-[#F1FAF6]/50'
                  : 'border-[#E4EAE7] bg-[#F7FAF9]'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full bg-[#0F9D76] shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">Điểm đón</span>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  onFocus={() => setActiveField('origin')}
                  placeholder="Nhập điểm đón của bạn..."
                  className="w-full text-xs font-semibold text-[#101B17] bg-transparent outline-none truncate placeholder:text-[#8A9993]"
                />
              </div>
            </div>

            {/* Destination Input */}
            <div
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                activeField === 'destination'
                  ? 'border-[#EE7A22] ring-2 ring-[#EE7A22]/15 bg-[#FFF8F2]'
                  : 'border-[#E4EAE7] bg-[#F7FAF9]'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-sm bg-[#EE7A22] shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A9993]">Điểm đến</span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => setActiveField('destination')}
                  placeholder="Nhập điểm đến của bạn..."
                  className="w-full text-xs font-semibold text-[#101B17] bg-transparent outline-none truncate placeholder:text-[#8A9993]"
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-[#E4EAE7] shadow-md flex items-center justify-center text-[#4B5A54] hover:text-[#0F9D76] hover:bg-[#F1FAF6] transition-all cursor-pointer z-10"
              title="Đổi chiều điểm đón và điểm đến"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="pt-4 pb-6">
          <button
            type="button"
            onClick={handleProceedToResults}
            disabled={!origin.trim() || !destination.trim()}
            className="w-full h-12 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(15,157,118,0.3)] transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{tripType === 'recurring' ? 'Tìm lịch trình định kỳ phù hợp' : 'Tìm chuyến đi phù hợp'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
