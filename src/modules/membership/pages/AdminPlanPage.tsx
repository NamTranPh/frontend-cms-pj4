import React from 'react';
import { Crown } from 'lucide-react';

/**
 * Module Membership - Trang Quản Trị Gói VIP (AdminPlanPage)
 *
 * Chức năng tương lai:
 * - Bảng danh sách các gói dịch vụ VIP (Tên, Giá VNĐ, Thời hạn ngày, Quyền 1080p/4K, Ẩn/Hiện)
 * - Nút Thêm mới gói VIP (Mở PlanFormModal)
 * - Nút Sửa thông tin giá và quyền lợi của gói
 * - Bật / Tắt trạng thái kích hoạt hiển thị ngoài Web xem phim
 */
export const AdminPlanPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Crown className="text-[#002b80] dark:text-cyan-400" />
            Quản Lý Gói VIP (Membership Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Module cấu hình bảng giá và quyền lợi các gói hội viên xem phim chất lượng cao 1080p/4K không quảng cáo.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
        [Module Gói VIP - Khung cấu trúc sẵn sàng, đang chờ triển khai logic nghiệp vụ]
      </div>
    </div>
  );
};
