import React from 'react';
import { Users } from 'lucide-react';

/**
 * Module Users - Trang Quản Trị Người Dùng (AdminUserPage)
 *
 * Chức năng tương lai:
 * - Bảng danh sách tài khoản: Avatar, Email, Họ tên, Role (USER/ADMIN), Trạng thái (ACTIVE/BANNED), Ngày tạo
 * - Bộ lọc tìm kiếm nhanh theo Email / Tên / Trạng thái
 * - Khóa / Mở khóa tài khoản người dùng kèm nhập lý do khóa
 * - Phân trang dữ liệu đồng bộ trên URL
 */
export const AdminUserPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Users className="text-[#002b80] dark:text-cyan-400" />
            Quản Lý Người Dùng (User Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Module kiểm soát danh sách người dùng, phân quyền quản trị và thực hiện khóa / mở khóa tài khoản vi phạm.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
        [Module Người Dùng - Khung cấu trúc sẵn sàng, đang chờ triển khai logic nghiệp vụ]
      </div>
    </div>
  );
};
