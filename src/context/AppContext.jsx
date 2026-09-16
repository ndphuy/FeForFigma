import React, { createContext, useContext, useState } from 'react';
import {
  MOCK_USER_PROFILES,
  INITIAL_TRIPS,
  INITIAL_BOOKINGS,
  INITIAL_MESSAGES,
  MOCK_DRIVER_SCHEDULES,
  MOCK_PASSENGER_SCHEDULES,
  RECURRING_SCHEDULE_PRESETS,
  MOCK_WALLET_TRANSACTIONS,
  MOCK_PICKUP_POINTS,
  MOCK_DRIVER_VEHICLES
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Role & Authentication State
  const [currentRole, setCurrentRole] = useState('passenger'); // 'driver' | 'passenger'
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Core Collections
  const [trips, setTrips] = useState(INITIAL_TRIPS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [driverSchedules, setDriverSchedules] = useState(MOCK_DRIVER_SCHEDULES);
  const [passengerSchedules, setPassengerSchedules] = useState(MOCK_PASSENGER_SCHEDULES);
  const [schedules, setSchedules] = useState(MOCK_DRIVER_SCHEDULES);
  const [walletTransactions, setWalletTransactions] = useState(MOCK_WALLET_TRANSACTIONS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [safetyReports, setSafetyReports] = useState([]);
  const [pickupPoints, setPickupPoints] = useState(MOCK_PICKUP_POINTS);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(MOCK_PICKUP_POINTS[0]);

  // 2-Way Wishlist System (Silent Favoriting - Empty by default for demo)
  const [favoriteDrivers, setFavoriteDrivers] = useState([]);
  const [favoritePassengers, setFavoritePassengers] = useState([]);

  // Vehicles State (Driver KYC / Fleet Management)
  const [vehicles, setVehicles] = useState(MOCK_DRIVER_VEHICLES);
  const [activeVehicle, setActiveVehicle] = useState(MOCK_DRIVER_VEHICLES[0]);

  const addVehicle = (newVehicle) => {
    const created = {
      ...newVehicle,
      id: `veh_${Date.now()}`,
      active: vehicles.length === 0,
      verificationStatus: newVehicle.hasCavet ? 'pending_review' : 'missing_document'
    };
    setVehicles(prev => [...prev, created]);
    if (vehicles.length === 0) {
      setActiveVehicle(created);
    }
    return created;
  };

  const updateVehicle = (id, updatedFields) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updatedFields } : v));
    if (activeVehicle?.id === id) {
      setActiveVehicle(prev => ({ ...prev, ...updatedFields }));
    }
  };

  const deleteVehicle = (id) => {
    setVehicles(prev => {
      const filtered = prev.filter(v => v.id !== id);
      if (activeVehicle?.id === id && filtered.length > 0) {
        setActiveVehicle(filtered[0]);
      }
      return filtered;
    });
  };

  const wishlistDrivers = favoriteDrivers;

  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isGPSTrackingEnabled, setIsGPSTrackingEnabled] = useState(true);
  const [lastRefundNotification, setLastRefundNotification] = useState(null);

  const toggleWishlist = (target) => {
    const targetId = typeof target === 'string' ? target : target.id;
    const isDriverTarget = targetId.startsWith('drv') || target?.role === 'driver';

    if (isDriverTarget) {
      setFavoriteDrivers(prev => {
        const exists = prev.some(d => d.id === targetId);
        if (exists) return prev.filter(d => d.id !== targetId);
        const newDriver = typeof target === 'object' ? target : {
          id: targetId,
          name: 'Tài xế Quốc Huy',
          avatar: 'QH',
          trustScore: 4.9,
          vehicle: 'Honda City · 51G-119.02',
          commonRoute: 'FPT University → Q.1',
          tripsCompleted: 96,
          phone: '0908 123 456'
        };
        return [newDriver, ...prev];
      });
    } else {
      setFavoritePassengers(prev => {
        const exists = prev.some(p => p.id === targetId);
        if (exists) return prev.filter(p => p.id !== targetId);
        const newPassenger = typeof target === 'object' ? target : {
          id: targetId,
          name: 'Hành khách Minh Anh',
          avatar: 'MA',
          trustScore: 4.8,
          commonRoute: 'Thủ Đức → Bến Thành',
          tripsTaken: 38,
          phone: '0912 345 678'
        };
        return [newPassenger, ...prev];
      });
    }
  };

  const isWishlisted = (targetId) => {
    return favoriteDrivers.some(d => d.id === targetId) || favoritePassengers.some(p => p.id === targetId);
  };

  // Driver applies direct discount to a customer (% or fixed ₫)
  const applyDirectDiscount = (tripId, passengerId, discountType, discountValue) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId || tripId === 'hist_drv_01' || tripId === 'trip_001') {
        return {
          ...t,
          passengers: (t.passengers || []).map(p => {
            if (p.id === passengerId || p.name === passengerId) {
              const originalFare = p.fareVnd || 45000;
              let newFare = originalFare;
              if (discountType === 'percent') {
                newFare = Math.max(0, Math.round(originalFare * (1 - discountValue / 100)));
              } else {
                newFare = Math.max(0, originalFare - discountValue);
              }
              return {
                ...p,
                originalFare,
                fareVnd: newFare,
                discountApplied: {
                  type: discountType,
                  value: discountValue,
                  discountAmount: originalFare - newFare
                }
              };
            }
            return p;
          })
        };
      }
      return t;
    }));
  };

  // Active Context IDs
  const [activeTripId, setActiveTripId] = useState('trip_001');
  const [activeBookingId, setActiveBookingId] = useState('bk_demo_02');

  // Wallets
  const [driverWallet, setDriverWallet] = useState(MOCK_USER_PROFILES.driver.walletBalance);
  const [passengerWallet, setPassengerWallet] = useState(MOCK_USER_PROFILES.passenger.walletBalance);

  // Search State
  const [searchParams, setSearchParams] = useState({
    origin: 'FPT University HCMC',
    destination: 'Chợ Bến Thành, Q.1',
    departureDate: 'Thứ 6, 12/09',
    departureTime: '07:30 AM',
    seats: 1
  });

  // Current User Profile
  const currentUser = {
    ...MOCK_USER_PROFILES[currentRole],
    walletBalance: currentRole === 'driver' ? driverWallet : passengerWallet
  };

  const switchRole = (newRole) => {
    setCurrentRole(newRole);
  };

  const login = (role = 'passenger') => {
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Top Up Wallet (VietQR / PayOS)
  const topUpWallet = (amount, code = 'RS128940') => {
    const numAmount = Number(amount) || 100000;
    if (currentRole === 'driver') {
      setDriverWallet(prev => prev + numAmount);
    } else {
      setPassengerWallet(prev => prev + numAmount);
    }

    const newTx = {
      id: `tx_${Date.now()}`,
      type: 'in',
      title: 'Nạp tiền qua VietQR (PayOS)',
      amount: numAmount,
      date: 'Vừa xong',
      status: 'success',
      code
    };
    setWalletTransactions(prev => [newTx, ...prev]);
  };

  // Publish a new Driver Trip (6-Step Wizard)
  const publishTrip = (tripData) => {
    if (currentRole !== 'driver') {
      return { ok: false, message: 'Chỉ tài xế mới có thể đăng chuyến.' };
    }

    const vehicle = vehicles.find(v => v.id === tripData.vehicleId) || activeVehicle;
    if (!vehicle || vehicle.verificationStatus !== 'verified') {
      return { ok: false, message: 'Hãy chọn phương tiện đã được xác thực trước khi đăng chuyến.' };
    }

    const newTripId = `trip_${Date.now()}`;
    const newTrip = {
      id: newTripId,
      driverId: 'drv_01',
      driverName: MOCK_USER_PROFILES.driver.name,
      driverInitials: MOCK_USER_PROFILES.driver.initials,
      driverTrustScore: MOCK_USER_PROFILES.driver.trustScore,
      driverTripsCount: MOCK_USER_PROFILES.driver.tripsCompleted + 1,
      driverPhone: MOCK_USER_PROFILES.driver.phone,
      verified: true,
      vehicleModel: tripData.vehicleModel || vehicle.model,
      vehiclePlate: tripData.vehiclePlate || vehicle.plate,
      vehicleColor: tripData.vehicleColor || vehicle.color,
      vehicleSeats: tripData.totalSeats || vehicle.seats,
      vehicleImage: vehicle.image || MOCK_USER_PROFILES.driver.vehicle.image,
      origin: tripData.origin || 'FPT University HCMC',
      originDetail: `${tripData.departureTime || '07:00'} · Điểm A`,
      destination: tripData.destination || 'Chợ Bến Thành, Q.1',
      destinationDetail: `${tripData.arrivalTime || '08:00'} · dự kiến · ${tripData.distanceKm || 18.5} km`,
      distanceKm: tripData.distanceKm || 18.5,
      departureDate: tripData.departureDate || 'Hôm nay, 12/09',
      departureTime: tripData.departureTime || '07:00',
      timeRange: tripData.timeRange || '07:00–08:00',
      matchPercentage: 95,
      isBestMatch: true,
      availableSeats: Number.isInteger(tripData.seats) ? tripData.seats : vehicle.passengerCapacity,
      totalSeats: tripData.totalSeats || vehicle.seats,
      statusText: 'Đang mở',
      priceVnd: tripData.priceVnd || 45000,
      costSharing: {
        totalKm: tripData.distanceKm ? tripData.distanceKm * 1.5 : 30,
        passengerKm: tripData.distanceKm || 15,
        fuelVnd: 92000,
        tollVnd: 20000,
        wearAndTearVnd: 23000,
        totalCostVnd: 135000,
        costPerKm: tripData.ratePerKm || 5000,
        splitPeople: 3,
        perPersonVnd: tripData.priceVnd || 45000,
      },
      stops: tripData.stops || [
        { id: 'st_1', name: tripData.origin || 'FPT University HCMC', role: 'Xuất phát', time: tripData.departureTime || '07:00', isPassengerStop: true },
        { id: 'st_2', name: tripData.destination || 'Chợ Bến Thành, Q.1', role: 'Điểm kết thúc', time: tripData.arrivalTime || '08:00', isPassengerStop: true }
      ],
      segments: [
        { km: 5, kmLabel: '5 km', barBg: '#DFE7E3', barFg: '#4B5A54', endLabel: 'B', isUserLeg: false },
        { km: 15, kmLabel: '15 km (Bạn đi)', barBg: '#0F9D76', barFg: '#FFFFFF', endLabel: 'C', isUserLeg: true },
      ],
      passengers: []
    };

    setTrips(prev => [newTrip, ...prev]);
    setActiveTripId(newTripId);
    return { ok: true, trip: newTrip };
  };

  // Request a Booking as Passenger
  const requestBooking = (tripId, seatsCount = 1, messageText = '', overrides = {}) => {
    if (currentRole !== 'passenger') {
      return { ok: false, message: 'Chỉ hành khách mới có thể gửi yêu cầu đặt chỗ.' };
    }

    const targetTrip = trips.find(t => t.id === tripId);
    const requestedSeats = Number(seatsCount);
    if (!targetTrip) return { ok: false, message: 'Không tìm thấy chuyến đi này.' };
    if (targetTrip.statusText !== 'Đang mở') return { ok: false, message: 'Chuyến đi hiện không mở nhận khách.' };
    if (!Number.isInteger(requestedSeats) || requestedSeats < 1 || requestedSeats > targetTrip.availableSeats) {
      return { ok: false, message: 'Số chỗ yêu cầu không hợp lệ hoặc đã hết chỗ.' };
    }
    if (bookings.some(b => b.tripId === tripId && b.passengerId === currentUser.id && ['pending', 'confirmed', 'pending_reschedule'].includes(b.status))) {
      return { ok: false, message: 'Bạn đã có yêu cầu đặt chỗ cho chuyến này.' };
    }

    const newBookingId = `bk_${Date.now()}`;
    const bookingCode = `#RS-${Math.floor(1000 + Math.random() * 9000)}`;
    const pin = String(Math.floor(1000 + Math.random() * 9000));
    const pickupPoint = overrides.pickupPoint || targetTrip.originDetail || targetTrip.origin;
    const dropoffPoint = overrides.dropoffPoint || targetTrip.destination;

    const newBooking = {
      id: newBookingId,
      tripId: targetTrip.id,
      passengerId: 'pas_01',
      passengerName: MOCK_USER_PROFILES.passenger.name,
      passengerInitials: MOCK_USER_PROFILES.passenger.initials,
      passengerPhone: MOCK_USER_PROFILES.passenger.phone,
      passengerTrustScore: MOCK_USER_PROFILES.passenger.trustScore,
      passengerTrips: MOCK_USER_PROFILES.passenger.tripsTaken,
      pickupPoint,
      dropoffPoint,
      fareVnd: targetTrip.priceVnd * requestedSeats,
      seatsCount: requestedSeats,
      message: messageText,
      status: 'pending',
      driverId: targetTrip.driverId,
      driverName: targetTrip.driverName,
      driverPhone: targetTrip.driverPhone,
      vehicleModel: `${targetTrip.vehicleModel} · ${targetTrip.vehicleColor}`,
      vehiclePlate: targetTrip.vehiclePlate,
      departureTime: targetTrip.departureTime,
      departureDate: targetTrip.departureDate || 'Hôm nay, 12/09',
      routeText: `${pickupPoint} → ${dropoffPoint} · ${targetTrip.departureTime}`,
      overlapPercent: targetTrip.matchPercentage || 92,
      detourKm: '+0.5 km',
      detourMin: '+2 phút',
      bookingCode,
      pin,
      createdAt: 'Vừa xong'
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveBookingId(newBookingId);
    setActiveTripId(targetTrip.id);
    return { ok: true, booking: newBooking };
  };

  // Driver responds to Booking (Accept / Reject)
  const respondBooking = (bookingId, decision) => {
    if (currentRole !== 'driver') return { ok: false, message: 'Chỉ tài xế mới có thể xử lý yêu cầu.' };
    if (!['accept', 'reject'].includes(decision)) return { ok: false, message: 'Quyết định xử lý không hợp lệ.' };

    const targetBk = bookings.find(b => b.id === bookingId);
    const targetTrip = targetBk && trips.find(t => t.id === targetBk.tripId);
    if (!targetBk || !targetTrip) return { ok: false, message: 'Không tìm thấy yêu cầu đặt chỗ.' };
    if ((targetBk.driverId || targetTrip.driverId) !== currentUser.id) return { ok: false, message: 'Bạn không có quyền xử lý yêu cầu này.' };
    if (targetBk.status !== 'pending') return { ok: false, message: 'Yêu cầu này đã được xử lý.' };

    if (decision === 'accept') {
      const requestedSeats = Number(targetBk.seatsCount) || 1;
      if (targetTrip.statusText !== 'Đang mở') return { ok: false, message: 'Chuyến đi hiện không mở nhận khách.' };
      if (requestedSeats > targetTrip.availableSeats) return { ok: false, message: 'Số chỗ còn lại không đủ cho yêu cầu này.' };

      setTrips(prev => prev.map(t => t.id === targetBk.tripId
        ? {
            ...t,
            availableSeats: t.availableSeats - requestedSeats,
            passengers: [
              ...t.passengers.filter(p => p.id !== targetBk.passengerId),
              {
                id: targetBk.passengerId,
                name: targetBk.passengerName,
                initials: targetBk.passengerInitials || 'MA',
                phone: targetBk.passengerPhone,
                pickupPoint: targetBk.pickupPoint,
                dropoffPoint: targetBk.dropoffPoint,
                fareVnd: targetBk.fareVnd,
                seatsCount: requestedSeats,
                status: 'waiting_pickup',
                isNearDropoff: false,
                pin: targetBk.pin || '4821'
              }
            ]
          }
        : t
      ));
    }

    setBookings(prev => prev.map(b => b.id === bookingId
      ? { ...b, status: decision === 'accept' ? 'confirmed' : 'rejected' }
      : b
    ));
    return { ok: true };
  };

  const startTrip = (tripId) => {
    if (currentRole !== 'driver') return { ok: false, message: 'Chỉ tài xế mới có thể bắt đầu chuyến.' };
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return { ok: false, message: 'Không tìm thấy chuyến đi.' };
    if (trip.driverId !== currentUser.id) return { ok: false, message: 'Bạn không có quyền bắt đầu chuyến này.' };
    if (trip.statusText !== 'Đang mở') return { ok: false, message: 'Chuyến đi không ở trạng thái sẵn sàng khởi hành.' };

    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, statusText: 'Đang diễn ra', startedAt: 'Vừa xong' } : t));
    setActiveTripId(tripId);
    return { ok: true };
  };

  // Driver confirms passenger pickup (physical onboarding)
  const confirmPassengerPickup = (tripId, passengerId) => {
    if (currentRole !== 'driver') return { ok: false, message: 'Chỉ tài xế mới có thể xác nhận đón khách.' };
    const trip = trips.find(t => t.id === tripId);
    const passenger = trip?.passengers?.find(p => p.id === passengerId);
    if (!trip || trip.driverId !== currentUser.id) return { ok: false, message: 'Không tìm thấy chuyến đi hợp lệ.' };
    if (trip.statusText !== 'Đang diễn ra' || passenger?.status !== 'waiting_pickup') {
      return { ok: false, message: 'Khách không ở trạng thái chờ đón.' };
    }

    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          passengers: t.passengers.map(p => p.id === passengerId ? { ...p, status: 'on_board', isNearDropoff: true } : p)
        };
      }
      return t;
    }));
    return { ok: true };
  };

  // Driver confirms reaching dropoff point for a passenger
  const confirmPassengerDropoff = (tripId, passengerId) => {
    if (currentRole !== 'driver') return { ok: false, message: 'Chỉ tài xế mới có thể xác nhận trả khách.' };
    const trip = trips.find(t => t.id === tripId);
    const passenger = trip?.passengers?.find(p => p.id === passengerId);
    if (!trip || trip.driverId !== currentUser.id) return { ok: false, message: 'Không tìm thấy chuyến đi hợp lệ.' };
    if (trip.statusText !== 'Đang diễn ra' || passenger?.status !== 'on_board') {
      return { ok: false, message: 'Chỉ có thể trả khách đã được xác nhận lên xe.' };
    }

    const fareEarned = passenger.fareVnd || 45000;
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          passengers: t.passengers.map(p => p.id === passengerId ? { ...p, status: 'dropped_off', isNearDropoff: false } : p)
        };
      }
      return t;
    }));

    // Credit driver wallet & log transaction
    setDriverWallet(prev => prev + fareEarned);
    const newTx = {
      id: `tx_${Date.now()}`,
      type: 'in',
      title: 'Thu nhập chia sẻ chi phí từ hành khách',
      amount: fareEarned,
      date: 'Vừa xong',
      status: 'success',
      code: '#RS-4821'
    };
    setWalletTransactions(prev => [newTx, ...prev]);
    setBookings(prev => prev.map(b => b.tripId === tripId && b.passengerId === passengerId && b.status === 'confirmed'
      ? { ...b, status: 'completed' }
      : b
    ));
    return { ok: true };
  };

  // Complete entire Trip
  const completeTrip = (tripId) => {
    if (currentRole !== 'driver') return { ok: false, message: 'Chỉ tài xế mới có thể hoàn thành chuyến.' };
    const trip = trips.find(t => t.id === tripId);
    if (!trip || trip.driverId !== currentUser.id) return { ok: false, message: 'Không tìm thấy chuyến đi hợp lệ.' };
    if (trip.statusText !== 'Đang diễn ra') return { ok: false, message: 'Chuyến đi chưa được bắt đầu.' };
    if (trip.passengers.some(p => p.status !== 'dropped_off')) {
      return { ok: false, message: 'Hãy xác nhận trả toàn bộ hành khách trước khi kết thúc chuyến.' };
    }

    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, statusText: 'Hoàn thành', completedAt: 'Vừa xong' } : t));
    return { ok: true };
  };

  // Driver cancels a trip that hasn't started yet (SF-14)
  const cancelTrip = (tripId, reason = '') => {
    if (currentRole !== 'driver') return { ok: false, message: 'Chỉ tài xế mới có thể huỷ chuyến.' };
    const trip = trips.find(t => t.id === tripId);
    if (!trip || trip.driverId !== currentUser.id) return { ok: false, message: 'Không tìm thấy chuyến đi hợp lệ.' };
    if (trip.statusText !== 'Đang mở') return { ok: false, message: 'Chỉ có thể huỷ chuyến trước khi khởi hành.' };

    setTrips(prev => prev.map(t => t.id === tripId
      ? { ...t, statusText: 'Đã huỷ', cancelled: true, cancelReason: reason }
      : t
    ));
    setBookings(prev => prev.map(b => (b.tripId === tripId && (b.status === 'pending' || b.status === 'confirmed'))
      ? { ...b, status: 'cancelled', cancelReason: reason || 'Tài xế đã huỷ chuyến đi' }
      : b
    ));
    return { ok: true };
  };

  // Driver reschedules a trip's date/time; confirmed passengers must accept or cancel (SF-15, SF-16)
  const rescheduleTrip = (tripId, { departureDate, departureTime } = {}, reason = '') => {
    if (currentRole !== 'driver') return { ok: false, message: 'Chỉ tài xế mới có thể đổi lịch chuyến.' };
    const trip = trips.find(t => t.id === tripId);
    if (!trip || trip.driverId !== currentUser.id) return { ok: false, message: 'Không tìm thấy chuyến đi hợp lệ.' };
    if (trip.statusText !== 'Đang mở') return { ok: false, message: 'Chỉ có thể đổi lịch trước khi khởi hành.' };
    if (!departureDate?.trim() || !/^\d{2}:\d{2}$/.test(departureTime || '')) {
      return { ok: false, message: 'Ngày hoặc giờ khởi hành mới không hợp lệ.' };
    }

    setTrips(prev => prev.map(t => t.id === tripId
      ? {
          ...t,
          departureDate: departureDate || t.departureDate,
          departureTime: departureTime || t.departureTime,
          originDetail: `${departureTime || t.departureTime} · Điểm A`,
          stops: (t.stops || []).map((stop, index) => index === 0 ? { ...stop, time: departureTime || stop.time } : stop),
          rescheduled: true,
          rescheduleReason: reason,
        }
      : t
    ));
    setBookings(prev => prev.map(b => {
      if (b.tripId !== tripId || !['pending', 'confirmed'].includes(b.status)) return b;
      return {
        ...b,
        status: b.status === 'confirmed' ? 'pending_reschedule' : 'pending',
        previousDepartureDate: b.departureDate,
        previousDepartureTime: b.departureTime,
        departureDate: departureDate || b.departureDate,
        departureTime: departureTime || b.departureTime,
        rescheduleReason: reason,
      };
    }));
    return { ok: true };
  };

  // Passenger responds to a trip-change notification (SF-16)
  const acceptReschedule = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (currentRole !== 'passenger' || !booking || booking.passengerId !== currentUser.id || booking.status !== 'pending_reschedule') {
      return { ok: false, message: 'Bạn không thể xác nhận thay đổi lịch này.' };
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
    return { ok: true };
  };

  const declineReschedule = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (currentRole !== 'passenger' || !booking || booking.passengerId !== currentUser.id || booking.status !== 'pending_reschedule') {
      return { ok: false, message: 'Bạn không thể huỷ đặt chỗ này.' };
    }
    const releasedSeats = Number(booking.seatsCount) || 1;
    setBookings(prev => prev.map(b => b.id === bookingId
      ? { ...b, status: 'cancelled', cancelReason: 'Hành khách huỷ do lịch mới không phù hợp' }
      : b
    ));
    setTrips(prev => prev.map(t => t.id === booking.tripId
      ? {
          ...t,
          availableSeats: Math.min(t.totalSeats || releasedSeats, t.availableSeats + releasedSeats),
          passengers: t.passengers.filter(p => p.id !== booking.passengerId)
        }
      : t
    ));
    return { ok: true };
  };

  const cancelBookingRequest = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (currentRole !== 'passenger' || !booking || booking.passengerId !== currentUser.id || booking.status !== 'pending') {
      return { ok: false, message: 'Bạn chỉ có thể huỷ yêu cầu đang chờ duyệt của mình.' };
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled', cancelReason: 'Hành khách đã rút yêu cầu' } : b));
    return { ok: true };
  };

  // Chat message sender with simulated auto-reply
  const sendMessage = (text, isLocation = false) => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: currentRole,
      senderName: currentUser.name,
      text: isLocation ? 'Vị trí hiện tại của tôi' : text,
      sub: isLocation ? 'Đang cập nhật GPS theo thời gian thực' : undefined,
      time: 'Vừa xong',
      isText: !isLocation,
      isLocation: isLocation
    };

    setMessages(prev => [...prev, newMsg]);

    // Simulate auto reply after 1.5s
    setTimeout(() => {
      const replyMsg = {
        id: `msg_reply_${Date.now()}`,
        sender: currentRole === 'driver' ? 'passenger' : 'driver',
        senderName: currentRole === 'driver' ? 'Minh Anh' : 'Nguyễn Minh',
        text: currentRole === 'driver' 
          ? 'Dạ em cảm ơn anh, em đang chuẩn bị ra điểm đón!' 
          : 'Mình đã nhận được tin nhắn, hẹn bạn đúng 07:20 tại Cổng 2 nhé.',
        time: 'Vừa xong',
        isText: true
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1500);
  };

  // --- Driver Schedules Management ---
  const addDriverSchedule = (newSched) => {
    const created = {
      ...newSched,
      id: `dsch_${Date.now()}`,
      active: true,
      subscribers: []
    };
    setDriverSchedules(prev => [created, ...prev]);
    setSchedules(prev => [created, ...prev]);
    return created;
  };

  const updateDriverSchedule = (id, updatedFields) => {
    setDriverSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const deleteDriverSchedule = (id) => {
    setDriverSchedules(prev => prev.filter(s => s.id !== id));
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const toggleDriverSchedule = (id) => {
    setDriverSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // --- Passenger Schedules Management ---
  const addPassengerSchedule = (newSched) => {
    const created = {
      ...newSched,
      id: `psch_${Date.now()}`,
      active: true,
      matchedDriver: null
    };
    setPassengerSchedules(prev => [created, ...prev]);
    return created;
  };

  const updatePassengerSchedule = (id, updatedFields) => {
    setPassengerSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const deletePassengerSchedule = (id) => {
    setPassengerSchedules(prev => prev.filter(s => s.id !== id));
  };

  const togglePassengerSchedule = (id) => {
    setPassengerSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // --- Passenger 1-Click Monthly Subscription to Driver Schedule ---
  const subscribeRecurringCommute = (driverScheduleId, note = '') => {
    if (currentRole !== 'passenger') return { ok: false, message: 'Chỉ hành khách mới có thể đăng ký lịch định kỳ.' };
    const targetDriverSched = driverSchedules.find(s => s.id === driverScheduleId);
    if (!targetDriverSched || !targetDriverSched.active) return { ok: false, message: 'Lịch trình này hiện không mở đăng ký.' };
    if ((targetDriverSched.availableSeats || 0) < 1) return { ok: false, message: 'Lịch trình này đã hết chỗ.' };
    if ((targetDriverSched.subscribers || []).some(sub => sub.id === currentUser.id || sub.name === currentUser.name)) {
      return { ok: false, message: 'Bạn đã đăng ký lịch trình này.' };
    }
    
    // 1. Add passenger to driver's schedule subscribers
    setDriverSchedules(prev => prev.map(s => {
      if (s.id === targetDriverSched.id) {
        return {
          ...s,
          availableSeats: Math.max(0, (s.availableSeats || 1) - 1),
          subscribers: [
            ...(s.subscribers || []),
            {
              id: currentUser.id || 'pas_01',
              name: currentUser.name || 'Minh Anh',
              avatar: currentUser.initials || 'MA',
              phone: currentUser.phone || '0912 345 678',
              pickup: targetDriverSched.origin,
              dropoff: targetDriverSched.destination,
              note: note || 'Đăng ký trọn gói cả tháng (T2-T6)'
            }
          ]
        };
      }
      return s;
    }));
    setSchedules(prev => prev.map(s => s.id === targetDriverSched.id
      ? {
          ...s,
          availableSeats: Math.max(0, (s.availableSeats || 1) - 1),
          subscribers: [
            ...(s.subscribers || []),
            {
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.initials,
              phone: currentUser.phone,
              pickup: targetDriverSched.origin,
              dropoff: targetDriverSched.destination,
              note: note || 'Đăng ký trọn gói cả tháng (T2-T6)'
            }
          ]
        }
      : s
    ));

    // 2. Add or update matched driver in passenger schedules
    const existingPassengerSched = passengerSchedules.find(ps => ps.origin.includes(targetDriverSched.origin) || ps.destination.includes(targetDriverSched.destination));
    if (existingPassengerSched) {
      updatePassengerSchedule(existingPassengerSched.id, {
        matchedDriver: {
          id: 'drv_01',
          name: 'Quốc Huy',
          avatar: 'QH',
          vehicle: targetDriverSched.vehicleModel ? `${targetDriverSched.vehicleModel} · ${targetDriverSched.vehiclePlate}` : 'Honda City · 51G-119.02',
          phone: '0908 123 456',
          status: 'Đã đăng ký trọn gói tháng 10 (22 chuyến)'
        }
      });
    } else {
      addPassengerSchedule({
        title: `Đi chung cùng ${targetDriverSched.title || 'Tài xế Quốc Huy'}`,
        purpose: 'Đi làm',
        icon: '🏢',
        origin: targetDriverSched.origin,
        destination: targetDriverSched.destination,
        days: targetDriverSched.days,
        time: targetDriverSched.time,
        duration: targetDriverSched.duration || { startDate: '01/10/2026', endDate: '31/10/2026', durationLabel: '01/10 → 31/10/2026' },
        preferredVehicle: targetDriverSched.vehicleType || 'all',
        matchedDriver: {
          id: 'drv_01',
          name: 'Quốc Huy',
          avatar: 'QH',
          vehicle: targetDriverSched.vehicleModel ? `${targetDriverSched.vehicleModel} · ${targetDriverSched.vehiclePlate}` : 'Honda City · 51G-119.02',
          phone: '0908 123 456',
          status: 'Đã đăng ký trọn gói tháng 10 (22 chuyến)'
        }
      });
    }

    return { ok: true };
  };

  // Toggle Recurring Schedule (Backward-compatible)
  const toggleSchedule = (scheduleId) => {
    toggleDriverSchedule(scheduleId);
  };

  // Delete Recurring Schedule (Backward-compatible)
  const deleteSchedule = (scheduleId) => {
    deleteDriverSchedule(scheduleId);
  };

  // Restore the whole demo to its initial seed data (used by the demo control bar's Reset button)
  const resetDemoState = () => {
    setTrips(INITIAL_TRIPS);
    setBookings(INITIAL_BOOKINGS);
    setDriverSchedules(MOCK_DRIVER_SCHEDULES);
    setPassengerSchedules(MOCK_PASSENGER_SCHEDULES);
    setSchedules(MOCK_DRIVER_SCHEDULES);
    setWalletTransactions(MOCK_WALLET_TRANSACTIONS);
    setMessages(INITIAL_MESSAGES);
    setSafetyReports([]);
    setPickupPoints(MOCK_PICKUP_POINTS);
    setSelectedPickupPoint(MOCK_PICKUP_POINTS[0]);
    setVehicles(MOCK_DRIVER_VEHICLES);
    setActiveTripId('trip_001');
    setActiveBookingId('bk_demo_02');
    setDriverWallet(MOCK_USER_PROFILES.driver.walletBalance);
    setPassengerWallet(MOCK_USER_PROFILES.passenger.walletBalance);
    setSearchParams({
      origin: 'FPT University HCMC',
      destination: 'Chợ Bến Thành, Q.1',
      departureDate: 'Thứ 6, 12/09',
      departureTime: '07:30 AM',
      seats: 1,
    });
  };

  // Dynamic Cost Splitting & Automatic Refund when additional passenger joins
  const recalculateAndRefundTrip = (tripId, newPassengerName = 'Lê Tuấn', refundAmount = 15000) => {
    // 1. Credit refund to passenger wallet
    setPassengerWallet(prev => prev + refundAmount);

    // 2. Add refund transaction record
    const refundTx = {
      id: `tx_rf_${Date.now()}`,
      type: 'in',
      title: 'Hoàn tiền chia sẻ chi phí (Thêm bạn đồng hành)',
      amount: refundAmount,
      date: 'Vừa xong',
      status: 'success',
      code: '#REFUND-SHARE'
    };
    setWalletTransactions(prev => [refundTx, ...prev]);

    // 3. Set notification state for in-trip UI
    setLastRefundNotification({
      id: `notif_${Date.now()}`,
      tripId,
      newPassengerName,
      refundAmount,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      message: `🎉 Bạn được hoàn lại ${new Intl.NumberFormat('vi-VN').format(refundAmount)} ₫ vào ví vì có thêm bạn ${newPassengerName} cùng chia sẻ lộ trình!`
    });

    return refundAmount;
  };

  // Report No-Show / Vắng mặt
  const submitNoShowReport = ({ tripId, role = 'passenger', reason = '', evidenceNote = '' }) => {
    const report = {
      id: `NS-${Date.now().toString().slice(-6)}`,
      tripId,
      type: 'no_show',
      category: 'Vắng mặt không báo trước',
      severity: 'high',
      description: `Báo cáo vắng mặt: ${reason}. Minh chứng: ${evidenceNote || 'Đã đợi 10 phút tại điểm đón'}`,
      reporterRole: currentRole,
      reporterName: currentUser.name,
      status: 'pending_admin_penalty',
      createdAt: 'Vừa xong'
    };
    setSafetyReports(prev => [report, ...prev]);
    return report;
  };

  // Report a user / safety incident (SF-21, SF-22)
  const submitReport = ({ tripCode, targetName, category, severity = 'low', description = '' }) => {
    const newReport = {
      id: `SF-${Date.now().toString().slice(-6)}`,
      tripCode: tripCode || null,
      targetName: targetName || '',
      category,
      severity,
      description,
      reporterRole: currentRole,
      reporterName: currentUser.name,
      status: 'open',
      createdAt: 'Vừa xong',
    };
    setSafetyReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0];
  const activeBooking = bookings.find(b => b.id === activeBookingId) || bookings[0];
  const pendingBookingsForDriver = bookings.filter(b => {
    if (b.status !== 'pending') return false;
    const trip = trips.find(t => t.id === b.tripId);
    return (b.driverId || trip?.driverId) === MOCK_USER_PROFILES.driver.id;
  });

  return (
    <AppContext.Provider
      value={{
        currentRole,
        switchRole,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        currentUser,
        trips,
        setTrips,
        bookings,
        setBookings,
        driverSchedules,
        passengerSchedules,
        addDriverSchedule,
        updateDriverSchedule,
        deleteDriverSchedule,
        toggleDriverSchedule,
        addPassengerSchedule,
        updatePassengerSchedule,
        deletePassengerSchedule,
        togglePassengerSchedule,
        subscribeRecurringCommute,
        schedules,
        walletTransactions,
        topUpWallet,
        messages,
        sendMessage,
        safetyReports,
        submitReport,
        submitNoShowReport,
        activeTripId,
        setActiveTripId,
        activeBookingId,
        setActiveBookingId,
        activeTrip,
        activeBooking,
        pendingBookingsForDriver,
        driverWallet,
        passengerWallet,
        searchParams,
        setSearchParams,
        searchFilter: searchParams,
        pickupPoints,
        selectedPickupPoint,
        setSelectedPickupPoint,
        vehicles,
        activeVehicle,
        setActiveVehicle,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        wishlistDrivers,
        favoriteDrivers,
        favoritePassengers,
        toggleWishlist,
        isWishlisted,
        applyDirectDiscount,
        isSOSModalOpen,
        setIsSOSModalOpen,
        isSOSActive,
        setIsSOSActive,
        isGPSTrackingEnabled,
        setIsGPSTrackingEnabled,
        lastRefundNotification,
        setLastRefundNotification,
        recalculateAndRefundTrip,
        publishTrip,
        requestBooking,
        respondBooking,
        startTrip,
        confirmPassengerPickup,
        confirmPassengerDropoff,
        completeTrip,
        cancelTrip,
        rescheduleTrip,
        acceptReschedule,
        declineReschedule,
        cancelBookingRequest,
        toggleSchedule,
        deleteSchedule,
        setSchedules,
        resetDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
