import React from 'react';
import { CreditCard } from 'lucide-react';

/**
 * Module Payments - Trang Quản Trị Giao Dịch PayOS (AdminPaymentPage)
 *
 * Chức năng tương lai:
 * - Bảng danh sách lịch sử đơn hàng thanh toán (Mã đơn, Email, Gói VIP, Số tiền VNĐ, Trạng thái, Ngày giờ)
 * - Bộ lọc trạng thái: Đã thanh toán (PAID), Đang chờ (PENDING), Đã hủy (CANCELLED)
 * - Nút Đối soát thủ công (Reconcile) đối với các đơn PENDING nếu Webhook PayOS bị trễ mạng
 */
export const AdminPaymentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <CreditCard className="text-[#002b80] dark:text-cyan-400" />
            Quản Lý Giao Dịch PayOS (Payment & Transactions)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Module theo dõi biến động dòng tiền nạp VIP qua cổng VietQR PayOS và xử lý đối soát giao dịch.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
        [Module Giao Dịch - Khung cấu trúc sẵn sàng, đang chờ triển khai logic nghiệp vụ]
      </div>
    </div>
  );
};
