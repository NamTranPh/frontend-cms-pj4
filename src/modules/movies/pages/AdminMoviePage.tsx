import React from 'react';
import { Film } from 'lucide-react';

/**
 * Module Movies - Trang Quản Trị Danh Sách Phim (AdminMoviePage)
 * Chức năng tương lai:
 * - Bảng danh sách Phim (Search, Filter thể loại/trạng thái, Phân trang)
 * - Nút Thêm mới phim (Mở MovieFormModal)
 * - Nút Sửa / Xóa mềm / Khôi phục / Xuất bản phim
 */
export const AdminMoviePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Film className="text-[#002b80] dark:text-cyan-400" />
            Quản Lý Phim (Movie Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Module quản lý kho phim lẻ và phim bộ, upload poster, backdrop và xuất bản phim.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
        [Module Phim - Khung cấu trúc sẵn sàng, đang chờ triển khai logic nghiệp vụ]
      </div>
    </div>
  );
};
