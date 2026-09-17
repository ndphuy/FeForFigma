import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, MessageSquare, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getAllConversations } from '../../data/conversations';

const ConversationCard = ({ conversation, onOpen }) => {
  const isCurrent = conversation.period === 'current';

  return (
    <button
      type="button"
      onClick={() => onOpen(conversation)}
      className={`w-full rounded-2xl border bg-white p-3 text-left flex items-start gap-3 transition-all active:scale-[0.99] ${
        isCurrent ? 'border-[#BDE7D5] shadow-[0_3px_12px_rgba(15,157,118,0.08)]' : 'border-[#E4EAE7]'
      }`}
    >
      <span className="relative w-11 h-11 rounded-full bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center text-sm font-bold shrink-0">
        {conversation.initials}
        {isCurrent && <span className="absolute right-0 bottom-0 w-3 h-3 rounded-full bg-[#0F9D76] border-2 border-white" />}
      </span>

      <span className="flex-1 min-w-0 flex flex-col">
        <span className="flex items-center gap-1.5 min-w-0">
          <span className="text-[13.5px] font-bold text-[#101B17] truncate">{conversation.name}</span>
          {conversation.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#0F9D76] shrink-0" />}
          <span className={`ml-auto px-2 py-0.5 rounded-full text-[9.5px] font-bold shrink-0 ${
            isCurrent ? 'bg-[#DDF3EA] text-[#0B7A5C]' : 'bg-[#EEF2F0] text-[#687770]'
          }`}>
            {isCurrent ? 'HIỆN TẠI' : 'CHUYẾN CŨ'}
          </span>
        </span>
        <span className="flex items-center gap-1.5 mt-0.5">
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
            conversation.myRole === 'driver' ? 'bg-[#EAF2FF] text-[#2F6FCE]' : 'bg-[#FFF4E9] text-[#D96A16]'
          }`}>
            {conversation.myRole === 'driver' ? 'Bạn lái' : 'Bạn đi'}
          </span>
          <span className="text-[10.5px] font-semibold text-[#0B7A5C] truncate">
            {conversation.roleLabel} · {conversation.schedule}
          </span>
        </span>
        <span className="text-[11px] text-[#4B5A54] mt-1 truncate">{conversation.route}</span>
        <span className="text-[11px] text-[#8A9993] mt-1 truncate">{conversation.lastMessage}</span>
      </span>

      <span className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-[9.5px] text-[#8A9993]">{conversation.lastMessageTime}</span>
        {conversation.unread > 0 ? (
          <span className="min-w-5 h-5 px-1 rounded-full bg-[#EE7A22] text-white text-[10px] font-bold flex items-center justify-center">
            {conversation.unread}
          </span>
        ) : (
          <ChevronRight className="w-4 h-4 text-[#A6B2AD]" />
        )}
      </span>
    </button>
  );
};

export const ConversationList = () => {
  const navigate = useNavigate();
  const { switchRole } = useApp();
  const [query, setQuery] = useState('');
  const conversations = getAllConversations();
  const normalizedQuery = query.trim().toLocaleLowerCase('vi');
  const filteredConversations = normalizedQuery
    ? conversations.filter((conversation) =>
        `${conversation.name} ${conversation.route} ${conversation.schedule}`
          .toLocaleLowerCase('vi')
          .includes(normalizedQuery)
      )
    : conversations;
  const currentConversations = filteredConversations.filter((conversation) => conversation.period === 'current');
  const pastConversations = filteredConversations.filter((conversation) => conversation.period === 'past');

  const openConversation = (conversation) => {
    switchRole(conversation.myRole);
    navigate(`/shared/chat/${conversation.id}`);
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-[#F4F7F5] pb-6">
      <div className="flex-none bg-white px-4 pt-3 pb-3.5 border-b border-[#EEF2F0]">
        <div className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-2xl bg-[#DDF3EA] text-[#0B7A5C] flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-base font-bold text-[#101B17] tracking-tight">Tin nhắn chuyến đi</h1>
            <p className="text-[11px] text-[#8A9993] mt-0.5">
              Trò chuyện với đúng tài xế và hành khách của bạn
            </p>
          </div>
        </div>

        <label className="h-10 mt-3 rounded-xl bg-[#F4F7F5] border border-[#E4EAE7] px-3 flex items-center gap-2 focus-within:border-[#BDE7D5]">
          <Search className="w-4 h-4 text-[#8A9993] shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm tài xế, hành khách hoặc tuyến đường"
            className="flex-1 min-w-0 bg-transparent outline-none text-xs text-[#101B17] placeholder:text-[#8A9993]"
          />
        </label>
      </div>

      <div className="p-3.5 flex flex-col gap-4">
        {currentConversations.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="px-1 flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#101B17]">Chuyến hiện tại</h2>
              <span className="text-[10px] font-semibold text-[#0B7A5C]">Đang hoạt động</span>
            </div>
            {currentConversations.map((conversation) => (
              <ConversationCard key={conversation.id} conversation={conversation} onOpen={openConversation} />
            ))}
          </section>
        )}

        {pastConversations.length > 0 && (
          <section className="flex flex-col gap-2">
            <div className="px-1 flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#101B17]">Chuyến cũ</h2>
              <span className="text-[10px] text-[#8A9993]">Kiểm tra tên và tuyến trước khi nhắn</span>
            </div>
            {pastConversations.map((conversation) => (
              <ConversationCard key={conversation.id} conversation={conversation} onOpen={openConversation} />
            ))}
          </section>
        )}

        {filteredConversations.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#C9D3CF] bg-white px-5 py-10 text-center">
            <MessageSquare className="w-8 h-8 text-[#A6B2AD] mx-auto" />
            <p className="text-sm font-bold text-[#101B17] mt-3">Không tìm thấy cuộc trò chuyện</p>
            <p className="text-[11px] text-[#8A9993] mt-1">Thử tìm theo tên hoặc tuyến đường khác.</p>
          </div>
        )}
      </div>
    </div>
  );
};
