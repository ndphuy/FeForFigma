import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Wallet,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
  CreditCard,
  Building2
} from 'lucide-react';

export const WalletDetail = () => {
  const navigate = useNavigate();
  const { driverWallet, passengerWallet } = useApp();

  const formattedDriverWallet = new Intl.NumberFormat('vi-VN').format(driverWallet);
  const formattedPassengerWallet = new Intl.NumberFormat('vi-VN').format(passengerWallet);

  // Mock Transaction History — merged across both wallets, tagged per role
  const [transactions] = useState([
    {
      id: 'tx_drv_01',
      role: 'driver',
      title: 'Tiền cước từ Thùy Linh (Q.7 → Q.1)',
      date: 'Hôm nay · 07:55',
      amount: 45000,
      type: 'in', // 'in' | 'out'
    },
    {
      id: 'tx_pas_01',
      role: 'passenger',
      title: 'Nạp tiền ví RouteShare (PayOS/VietQR)',
      date: 'Hôm nay · 06:30',
      amount: 200000,
      type: 'in',
    },
    {
      id: 'tx_drv_02',
      role: 'driver',
      title: 'Tiền cước từ Hoàng Nam (Q.4 → Q.1)',
      date: 'Hôm qua · 17:45',
      amount: 45000,
      type: 'in',
    },
    {
      id: 'tx_pas_02',
      role: 'passenger',
      title: 'Thanh toán chuyến đi Nguyễn Minh (Q.7 → Q.1)',
      date: 'Hôm qua · 07:55',
      amount: -45000,
      type: 'out',
    },
    {
      id: 'tx_drv_03',
      role: 'driver',
      title: 'Rút tiền về tài khoản Techcombank',
      date: '09/09/2026',
      amount: -500000,
      type: 'out',
    },
    {
      id: 'tx_pas_03',
      role: 'passenger',
      title: 'Thanh toán chuyến đi Hoàng Tùng (Q.7 → Q.1)',
      date: '09/09/2026',
      amount: -52000,
      type: 'out',
    },
    {
      id: 'tx_drv_04',
      role: 'driver',
      title: 'Tiền cước từ Thanh Trúc',
      date: '08/09/2026',
      amount: 52000,
      type: 'in',
    },
    {
      id: 'tx_pas_04',
      role: 'passenger',
      title: 'Nạp tiền ví RouteShare',
      date: '05/09/2026',
      amount: 300000,
      type: 'in',
    }
  ]);

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#F4F7F5]">
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-[#E4EAE7] flex items-center justify-center text-[#101B17] shadow-xs hover:bg-[#F1FAF6] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold text-[#101B17]">Chi tiết Ví RouteShare</h1>
          <div className="w-10" />
        </div>

        {/* Balance Cards: driver + passenger side by side */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] space-y-2.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wide text-[#2F6FCE] bg-[#EAF2FF] px-2 py-0.5 rounded-full inline-block">
              Ví tài xế
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#0F9D76]">{formattedDriverWallet}</span>
              <span className="text-xs font-bold text-[#101B17]">đ</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] space-y-2.5">
            <span className="text-[10.5px] font-bold uppercase tracking-wide text-[#D96A16] bg-[#FFF4E9] px-2 py-0.5 rounded-full inline-block">
              Ví hành khách
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#0F9D76]">{formattedPassengerWallet}</span>
              <span className="text-xs font-bold text-[#101B17]">đ</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={() => navigate('/wallet/top-up')}
          className="w-full py-3 bg-[#0F9D76] hover:bg-[#0B7A5C] active:scale-[0.99] text-white font-bold rounded-2xl text-xs transition-all shadow-xs flex items-center justify-center space-x-1.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nạp tiền vào ví</span>
        </button>

        {/* Transaction History Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#101B17] uppercase tracking-wider">
              Lịch sử giao dịch
            </h2>
            <span className="text-[11px] text-[#8A9993]">Cả 2 ví · Gần đây</span>
          </div>

          <div className="bg-white rounded-3xl border border-[#E4EAE7] shadow-[0_2px_8px_rgba(16,27,23,0.03)] divide-y divide-[#E4EAE7] overflow-hidden">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-[#F1FAF6] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${tx.type === 'in'
                      ? 'bg-[#DDF3EA] text-[#0F9D76]'
                      : 'bg-slate-100 text-[#4B5A54]'
                    }`}>
                    {tx.type === 'in' ? (
                      <ArrowDownLeft className="w-4 h-4 stroke-[2.5px]" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5px]" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                        tx.role === 'driver' ? 'bg-[#EAF2FF] text-[#2F6FCE]' : 'bg-[#FFF4E9] text-[#D96A16]'
                      }`}>
                        {tx.role === 'driver' ? 'Ví tài xế' : 'Ví khách'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#101B17] block leading-snug mt-1">
                      {tx.title}
                    </span>
                    <span className="text-[10px] text-[#8A9993] mt-0.5 block">
                      {tx.date}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-bold font-mono ${tx.type === 'in' ? 'text-[#0F9D76]' : 'text-[#101B17]'
                    }`}>
                    {tx.amount > 0 ? `+${new Intl.NumberFormat('vi-VN').format(tx.amount)} đ` : `${new Intl.NumberFormat('vi-VN').format(tx.amount)} đ`}
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">
                    Thành công
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="text-center text-[11px] text-[#8A9993] pt-4">
        Ví điện tử RouteShare được bảo chứng giao dịch tự động.
      </div>
    </div>
  );
};
