/**
 * RouteShare Mock Data Repository
 * Follows Minimalist Design System & Real-life Vietnam Commutes
 */

export const MOCK_DRIVER_VEHICLES = [
  {
    id: "veh_01",
    model: "Honda City",
    plate: "51G-119.02",
    color: "Trắng ngọc trai",
    type: "car", // 'car' | 'bike'
    typeLabel: "Ô tô 4 chỗ (Sedan)",
    seats: 4,
    passengerCapacity: 3,
    active: true,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "veh_02",
    model: "Honda SH 150i",
    plate: "59-X3 892.12",
    color: "Xám đen",
    type: "bike",
    typeLabel: "Xe máy 1 chỗ",
    seats: 2,
    passengerCapacity: 1,
    active: false,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "veh_03",
    model: "Toyota Corolla Cross",
    plate: "51K-456.78",
    color: "Đỏ đô",
    type: "car",
    typeLabel: "Ô tô 5 chỗ (SUV/Crossover)",
    seats: 5,
    passengerCapacity: 4,
    active: false,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80"
  }
];

export const MOCK_USER_PROFILES = {
  driver: {
    id: "drv_01",
    name: "Quốc Huy",
    initials: "QH",
    phone: "0908 123 456",
    email: "quochuy.driver@gmail.com",
    role: "driver",
    trustScore: 4.8,
    tripsCompleted: 96,
    verified: true,
    verificationStatus: "Đã xác thực CCCD & GPLX",
    walletBalance: 1250000,
    vehicle: {
      model: "Honda City",
      plate: "51G-119.02",
      color: "Trắng",
      type: "Sedan 4 chỗ",
      seats: 4,
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80",
    },
  },
  passenger: {
    id: "pas_01",
    name: "Minh Anh",
    initials: "MA",
    phone: "0912 345 678",
    email: "minhanh@gmail.com",
    role: "passenger",
    trustScore: 4.9,
    tripsTaken: 38,
    verified: true,
    verificationStatus: "Đã xác thực CCCD",
    walletBalance: 450000,
  },
};

export const MOCK_LOCATIONS_PRESETS = [
  { id: "loc_01", name: "FPT University HCMC", address: "Đường D1, Khu Công Nghệ Cao, TP. Thủ Đức", area: "Thủ Đức" },
  { id: "loc_02", name: "Chợ Bến Thành, Q.1", address: "Lê Lợi, Phường Bến Thành, Quận 1", area: "Quận 1" },
  { id: "loc_03", name: "Phú Mỹ Hưng, Q.7", address: "Nguyễn Văn Linh, Tân Phong, Quận 7", area: "Quận 7" },
  { id: "loc_04", name: "Landmark 81, Bình Thạnh", address: "720A Điện Biên Phủ, Phường 22, Bình Thạnh", area: "Bình Thạnh" },
];

export const MOCK_PICKUP_POINTS = [
  {
    id: "p_01",
    name: "Cổng 2 — ĐH FPT HCMC",
    address: "Đường D1, Khu CNC, P. Long Thạnh Mỹ, TP. Thủ Đức",
    distance: "50m · 1 phút đi bộ",
    safetyTag: "Thuận tiện đón",
    isSafe: true,
    coordinates: { lat: 10.8415, lng: 106.8098 },
    note: "Vỉa hè rộng, xe dừng đỗ thuận tiện không gây ùn tắc"
  },
  {
    id: "p_02",
    name: "Cây xăng Petrolimex Số 19",
    address: "Đường Võ Chí Công, TP. Thủ Đức",
    distance: "250m · 3 phút đi bộ",
    safetyTag: "Điểm dừng an toàn",
    isSafe: true,
    coordinates: { lat: 10.8380, lng: 106.8050 },
    note: "Có mái che và đèn đường sáng ban đêm"
  },
  {
    id: "p_03",
    name: "Cổng chính Khu Công Nghệ Cao (Xa Lộ HN)",
    address: "Xa Lộ Hà Nội, P. Hiệp Phú, TP. Thủ Đức",
    distance: "600m · 7 phút đi bộ",
    safetyTag: "Cấm dừng giờ cao điểm",
    isSafe: false,
    coordinates: { lat: 10.8520, lng: 106.7850 },
    note: "Khu vực có biển cấm dừng đỗ 06:30 - 08:30"
  },
];

export const INITIAL_TRIPS = [
  {
    id: "trip_001",
    driverId: "drv_01",
    driverName: "Quốc Huy",
    driverInitials: "QH",
    driverTrustScore: 4.8,
    driverTripsCount: 96,
    driverPhone: "0908 123 456",
    verified: true,
    vehicleModel: "Honda City",
    vehiclePlate: "51G-119.02",
    vehicleColor: "Trắng",
    vehicleSeats: 4,
    vehicleImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80",
    origin: "FPT University HCMC",
    originDetail: "07:00 · Cổng 2 ĐH FPT",
    destination: "Chợ Bến Thành, Q.1",
    destinationDetail: "07:48 · dự kiến · 18,5 km",
    distanceKm: 18.5,
    departureDate: "Hôm nay, 12/09",
    departureTime: "07:00",
    timeRange: "07:00–08:00",
    matchPercentage: 94,
    isBestMatch: true,
    availableSeats: 3,
    totalSeats: 4,
    statusText: "Đang mở",
    ratePerKm: 5000,
    priceVnd: 45000,
    costSharing: {
      totalKm: 30,
      passengerKm: 9,
      fuelVnd: 92000,
      tollVnd: 20000,
      wearAndTearVnd: 23000,
      totalCostVnd: 135000,
      costPerKm: 5000,
      splitPeople: 3,
      perPersonVnd: 45000,
    },
    stops: [
      { id: "st_1", name: "FPT University HCMC (Điểm A)", role: "Xuất phát", time: "07:00", isPassengerStop: true },
      { id: "st_2", name: "Ngã 4 Thủ Đức (Điểm B)", role: "Điểm đón 1", time: "07:15", isPassengerStop: false },
      { id: "st_3", name: "Hàng Xanh (Điểm C)", role: "Điểm trả 1", time: "07:35", isPassengerStop: false },
      { id: "st_4", name: "Chợ Bến Thành, Q.1 (Điểm D)", role: "Điểm kết thúc", time: "07:48", isPassengerStop: true },
    ],
    segments: [
      { km: 5, kmLabel: "5 km", barBg: "#DFE7E3", barFg: "#4B5A54", endLabel: "B", isUserLeg: false },
      { km: 15, kmLabel: "15 km (Bạn đi)", barBg: "#0F9D76", barFg: "#FFFFFF", endLabel: "C", isUserLeg: true },
      { km: 10, kmLabel: "10 km", barBg: "#DFE7E3", barFg: "#4B5A54", endLabel: "D", isUserLeg: false },
    ],
    passengers: [
      {
        id: "pas_02",
        name: "Thùy Linh",
        initials: "TL",
        phone: "0988 776 655",
        pickupPoint: "Ngã 4 Thủ Đức",
        dropoffPoint: "Hàng Xanh",
        fareVnd: 35000,
        status: "waiting_pickup",
        isNearDropoff: false,
        pin: "6392"
      }
    ]
  },
  {
    id: "trip_002",
    driverId: "drv_02",
    driverName: "Nguyễn Minh",
    driverInitials: "NM",
    driverTrustScore: 4.9,
    driverTripsCount: 128,
    driverPhone: "0933 222 111",
    verified: true,
    vehicleModel: "Mazda 3",
    vehiclePlate: "51K-882.91",
    vehicleColor: "Đỏ pha lê",
    vehicleSeats: 4,
    vehicleImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80",
    origin: "FPT University HCMC",
    originDetail: "07:20 · Cổng 2 ĐH FPT",
    destination: "Tòa nhà Bitexco, Q.1",
    destinationDetail: "08:05 · dự kiến · 19 km",
    distanceKm: 19.0,
    departureDate: "Hôm nay, 12/09",
    departureTime: "07:20",
    timeRange: "07:15–08:15",
    matchPercentage: 91,
    isBestMatch: false,
    availableSeats: 3,
    totalSeats: 4,
    statusText: "Đang mở",
    ratePerKm: 5000,
    priceVnd: 45000,
    costSharing: {
      totalKm: 32,
      passengerKm: 9,
      fuelVnd: 98000,
      tollVnd: 20000,
      wearAndTearVnd: 25000,
      totalCostVnd: 143000,
      costPerKm: 5000,
      splitPeople: 3,
      perPersonVnd: 45000,
    },
    stops: [
      { id: "st_201", name: "FPT University HCMC", role: "Xuất phát", time: "07:20", isPassengerStop: true },
      { id: "st_202", name: "Cầu Sài Gòn", role: "Điểm trả 1", time: "07:45", isPassengerStop: false },
      { id: "st_203", name: "Tòa nhà Bitexco, Q.1", role: "Điểm kết thúc", time: "08:05", isPassengerStop: true },
    ],
    segments: [
      { km: 4, kmLabel: "4 km", barBg: "#DFE7E3", barFg: "#4B5A54", endLabel: "B", isUserLeg: false },
      { km: 16, kmLabel: "16 km (Bạn đi)", barBg: "#0F9D76", barFg: "#FFFFFF", endLabel: "C", isUserLeg: true },
      { km: 12, kmLabel: "12 km", barBg: "#DFE7E3", barFg: "#4B5A54", endLabel: "D", isUserLeg: false },
    ],
    passengers: []
  },
  {
    id: "trip_003",
    driverId: "drv_03",
    driverName: "Hoàng Tùng",
    driverInitials: "HT",
    driverTrustScore: 4.7,
    driverTripsCount: 42,
    driverPhone: "0977 123 999",
    verified: true,
    vehicleModel: "Kia Seltos",
    vehiclePlate: "51H-445.67",
    vehicleColor: "Đen",
    vehicleSeats: 5,
    vehicleImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=300&auto=format&fit=crop&q=80",
    origin: "FPT University HCMC",
    originDetail: "07:45 · KTX ĐHQG",
    destination: "Landmark 81, Bình Thạnh",
    destinationDetail: "08:25 · dự kiến · 14,2 km",
    distanceKm: 14.2,
    departureDate: "Hôm nay, 12/09",
    departureTime: "07:45",
    timeRange: "07:30–08:30",
    matchPercentage: 82,
    isBestMatch: false,
    availableSeats: 3,
    totalSeats: 5,
    statusText: "Đang mở",
    ratePerKm: 4500,
    priceVnd: 40000,
    costSharing: {
      totalKm: 25,
      passengerKm: 14,
      fuelVnd: 75000,
      tollVnd: 15000,
      wearAndTearVnd: 20000,
      totalCostVnd: 110000,
      costPerKm: 4400,
      splitPeople: 3,
      perPersonVnd: 40000,
    },
    stops: [
      { id: "st_301", name: "FPT University HCMC", role: "Xuất phát", time: "07:45", isPassengerStop: true },
      { id: "st_302", name: "Landmark 81, Bình Thạnh", role: "Điểm kết thúc", time: "08:25", isPassengerStop: true },
    ],
    segments: [
      { km: 11, kmLabel: "11 km", barBg: "#DFE7E3", barFg: "#4B5A54", endLabel: "B", isUserLeg: false },
      { km: 14, kmLabel: "14 km (Bạn đi)", barBg: "#0F9D76", barFg: "#FFFFFF", endLabel: "C", isUserLeg: true },
    ],
    passengers: []
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: "bk_demo_01",
    tripId: "trip_001",
    passengerId: "pas_01",
    passengerName: "Minh Anh",
    passengerInitials: "MA",
    passengerPhone: "0912 345 678",
    passengerTrustScore: 4.9,
    passengerTrips: 38,
    pickupPoint: "Cổng 2 ĐH FPT HCMC",
    dropoffPoint: "Chợ Bến Thành, Q.1",
    fareVnd: 45000,
    status: "pending", // 'pending' | 'confirmed' | 'rejected' | 'completed'
    driverName: "Quốc Huy",
    driverPhone: "0908 123 456",
    vehicleModel: "Honda City · Trắng",
    vehiclePlate: "51G-119.02",
    departureTime: "07:00",
    departureDate: "Thứ 6, 12/09",
    routeText: "FPT University → Chợ Bến Thành · 07:00",
    overlapPercent: 94,
    detourKm: "+0.4 km",
    detourMin: "+2 phút",
    bookingCode: "#RS-4821",
    pin: "4821",
    createdAt: "12 phút trước"
  },
  {
    id: "bk_demo_02",
    tripId: "trip_001",
    passengerId: "pas_02",
    passengerName: "Thùy Linh",
    passengerInitials: "TL",
    passengerPhone: "0988 776 655",
    passengerTrustScore: 4.8,
    passengerTrips: 24,
    pickupPoint: "Ngã 4 Thủ Đức",
    dropoffPoint: "Hàng Xanh, Bình Thạnh",
    fareVnd: 35000,
    status: "confirmed",
    driverName: "Quốc Huy",
    driverPhone: "0908 123 456",
    vehicleModel: "Honda City · Trắng",
    vehiclePlate: "51G-119.02",
    departureTime: "07:00",
    departureDate: "Thứ 6, 12/09",
    routeText: "Ngã 4 Thủ Đức → Hàng Xanh · 07:15",
    overlapPercent: 88,
    detourKm: "+0.8 km",
    detourMin: "+3 phút",
    bookingCode: "#RS-7719",
    pin: "6392",
    createdAt: "15 phút trước"
  }
];

export const INITIAL_MESSAGES = [
  {
    id: "msg_1",
    sender: "driver",
    senderName: "Nguyễn Minh",
    text: "Chào bạn Minh Anh, mình đã xác nhận yêu cầu đi chung của bạn nhé.",
    time: "07:10 AM",
    isText: true,
  },
  {
    id: "msg_2",
    sender: "passenger",
    senderName: "Minh Anh",
    text: "Dạ vâng ạ! Em đứng ở Cổng 2 ĐH FPT, áo khoác xanh lá.",
    time: "07:12 AM",
    isText: true,
  },
  {
    id: "msg_3",
    sender: "driver",
    senderName: "Nguyễn Minh",
    text: "Vị trí xe hiện tại của mình",
    sub: "Cách bạn khoảng 800m · 2 phút nữa tới",
    time: "07:16 AM",
    isLocation: true,
  },
];

export const RECURRING_SCHEDULE_PRESETS = [
  {
    id: "sch_01",
    title: "Đi làm buổi sáng",
    days: ["T2", "T3", "T4", "T5", "T6"],
    origin: "Q.7 · Phú Mỹ Hưng",
    destination: "Q.1 · Bến Thành",
    time: "07:15",
    active: true,
  },
  {
    id: "sch_02",
    title: "Về nhà buổi chiều",
    days: ["T2", "T3", "T4", "T5", "T6"],
    origin: "Q.1 · Bến Thành",
    destination: "Q.7 · Phú Mỹ Hưng",
    time: "17:30",
    active: true,
  }
];

export const MOCK_WALLET_TRANSACTIONS = [
  {
    id: "tx_01",
    title: "Nạp tiền ví RouteShare (PayOS/VietQR)",
    date: "Hôm nay · 06:30",
    amount: 200000,
    type: "in",
  },
  {
    id: "tx_02",
    title: "Đóng góp chuyến đi cùng Quốc Huy (FPT → Q.1)",
    date: "Hôm qua · 07:55",
    amount: -45000,
    type: "out",
  },
  {
    id: "tx_03",
    title: "Thu nhập chia sẻ từ Minh Anh",
    date: "09/09/2026",
    amount: 45000,
    type: "in",
  },
  {
    id: "tx_04",
    title: "Rút tiền về tài khoản ngân hàng",
    date: "05/09/2026",
    amount: -500000,
    type: "out",
  }
];
