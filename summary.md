# RouteShare Mobile App — Architecture & Design System Summary

## 1. Project Overview
**RouteShare** is an urban carpooling mobile application designed for Vietnam, built using **React 18 + Vite + Tailwind CSS + Lucide Icons**. It implements the exact minimalist aesthetic, 8px grid system, typography, and micro-animations defined in the `@html` prototype directory.

The application runs inside a responsive phone mockup (`MobileFrame`: 410×864px outer bezel, 390×844px inner viewport) featuring interactive role switching between **Passenger** and **Driver** and a screen navigation jumper.

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

### Typography:
- **Headings & Body**: `Be Vietnam Pro` (300, 400, 500, 600, 700) with anti-aliasing and optimized text rendering.
- **Monospace & Numbers**: `IBM Plex Mono` (400, 500, 600, 700) for prices (`35.000 ₫`), PINs (`4821`), license plates, and metrics.
- **Layout & Sizing**: Standardized 8px grid system, single-layer scrolling containers, explicit `min-w-0` and truncation handling to prevent horizontal overflows.

---

## 3. Architecture & State Management

State is centrally managed via `src/context/AppContext.jsx` and backed by `src/data/mockData.js`:
- **Authentication & Roles**: Seamless switching between `passenger` and `driver` modes with persistent profile and vehicle state.
- **Driver Fleet Management**: Support up to 3 vehicles (cars & motorbikes) with Cavet upload/verification, active vehicle toggle, and vehicle deletion.
- **Commute Lifecycle**: Full state transitions from trip creation $\rightarrow$ search $\rightarrow$ booking request with parent trip context $\rightarrow$ driver detour approval & dynamic seat occupancy (1/3 confirmed passengers, 2 empty seats) $\rightarrow$ active GPS tracking $\rightarrow$ boarding PIN verification $\rightarrow$ trip settlement & rating.
- **Financial Balances**: Real-time driver and passenger wallets with VietQR / PayOS mock top-up.
- **Dynamic Pricing Model (Rate/km × Actual Passenger Distance)**:
  - Driver configures customizable `ratePerKm` during trip creation (within admin boundary `3.000 – 7.000 ₫/km`).
  - Passenger fare is dynamically calculated: `Số km thực tế khách đi × ratePerKm × số ghế`, ensuring fairness regardless of the driver's full route length.
- **In-trip Communications**: Real-time driver-passenger messaging stream with quick replies and GPS coordinate sharing.

---

## 4. Route & Screen Matrix

```
/
├── auth/login                        # Phone + OTP verification flow
├── profile                           # User profile, verified badges & wallet link
├── wallet                            # Wallet balance & transaction history
│   └── top-up                        # VietQR / PayOS simulated payment gateway
│
├── passenger/
│   ├── home                          # Passenger Home (Search commute & active trips)
│   ├── results                       # Trip Search Results (Overlap % & sorting)
│   ├── pickup-picker                 # Safe Pickup Location Picker on interactive map
│   ├── trip/:id                      # Trip Detail & Itinerary Timeline
│   ├── request-booking/:id           # Seat Count & Notes to Driver
│   ├── booking-pending/:id           # Live Radar Hero & Approval waiting
│   ├── booking-confirm/:id           # Confirmation Celebration & PIN Code
│   └── live-tracking                 # Real-time GPS Tracking with Driver
│
├── driver/
│   ├── home                          # Driver Home (Quick Publish & Requests summary)
│   ├── create-trip                   # 6-Step Commute Creation Wizard
│   ├── requests                      # Booking Requests with Detour Decision Pairs
│   ├── approval                      # Accept Passenger Sheet (Before/After comparison)
│   ├── route-preview                 # Full route map preview
│   ├── active-trip                   # 4-Phase Active Trip Navigation & Boarding
│   └── kyc                           # CCCD & GPLX Vehicle Profile Verification
│
└── shared/
    ├── trip-history                  # Trip History with Filter Tabs & Itinerary Modal
    ├── cost-breakdown                # Transparent 3-Step Cost Calculation Breakdown
    ├── chat/:id                      # In-Trip Driver-Passenger Chat Stream
    ├── boarding-pin                  # 4-Digit Boarding PIN Verification Keypad
    ├── live-tracking                 # Active GPS Map Tracking with SOS Modal
    ├── trip-complete                 # Rating, Compliment Chips & Settlement
    └── schedule                      # Recurring Weekly Commute Scheduler
```

---

## 5. Build & Verification
- **Development**: `npm run dev`
- **Production Bundle**: `npm run build` (Verified zero errors; Vite v8 production build passing cleanly).
