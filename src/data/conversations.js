export const CONVERSATIONS_BY_ROLE = {
  passenger: [
    {
      id: 'pas_trip_001_driver_quoc_huy',
      tripId: 'trip_001',
      personId: 'drv_01',
      name: 'Quốc Huy',
      initials: 'QH',
      roleLabel: 'Tài xế hiện tại',
      phone: '0908123456',
      verified: true,
      period: 'current',
      statusLabel: 'Chuyến hiện tại',
      route: 'FPT University HCMC → Chợ Bến Thành',
      schedule: 'Hôm nay · 07:00',
      lastMessage: 'Mình sẽ tới Cổng 2 sau 5 phút nữa.',
      lastMessageTime: '07:19',
      unread: 2,
      messages: [
        { id: 1, from: 'them', text: 'Chào bạn, mình sẽ tới Cổng 2 lúc 07:25 nhé.', time: '07:02' },
        { id: 2, from: 'me', text: 'Dạ vâng, em đợi ở Cổng 2 ạ.', time: '07:03' },
        { id: 3, from: 'them', text: 'Bạn mặc áo màu gì để mình nhận ra?', time: '07:04' },
        { id: 4, from: 'me', text: 'Em mặc áo sơ mi xanh ạ.', time: '07:05' },
        { id: 5, from: 'them', text: 'Mình sẽ tới Cổng 2 sau 5 phút nữa.', time: '07:19' }
      ]
    },
    {
      id: 'pas_hist_002_driver_nguyen_minh',
      tripId: 'hist_pas_02',
      personId: 'drv_02',
      name: 'Nguyễn Minh',
      initials: 'NM',
      roleLabel: 'Tài xế chuyến cũ',
      phone: '0933222111',
      verified: true,
      period: 'past',
      statusLabel: 'Chuyến đã kết thúc',
      route: 'Chợ Bến Thành → FPT University HCMC',
      schedule: 'Hôm qua · 17:30',
      lastMessage: 'Cảm ơn bạn, chúc bạn buổi tối vui vẻ!',
      lastMessageTime: 'Hôm qua',
      unread: 0,
      messages: [
        { id: 1, from: 'them', text: 'Mình đã tới điểm đón ở cổng chợ nhé.', time: '17:25' },
        { id: 2, from: 'me', text: 'Mình thấy xe rồi, cảm ơn anh.', time: '17:27' },
        { id: 3, from: 'them', text: 'Cảm ơn bạn, chúc bạn buổi tối vui vẻ!', time: '18:20' }
      ]
    },
    {
      id: 'pas_hist_003_driver_hoang_tung',
      tripId: 'hist_pas_03',
      personId: 'drv_03',
      name: 'Hoàng Tùng',
      initials: 'HT',
      roleLabel: 'Tài xế chuyến cũ',
      phone: '0977123999',
      verified: true,
      period: 'past',
      statusLabel: 'Chuyến đã kết thúc',
      route: 'Ngã 4 Thủ Đức → Landmark 81',
      schedule: '10/09/2026 · 07:15',
      lastMessage: 'Bạn nhớ kiểm tra lại đồ dùng nhé.',
      lastMessageTime: '10/09',
      unread: 0,
      messages: [
        { id: 1, from: 'me', text: 'Em đang đứng cạnh cửa hàng tiện lợi ạ.', time: '07:10' },
        { id: 2, from: 'them', text: 'Mình thấy bạn rồi nhé.', time: '07:13' },
        { id: 3, from: 'them', text: 'Bạn nhớ kiểm tra lại đồ dùng nhé.', time: '07:58' }
      ]
    }
  ],
  driver: [
    {
      id: 'drv_trip_001_passenger_minh_anh',
      tripId: 'trip_001',
      personId: 'pas_01',
      name: 'Minh Anh',
      initials: 'MA',
      roleLabel: 'Hành khách hiện tại',
      phone: '0912345678',
      verified: true,
      period: 'current',
      statusLabel: 'Chuyến hiện tại',
      route: 'FPT University HCMC → Chợ Bến Thành',
      schedule: 'Hôm nay · 07:00',
      lastMessage: 'Em đã có mặt tại Cổng 2 rồi ạ.',
      lastMessageTime: '07:18',
      unread: 1,
      messages: [
        { id: 1, from: 'me', text: 'Chào bạn, mình sẽ tới Cổng 2 lúc 07:25 nhé.', time: '07:02' },
        { id: 2, from: 'them', text: 'Dạ vâng, em đợi ở Cổng 2 ạ.', time: '07:03' },
        { id: 3, from: 'them', text: 'Em đã có mặt tại Cổng 2 rồi ạ.', time: '07:18' }
      ]
    },
    {
      id: 'drv_trip_001_passenger_thuy_linh',
      tripId: 'trip_001',
      personId: 'pas_02',
      name: 'Thùy Linh',
      initials: 'TL',
      roleLabel: 'Hành khách hiện tại',
      phone: '0988776655',
      verified: true,
      period: 'current',
      statusLabel: 'Chuyến hiện tại',
      route: 'Ngã 4 Thủ Đức → Hàng Xanh',
      schedule: 'Hôm nay · 07:15',
      lastMessage: 'Em sẽ đợi ở phía trước nhà thuốc.',
      lastMessageTime: '07:12',
      unread: 0,
      messages: [
        { id: 1, from: 'them', text: 'Em sẽ đợi ở phía trước nhà thuốc.', time: '07:12' },
        { id: 2, from: 'me', text: 'Được em, anh tới sau khoảng 3 phút.', time: '07:13' }
      ]
    },
    {
      id: 'drv_hist_002_passenger_hoang_nam',
      tripId: 'hist_drv_02',
      personId: 'pas_03',
      name: 'Hoàng Nam',
      initials: 'HN',
      roleLabel: 'Hành khách chuyến cũ',
      phone: '0933111222',
      verified: true,
      period: 'past',
      statusLabel: 'Chuyến đã kết thúc',
      route: 'Chợ Bến Thành → FPT University HCMC',
      schedule: 'Hôm qua · 17:30',
      lastMessage: 'Cảm ơn anh đã đưa em về an toàn.',
      lastMessageTime: 'Hôm qua',
      unread: 0,
      messages: [
        { id: 1, from: 'me', text: 'Anh đang dừng ở làn đón khách phía trước.', time: '17:25' },
        { id: 2, from: 'them', text: 'Em thấy xe rồi ạ.', time: '17:27' },
        { id: 3, from: 'them', text: 'Cảm ơn anh đã đưa em về an toàn.', time: '18:22' }
      ]
    },
    {
      id: 'drv_hist_003_passenger_bao_tram',
      tripId: 'hist_drv_03',
      personId: 'pas_04',
      name: 'Bảo Trâm',
      initials: 'BT',
      roleLabel: 'Hành khách chuyến cũ',
      phone: '0977888999',
      verified: true,
      period: 'past',
      statusLabel: 'Chuyến đã kết thúc',
      route: 'FPT University HCMC → Landmark 81',
      schedule: '10/09/2026 · 07:00',
      lastMessage: 'Dạ em đã nhận lại ví, cảm ơn anh nhiều.',
      lastMessageTime: '10/09',
      unread: 0,
      messages: [
        { id: 1, from: 'me', text: 'Anh có giữ giúp em chiếc ví để quên trên xe.', time: '09:15' },
        { id: 2, from: 'them', text: 'Dạ em đã nhận lại ví, cảm ơn anh nhiều.', time: '10:02' }
      ]
    }
  ]
};

export const getConversationsForRole = (role) => CONVERSATIONS_BY_ROLE[role] || [];

export const getConversationById = (role, conversationId) =>
  getConversationsForRole(role).find((conversation) => conversation.id === conversationId);
