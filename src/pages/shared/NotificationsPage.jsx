import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CalendarClock,
  Check,
  ChevronRight,
  CircleDollarSign,
  MessageSquare,
  ShieldCheck,
  Users
} from 'lucide-react';

const notificationSets = {
  passenger: [
    {
      id: 'pas_trip_confirmed',
      title: 'Chuyến đi đã được xác nhận',
      description: 'Tài xế Quốc Huy đã xác nhận chỗ của bạn cho chuyến 07:00 hôm nay.',
      time: '5 phút trước',
      icon: CalendarClock,
      iconStyle: 'bg-[#DDF3EA] text-[#0B7A5C]',
      unread: true,
      path: '/passenger/history'
    },
    {
      id: 'pas_new_message',
      title: 'Tin nhắn mới từ tài xế',
      description: '“Mình sẽ tới Cổng 2 sau khoảng 5 phút nữa nhé.”',
      time: '12 phút trước',
      icon: MessageSquare,
      iconStyle: 'bg-[#FFF4E9] text-[#D96A16]',
      unread: true,
      path: '/shared/chat/pas_trip_001_driver_quoc_huy'
    },
    {
      id: 'pas_trip_reminder',
      title: 'Sắp đến giờ khởi hành',
      description: 'Chuyến FPT University → Chợ Bến Thành sẽ khởi hành sau 30 phút.',
      time: '30 phút trước',
      icon: Bell,
      iconStyle: 'bg-[#EAF2FF] text-[#2F6FCE]',
      unread: false,
      path: '/passenger/history'
    },
    {
      id: 'pas_payment',
      title: 'Thanh toán thành công',
      description: '45.000 ₫ đã được giữ an toàn cho chuyến đi #RS-4821.',
      time: 'Hôm qua',
      icon: CircleDollarSign,
      iconStyle: 'bg-[#F1FAF6] text-[#0F9D76]',
      unread: false,
      path: '/wallet'
    }
  ],
  driver: [
    {
      id: 'drv_booking_request',
      title: 'Yêu cầu đặt chỗ mới',
      description: 'Minh Anh muốn đặt 1 chỗ trên chuyến FPT University → Chợ Bến Thành.',
      time: '3 phút trước',
      icon: Users,
      iconStyle: 'bg-[#FFF4E9] text-[#D96A16]',
      unread: true,
      path: '/driver/requests'
    },
    {
      id: 'drv_new_message',
      title: 'Tin nhắn mới từ hành khách',
      description: '“Em đã có mặt tại Cổng 2 và đang đợi anh ạ.”',
      time: '8 phút trước',
      icon: MessageSquare,
      iconStyle: 'bg-[#DDF3EA] text-[#0B7A5C]',
      unread: true,
      path: '/shared/chat/drv_trip_001_passenger_minh_anh'
    },
    {
      id: 'drv_trip_reminder',
      title: 'Chuẩn bị khởi hành',
      description: 'Chuyến đi lúc 07:00 có 2 hành khách đã xác nhận.',
      time: '25 phút trước',
      icon: CalendarClock,
      iconStyle: 'bg-[#EAF2FF] text-[#2F6FCE]',
      unread: false,
      path: '/driver/history'
    },
    {
      id: 'drv_verified',
      title: 'Hồ sơ đã được xác thực',
      description: 'CCCD và giấy phép lái xe của bạn đang ở trạng thái hợp lệ.',
      time: '2 ngày trước',
      icon: ShieldCheck,
      iconStyle: 'bg-[#F1FAF6] text-[#0F9D76]',
      unread: false,
      path: '/profile'
    }
  ]
};

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const { currentRole, pendingBookingsForDriver } = useApp();

  const driverNotifications = [
    ...(pendingBookingsForDriver.length > 0 ? pendingBookingsForDriver.map(b => ({
      id: `drv_req_${b.id}`,
      title: 'Yêu cầu đặt chỗ mới',
      description: `${b.passengerName || 'Minh Anh'} muốn đặt ${b.seatsCount || 1} chỗ trên chuyến FPT University → Chợ Bến Thành.`,
      time: b.createdAt || 'Vừa xong',
      icon: Users,
      iconStyle: 'bg-[#FFF4E9] text-[#D96A16]',
      unread: true,
      path: '/driver/requests'
    })) : []),
    {
      id: 'drv_trip_reminder',
      title: 'Chuẩn bị khởi hành',
      description: 'Chuyến đi lúc 07:00 đã có hành khách xác nhận chỗ.',
      time: '25 phút trước',
      icon: CalendarClock,
      iconStyle: 'bg-[#EAF2FF] text-[#2F6FCE]',
      unread: false,
      path: '/driver/history'
    },
    {
      id: 'drv_verified',
      title: 'Hồ sơ đã được xác thực',
      description: 'CCCD và giấy phép lái xe của bạn đang ở trạng thái hợp lệ.',
      time: '2 ngày trước',
      icon: ShieldCheck,
      iconStyle: 'bg-[#F1FAF6] text-[#0F9D76]',
      unread: false,
      path: '/profile'
    }
  ];

  const roleNotifications = currentRole === 'driver' ? driverNotifications : notificationSets.passenger;
  const [readIds, setReadIds] = useState(() =>
    roleNotifications.filter((item) => !item.unread).map((item) => item.id)
  );

  const unreadCount = roleNotifications.filter((item) => !readIds.includes(item.id)).length;

  const handleOpen = (item) => {
    setReadIds((current) => current.includes(item.id) ? current : [...current, item.id]);
    navigate(item.path);
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-[#F4F7F5] pb-6">
      <div className="flex-none bg-white px-4 py-3 border-b border-[#EEF2F0] flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-[#101B17] tracking-tight">Thông báo</h1>
          <p className="text-[11px] text-[#8A9993] mt-0.5">
            {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Bạn đã đọc tất cả thông báo'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReadIds(roleNotifications.map((item) => item.id))}
          disabled={unreadCount === 0}
          className="h-9 px-3 rounded-xl bg-[#F1FAF6] text-[#0B7A5C] text-[11px] font-bold flex items-center gap-1.5 disabled:opacity-50"
        >
          <Check className="w-3.5 h-3.5" />
          Đánh dấu đã đọc
        </button>
      </div>

      <div className="p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1 pb-0.5">
          <span className="text-xs font-bold text-[#101B17]">Gần đây</span>
          <span className="text-[10.5px] text-[#8A9993]">
            {currentRole === 'driver' ? 'Dành cho tài xế' : 'Dành cho hành khách'}
          </span>
        </div>

        {roleNotifications.map((item) => {
          const Icon = item.icon;
          const isUnread = !readIds.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleOpen(item)}
              className={`w-full text-left rounded-2xl p-3.5 border shadow-[0_2px_8px_rgba(16,27,23,0.03)] flex items-start gap-3 transition-all active:scale-[0.99] ${
                isUnread
                  ? 'bg-white border-[#BDE7D5]'
                  : 'bg-white border-[#E4EAE7]'
              }`}
            >
              <span className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${item.iconStyle}`}>
                <Icon className="w-5 h-5" />
              </span>

              <span className="flex-1 min-w-0 flex flex-col">
                <span className="flex items-start gap-2">
                  <span className="flex-1 text-[13px] font-bold text-[#101B17] leading-snug">
                    {item.title}
                  </span>
                  {isUnread && <span className="w-2 h-2 rounded-full bg-[#EE7A22] mt-1.5 shrink-0" />}
                </span>
                <span className="text-[11.5px] text-[#4B5A54] leading-relaxed mt-1">
                  {item.description}
                </span>
                <span className="text-[10.5px] text-[#8A9993] mt-1.5">{item.time}</span>
              </span>

              <ChevronRight className="w-4 h-4 text-[#A6B2AD] shrink-0 mt-3" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
