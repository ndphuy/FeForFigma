import React, { createContext, useContext, useState } from 'react';
import {
  MOCK_USER_PROFILES,
  INITIAL_TRIPS,
  INITIAL_BOOKINGS,
  INITIAL_MESSAGES,
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
  const [schedules, setSchedules] = useState(RECURRING_SCHEDULE_PRESETS);
  const [walletTransactions, setWalletTransactions] = useState(MOCK_WALLET_TRANSACTIONS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [safetyReports, setSafetyReports] = useState([]);
  const [pickupPoints, setPickupPoints] = useState(MOCK_PICKUP_POINTS);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(MOCK_PICKUP_POINTS[0]);

  // Driver Vehicles (Up to 3 vehicles)
  const [vehicles, setVehicles] = useState(MOCK_DRIVER_VEHICLES);
  const activeVehicle = vehicles.find(v => v.active) || vehicles[0];

  const setActiveVehicle = (vehicleId) => {
    setVehicles(prev => prev.map(v => ({
      ...v,
      active: v.id === vehicleId
    })));
  };

  const addVehicle = (newVehicleData) => {
    if (vehicles.length >= 3) return false;
    const newVeh = {
      id: `veh_${Date.now()}`,
      ...newVehicleData,
      // New vehicles must wait for admin review before they can be activated for trips.
      verificationStatus: 'pending_review',
      active: false,
    };
    setVehicles(prev => [...prev, newVeh]);
    return true;
  };

  const deleteVehicle = (vehicleId) => {
    if (vehicles.length <= 1) return false;
    setVehicles(prev => {
      const remaining = prev.filter(v => v.id !== vehicleId);
      const wasActive = prev.find(v => v.id === vehicleId)?.active;
      if (wasActive && remaining.length > 0) {
        remaining[0].active = true;
      }
      return remaining;
    });
    return true;
  };

  // Active Context IDs
  const [activeTripId, setActiveTripId] = useState('trip_001');
  const [activeBookingId, setActiveBookingId] = useState('bk_demo_01');

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
      vehicleModel: tripData.vehicleModel || activeVehicle.model,
      vehiclePlate: tripData.vehiclePlate || activeVehicle.plate,
      vehicleColor: tripData.vehicleColor || activeVehicle.color,
      vehicleSeats: tripData.totalSeats || activeVehicle.seats,
      vehicleImage: activeVehicle.image || MOCK_USER_PROFILES.driver.vehicle.image,
      origin: tripData.origin || 'FPT University HCMC',
      originDetail: `${tripData.departureTime || '07:00'} · Điểm A`,
      destination: tripData.destination || 'Chợ Bến Thành, Q.1',
      destinationDetail: `${tripData.arrivalTime || '07:48'} · dự kiến · ${tripData.distanceKm || 18.5} km`,
      distanceKm: tripData.distanceKm || 18.5,
      departureDate: tripData.departureDate || 'Hôm nay, 12/09',
      departureTime: tripData.departureTime || '07:00',
      timeRange: tripData.timeRange || '07:00–08:00',
      matchPercentage: 95,
      isBestMatch: true,
      availableSeats: tripData.seats || (activeVehicle.type === 'bike' ? 1 : 3),
      totalSeats: tripData.totalSeats || activeVehicle.seats,
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
        { id: 'st_2', name: tripData.destination || 'Chợ Bến Thành, Q.1', role: 'Điểm kết thúc', time: tripData.arrivalTime || '07:48', isPassengerStop: true }
      ],
      segments: [
        { km: 5, kmLabel: '5 km', barBg: '#DFE7E3', barFg: '#4B5A54', endLabel: 'B', isUserLeg: false },
        { km: 15, kmLabel: '15 km (Bạn đi)', barBg: '#0F9D76', barFg: '#FFFFFF', endLabel: 'C', isUserLeg: true },
      ],
      passengers: []
    };

    setTrips(prev => [newTrip, ...prev]);
    setActiveTripId(newTripId);
    return newTrip;
  };

  // Request a Booking as Passenger
  const requestBooking = (tripId, seatsCount = 1, messageText = '', overrides = {}) => {
    const targetTrip = trips.find(t => t.id === tripId) || trips[0];
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
      fareVnd: targetTrip.priceVnd * seatsCount,
      seatsCount,
      message: messageText,
      status: 'pending',
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
    return newBooking;
  };

  // Driver responds to Booking (Accept / Reject)
  const respondBooking = (bookingId, decision) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: decision === 'accept' ? 'confirmed' : 'rejected'
        };
      }
      return b;
    }));

    if (decision === 'accept') {
      const targetBk = bookings.find(b => b.id === bookingId);
      if (targetBk) {
        setTrips(prev => prev.map(t => {
          if (t.id === targetBk.tripId) {
            return {
              ...t,
              availableSeats: Math.max(0, t.availableSeats - (targetBk.seatsCount || 1)),
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
                  status: 'waiting_pickup',
                  isNearDropoff: false,
                  pin: targetBk.pin || '4821'
                }
              ]
            };
          }
          return t;
        }));
      }
    }
  };

  // Driver confirms passenger pickup (physical onboarding)
  const confirmPassengerPickup = (tripId, passengerId) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return {
          ...t,
          passengers: t.passengers.map(p => p.id === passengerId ? { ...p, status: 'on_board', isNearDropoff: true } : p)
        };
      }
      return t;
    }));
  };

  // Driver confirms reaching dropoff point for a passenger
  const confirmPassengerDropoff = (tripId, passengerId) => {
    let fareEarned = 45000;
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        const found = t.passengers.find(p => p.id === passengerId);
        if (found) fareEarned = found.fareVnd || 45000;
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
  };

  // Complete entire Trip
  const completeTrip = (tripId) => {
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, statusText: 'Hoàn thành' } : t));
    setBookings(prev => prev.map(b => (b.tripId === tripId && b.status === 'confirmed') ? { ...b, status: 'completed' } : b));
  };

  // Driver cancels a trip that hasn't started yet (SF-14)
  const cancelTrip = (tripId, reason = '') => {
    setTrips(prev => prev.map(t => t.id === tripId
      ? { ...t, statusText: 'Đã huỷ', cancelled: true, cancelReason: reason }
      : t
    ));
    setBookings(prev => prev.map(b => (b.tripId === tripId && (b.status === 'pending' || b.status === 'confirmed'))
      ? { ...b, status: 'cancelled', cancelReason: reason || 'Tài xế đã huỷ chuyến đi' }
      : b
    ));
  };

  // Driver reschedules a trip's date/time; confirmed passengers must accept or cancel (SF-15, SF-16)
  const rescheduleTrip = (tripId, { departureDate, departureTime } = {}, reason = '') => {
    setTrips(prev => prev.map(t => t.id === tripId
      ? {
          ...t,
          departureDate: departureDate || t.departureDate,
          departureTime: departureTime || t.departureTime,
          rescheduled: true,
          rescheduleReason: reason,
        }
      : t
    ));
    setBookings(prev => prev.map(b => {
      if (b.tripId !== tripId || b.status !== 'confirmed') return b;
      return {
        ...b,
        status: 'pending_reschedule',
        previousDepartureDate: b.departureDate,
        previousDepartureTime: b.departureTime,
        departureDate: departureDate || b.departureDate,
        departureTime: departureTime || b.departureTime,
        rescheduleReason: reason,
      };
    }));
  };

  // Passenger responds to a trip-change notification (SF-16)
  const acceptReschedule = (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
  };

  const declineReschedule = (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId
      ? { ...b, status: 'cancelled', cancelReason: 'Hành khách huỷ do lịch mới không phù hợp' }
      : b
    ));
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

  // Toggle Recurring Schedule
  const toggleSchedule = (scheduleId) => {
    setSchedules(prev => prev.map(s => s.id === scheduleId ? { ...s, active: !s.active } : s));
  };

  // Restore the whole demo to its initial seed data (used by the demo control bar's Reset button)
  const resetDemoState = () => {
    setTrips(INITIAL_TRIPS);
    setBookings(INITIAL_BOOKINGS);
    setSchedules(RECURRING_SCHEDULE_PRESETS);
    setWalletTransactions(MOCK_WALLET_TRANSACTIONS);
    setMessages(INITIAL_MESSAGES);
    setSafetyReports([]);
    setPickupPoints(MOCK_PICKUP_POINTS);
    setSelectedPickupPoint(MOCK_PICKUP_POINTS[0]);
    setVehicles(MOCK_DRIVER_VEHICLES);
    setActiveTripId('trip_001');
    setActiveBookingId('bk_demo_01');
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
  const pendingBookingsForDriver = bookings.filter(b => b.status === 'pending');

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
        schedules,
        walletTransactions,
        topUpWallet,
        messages,
        sendMessage,
        safetyReports,
        submitReport,
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
        deleteVehicle,
        publishTrip,
        requestBooking,
        respondBooking,
        confirmPassengerPickup,
        confirmPassengerDropoff,
        completeTrip,
        cancelTrip,
        rescheduleTrip,
        acceptReschedule,
        declineReschedule,
        toggleSchedule,
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
