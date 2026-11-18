import React from 'react';
import { Calendar, Camera, CheckCircle2, Shield } from 'lucide-react';
import { Avatar } from '../../../components/ui/Avatar';
import type { AdminProfile } from '../types/profile.types';

interface ProfileSummaryCardProps {
  user: AdminProfile | null;
  onEditAvatar: () => void;
}

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  user,
  onEditAvatar,
}) => {
  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : 'Chưa có thông tin';

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col items-center text-center">
      {/* Avatar lớn kèm nút icon máy ảnh tinh gọn ở góc */}
      <div className="relative mb-3 group">
        <Avatar
          src={user?.profileUrl}
          name={user?.name}
          size="2xl"
          shape="rounded"
          className="w-24 h-24 text-3xl shadow-lg shadow-cyan-500/10"
        />

        {/* Chấm trạng thái hoạt động ở góc trên */}
        <span
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#131c2e]"
          title="Đang hoạt động"
        />

        {/* Nút icon Máy ảnh ở góc dưới bên phải avatar */}
        <button
          type="button"
          onClick={onEditAvatar}
          className="absolute -bottom-1.5 -right-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:bg-cyan-50 dark:hover:bg-slate-700 shadow-md shadow-black/10 transition-all cursor-pointer hover:scale-110"
          title="Chỉnh sửa ảnh đại diện"
        >
          <Camera size={15} />
        </button>
      </div>

      {/* Tên Quản trị viên và Email ngay bên dưới avatar */}
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        {user?.name || 'Administrator'}
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        {user?.email || 'admin@admin.vn'}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
          {user?.role || 'ADMIN'}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 size={12} />
          {user?.accountStatus || 'ACTIVE'}
        </span>
      </div>

      {/* Thông tin phụ */}
      <div className="w-full mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-left space-y-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            Ngày tham gia
          </span>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {formattedDate}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Shield size={14} className="text-slate-400" />
            Quyền hạn
          </span>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            Toàn quyền hệ thống
          </span>
        </div>
      </div>
    </div>
  );
};
