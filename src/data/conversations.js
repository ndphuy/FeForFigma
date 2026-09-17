export const CONVERSATIONS_BY_ROLE = {
  passenger: [
    {
      id: 'pas_trip_002_driver_nguyen_minh',
      tripId: 'trip_002',
      personId: 'drv_02',
      name: 'Nguyễn Minh',
      initials: 'NM',
      roleLabel: 'Tài xế hiện tại',
      phone: '0933222111',
      verified: true,
      period: 'current',
      statusLabel: 'Chuyến hiện tại',
      route: 'FPT University HCMC → Tòa nhà Bitexco, Q.1',
      schedule: 'Hôm nay · 07:20',
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

// Merged inbox: conversations from both roles, each tagged with which role you are in it.
export const getAllConversations = () => [
  ...CONVERSATIONS_BY_ROLE.passenger.map((c) => ({ ...c, myRole: 'passenger' })),
  ...CONVERSATIONS_BY_ROLE.driver.map((c) => ({ ...c, myRole: 'driver' })),
];

export const getConversationById = (role, conversationId) => {
  const conversations = getConversationsForRole(role);
  if (!conversations || conversations.length === 0) return null;
  if (!conversationId) return conversations[0];

  // 1. Direct ID match
  let found = conversations.find((conversation) => conversation.id === conversationId);
  if (found) return found;

  // 2. Match by personId (e.g., 'drv_01', 'pas_01')
  found = conversations.find((conversation) => conversation.personId === conversationId);
  if (found) return found;

  // 3. Match by tripId (e.g., 'trip_001', 'hist_pas_02')
  found = conversations.find((conversation) => conversation.tripId === conversationId);
  if (found) return found;

  // 4. Substring match
  found = conversations.find((conversation) =>
    conversation.id.toLowerCase().includes(conversationId.toLowerCase())
  );
  if (found) return found;

  // 5. Fallback to active/first conversation
  return conversations[0];
};
