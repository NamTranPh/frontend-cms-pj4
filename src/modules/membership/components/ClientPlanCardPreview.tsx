import React, { useState } from 'react';
import {
  Check,
  X,
  Crown,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';

export interface ClientPlanCardPreviewProps {
  name: string;
  price: number;
  durationDays: number;
  maxDevices?: number | null;
  canDownload?: boolean | null;
  videoQuality?: string | null;
  description?: string | null;
  isActive?: boolean;
  highlight?: boolean;
}

export const ClientPlanCardPreview: React.FC<ClientPlanCardPreviewProps> = ({
  name,
  price,
  durationDays,
  maxDevices = 1,
  canDownload = false,
  videoQuality = '1080p',
  description,
  isActive = true,
  highlight = false,
}) => {
  // Cho phép Admin test thử hiển thị ở Dark mode và Light mode của Client
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val || 0);
  };

  // Tách các dòng quyền lợi thêm từ description
  const customBenefits = (description || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const isDark = themeMode === 'dark';

  return (
    <div className="flex flex-col items-center w-full">
      {/* Thanh công cụ Preview chế độ Sáng / Tối */}
      <div className="flex items-center justify-between w-full max-w-sm mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Sparkles size={13} className="text-amber-500" />
          <span className="font-medium">Mô phỏng giao diện Client:</span>
        </div>

        <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setThemeMode('dark')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-colors ${
              isDark
                ? 'bg-slate-900 text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Moon size={11} /> Tối
          </button>
          <button
            type="button"
            onClick={() => setThemeMode('light')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-colors ${
              !isDark
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sun size={11} /> Sáng
          </button>
        </div>
      </div>

      {/* Thẻ Card Gói VIP mô phỏng */}
      <div
        className={`w-full max-w-sm rounded-3xl p-6 transition-all relative overflow-hidden border shadow-xl ${
          isDark
            ? 'bg-gradient-to-b from-[#131c2e] to-[#090d16] text-slate-100 border-slate-800 shadow-black/40'
            : 'bg-gradient-to-b from-white to-slate-50 text-slate-900 border-slate-200 shadow-slate-200/60'
        } ${
          highlight
            ? 'ring-2 ring-cyan-500/80 shadow-cyan-500/10'
            : ''
        }`}
      >
        {/* Ánh sáng trang trí góc trên */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Trạng thái Ẩn/Hiện */}
        {!isActive && (
          <div className="mb-3 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[11px] font-semibold text-center">
            ⚠ Gói đang tạm ẩn (Chưa hiển thị ngoài Web)
          </div>
        )}

        {/* Huy hiệu đỉnh thẻ */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-500 text-xs font-bold tracking-wide uppercase">
            <Crown size={13} className="text-cyan-500" />
            VIP Membership
          </div>

          {highlight && (
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
              Phổ biến nhất
            </span>
          )}
        </div>

        {/* Tên gói */}
        <h3
          className={`text-xl font-bold mb-1 truncate ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          {name || 'Tên Gói VIP'}
        </h3>
        <p
          className={`text-xs mb-5 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Thưởng thức toàn bộ kho phim bom tấn không giới hạn
        </p>

        {/* Khung Giá Tiền */}
        <div
          className={`p-4 rounded-2xl mb-6 border ${
            isDark
              ? 'bg-slate-900/80 border-slate-800/80'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-3xl font-extrabold tracking-tight ${
                isDark ? 'text-cyan-400' : 'text-[#002b80]'
              }`}
            >
              {formatPrice(price)}
            </span>
            <span className="text-xs font-semibold text-slate-500">₫</span>
            <span className="text-xs text-slate-400 font-medium ml-1">
              / {durationDays || 30} ngày
            </span>
          </div>

          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span>Thanh toán tiện lợi qua PayOS (QR MoMo/Ngân hàng)</span>
          </div>
        </div>

        {/* Danh sách Quyền lợi */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Đặc quyền hội viên:
          </div>

          {/* Chất lượng video */}
          <div className="flex items-center gap-2.5 text-xs">
            <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <Check size={13} strokeWidth={2.5} />
            </div>
            <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
              Chất lượng tối đa:{' '}
              <strong className="text-cyan-500 dark:text-cyan-400 font-bold">
                {videoQuality || 'Full HD 1080p'}
              </strong>
            </span>
          </div>

          {/* Số thiết bị đồng thời */}
          <div className="flex items-center gap-2.5 text-xs">
            <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <Check size={13} strokeWidth={2.5} />
            </div>
            <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
              Xem cùng lúc trên:{' '}
              <strong className="font-bold">
                {maxDevices || 1} thiết bị
              </strong>
            </span>
          </div>

          {/* Tải xuống ngoại tuyến */}
          <div className="flex items-center gap-2.5 text-xs">
            {canDownload ? (
              <>
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                  <Check size={13} strokeWidth={2.5} />
                </div>
                <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  Tải phim về xem ngoại tuyến (Offline)
                </span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-slate-500/15 text-slate-400 flex items-center justify-center shrink-0">
                  <X size={13} strokeWidth={2} />
                </div>
                <span className="text-slate-400 line-through">
                  Tải phim về xem ngoại tuyến
                </span>
              </>
            )}
          </div>

          {/* Không quảng cáo mặc định */}
          <div className="flex items-center gap-2.5 text-xs">
            <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <Check size={13} strokeWidth={2.5} />
            </div>
            <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
              Hoàn toàn <strong>không có quảng cáo</strong> gián đoạn
            </span>
          </div>

          {/* Các quyền lợi bổ sung từ description */}
          {customBenefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs">
              <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                <Check size={13} strokeWidth={2.5} />
              </div>
              <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* Nút hành động giả lập Client */}
        <button
          type="button"
          disabled
          className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 shadow-lg shadow-cyan-500/25 transition-all cursor-default"
        >
          Đăng Ký Gói Này
        </button>

        <p className="text-[10px] text-center text-slate-400 mt-2.5">
          Tự động kích hoạt ngay sau khi chuyển khoản thành công
        </p>
      </div>
    </div>
  );
};
