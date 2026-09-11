import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  Star, 
  MapPin, 
  Clock 
} from 'lucide-react';

export const ApprovalModal = () => {
  const navigate = useNavigate();
  const { activeBooking, respondBooking } = useApp();
  
  const [feedback, setFeedback] = useState(null);

  const booking = activeBooking || {
    id: 'bk_demo_01',
    passengerName: 'Minh Anh',
    passengerInitials: 'MA',
    passengerPhone: '0912 345 678',
    passengerTrustScore: 4.9,
    pickupPoint: 'Cổng R1 Phú Mỹ Hưng, Q.7',
    dropoffPoint: 'Tòa nhà Bitexco, Q.1',
    fareVnd: 45000,
  };

  const handleAccept = () => {
    setFeedback('accepted');
    respondBooking(booking.id, 'accept');
    setTimeout(() => navigate('/driver/home'), 800);
  };

  const handleDecline = () => {
    setFeedback('declined');
    respondBooking(booking.id, 'decline');
    setTimeout(() => navigate('/driver/home'), 800);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-canvas">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/driver/home')}
            className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold text-slate-900">Phê duyệt đặt chỗ</h1>
          <div className="w-10" />
        </div>

        {/* Passenger Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-sm">
                {booking.passengerInitials || 'MA'}
              </div>

              <div>
                <span className="text-sm font-bold text-slate-900 block">{booking.passengerName}</span>
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{booking.passengerTrustScore || 4.9}</span>
                  <span>·</span>
                  <span>{booking.passengerPhone}</span>
                </div>
              </div>
            </div>

            <span className="text-sm font-bold text-primary">
              +{new Intl.NumberFormat('vi-VN').format(booking.fareVnd || 45000)} đ
            </span>
          </div>

          {/* Pickup and Dropoff Itinerary */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold shrink-0">Điểm đón:</span>
              <span className="text-slate-800 font-medium">{booking.pickupPoint}</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-orange-600 font-bold shrink-0">Điểm trả:</span>
              <span className="text-slate-800 font-medium">{booking.dropoffPoint}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {feedback === null ? (
        <div className="space-y-2">
          <button
            onClick={handleAccept}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold rounded-2xl text-xs transition-all shadow-xs flex items-center justify-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Chấp nhận đón khách</span>
          </button>

          <button
            onClick={handleDecline}
            className="w-full py-3 bg-white hover:bg-slate-50 text-slate-600 font-semibold rounded-2xl text-xs border border-slate-200 transition-colors"
          >
            Từ chối yêu cầu
          </button>
        </div>
      ) : feedback === 'accepted' ? (
        <div className="bg-emerald-700 text-white p-3.5 rounded-2xl text-center font-bold text-xs shadow-xs">
          Đã chấp nhận đón hành khách!
        </div>
      ) : (
        <div className="bg-slate-800 text-white p-3.5 rounded-2xl text-center font-bold text-xs shadow-xs">
          Đã từ chối yêu cầu.
        </div>
      )}
    </div>
  );
};
