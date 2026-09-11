import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Clock, ChevronLeft, Check, ArrowRight, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';
import { RouteRail } from '../../components/RouteRail';

export const RecurringSchedule = () => {
  const navigate = useNavigate();
  const { schedules, toggleSchedule, currentRole } = useApp();
  
  const [selectedDays, setSelectedDays] = useState(['T2', 'T3', 'T4', 'T5', 'T6']);
  const [origin] = useState('Q.7 · Phú Mỹ Hưng');
  const [destination] = useState('Q.1 · Bến Thành');
  const [morningTime, setMorningTime] = useState('07:15');
  const [eveningTime, setEveningTime] = useState('17:30');
  const [isSaved, setIsSaved] = useState(false);

  const daysOfWeek = [
    { id: 'T2', label: 'T2' },
    { id: 'T3', label: 'T3' },
    { id: 'T4', label: 'T4' },
    { id: 'T5', label: 'T5' },
    { id: 'T6', label: 'T6' },
    { id: 'T7', label: 'T7' },
    { id: 'CN', label: 'CN' },
  ];

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== dayId));
      }
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleSaveSchedule = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#F4F7F5]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(currentRole === 'driver' ? '/driver/home' : '/passenger/home')}
            className="w-10 h-10 rounded-full bg-white border border-[#E4EAE7] flex items-center justify-center text-[#101B17] shadow-xs hover:bg-[#F1FAF6] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold text-[#101B17]">Lịch trình đi lại định kỳ</h1>
          <div className="w-10" />
        </div>

        {/* Days Selector */}
        <div className="bg-white p-4 rounded-3xl border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] mb-3.5">
          <label className="text-xs font-bold text-[#101B17] block mb-2.5">
            Ngày lặp lại trong tuần
          </label>
          <div className="flex items-center justify-between gap-1.5">
            {daysOfWeek.map((day) => {
              const active = selectedDays.includes(day.id);
              return (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#0F9D76] text-white shadow-xs'
                      : 'bg-[#F4F7F5] text-[#4B5A54] hover:bg-[#DDF3EA]'
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule Form */}
        <div className="bg-white p-4 rounded-3xl border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] mb-3.5 space-y-3">
          <h2 className="text-xs font-bold text-[#101B17]">Tuyến đường cố định</h2>
          
          <RouteRail
            origin={origin}
            destination={destination}
          />

          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#E4EAE7]">
            <div>
              <label className="text-[10px] font-bold text-[#8A9993] block mb-1">
                Giờ đi sáng
              </label>
              <div className="flex items-center bg-[#F4F7F5] border border-[#E4EAE7] rounded-xl px-2.5 py-2">
                <Clock className="w-3.5 h-3.5 text-[#8A9993] mr-1.5" />
                <input
                  type="time"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#101B17] outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#8A9993] block mb-1">
                Giờ về chiều
              </label>
              <div className="flex items-center bg-[#F4F7F5] border border-[#E4EAE7] rounded-xl px-2.5 py-2">
                <Clock className="w-3.5 h-3.5 text-[#8A9993] mr-1.5" />
                <input
                  type="time"
                  value={eveningTime}
                  onChange={(e) => setEveningTime(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#101B17] outline-none w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Schedules List */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-bold text-[#101B17] block">
            Lịch trình kích hoạt ({schedules.filter(s => s.active).length})
          </label>

          {schedules.map((sch) => (
            <div
              key={sch.id}
              className={`bg-white p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                sch.active ? 'border-[#E4EAE7] shadow-xs' : 'border-[#E4EAE7] opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#101B17]">{sch.title}</span>
                  <span className="text-[10px] bg-[#DDF3EA] font-mono text-[#0B7A5C] px-1.5 py-0.5 rounded font-semibold">
                    {sch.time}
                  </span>
                </div>
                <p className="text-[11px] text-[#4B5A54] truncate max-w-[200px] mt-0.5">
                  {sch.origin} → {sch.destination}
                </p>
              </div>

              <button
                onClick={() => toggleSchedule(sch.id)}
                className={`p-1 text-xs font-bold rounded-lg transition-colors ${
                  sch.active ? 'text-[#0F9D76]' : 'text-slate-300'
                }`}
              >
                {sch.active ? (
                  <ToggleRight className="w-8 h-8 text-[#0F9D76] fill-[#0F9D76]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-300" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save CTA */}
      <button
        onClick={handleSaveSchedule}
        className="w-full py-3.5 bg-[#0F9D76] hover:bg-[#0B7A5C] active:scale-[0.99] text-white font-bold rounded-2xl text-xs transition-all shadow-xs flex items-center justify-center space-x-2"
      >
        {isSaved ? (
          <>
            <Check className="w-4 h-4" />
            <span>Đã lưu cấu hình lịch trình!</span>
          </>
        ) : (
          <>
            <span>Lưu lịch trình cố định</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
