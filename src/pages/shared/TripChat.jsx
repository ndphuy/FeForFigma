import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Phone, MapPin, Send } from 'lucide-react';

export const TripChat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentRole, messages: contextMessages, sendMessage } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, from: 'them', text: 'Chào bạn, mình sẽ tới Cổng 2 lúc 07:25 nhé.', time: '07:02' },
    { id: 2, from: 'me', text: 'Dạ vâng, em đợi ở Cổng 2 ạ.', time: '07:03' },
    { id: 3, from: 'them', text: 'Bạn mặc áo màu gì để mình nhận ra?', time: '07:04' },
    { id: 4, from: 'me', text: 'Em mặc áo sơ mi xanh ạ.', time: '07:05' },
    { id: 5, from: 'them', text: 'Mình sẽ tới sau 5 phút nữa.', time: '07:19' }
  ]);

  const quickReplies = [
    'Em đã ở điểm đón.',
    'Em tới sau 5 phút nữa.',
    'Em nên đợi ở đâu ạ?',
    'Em mặc áo sơ mi xanh.'
  ];

  const now = () => {
    const d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  };

  const handleSendText = (textToSend) => {
    const txt = textToSend || inputVal;
    if (!txt.trim()) return;

    const newMsg = {
      id: Date.now(),
      from: 'me',
      text: txt,
      time: now()
    };

    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInputVal('');

    // Optional simulated reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'them',
          text: 'Oke bạn, mình đã nhận tin!',
          time: now()
        }
      ]);
    }, 1500);
  };

  const handleSendLocation = () => {
    const newMsg = {
      id: Date.now(),
      from: 'me',
      text: 'Vị trí của em',
      sub: 'Cổng 2, FPT University HCMC',
      location: true,
      time: now()
    };
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Header */}
      <div className="flex-none bg-white px-4 py-3 border-b border-[#EEF2F0] flex items-center gap-3 shadow-[0_2px_12px_rgba(16,27,23,0.05)]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-2xl bg-white hover:bg-[#F7FAF9] border border-[#EEF2F0] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors"
        >
          ‹
        </button>

        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center text-[15px] font-bold">
            {currentRole === 'passenger' ? 'NM' : 'LA'}
          </div>
          <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-[#0F9D76] border-2 border-white" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[15.5px] font-bold text-[#101B17] truncate">
              {currentRole === 'passenger' ? 'Nguyễn Minh' : 'Lan'}
            </span>
            <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
          </div>
          <span className="text-[11.5px] text-[#0B7A5C] truncate">
            Đang hoạt động · FPT University → Bến Thành
          </span>
        </div>

        <a
          href="tel:0901234567"
          className="w-11 h-11 rounded-2xl border-[1.5px] border-[#E4EAE7] hover:border-[#BDE7D5] hover:bg-[#F7FAF9] bg-white flex items-center justify-center text-[#0B7A5C] shrink-0 transition-colors"
        >
          <Phone className="w-4.5 h-4.5" />
        </a>
      </div>

      {/* Trip context strip */}
      <div className="flex-none mx-4 mt-3 bg-white rounded-2xl p-2.5 px-3.5 flex items-center gap-2.5 shadow-[0_1px_4px_rgba(16,27,23,0.04)]">
        <span className="w-2 h-2 rounded-full bg-[#0F9D76] shrink-0" />
        <span className="flex-1 min-w-0 text-[12.5px] font-semibold text-[#101B17] truncate">
          Hôm nay 07:25 · Cổng 2
        </span>
        <button
          type="button"
          onClick={() => navigate('/passenger/live-tracking')}
          className="text-xs font-bold text-[#0B7A5C] hover:underline shrink-0"
        >
          Xem chuyến
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto rs-scroll p-4 flex flex-col gap-2.5">
        <span className="self-center px-3 py-1 rounded-full bg-[#E9EFEC] text-[#5B6B64] text-[11px] font-semibold">
          Hôm nay
        </span>

        {/* Safety banner */}
        <div className="flex gap-2.5 items-start bg-[#F1FAF6] rounded-2xl p-3 text-xs text-[#0B7A5C] border border-[#BDE7D5]/60">
          <ShieldCheck className="w-4 h-4 text-[#0B7A5C] shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            Chỉ trao đổi nội dung liên quan đến chuyến RouteShare của bạn.
          </span>
        </div>

        {/* Bubble List */}
        {messages.map((m) => {
          const mine = m.from === 'me';
          return (
            <div
              key={m.id}
              className={`flex flex-col gap-1 max-w-[82%] ${mine ? 'self-end items-end' : 'self-start items-start'}`}
            >
              {m.location ? (
                <div
                  className={`rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(16,27,23,0.06)] flex flex-col w-[220px] ${
                    mine ? 'bg-[#0F9D76] text-white' : 'bg-white text-[#101B17]'
                  }`}
                >
                  <div className="h-24 bg-[repeating-linear-gradient(135deg,#E4EBE8_0_8px,#EDF2F0_8px_16px)] relative flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-[#0F9D76] border-2 border-white shadow-[0_3px_10px_rgba(15,157,118,0.4)]" />
                  </div>
                  <div className="p-3 flex flex-col gap-0.5">
                    <span className="text-[12.5px] font-bold">{m.text}</span>
                    <span className={`text-[11px] ${mine ? 'text-[#CFF0E3]' : 'text-[#8A9993]'}`}>{m.sub}</span>
                  </div>
                </div>
              ) : (
                <div
                  className={`p-3 px-3.5 text-sm leading-relaxed ${
                    mine
                      ? 'rounded-[18px_18px_6px_18px] bg-[#0F9D76] text-white shadow-[0_4px_14px_rgba(15,157,118,0.22)]'
                      : 'rounded-[18px_18px_18px_6px] bg-white text-[#101B17] shadow-[0_1px_4px_rgba(16,27,23,0.06)]'
                  }`}
                >
                  {m.text}
                </div>
              )}
              <span className="text-[10.5px] text-[#A6B2AD] px-1 font-mono">{m.time}</span>
            </div>
          );
        })}
      </div>

      {/* Quick Replies Carousel */}
      <div className="flex-none px-4 py-2 flex gap-2 overflow-x-auto rs-scroll">
        {quickReplies.map((label, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendText(label)}
            className="shrink-0 h-[38px] px-3.5 border-[1.5px] border-[#E4EAE7] hover:border-[#BDE7D5] hover:bg-[#F1FAF6] hover:text-[#0B7A5C] rounded-full bg-white text-[#4B5A54] text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="flex-none bg-white p-3.5 pb-7 flex items-center gap-2.5 shadow-[0_-4px_20px_rgba(16,27,23,0.06)]">
        <button
          type="button"
          onClick={handleSendLocation}
          className="w-12 h-12 shrink-0 border-[1.5px] border-[#E4EAE7] hover:border-[#BDE7D5] hover:bg-[#F1FAF6] rounded-2xl bg-white flex items-center justify-center text-[#0B7A5C] transition-colors"
        >
          <MapPin className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendText();
          }}
          placeholder="Nhắn về chuyến đi…"
          className="flex-1 min-w-0 h-12 rounded-full bg-[#F4F7F5] px-4 text-sm text-[#101B17] placeholder-[#8A9993] outline-none border border-transparent focus:border-[#BDE7D5] transition-colors"
        />

        <button
          type="button"
          onClick={() => handleSendText()}
          className="w-12 h-12 shrink-0 rounded-2xl bg-[#0F9D76] hover:bg-[#0B8A66] text-white flex items-center justify-center shadow-[0_6px_16px_rgba(15,157,118,0.28)] transition-all active:scale-95 cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
