import React, { useState } from 'react';
import { X, AlertTriangle, ShieldAlert, Wallet, Car, XCircle, MoreHorizontal, Check, ShieldCheck, Siren } from 'lucide-react';
import { useApp } from '../context/AppContext';

const REPORT_CATEGORIES = [
  { id: 'unsafe_driving', label: 'Lái xe không an toàn', hint: 'Phóng nhanh, vượt ẩu, phanh gấp...', severity: 'high', icon: AlertTriangle },
  { id: 'inappropriate_behavior', label: 'Hành vi không phù hợp', hint: 'Lời nói, cử chỉ khiến bạn khó chịu', severity: 'medium', icon: ShieldAlert },
  { id: 'wrong_charge', label: 'Tính phí sai quy tắc', hint: 'Thu nhiều hơn mức hiển thị trên ứng dụng', severity: 'high', icon: Wallet },
  { id: 'vehicle_mismatch', label: 'Phương tiện không đúng đăng ký', hint: 'Xe/biển số khác với thông tin trên app', severity: 'medium', icon: Car },
  { id: 'abrupt_cancel', label: 'Huỷ chuyến đột xuất', hint: 'Huỷ sát giờ mà không báo trước', severity: 'low', icon: XCircle },
  { id: 'other', label: 'Vấn đề khác', hint: 'Sự cố không thuộc các mục trên', severity: 'low', icon: MoreHorizontal },
];

// Reusable report sheet for SF-21 (Report User) & SF-22 (Report Safety Incident).
// Mount near driver/passenger contact points and pass who/what is being reported.
export const ReportModal = ({ open, onClose, reportedName, tripCode }) => {
  const { submitReport } = useApp();
  const [categoryId, setCategoryId] = useState(null);
  const [details, setDetails] = useState('');
  const [submittedReport, setSubmittedReport] = useState(null);

  if (!open) return null;

  const selectedCategory = REPORT_CATEGORIES.find((c) => c.id === categoryId);

  const handleClose = () => {
    setCategoryId(null);
    setDetails('');
    setSubmittedReport(null);
    onClose?.();
  };

  const handleSubmit = () => {
    if (!selectedCategory) return;
    const report = submitReport({
      tripCode,
      targetName: reportedName,
      category: selectedCategory.label,
      severity: selectedCategory.severity,
      description: details.trim(),
    });
    setSubmittedReport(report);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-[#07110D]/55 backdrop-blur-[2.5px] animate-rs-backdrop-in"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        onClick={(event) => event.stopPropagation()}
        className="animate-rs-sheet-up flex max-h-[90vh] w-full max-w-[390px] flex-col overflow-hidden rounded-t-[30px] bg-white shadow-[0_-18px_48px_rgba(7,17,13,0.22)]"
      >
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-[#D7E0DC]" />

        {submittedReport ? (
          <div className="flex flex-col items-center gap-3.5 px-5 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#DDF3EA] text-[#0F9D76] flex items-center justify-center animate-rs-pop">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#101B17]">Đã gửi báo cáo</h2>
            <p className="text-sm text-[#4B5A54] leading-relaxed max-w-[28ch]">
              Đội an toàn RouteShare sẽ xem xét và phản hồi trong vòng 24 giờ. Cảm ơn bạn đã giúp cộng đồng an toàn hơn.
            </p>
            <span className="px-3 py-1.5 rounded-full bg-[#F4F7F5] text-[#4B5A54] text-xs font-mono font-bold">
              Mã báo cáo: {submittedReport.id}
            </span>
            <button
              type="button"
              onClick={handleClose}
              className="w-full h-12 mt-2 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between px-5 pb-3 pt-2.5 shrink-0">
              <div className="min-w-0">
                <h2 id="report-modal-title" className="text-lg font-bold text-[#101B17]">Báo cáo sự cố</h2>
                {reportedName && (
                  <p className="mt-0.5 text-sm text-[#8A9993] truncate">
                    Liên quan đến {reportedName}{tripCode ? ` · ${tripCode}` : ''}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Đóng"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F4F7F5] text-[#101B17] hover:bg-[#E4EAE7] shrink-0 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="rs-scroll flex-1 overflow-y-auto px-5 pb-4 flex flex-col gap-3">
              <div className="rounded-2xl bg-[#FFF4E9] border border-[#F7D9B8] px-3.5 py-2.5 flex items-start gap-2.5">
                <Siren className="w-4 h-4 text-[#EE7A22] shrink-0 mt-0.5" />
                <span className="text-[11px] text-[#8A4A0B] leading-relaxed">
                  Đang gặp nguy hiểm ngay lúc này? Dùng nút <strong>SOS khẩn cấp</strong> thay vì gửi báo cáo.
                </span>
              </div>

              <span className="text-xs font-bold text-[#101B17]">Chọn loại sự cố</span>
              <div className="flex flex-col gap-2">
                {REPORT_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = categoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      className={`flex items-start gap-3 p-3 rounded-2xl border-[1.5px] text-left transition-all cursor-pointer ${
                        isSelected ? 'border-[#0F9D76] bg-[#F1FAF6]' : 'border-[#E4EAE7] bg-white hover:border-[#BDE7D5]'
                      }`}
                    >
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#0F9D76] text-white' : 'bg-[#F4F7F5] text-[#4B5A54]'}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-[#101B17]">{cat.label}</span>
                        <span className="block text-[11px] text-[#8A9993] mt-0.5">{cat.hint}</span>
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#0F9D76] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-xs font-bold text-[#101B17]">Mô tả chi tiết (tuỳ chọn)</span>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="Mô tả cụ thể điều đã xảy ra để đội an toàn xử lý nhanh hơn..."
                  className="w-full text-xs text-[#101B17] bg-[#F7FAF9] border border-[#E4EAE7] rounded-2xl p-3 outline-none focus:border-[#0F9D76] resize-none"
                />
              </div>
            </div>

            <div className="flex-none px-5 pt-3 pb-5 border-t border-[#EEF2F0]">
              <button
                type="button"
                disabled={!categoryId}
                onClick={handleSubmit}
                className="w-full h-13 rounded-2xl bg-[#0F9D76] hover:bg-[#0B7A5C] disabled:bg-[#DFE7E3] disabled:cursor-not-allowed text-white font-bold text-sm shadow-[0_8px_20px_rgba(15,157,118,0.28)] disabled:shadow-none transition-all cursor-pointer"
              >
                Gửi báo cáo
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};
