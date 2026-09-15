import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Heart, Star, Car, User, MessageSquare, ArrowRight, ShieldCheck, MapPin, Plus, History } from 'lucide-react';

export const WishlistPage = () => {
  const navigate = useNavigate();
  const { 
    currentRole, 
    favoriteDrivers, 
    favoritePassengers, 
    toggleWishlist 
  } = useApp();

  const isDriver = currentRole === 'driver';
  const driversList = favoriteDrivers || [];
  const passengersList = favoritePassengers || [];

  return (
    <div className="flex-1 flex flex-col bg-[#F4F7F5] overflow-hidden relative">
      {/* Top Header */}
      <div className="flex-none bg-white p-4 pb-3 border-b border-[#EEF2F0] flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-10 h-10 border border-[#EEF2F0] rounded-xl bg-white hover:bg-[#F7FAF9] flex items-center justify-center text-lg text-[#101B17] shrink-0 cursor-pointer"
          >
            ‹
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-[#101B17]">Danh sách yêu thích</h1>
            <span className="text-[11px] text-[#8A9993]">Lưu bạn đồng hành quen thuộc</span>
          </div>
        </div>

        <div className="w-9 h-9 rounded-full bg-[#FFF0F0] text-[#C22B35] flex items-center justify-center">
          <Heart className="w-4.5 h-4.5 fill-[#C22B35]" />
        </div>
      </div>

      {/* Info Badge */}
      <div className="px-4 pt-3.5 pb-1">
        <div className="bg-[#F1FAF6] border border-[#BDE7D5] rounded-2xl p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#0F9D76] text-white flex items-center justify-center text-xs shrink-0">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0B7A5C]">
                Đang lưu {isDriver ? passengersList.length : driversList.length} người
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main List Area */}
      <div className="flex-1 overflow-y-auto rs-scroll p-4 pb-12 flex flex-col gap-3">
        {isDriver ? (
          /* Driver View: Only Passengers */
          passengersList.length > 0 ? (
            passengersList.map((passenger) => (
              <div
                key={passenger.id}
                className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-xs flex flex-col gap-3 transition-all hover:border-[#B2E2D0]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-base flex items-center justify-center shrink-0 border border-[#B2E2D0]">
                      {passenger.avatar || 'MA'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-[#101B17] truncate">{passenger.name}</span>
                      <div className="flex items-center gap-1.5 text-xs text-[#8A9993]">
                        <span className="text-[#EE7A22] font-bold">★ {passenger.trustScore || 4.9}</span>
                        <span>·</span>
                        <span>{passenger.tripsTaken || 38} chuyến đi ké</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(passenger)}
                    className="p-2 rounded-xl bg-[#FFF0F0] text-[#C22B35] hover:bg-red-100 transition-colors cursor-pointer"
                    title="Bỏ lưu khỏi danh sách yêu thích"
                  >
                    <Heart className="w-4 h-4 fill-[#C22B35]" />
                  </button>
                </div>

                <div className="p-2.5 rounded-2xl bg-[#F7FAF9] border border-[#EEF2F0] flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[#4B5A54]">
                    <MapPin className="w-3.5 h-3.5 text-[#EE7A22] shrink-0" />
                    <span className="truncate">{passenger.commonRoute || 'FPT University → Q.1'}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 border-t border-[#EEF2F0]">
                  <button
                    type="button"
                    onClick={() => navigate('/shared/chat/bk_01')}
                    className="flex-1 h-10 rounded-xl bg-[#F1FAF6] hover:bg-[#DDF3EA] text-[#0B7A5C] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Nhắn tin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/shared/trip-history')}
                    className="flex-1 h-10 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Lịch sử</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#E4EAE7] flex flex-col items-center gap-3 mt-4">
              <div className="w-14 h-14 rounded-full bg-[#F4F7F5] text-[#8A9993] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#8A9993] leading-relaxed">
                Chưa có hành khách nào trong danh sách yêu thích. Hãy bấm icon Trái tim khi xem chi tiết chuyến hoặc nhắn tin để lưu khách quen.
              </p>
            </div>
          )
        ) : (
          /* Passenger View: Only Drivers */
          driversList.length > 0 ? (
            driversList.map((driver) => (
              <div
                key={driver.id}
                className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-xs flex flex-col gap-3 transition-all hover:border-[#B2E2D0]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-[#DDF3EA] text-[#0B7A5C] font-bold text-base flex items-center justify-center shrink-0 border border-[#B2E2D0]">
                      {driver.avatar || 'QH'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-[#101B17] truncate">{driver.name}</span>
                        <ShieldCheck className="w-4 h-4 text-[#0F9D76] shrink-0" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#8A9993]">
                        <span className="text-[#EE7A22] font-bold">★ {driver.trustScore || 4.9}</span>
                        <span>·</span>
                        <span>{driver.tripsCompleted || 96} chuyến lái</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(driver)}
                    className="p-2 rounded-xl bg-[#FFF0F0] text-[#C22B35] hover:bg-red-100 transition-colors cursor-pointer"
                    title="Bỏ lưu khỏi danh sách yêu thích"
                  >
                    <Heart className="w-4 h-4 fill-[#C22B35]" />
                  </button>
                </div>

                {/* Vehicle & Route info */}
                <div className="p-2.5 rounded-2xl bg-[#F7FAF9] border border-[#EEF2F0] flex flex-col gap-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[#101B17] font-semibold">
                    <Car className="w-3.5 h-3.5 text-[#0B7A5C]" />
                    <span>{driver.vehicle || 'Honda City · 51G-119.02'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#4B5A54]">
                    <MapPin className="w-3.5 h-3.5 text-[#EE7A22] shrink-0" />
                    <span className="truncate">{driver.commonRoute || 'FPT University → Q.1'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-[#EEF2F0]">
                  <button
                    type="button"
                    onClick={() => navigate('/shared/chat/bk_01')}
                    className="flex-1 h-10 rounded-xl bg-[#F1FAF6] hover:bg-[#DDF3EA] text-[#0B7A5C] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Nhắn tin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/shared/trip-history')}
                    className="flex-1 h-10 rounded-xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Lịch sử</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#E4EAE7] flex flex-col items-center gap-3 mt-4">
              <div className="w-14 h-14 rounded-full bg-[#F4F7F5] text-[#8A9993] flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#8A9993] leading-relaxed">
                Chưa có tài xế nào trong danh sách yêu thích. Hãy bấm icon Trái tim khi tìm chuyến để lưu tài xế quen.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
