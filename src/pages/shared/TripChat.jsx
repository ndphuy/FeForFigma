import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, Check, MapPin, MessageSquare, Phone, Send, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getConversationById } from '../../data/conversations';

const TripChatConversation = ({ conversation, currentRole }) => {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState(conversation.messages);
  const [pastRecipientConfirmed, setPastRecipientConfirmed] = useState(conversation.period === 'current');
  const isCurrent = conversation.period === 'current';

  const quickReplies = currentRole === 'driver'
    ? ['Anh đang tới điểm đón.', 'Anh tới sau 5 phút.', 'Em đang đứng ở đâu?', 'Anh đã thấy em rồi.']
    : ['Em đã ở điểm đón.', 'Em tới sau 5 phút nữa.', 'Em nên đợi ở đâu ạ?', 'Em mặc áo sơ mi xanh.'];

  const now = () => {
    const date = new Date();
    return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
  };

  const handleSendText = (textToSend) => {
    if (!pastRecipientConfirmed) return;
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), from: 'me', text, time: now() }
    ]);
    if (!textToSend) setInputVal('');

    if (isCurrent) {
      setTimeout(() => {
        setMessages((current) => [
          ...current,
          {
            id: Date.now() + 1,
            from: 'them',
            text: 'Mình đã nhận được tin nhắn nhé!',
            time: now()
          }
        ]);
      }, 1500);
    }
  };

  const handleSendLocation = () => {
    if (!pastRecipientConfirmed) return;
    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        from: 'me',
        text: 'Vị trí hiện tại của tôi',
        sub: 'Cổng 2, FPT University HCMC',
        location: true,
        time: now()
      }
    ]);
  };

  const tripPath = isCurrent
    ? (currentRole === 'driver' ? '/driver/active-trip' : '/passenger/live-tracking')
    : `/${currentRole}/history`;

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      <div className="flex-none bg-white px-3 py-3 border-b border-[#EEF2F0] flex items-center gap-2.5 shadow-[0_2px_12px_rgba(16,27,23,0.05)]">
        <button
          type="button"
          onClick={() => navigate(`/${currentRole}/messages`)}
          aria-label="Quay lại danh sách tin nhắn"
          className="w-10 h-10 rounded-2xl bg-white hover:bg-[#F7FAF9] border border-[#EEF2F0] flex items-center justify-center text-lg text-[#101B17] shrink-0 transition-colors"
        >
          ‹
        </button>

        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center text-sm font-bold">
            {conversation.initials}
          </div>
          {isCurrent && <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-[#0F9D76] border-2 border-white" />}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[14px] font-bold text-[#101B17] truncate">{conversation.name}</span>
            {conversation.verified && <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />}
          </div>
          <span className={`text-[10.5px] font-semibold truncate ${isCurrent ? 'text-[#0B7A5C]' : 'text-[#8A9993]'}`}>
            {conversation.roleLabel} · {conversation.statusLabel}
          </span>
        </div>

        <a
          href={`tel:${conversation.phone}`}
          aria-label={`Gọi ${conversation.name}`}
          className="w-10 h-10 rounded-2xl border-[1.5px] border-[#E4EAE7] hover:border-[#BDE7D5] hover:bg-[#F7FAF9] bg-white flex items-center justify-center text-[#0B7A5C] shrink-0 transition-colors"
        >
          <Phone className="w-4.5 h-4.5" />
        </a>
      </div>

      <div className={`flex-none mx-3 mt-3 rounded-2xl p-2.5 px-3 flex items-center gap-2.5 border ${
        isCurrent ? 'bg-white border-[#BDE7D5]' : 'bg-[#F7F8F7] border-[#D8DFDC]'
      }`}>
        <span className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-[#0F9D76]' : 'bg-[#8A9993]'}`} />
        <span className="flex-1 min-w-0 flex flex-col">
          <span className="text-[11.5px] font-bold text-[#101B17] truncate">{conversation.route}</span>
          <span className="text-[10px] text-[#8A9993] truncate">{conversation.schedule} · Mã chuyến {conversation.tripId}</span>
        </span>
        <button
          type="button"
          onClick={() => navigate(tripPath)}
          className="text-[11px] font-bold text-[#0B7A5C] hover:underline shrink-0"
        >
          Xem chuyến
        </button>
      </div>

      {!isCurrent && !pastRecipientConfirmed && (
        <div className="flex-none mx-3 mt-2.5 rounded-2xl bg-[#FFF4E9] border border-[#F7D9B8] p-3 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#D96A16] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[11.5px] font-bold text-[#8A4A0B]">Đây là người đi cùng chuyến cũ</p>
            <p className="text-[10.5px] leading-relaxed text-[#8A4A0B]/80 mt-0.5">
              Kiểm tra đúng {conversation.name}, tuyến đường và ngày đi trước khi gửi tin.
            </p>
            <button
              type="button"
              onClick={() => setPastRecipientConfirmed(true)}
              className="h-8 mt-2 px-3 rounded-xl bg-[#EE7A22] text-white text-[10.5px] font-bold inline-flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Xác nhận đúng người
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto rs-scroll p-3.5 flex flex-col gap-2.5">
        <span className="self-center px-3 py-1 rounded-full bg-[#E9EFEC] text-[#5B6B64] text-[10.5px] font-semibold">
          {isCurrent ? 'Hôm nay' : conversation.schedule}
        </span>

        <div className={`flex gap-2.5 items-start rounded-2xl p-3 text-[11px] border ${
          isCurrent
            ? 'bg-[#F1FAF6] text-[#0B7A5C] border-[#BDE7D5]/60'
            : 'bg-white text-[#4B5A54] border-[#E4EAE7]'
        }`}>
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            Bạn đang nhắn với <strong>{conversation.name}</strong> — {conversation.roleLabel.toLocaleLowerCase('vi')} của tuyến <strong>{conversation.route}</strong>.
          </span>
        </div>

        {messages.map((message) => {
          const mine = message.from === 'me';
          return (
            <div
              key={message.id}
              className={`flex flex-col gap-1 max-w-[82%] ${mine ? 'self-end items-end' : 'self-start items-start'}`}
            >
              {message.location ? (
                <div className={`rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(16,27,23,0.06)] flex flex-col w-[220px] ${
                  mine ? 'bg-[#0F9D76] text-white' : 'bg-white text-[#101B17]'
                }`}>
                  <div className="h-24 bg-[repeating-linear-gradient(135deg,#E4EBE8_0_8px,#EDF2F0_8px_16px)] relative flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-[#0F9D76] border-2 border-white shadow-[0_3px_10px_rgba(15,157,118,0.4)]" />
                  </div>
                  <div className="p-3 flex flex-col gap-0.5">
                    <span className="text-[12.5px] font-bold">{message.text}</span>
                    <span className={`text-[11px] ${mine ? 'text-[#CFF0E3]' : 'text-[#8A9993]'}`}>{message.sub}</span>
                  </div>
                </div>
              ) : (
                <div className={`p-3 px-3.5 text-sm leading-relaxed ${
                  mine
                    ? 'rounded-[18px_18px_6px_18px] bg-[#0F9D76] text-white shadow-[0_4px_14px_rgba(15,157,118,0.22)]'
                    : 'rounded-[18px_18px_18px_6px] bg-white text-[#101B17] shadow-[0_1px_4px_rgba(16,27,23,0.06)]'
                }`}>
                  {message.text}
                </div>
              )}
              <span className="text-[10.5px] text-[#A6B2AD] px-1 font-mono">{message.time}</span>
            </div>
          );
        })}
      </div>

      <div className="flex-none px-3 py-2 flex gap-2 overflow-x-auto rs-scroll">
        {quickReplies.map((label) => (
          <button
            key={label}
            type="button"
            disabled={!pastRecipientConfirmed}
            onClick={() => handleSendText(label)}
            className="shrink-0 h-[36px] px-3.5 border-[1.5px] border-[#E4EAE7] hover:border-[#BDE7D5] hover:bg-[#F1FAF6] hover:text-[#0B7A5C] rounded-full bg-white text-[#4B5A54] text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-none bg-white p-3.5 pb-7 flex items-center gap-2.5 shadow-[0_-4px_20px_rgba(16,27,23,0.06)]">
        <button
          type="button"
          disabled={!pastRecipientConfirmed}
          onClick={handleSendLocation}
          aria-label={`Gửi vị trí cho ${conversation.name}`}
          className="w-12 h-12 shrink-0 border-[1.5px] border-[#E4EAE7] hover:border-[#BDE7D5] hover:bg-[#F1FAF6] rounded-2xl bg-white flex items-center justify-center text-[#0B7A5C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <MapPin className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputVal}
          disabled={!pastRecipientConfirmed}
          onChange={(event) => setInputVal(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleSendText();
          }}
          placeholder={pastRecipientConfirmed ? `Nhắn cho ${conversation.name}…` : 'Xác nhận đúng người để nhắn'}
          className="flex-1 min-w-0 h-12 rounded-full bg-[#F4F7F5] px-4 text-sm text-[#101B17] placeholder-[#8A9993] outline-none border border-transparent focus:border-[#BDE7D5] transition-colors disabled:cursor-not-allowed"
        />

        <button
          type="button"
          disabled={!pastRecipientConfirmed || !inputVal.trim()}
          onClick={() => handleSendText()}
          aria-label={`Gửi tin nhắn cho ${conversation.name}`}
          className="w-12 h-12 shrink-0 rounded-2xl bg-[#0F9D76] hover:bg-[#0B8A66] text-white flex items-center justify-center shadow-[0_6px_16px_rgba(15,157,118,0.28)] transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const TripChat = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentRole } = useApp();
  const conversation = getConversationById(currentRole, id);

  if (!conversation) {
    return (
      <div className="w-full min-h-full bg-[#F4F7F5] flex items-center justify-center p-6">
        <div className="w-full rounded-3xl bg-white border border-[#E4EAE7] p-6 text-center shadow-sm">
          <span className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF4E9] text-[#D96A16] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </span>
          <h1 className="text-base font-bold text-[#101B17] mt-4">Không xác định được người nhận</h1>
          <p className="text-xs text-[#8A9993] leading-relaxed mt-2">
            Cuộc trò chuyện không thuộc tài khoản {currentRole === 'driver' ? 'tài xế' : 'hành khách'} hiện tại. Hãy chọn lại từ danh sách để tránh nhắn nhầm.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/${currentRole}/messages`)}
            className="w-full h-11 mt-5 rounded-2xl bg-[#0F9D76] text-white text-sm font-bold flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Về danh sách tin nhắn
          </button>
        </div>
      </div>
    );
  }

  return (
    <TripChatConversation
      key={`${currentRole}:${conversation.id}`}
      conversation={conversation}
      currentRole={currentRole}
    />
  );
};
