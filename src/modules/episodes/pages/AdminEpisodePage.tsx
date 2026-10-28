import React from 'react';
import { Video } from 'lucide-react';

/**
 * Module Episodes - Trang Quản Trị Tập Phim (AdminEpisodePage)
 * Chức năng tương lai:
 * - Danh sách các tập phim theo từng bộ phim
 * - Nút Thêm tập mới, cập nhật số tập, upload thumbnail
 * - Nút mở Modal Upload Video và Xem trước HLS Player
 */
export const AdminEpisodePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Video className="text-[#002b80] dark:text-cyan-400" />
            Quản Lý Tập Phim & Video (Episode & Video Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Module quản lý các tập phim của phim bộ, tải lên video dung lượng lớn và kích hoạt HLS Transcode.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
        [Module Tập Phim - Khung cấu trúc sẵn sàng, đang chờ triển khai logic nghiệp vụ]
      </div>
    </div>
  );
};
