# RouteShare Mobile App — Architecture & Design System Summary

## 1. Project Overview
**RouteShare** is an urban carpooling mobile application designed for Vietnam, built using **React 18 + Vite + Tailwind CSS + Lucide Icons**. It implements the exact minimalist aesthetic, 8px grid system, typography, and micro-animations defined in the `@html` prototype directory.

The application runs inside a responsive phone mockup (`MobileFrame`: 410×864px outer bezel, 390×844px inner viewport) featuring interactive role switching between **Passenger** and **Driver**, a 5-scenario demo switcher for graduation capstone presentations, demo state reset, and a full back-office **Admin Portal** (`/admin`).

---

## 2. Design System & Tokens

| Token | Value | Purpose |
|---|---|---|
| `color/primary` | `#0F9D76` | Primary action buttons, active tab indicators, price highlights |
| `color/primary-deep` | `#0B7A5C` | High-contrast headers, deep brand text, pressed states |
| `color/primary-soft` | `#DDF3EA` | Soft badges, initial avatar circles (`border: #B2E2D0`) |
| `color/primary-tint` | `#F1FAF6` | Card selection and hover backgrounds |
| `color/accent` | `#EE7A22` | Destination square pins, pending warnings, alert badges |
| `color/text-primary`| `#101B17` | High-emphasis body and title text |
| `color/text-secondary`| `#4B5A54` | Subtitles, descriptions, secondary values |
| `color/text-tertiary`| `#8A9993` | Placeholders, captions, timestamps |
| `color/border` | `#E4EAE7` / `#EEF2F0` | Crisp container borders and divider lines |
| `color/canvas` | `#F4F7F5` | Off-white background canvas |
| `color/danger` | `#C22B35` | Emergency SOS button and cancellation actions |

### Typography, Icons & Conventions:
### Typography, Icons & Conventions:
- **Headings & Body**: `Be Vietnam Pro` (300, 400, 500, 600, 700) with anti-aliasing and optimized text rendering.
- **Monospace & Numbers**: `IBM Plex Mono` (400, 500, 600, 700) for prices (`35.000 ₫`), license plates, and metrics.
- **Layout & Sizing**: Standardized 8px grid system, single-layer scrolling containers, explicit `min-w-0` and truncation handling to prevent horizontal overflows.
- **Quy tắc Nghiêm ngặt về Icon AI / Nhãn AI**: **TUYỆT ĐỐI KHÔNG SỬ DỤNG icon AI (như Sparkles / lấp lánh) hoặc gắn nhãn "AI" trong toàn bộ project**. Mô hình RouteShare là carpooling thuần túy chia sẻ chi phí dựa trên thuật toán ghép tuyến và định vị hành trình thực tế.
- **Quy tắc Nghiêm ngặt về Mã PIN Đón Xe**: **ĐÃ XÓA TOÀN BỘ mã PIN đón xe** trên toàn bộ các màn hình (BoardingPIN, BoardingVerify, Live Tracking, Trip Detail, Search Results, Confirmation). Quá trình đón xe được xác thực trực tiếp giữa Tài xế và Hành khách thông qua **Tên và Số điện thoại** hiển thị rõ ràng trên chi tiết chuyến đi, không cần mã PIN.
- **Hệ thống Bản đồ Đồng bộ Duy nhất (Master Map Component - `src/components/AppMap.jsx`)**:
  - Toàn bộ hệ thống RouteShare sử dụng duy nhất một **Master Component `AppMap.jsx`** tích hợp **Mapbox GL (`mapbox-gl`)** và GeoJSON route rendering thực tế (với fallback vector chuẩn).
  - Cấu hình qua biến môi trường `VITE_MAPBOX_TOKEN` trong `.env`.
  - Hỗ trợ **4 chế độ linh hoạt (`mode`)**:
    1. `preview`: Bản đồ thẻ xem trước tuyến đường (dùng trong `RouteMapPreview.jsx`, `TripDetailView.jsx`, `TripDetail.jsx`, `RoutePreview.jsx`, `CreateTrip.jsx`).
    2. `backdrop`: Bản đồ toàn màn hình làm nền tĩnh/tương tác nhẹ phía sau bottom sheet (dùng trong `SearchResults.jsx`).
    3. `live`: Bản đồ theo dõi trực tiếp với xe di chuyển định vị GPS, sóng radar tỏa ra (`animate-ping`) và thanh tiến trình lộ trình (dùng trong `LiveRouteMap.jsx`, `PassengerLiveTracking.jsx`, `LiveTracking.jsx`).
    4. `picker`: Bản đồ tương tác chọn điểm đón an toàn (Safe Pickup Points) với radar vòng an toàn, badge `✓ An toàn`, và callback `onSelectStop` (dùng trong `PickupPicker.jsx`).
  - **Quy chuẩn Đồ họa Bản đồ Đô thị TP.HCM**:
    - **Tọa độ thực tế**: Hành lang phía Đông TP.HCM (Thủ Đức / Suối Tiên $\rightarrow$ Xa lộ Hà Nội $\rightarrow$ Cầu Sài Gòn $\rightarrow$ Mai Chí Thọ $\rightarrow$ Hầm Thủ Thiêm $\rightarrow$ Bến Thành, Q.1) và khu vực Phú Mỹ Hưng, Q.7.
    - **Đường polyline lộ trình**: Màu xanh ngọc thương hiệu `#0F9D76` (nét 3.5-4px) kèm viền sáng mềm bên dưới `#BDE7D5`.
    - **Marker điểm dừng (Waypoints)**: Điểm đón / Xuất phát = 🟢 Hình tròn xanh ngọc `#0F9D76` (label: `Đón [Tên Khách] · [Tên Trạm]`), Điểm trả / Kết thúc = 🟧 Hình vuông cam `#EE7A22` (label: `Trả [Tên Khách] · [Tên Trạm]`).
    - **Marker Trạm An toàn**: 🛡️ Pin xanh lục kèm vòng radar hào quang và badge `✓ An toàn`.
    - **Backward Compatibility**: `RouteMapPreview.jsx` và `LiveRouteMap.jsx` được tinh gọn thành các wrapper chuẩn gọi trực tiếp `AppMap` với `mode="preview"` và `mode="live"`, đảm bảo tương thích 100% cho toàn bộ project.

---

## 3. Architecture & State Management

State is centrally managed via `src/context/AppContext.jsx` and backed by `src/data/mockData.js`:
- **Authentication & Roles**: Seamless switching between `passenger` and `driver` modes with persistent profile and vehicle state.
- **Passenger Commute Search Flow**:
  - **Trang Chủ Hành Khách Tinh Gọn (`PassengerHome.jsx`)**: Header avatar, số dư ví RouteShare, form tìm kiếm lộ trình trực quan (`[ 🔵 Điểm đón ]`, `[ 🟠 Điểm đến ]`, ngày/giờ, số người đi cùng với stepper `- 1 +`, nút CTA lớn *"Tìm chuyến đi phù hợp"*), thẻ insight mật độ tuyến. **Đã loại bỏ hoàn toàn phần "Chuyến gợi ý tốt nhất"** để giao diện trang chủ gọn gàng, tập trung tối đa vào luồng tìm chuyến.
  - **Trang Nhập Điểm Đón & Điểm Đến Tinh Gọn (`DestinationSearch.jsx`)**: Khi bấm vào ô "Điểm đón" hoặc "Điểm đến" tại `PassengerHome`, chuyển trực tiếp sang trang tìm kiếm `/passenger/destination-search`. Giao diện tinh gọn với 2 ô nhập: `[ 🔵 Nhập điểm đón ]` và `[ 🟡 Nhập điểm đến ]` cùng nút đảo chiều `⇅` và nút "Tìm chuyến đi phù hợp" (loại bỏ hoàn toàn các tag gợi ý thừa và lịch sử gần đây).
  - **Trang Kết Quả Tìm Chuyến Trực Quan Kèm Bản Đồ & Bottom Sheet Co Giãn (`SearchResults.jsx`)**:
    - **Header & Thanh tìm kiếm nổi**: Logo RouteShare, nút quay lại, thẻ lộ trình nổi 2 điểm (`🔵 Điểm đón`, `🟡 Điểm đến`) kèm nút đảo chiều `⇅`.
    - **Bản đồ nền phía trên**: Trực quan hóa tuyến đường của hành khách (polyline xanh ngọc) trên nền bản đồ đô thị thực tế TP.HCM (Sông Sài Gòn, QL52, Mai Chí Thọ) cùng nút định vị GPS.
    - **Bottom Sheet danh sách chuyến đi vuốt linh hoạt**:
      - *Mặc định (Nửa màn hình ~50%)*: Bản đồ lộ trình hiển thị rõ ở nửa trên; nửa dưới hiển thị thanh kéo, tab lọc nhanh (`✨ Phù hợp nhất`, `📍 Gần điểm đón`, `Giá thấp`, `Khởi hành sớm`) và danh sách các chuyến đi.
      - *Vuốt lên / Chạm thanh kéo*: Mở rộng toàn màn hình (`full-height`) để lướt xem danh sách chuyến đi chi tiết.
      - *Vuốt xuống / Chạm lại thanh kéo*: Thu gọn về nửa màn hình để quan sát bản đồ.
      - *Thẻ chuyến đi tinh gọn*: Tên tài xế, avatar, tích xanh xác minh, đánh giá sao, dòng xe & chỗ trống, giờ khởi hành, độ lệch tuyến, giá chia sẻ mỗi người, điểm đón thực tế và nút xem chi tiết chuyến.
- **Driver Fleet Management (`KYCVerify.jsx`)**: 
  - Quản lý tối đa 3 phương tiện (Ô tô 4/5/7 chỗ & Xe máy 2 chỗ).
  - Tinh gọn giao diện với 2 icon: ✏️ Sửa và 🗑️ Xóa.
  - **Center Modal Popup**: Form Thêm & Sửa xe nổi ở giữa màn hình với tải ảnh Cà vẹt xe (Cavet).
- **Commute Lifecycle & Multi-waypoint Builder**: 
  - Tạo chuyến đi lẻ hoặc lịch trình định kỳ (Thứ 2 – Thứ 6 theo giờ làm).
  - Bộ tạo lộ trình đa điểm (Điểm xuất phát $\rightarrow$ Các trạm đón dọc tuyến $\rightarrow$ Điểm kết thúc).
- **Dynamic Pricing & 2-Way Wishlist System**:
  - Driver tự quyết định đơn giá (`3.000 – 7.000 ₫/km`) dựa trên gợi ý từ Admin.
  - Cấu hình giảm giá riêng cho **Wishlist khách quen** (Nhập % tùy ý từ 0-100%).
  - **Danh sách Yêu thích 2 chiều (2-Way Silent Wishlist)**:
    - Cả Tài xế và Hành khách đều có thể bấm icon Trái tim (❤️) một cách kín đáo tại Search Results, Chat, Trip Detail để lưu đối phương vào Wishlist.
    - Mặc định danh sách là rỗng (`[]`) để thuận tiện demo thao tác thêm/xóa trong quá trình thuyết trình.
    - Trang `/shared/wishlist` mang tên thống nhất **"Danh sách yêu thích"**, tự động hiển thị danh sách tương ứng theo vai trò (Tài xế chỉ thấy Khách quen; Hành khách chỉ thấy Tài xế quen, không dùng tab kép).
    - Thẻ từng người trang bị nút **"Nhắn tin"** và **"Lịch sử"** (dẫn đến `/shared/trip-history` để xem các chuyến đã đi cùng nhau).
    - Thẻ thống kê tinh gọn: chỉ hiển thị số lượng người đang theo dõi (`Đang lưu X người`).
  - Tiền khách trả = `Km thực tế khách đi × Đơn giá/km`.
- **Trang Chi tiết Chuyến đi Toàn màn hình (`TripDetailView.jsx`) & Giảm giá Trực tiếp**:
  - Thay thế modal nhỏ cũ bằng trang fullscreen chuyên biệt cho cả 2 vai trò (`/shared/trip-detail/:id`).
  - **Driver View**: Xem toàn bộ lộ trình đa điểm của các hành khách, danh sách hành khách chi tiết, thao tác **Giảm giá Trực tiếp** (biểu tượng `%`) cho từng hành khách theo % hoặc số tiền ₫ cụ thể (kèm cảnh báo rõ ràng: *"Bạn sẽ chịu phần phí chênh lệch của Khách hàng"*), nút Bắt đầu chuyến đi / Hủy chuyến / Đổi lịch.
  - **Passenger View**: Điểm đón/trả cá nhân, lộ trình trực quan, hồ sơ tài xế, bảng bóc tách chi phí, nút Chat / Gọi điện / Hủy chuyến / Báo cáo và Lưu tài xế yêu thích.
- **Interactive SVG Mapping & In-Trip Live Flow (`LiveTracking.jsx`, `LiveRouteMap.jsx`)**:
  - Polyline lộ trình chủ xe kết hợp tô sáng chặng khách đi (User Leg).
  - Checkpoint đón Khách 1 & Khách 2.
  - **Dịch vụ Tự động Hoàn tiền (Dynamic Refund)**: Khi đón thêm Khách 2 dọc đường, hệ thống tự động tính lại chi phí chia sẻ và hoàn tiền thừa về ví cho Khách 1 kèm pop-up chúc mừng.
- **An toàn, SOS & Xử lý Vắng mặt (No-Show)**:
  - Bật/Tắt định vị GPS Live.
  - Nút SOS khẩn cấp kết nối Cảnh sát 113 và gửi tọa độ cho người thân.
  - Báo cáo vắng mặt (No-show), trừ điểm uy tín và chuyển minh chứng cho Admin.
- **Báo cáo Phân bổ Tài chính 3 bên (`TripComplete.jsx`)**:
  - Khách tiết kiệm ~65% so với taxi, Tài xế bù tiền xăng, Nền tảng miễn phí Giai đoạn 1 (0% Fee) hoặc thu phí Giai đoạn 2.

---

## 4. Route & Screen Matrix

```
/
├── auth/login                        # Phone + OTP verification flow
├── profile                           # User profile, verified badges, wallet link & Wishlist
├── wallet                            # Wallet balance & transaction history
│   └── top-up                        # VietQR / PayOS simulated payment gateway
│
├── passenger/
│   ├── home                          # Passenger Home (Search commute with - 1 + stepper, active trips)
│   ├── destination-search            # Pure 2-Input Destination & Pickup Search Page
│   ├── results                       # Compact Search Results (Fits 2-3 cards/screen, Wishlist toggle)
│   ├── pickup-picker                 # Safe Pickup Location Picker on interactive map
│   ├── trip/:id                      # Trip Detail, Itinerary & Booking action
│   ├── trip-detail/:id               # Dedicated Fullscreen Trip Detail View
│   ├── request-booking/:id           # Seat Count & Notes to Driver
│   ├── booking-pending/:id           # Live Radar Hero & Approval waiting
│   ├── booking-confirm/:id           # Confirmation Celebration
│   ├── live-tracking                 # Real-time GPS Tracking with Driver & Dynamic Refund
│   ├── history                       # Passenger Trip History & Details
│   ├── wishlist                      # 2-Tab Wishlist Management (Drivers & Passengers)
│   ├── cost-history                  # Cost Contribution Ledger
│   ├── messages                      # Passenger In-app Conversations
│   └── notifications                 # Passenger Notification Center
│
├── driver/
│   ├── home                          # Driver Home (Quick Publish, Single Unified "Chi tiết & Lộ trình" CTA & Requests summary)
│   ├── create-trip                   # Commute Wizard (Single & Recurring, Custom % Wishlist Discount)
│   ├── requests                      # Booking Requests with Detour Decision Pairs
│   ├── approval                      # Accept Passenger Sheet (Before/After comparison)
│   ├── active-trip                   # Multi-passenger GPS Navigation & Dynamic Refund
│   ├── kyc                           # CCCD & GPLX Vehicle Profile (Center Modal & Edit/Delete)
│   ├── history                       # Driver Trip History & Earnings
│   ├── wishlist                      # 2-Tab Wishlist Management (Drivers & Passengers)
│   ├── cost-history                  # Driver Earnings & Payout Records
│   ├── messages                      # Driver In-app Conversations
│   └── notifications                 # Driver Notification Center
│
├── shared/
│   ├── trip-detail/:id               # Fullscreen Trip Details (Role-adaptive Driver/Passenger views)
│   ├── wishlist                      # Role-adaptive Danh sách yêu thích
│   ├── trip-history                  # Trip History with Filter Tabs & Detail Navigation
│   ├── cost-breakdown                # Transparent 3-Step Cost Calculation Breakdown
│   ├── cost-history                  # Financial Ledger (Earnings / Contributions)
│   ├── chat/:id                      # In-Trip Driver-Passenger Chat Stream with Wishlist toggle
│   ├── live-tracking                 # Active GPS Map Tracking with SOS Modal & Dynamic Refund
│   ├── trip-complete                 # 3-Party Economic Settlement, Ratings & Compliments
│   ├── schedule                      # Recurring Weekly Commute Scheduler
│   ├── messages                      # In-app Conversation List
│   └── notifications                 # System & Activity Notifications
│
└── admin/                            # Web Back-Office Admin Portal
    ├── overview                      # Platform Metrics & Key Trends
    ├── users                         # User Account & Role Management
    ├── drivers                       # Driver Verification & KYC Approvals
    ├── vehicles                      # Vehicle Fleet & Cavet Approvals
    ├── trips                         # All Platform Trips & Active Monitoring
    ├── bookings                      # Booking Status & Detour Audits
    ├── cost-rules                    # Dynamic Pricing & Rate Boundaries (Phase 1 & 2)
    ├── safety-reports                # Incident Reports & Safety Escalations (SF-21/22)
    ├── reviews                       # Trip Ratings & Driver Feedback
    ├── notifications                 # Broadcast Announcements
    └── settings                      # System Configurations
```

---

## 5. Build & Verification
- **Development**: `npm run dev`
- **Production Bundle**: `npm run build` (Verified zero errors; Vite production build passing cleanly).

