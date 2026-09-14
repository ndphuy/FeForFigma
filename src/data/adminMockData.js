/**
 * RouteShare Admin Console — Mock Data Repository
 * Vietnamese cost-sharing carpooling platform. Drivers never profit — all monetary
 * figures here represent shared trip costs (fuel, tolls, wear & tear), not fares.
 */

// ---------------------------------------------------------------------------
// Audit log (every destructive/irreversible action is recorded actor + time)
// ---------------------------------------------------------------------------
export const SEED_AUDIT_LOG = [
  {
    id: 'log_seed_01',
    actor: 'Ngọc Bích',
    action: 'Khóa tài khoản người dùng',
    target: 'Lê Văn Phúc (pas_1042)',
    timestamp: new Date('2026-09-14T08:12:00'),
    tone: 'danger',
  },
  {
    id: 'log_seed_02',
    actor: 'Trần Công Tâm',
    action: 'Duyệt xác thực GPLX & CCCD',
    target: 'Nguyễn Đình Khoa (drv_0231)',
    timestamp: new Date('2026-09-14T07:44:00'),
    tone: 'success',
  },
  {
    id: 'log_seed_03',
    actor: 'Trần Công Tâm',
    action: 'Cập nhật khung đơn giá/km',
    target: 'Quy tắc chi phí khu vực TP.HCM',
    timestamp: new Date('2026-09-13T16:05:00'),
    tone: 'neutral',
  },
  {
    id: 'log_seed_04',
    actor: 'Ngọc Bích',
    action: 'Đóng báo cáo an toàn',
    target: 'SF-2026-0091',
    timestamp: new Date('2026-09-13T11:30:00'),
    tone: 'success',
  },
  {
    id: 'log_seed_05',
    actor: 'Minh Quân',
    action: 'Gỡ phương tiện khỏi hệ thống',
    target: 'Xe 59-X3 892.•• (veh_2210)',
    timestamp: new Date('2026-09-12T14:52:00'),
    tone: 'danger',
  },
];

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------
export const ADMIN_OVERVIEW_STATS = {
  totalUsers: 18420,
  totalUsersDeltaPct: 4.2,
  activeDrivers: 1284,
  activeDriversDeltaPct: 1.8,
  tripsToday: 3062,
  completedTripsToday: 2810,
  costSharedToday: 128_500_000,
  costSharedDeltaPct: 3.6,
  openSafetyReports: 7,
  pendingKyc: 23,
  avgOverlapPercent: 87,
  cancelRatePct: 3.1,
};

// Single-series magnitude data — one hue, ordered categories (Mon→Sun).
export const ADMIN_WEEKLY_TRIP_VOLUME = [
  { day: 'T2', trips: 2480 },
  { day: 'T3', trips: 2610 },
  { day: 'T4', trips: 2390 },
  { day: 'T5', trips: 2720 },
  { day: 'T6', trips: 3140 },
  { day: 'T7', trips: 1860 },
  { day: 'CN', trips: 1420 },
];

// Status breakdown — reserved status colors (good / info / critical), not generic categorical hues.
export const ADMIN_TRIP_STATUS_BREAKDOWN = [
  { key: 'completed', label: 'Đã hoàn thành', count: 2810, tone: 'success' },
  { key: 'ongoing', label: 'Đang diễn ra', count: 156, tone: 'info' },
  { key: 'cancelled', label: 'Đã huỷ', count: 96, tone: 'danger' },
];

export const ADMIN_RECENT_ACTIVITY = [
  { id: 'act_01', type: 'safety', text: 'Báo cáo an toàn mới từ chuyến #RS-77120', time: '6 phút trước' },
  { id: 'act_02', type: 'kyc', text: 'Tài xế Đặng Hồng Sơn gửi hồ sơ xác thực GPLX B2', time: '18 phút trước' },
  { id: 'act_03', type: 'trip', text: '142 chuyến khởi hành trong khung 07:00–08:00', time: '32 phút trước' },
  { id: 'act_04', type: 'user', text: 'Tài khoản Hành khách mới: Vũ Thị Kim Ngân', time: '41 phút trước' },
  { id: 'act_05', type: 'report', text: 'Đánh giá 1★ bị gắn cờ trên chuyến #RS-76980', time: '58 phút trước' },
  { id: 'act_06', type: 'vehicle', text: 'Phương tiện 51K-445.•• hết hạn đăng kiểm trong 5 ngày', time: '1 giờ trước' },
  { id: 'act_07', type: 'trip', text: 'Tuyến FPT University ↔ Q.1 đạt độ trùng tuyến trung bình 91%', time: '2 giờ trước' },
  { id: 'act_08', type: 'safety', text: 'Đã xử lý xong báo cáo SF-2026-0091', time: '3 giờ trước' },
];

// ---------------------------------------------------------------------------
// Users (passengers + drivers, unified directory)
// ---------------------------------------------------------------------------
export const ADMIN_USERS = [
  { id: 'pas_1001', name: 'Nguyễn Minh Anh', initials: 'MA', role: 'passenger', phone: '0912345678', email: 'minhanh@gmail.com', joinedAt: '14/03/2025', trips: 38, trustScore: 4.9, status: 'active', verified: true },
  { id: 'drv_0231', name: 'Nguyễn Đình Khoa', initials: 'ĐK', role: 'driver', phone: '0977664521', email: 'dinhkhoa.driver@gmail.com', joinedAt: '02/01/2025', trips: 96, trustScore: 4.8, status: 'active', verified: true },
  { id: 'pas_1042', name: 'Lê Văn Phúc', initials: 'LP', role: 'passenger', phone: '0933221144', email: 'levanphuc@gmail.com', joinedAt: '22/06/2025', trips: 4, trustScore: 3.1, status: 'suspended', verified: true },
  { id: 'drv_0198', name: 'Trần Thị Bích Hằng', initials: 'BH', role: 'driver', phone: '0908123456', email: 'bichhang.rs@gmail.com', joinedAt: '19/11/2024', trips: 214, trustScore: 4.95, status: 'active', verified: true },
  { id: 'pas_1103', name: 'Phạm Thu Thảo', initials: 'TT', role: 'passenger', phone: '0988776655', email: 'thuthao.pham@gmail.com', joinedAt: '30/07/2025', trips: 12, trustScore: 4.7, status: 'active', verified: false },
  { id: 'drv_0304', name: 'Đặng Hồng Sơn', initials: 'HS', role: 'driver', phone: '0965123789', email: 'hongson.dang@gmail.com', joinedAt: '05/09/2026', trips: 0, trustScore: null, status: 'pending', verified: false },
  { id: 'pas_1187', name: 'Vũ Thị Kim Ngân', initials: 'KN', role: 'passenger', phone: '0901122334', email: 'kimngan.vu@gmail.com', joinedAt: '14/09/2026', trips: 0, trustScore: null, status: 'pending', verified: false },
  { id: 'drv_0112', name: 'Hoàng Anh Tùng', initials: 'AT', role: 'driver', phone: '0977123999', email: 'anhtung.hoang@gmail.com', joinedAt: '11/02/2025', trips: 42, trustScore: 4.7, status: 'active', verified: true },
  { id: 'pas_1256', name: 'Đỗ Gia Bảo', initials: 'GB', role: 'passenger', phone: '0912998877', email: 'giabao.do@gmail.com', joinedAt: '01/05/2025', trips: 27, trustScore: 4.6, status: 'active', verified: true },
  { id: 'drv_0087', name: 'Nguyễn Minh Quân', initials: 'MQ', role: 'driver', phone: '0933222111', email: 'minhquan.nguyen@gmail.com', joinedAt: '08/08/2024', trips: 128, trustScore: 4.9, status: 'active', verified: true },
  { id: 'pas_1310', name: 'Bùi Thanh Trúc', initials: 'TT', role: 'passenger', phone: '0977888999', email: 'thanhtruc.bui@gmail.com', joinedAt: '19/09/2025', trips: 9, trustScore: 2.8, status: 'suspended', verified: true },
  { id: 'drv_0276', name: 'Lý Hoàng Việt', initials: 'HV', role: 'driver', phone: '0909333444', email: 'hoangviet.ly@gmail.com', joinedAt: '27/03/2025', trips: 61, trustScore: 4.6, status: 'active', verified: true },
];

// ---------------------------------------------------------------------------
// Drivers (driver-specific KYC & vehicle view)
// ---------------------------------------------------------------------------
export const ADMIN_DRIVERS = [
  { id: 'drv_0231', name: 'Nguyễn Đình Khoa', initials: 'ĐK', vehicle: 'Honda City · 51G-119.02', kycStatus: 'verified', trustScore: 4.8, tripsCompleted: 96, costReceived: 4_320_000, status: 'active', joinedAt: '02/01/2025' },
  { id: 'drv_0198', name: 'Trần Thị Bích Hằng', initials: 'BH', vehicle: 'Toyota Vios · 51H-882.19', kycStatus: 'verified', trustScore: 4.95, tripsCompleted: 214, costReceived: 9_650_000, status: 'active', joinedAt: '19/11/2024' },
  { id: 'drv_0304', name: 'Đặng Hồng Sơn', initials: 'HS', vehicle: 'Mazda CX-5 · 51K-204.55', kycStatus: 'pending_review', trustScore: null, tripsCompleted: 0, costReceived: 0, status: 'pending', joinedAt: '05/09/2026' },
  { id: 'drv_0112', name: 'Hoàng Anh Tùng', initials: 'AT', vehicle: 'Kia Seltos · 51H-445.67', kycStatus: 'verified', trustScore: 4.7, tripsCompleted: 42, costReceived: 1_780_000, status: 'active', joinedAt: '11/02/2025' },
  { id: 'drv_0087', name: 'Nguyễn Minh Quân', initials: 'MQ', vehicle: 'Mazda 3 · 51K-882.91', kycStatus: 'verified', trustScore: 4.9, tripsCompleted: 128, costReceived: 5_940_000, status: 'active', joinedAt: '08/08/2024' },
  { id: 'drv_0276', name: 'Lý Hoàng Việt', initials: 'HV', vehicle: 'Hyundai Accent · 51G-661.03', kycStatus: 'verified', trustScore: 4.6, tripsCompleted: 61, costReceived: 2_610_000, status: 'active', joinedAt: '27/03/2025' },
  { id: 'drv_0355', name: 'Phan Đức Thịnh', initials: 'ĐT', vehicle: 'Honda SH 150i · 59-X3 892.12', kycStatus: 'rejected', trustScore: null, tripsCompleted: 0, costReceived: 0, status: 'suspended', joinedAt: '30/08/2026', rejectReason: 'Ảnh GPLX mờ, không khớp thông tin CCCD' },
  { id: 'drv_0410', name: 'Vương Bảo Long', initials: 'BL', vehicle: 'Toyota Corolla Cross · 51K-456.78', kycStatus: 'pending_review', trustScore: null, tripsCompleted: 0, costReceived: 0, status: 'pending', joinedAt: '13/09/2026' },
];

// ---------------------------------------------------------------------------
// Vehicles
// ---------------------------------------------------------------------------
export const ADMIN_VEHICLES = [
  { id: 'veh_1001', ownerName: 'Nguyễn Đình Khoa', model: 'Honda City', plate: '51G-119.02', type: 'car', seats: 4, status: 'verified', inspectionExpiry: '18/12/2026', registeredAt: '02/01/2025' },
  { id: 'veh_1002', ownerName: 'Trần Thị Bích Hằng', model: 'Toyota Vios', plate: '51H-882.19', type: 'car', seats: 5, status: 'verified', inspectionExpiry: '05/03/2027', registeredAt: '19/11/2024' },
  { id: 'veh_1003', ownerName: 'Hoàng Anh Tùng', model: 'Kia Seltos', plate: '51H-445.67', type: 'car', seats: 5, status: 'verified', inspectionExpiry: '22/09/2026', registeredAt: '11/02/2025' },
  { id: 'veh_1004', ownerName: 'Nguyễn Minh Quân', model: 'Mazda 3', plate: '51K-882.91', type: 'car', seats: 4, status: 'verified', inspectionExpiry: '30/01/2027', registeredAt: '08/08/2024' },
  { id: 'veh_1005', ownerName: 'Đặng Hồng Sơn', model: 'Mazda CX-5', plate: '51K-204.55', type: 'car', seats: 5, status: 'pending_review', inspectionExpiry: '—', registeredAt: '05/09/2026' },
  { id: 'veh_1006', ownerName: 'Lý Hoàng Việt', model: 'Hyundai Accent', plate: '51G-661.03', type: 'car', seats: 5, status: 'verified', inspectionExpiry: '14/11/2026', registeredAt: '27/03/2025' },
  { id: 'veh_1007', ownerName: 'Phan Đức Thịnh', model: 'Honda SH 150i', plate: '59-X3 892.12', type: 'bike', seats: 2, status: 'rejected', inspectionExpiry: '—', registeredAt: '30/08/2026' },
  { id: 'veh_1008', ownerName: 'Vương Bảo Long', model: 'Toyota Corolla Cross', plate: '51K-456.78', type: 'car', seats: 5, status: 'pending_review', inspectionExpiry: '—', registeredAt: '13/09/2026' },
  { id: 'veh_1009', ownerName: 'Quốc Huy', model: 'Honda City', plate: '51G-119.02', type: 'car', seats: 4, status: 'verified', inspectionExpiry: '20/09/2026', registeredAt: '14/05/2024', expiringSoon: true },
];

// ---------------------------------------------------------------------------
// Trips
// ---------------------------------------------------------------------------
export const ADMIN_TRIPS = [
  { id: 'trip_9001', code: '#RS-77120', driverName: 'Nguyễn Đình Khoa', route: 'FPT University HCMC → Chợ Bến Thành, Q.1', date: '14/09/2026', time: '07:00', seatsTotal: 4, seatsBooked: 3, overlapPct: 94, status: 'ongoing', costPerKm: 5000, distanceKm: 18.5 },
  { id: 'trip_9002', code: '#RS-77098', driverName: 'Trần Thị Bích Hằng', route: 'Phú Mỹ Hưng, Q.7 → Landmark 81, Bình Thạnh', date: '14/09/2026', time: '07:15', seatsTotal: 4, seatsBooked: 4, overlapPct: 88, status: 'ongoing', costPerKm: 5200, distanceKm: 15.2 },
  { id: 'trip_9003', code: '#RS-76980', driverName: 'Hoàng Anh Tùng', route: 'FPT University HCMC → Landmark 81, Bình Thạnh', date: '13/09/2026', time: '07:45', seatsTotal: 5, seatsBooked: 3, overlapPct: 82, status: 'completed', costPerKm: 4500, distanceKm: 14.2 },
  { id: 'trip_9004', code: '#RS-76955', driverName: 'Nguyễn Minh Quân', route: 'Quận 1 → Khu Công Nghệ Cao, Thủ Đức', date: '13/09/2026', time: '17:30', seatsTotal: 4, seatsBooked: 2, overlapPct: 76, status: 'completed', costPerKm: 5000, distanceKm: 19.0 },
  { id: 'trip_9005', code: '#RS-76890', driverName: 'Lý Hoàng Việt', route: 'Bình Thạnh → Chợ Bến Thành, Q.1', date: '13/09/2026', time: '08:00', seatsTotal: 5, seatsBooked: 0, overlapPct: 0, status: 'cancelled', costPerKm: 4800, distanceKm: 9.8, cancelReason: 'Tài xế báo bận đột xuất' },
  { id: 'trip_9006', code: '#RS-77205', driverName: 'Nguyễn Đình Khoa', route: 'FPT University HCMC → Chợ Bến Thành, Q.1', date: '15/09/2026', time: '07:00', seatsTotal: 4, seatsBooked: 1, overlapPct: 94, status: 'scheduled', costPerKm: 5000, distanceKm: 18.5 },
  { id: 'trip_9007', code: '#RS-77188', driverName: 'Đặng Hồng Sơn', route: 'Quận 7 → Quận 1', date: '15/09/2026', time: '07:20', seatsTotal: 5, seatsBooked: 0, overlapPct: 0, status: 'scheduled', costPerKm: 5100, distanceKm: 11.4 },
  { id: 'trip_9008', code: '#RS-76812', driverName: 'Trần Thị Bích Hằng', route: 'Phú Mỹ Hưng, Q.7 → Landmark 81, Bình Thạnh', date: '12/09/2026', time: '07:15', seatsTotal: 4, seatsBooked: 4, overlapPct: 90, status: 'completed', costPerKm: 5200, distanceKm: 15.2 },
  { id: 'trip_9009', code: '#RS-76740', driverName: 'Vương Bảo Long', route: 'Thủ Đức → Quận 3', date: '11/09/2026', time: '06:50', seatsTotal: 5, seatsBooked: 2, overlapPct: 71, status: 'completed', costPerKm: 4700, distanceKm: 12.6 },
  { id: 'trip_9010', code: '#RS-76701', driverName: 'Hoàng Anh Tùng', route: 'FPT University HCMC → Landmark 81, Bình Thạnh', date: '11/09/2026', time: '07:45', seatsTotal: 5, seatsBooked: 0, overlapPct: 0, status: 'cancelled', costPerKm: 4500, distanceKm: 14.2, cancelReason: 'Không đủ hành khách trùng tuyến' },
];

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------
export const ADMIN_BOOKINGS = [
  { id: 'bk_5001', code: '#RS-4821', tripCode: '#RS-77120', passengerName: 'Nguyễn Minh Anh', driverName: 'Nguyễn Đình Khoa', route: 'FPT University → Chợ Bến Thành', fareVnd: 45000, status: 'confirmed', createdAt: '14/09 · 06:48' },
  { id: 'bk_5002', code: '#RS-7719', tripCode: '#RS-77120', passengerName: 'Phạm Thu Thảo', driverName: 'Nguyễn Đình Khoa', route: 'Ngã 4 Thủ Đức → Hàng Xanh', fareVnd: 35000, status: 'confirmed', createdAt: '14/09 · 06:52' },
  { id: 'bk_5003', code: '#RS-3190', tripCode: '#RS-77098', passengerName: 'Đỗ Gia Bảo', driverName: 'Trần Thị Bích Hằng', route: 'Phú Mỹ Hưng → Landmark 81', fareVnd: 42000, status: 'pending', createdAt: '14/09 · 06:59' },
  { id: 'bk_5004', code: '#RS-1842', tripCode: '#RS-76980', passengerName: 'Bùi Thanh Trúc', driverName: 'Hoàng Anh Tùng', route: 'Cổng ĐH FPT → Landmark 81', fareVnd: 40000, status: 'completed', createdAt: '13/09 · 07:20' },
  { id: 'bk_5005', code: '#RS-2290', tripCode: '#RS-76890', passengerName: 'Vũ Thị Kim Ngân', driverName: 'Lý Hoàng Việt', route: 'Bình Thạnh → Bến Thành', fareVnd: 38000, status: 'rejected', createdAt: '13/09 · 07:35', rejectReason: 'Tài xế huỷ chuyến trước giờ khởi hành' },
  { id: 'bk_5006', code: '#RS-9012', tripCode: '#RS-77205', passengerName: 'Nguyễn Minh Anh', driverName: 'Nguyễn Đình Khoa', route: 'FPT University → Chợ Bến Thành', fareVnd: 45000, status: 'pending', createdAt: '14/09 · 21:10' },
  { id: 'bk_5007', code: '#RS-5567', tripCode: '#RS-76812', passengerName: 'Đỗ Gia Bảo', driverName: 'Trần Thị Bích Hằng', route: 'Phú Mỹ Hưng → Landmark 81', fareVnd: 42000, status: 'completed', createdAt: '12/09 · 06:50' },
  { id: 'bk_5008', code: '#RS-6634', tripCode: '#RS-76740', passengerName: 'Bùi Thanh Trúc', driverName: 'Vương Bảo Long', route: 'Thủ Đức → Quận 3', fareVnd: 30000, status: 'completed', createdAt: '11/09 · 06:40' },
];

// ---------------------------------------------------------------------------
// Safety reports
// ---------------------------------------------------------------------------
export const ADMIN_SAFETY_REPORTS = [
  { id: 'SF-2026-0102', tripCode: '#RS-77120', category: 'Lái xe không an toàn', severity: 'high', status: 'open', reporterRole: 'passenger', reporterName: 'Nguyễn Minh Anh', targetName: 'Nguyễn Đình Khoa', createdAt: '14/09 · 07:22', description: 'Xe vượt đèn đỏ tại giao lộ Thủ Đức, hành khách yêu cầu dừng xe an toàn.' },
  { id: 'SF-2026-0101', tripCode: '#RS-77098', category: 'SOS khẩn cấp', severity: 'critical', status: 'investigating', reporterRole: 'passenger', reporterName: 'Đỗ Gia Bảo', targetName: 'Trần Thị Bích Hằng', createdAt: '14/09 · 06:40', description: 'Hành khách kích hoạt nút SOS giữa hành trình, đội an toàn đã liên hệ xác minh.' },
  { id: 'SF-2026-0100', tripCode: '#RS-76980', category: 'Hành vi không phù hợp', severity: 'medium', status: 'open', reporterRole: 'passenger', reporterName: 'Bùi Thanh Trúc', targetName: 'Hoàng Anh Tùng', createdAt: '13/09 · 08:05', description: 'Hành khách phản ánh thái độ giao tiếp thiếu tôn trọng trong chuyến đi.' },
  { id: 'SF-2026-0099', tripCode: '#RS-76890', category: 'Huỷ chuyến đột xuất', severity: 'low', status: 'open', reporterRole: 'passenger', reporterName: 'Vũ Thị Kim Ngân', targetName: 'Lý Hoàng Việt', createdAt: '13/09 · 07:50', description: 'Tài xế huỷ chuyến 10 phút trước giờ đón mà không báo trước.' },
  { id: 'SF-2026-0098', tripCode: '#RS-76701', category: 'Tính phí sai quy tắc', severity: 'high', status: 'open', reporterRole: 'passenger', reporterName: 'Phạm Thu Thảo', targetName: 'Hoàng Anh Tùng', createdAt: '12/09 · 18:22', description: 'Hành khách cho rằng khoản đóng góp vượt khung chi phí công bố trên chuyến.' },
  { id: 'SF-2026-0097', tripCode: '#RS-76740', category: 'Phương tiện không đúng đăng ký', severity: 'medium', status: 'open', reporterRole: 'passenger', reporterName: 'Bùi Thanh Trúc', targetName: 'Vương Bảo Long', createdAt: '12/09 · 07:02', description: 'Xe thực tế khác biển số/đời xe so với thông tin đã đăng ký trên hệ thống.' },
  { id: 'SF-2026-0096', tripCode: '#RS-76890', category: 'Lái xe không an toàn', severity: 'medium', status: 'open', reporterRole: 'passenger', reporterName: 'Đỗ Gia Bảo', targetName: 'Lý Hoàng Việt', createdAt: '11/09 · 17:40', description: 'Phóng nhanh, phanh gấp nhiều lần khiến hành khách lo lắng.' },
  { id: 'SF-2026-0091', tripCode: '#RS-76500', category: 'Hành vi không phù hợp', severity: 'low', status: 'resolved', reporterRole: 'driver', reporterName: 'Nguyễn Minh Quân', targetName: 'Lê Văn Phúc', createdAt: '10/09 · 12:15', resolvedAt: '13/09 · 11:30', description: 'Hành khách hút thuốc trong xe dù đã được nhắc nhở.', resolutionNote: 'Đã cảnh cáo và tạm khoá tài khoản hành khách 7 ngày.' },
  { id: 'SF-2026-0088', tripCode: '#RS-76320', category: 'SOS khẩn cấp', severity: 'critical', status: 'resolved', reporterRole: 'passenger', reporterName: 'Bùi Thanh Trúc', targetName: 'Phan Đức Thịnh', createdAt: '08/09 · 21:05', resolvedAt: '09/09 · 09:00', description: 'Nghi vấn tài xế đi sai lộ trình đã xác nhận, sau xác minh là do kẹt xe.', resolutionNote: 'Xác minh qua định vị GPS — không có sai phạm, đã đóng báo cáo.' },
];

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
export const ADMIN_REVIEWS = [
  { id: 'rv_01', tripCode: '#RS-76980', authorName: 'Bùi Thanh Trúc', authorRole: 'passenger', targetName: 'Hoàng Anh Tùng', rating: 1, comment: 'Tài xế nói chuyện khó nghe, sẽ không đi lại.', createdAt: '13/09 · 08:30', flagged: true, status: 'pending' },
  { id: 'rv_02', tripCode: '#RS-76812', authorName: 'Đỗ Gia Bảo', authorRole: 'passenger', targetName: 'Trần Thị Bích Hằng', rating: 5, comment: 'Chị lái xe rất an toàn và đúng giờ, xe sạch sẽ.', createdAt: '12/09 · 07:40', flagged: false, status: 'published' },
  { id: 'rv_03', tripCode: '#RS-76740', authorName: 'Vương Bảo Long', authorRole: 'driver', targetName: 'Bùi Thanh Trúc', rating: 4, comment: 'Hành khách đúng giờ, dễ chịu.', createdAt: '11/09 · 07:10', flagged: false, status: 'published' },
  { id: 'rv_04', tripCode: '#RS-76701', authorName: 'Phạm Thu Thảo', authorRole: 'passenger', targetName: 'Hoàng Anh Tùng', rating: 2, comment: 'Thu thêm phí ngoài dự tính so với ứng dụng hiển thị.', createdAt: '11/09 · 08:00', flagged: true, status: 'pending' },
  { id: 'rv_05', tripCode: '#RS-76500', authorName: 'Nguyễn Minh Quân', authorRole: 'driver', targetName: 'Lê Văn Phúc', rating: 1, comment: 'Hành khách hút thuốc trong xe dù đã nhắc nhở.', createdAt: '10/09 · 12:20', flagged: true, status: 'reviewed' },
  { id: 'rv_06', tripCode: '#RS-76320', authorName: 'Bùi Thanh Trúc', authorRole: 'passenger', targetName: 'Phan Đức Thịnh', rating: 3, comment: 'Đi hơi vòng nhưng tài xế giải thích rõ do kẹt xe.', createdAt: '09/09 · 09:15', flagged: false, status: 'published' },
  { id: 'rv_07', tripCode: '#RS-76100', authorName: 'Nguyễn Minh Anh', authorRole: 'passenger', targetName: 'Nguyễn Đình Khoa', rating: 5, comment: 'Anh tài xế thân thiện, chạy đúng giờ, rất recommend!', createdAt: '07/09 · 07:05', flagged: false, status: 'published' },
];

// ---------------------------------------------------------------------------
// Cost rules
// ---------------------------------------------------------------------------
export const ADMIN_COST_RULE_CONFIG = {
  minRatePerKm: 3000,
  maxRatePerKm: 7000,
  defaultRatePerKm: 5000,
  tollPassThrough: true,
  wearAndTearPct: 15,
  platformFeePct: 0,
  regions: [
    { id: 'rg_01', name: 'TP. Hồ Chí Minh', minRate: 3000, maxRate: 7000, status: 'active' },
    { id: 'rg_02', name: 'Hà Nội', minRate: 3200, maxRate: 7200, status: 'active' },
    { id: 'rg_03', name: 'Đà Nẵng', minRate: 2800, maxRate: 6500, status: 'active' },
    { id: 'rg_04', name: 'Cần Thơ', minRate: 2600, maxRate: 6000, status: 'draft' },
  ],
};

export const ADMIN_COST_RULE_HISTORY = [
  { id: 'crh_01', change: 'Nâng trần đơn giá TP.HCM từ 6.500đ → 7.000đ/km', actor: 'Trần Công Tâm', timestamp: new Date('2026-09-13T16:05:00') },
  { id: 'crh_02', change: 'Thêm khu vực Cần Thơ (bản nháp, chưa kích hoạt)', actor: 'Ngọc Bích', timestamp: new Date('2026-09-10T09:20:00') },
  { id: 'crh_03', change: 'Điều chỉnh tỉ lệ hao mòn xe từ 12% → 15% chi phí', actor: 'Trần Công Tâm', timestamp: new Date('2026-08-28T14:00:00') },
  { id: 'crh_04', change: 'Khởi tạo khung chi phí mặc định cho 3 khu vực', actor: 'Minh Quân', timestamp: new Date('2026-06-01T10:00:00') },
];

// ---------------------------------------------------------------------------
// Notifications (admin's own operational inbox)
// ---------------------------------------------------------------------------
export const ADMIN_NOTIFICATIONS = [
  { id: 'ntf_01', title: 'Báo cáo SOS khẩn cấp mới', body: 'Chuyến #RS-77098 — hành khách Đỗ Gia Bảo vừa kích hoạt SOS.', time: '6 phút trước', unread: true, tone: 'danger' },
  { id: 'ntf_02', title: 'Hồ sơ KYC cần duyệt', body: 'Tài xế Vương Bảo Long vừa nộp hồ sơ GPLX & CCCD.', time: '25 phút trước', unread: true, tone: 'warning' },
  { id: 'ntf_03', title: 'Đánh giá 1★ bị gắn cờ', body: 'Đánh giá trên chuyến #RS-76980 cần được kiểm duyệt.', time: '40 phút trước', unread: true, tone: 'warning' },
  { id: 'ntf_04', title: 'Đã xử lý báo cáo an toàn', body: 'SF-2026-0091 đã được đóng bởi Ngọc Bích.', time: '3 giờ trước', unread: false, tone: 'success' },
  { id: 'ntf_05', title: 'Cập nhật quy tắc chi phí thành công', body: 'Khung đơn giá TP.HCM đã áp dụng cho các chuyến mới.', time: 'Hôm qua · 16:05', unread: false, tone: 'neutral' },
  { id: 'ntf_06', title: 'Phương tiện sắp hết hạn đăng kiểm', body: 'Xe 51G-119.•• (Quốc Huy) hết hạn đăng kiểm trong 5 ngày.', time: 'Hôm qua · 09:00', unread: false, tone: 'warning' },
];
