import { KeyRound, Laptop, User } from 'lucide-react';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../../../components/feedback';
import { AvatarEditModal } from '../components/AvatarEditModal';
import { ChangePasswordTab } from '../components/ChangePasswordTab';
import { GeneralProfileTab } from '../components/GeneralProfileTab';
import { ProfileSummaryCard } from '../components/ProfileSummaryCard';
import { SessionsTab } from '../components/SessionsTab';
import { useProfile } from '../hooks/useProfile';
import { profileService } from '../services/profileService';
import type { UpdateProfileRequest } from '../types/profile.types';

export const AdminProfilePage: React.FC = () => {
  const { profile: user, refreshProfile, updateProfile } = useProfile();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const toast = useToast();

  const activeTab = searchParams.get('tab') || 'general';

  const setTab = (tab: 'general' | 'password' | 'sessions') => {
    setSearchParams({ tab });
  };

  const handleUpdate = async (data: UpdateProfileRequest) => {
    await updateProfile(data);
  };

  const handleSaveAvatar = async (file: File) => {
    await profileService.uploadAvatar(file);
    await refreshProfile();
    toast.success('Cập nhật ảnh đại diện thành công!', 'Thành công');
  };

  const handleDeleteAvatar = async () => {
    await profileService.deleteAvatar();
    await refreshProfile();
    toast.success('Đã gỡ ảnh đại diện thành công!', 'Thành công');
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <User className="text-[#002b80] dark:text-cyan-400" size={26} />
            Hồ Sơ Quản Trị Viên
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý thông tin cá nhân, mật khẩu và danh sách thiết bị đăng nhập.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột Trái: Thẻ Tóm Tắt Profile */}
        <div className="lg:col-span-1 space-y-6">
          <ProfileSummaryCard
            user={user}
            onEditAvatar={() => setIsAvatarModalOpen(true)}
          />
        </div>

        {/* Cột Phải: Tabs Quản trị */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thanh chuyển Tab */}
          <div className="flex items-center p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 gap-1.5">
            <button
              type="button"
              onClick={() => setTab('general')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-white dark:bg-[#131c2e] text-[#002b80] dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <User size={15} />
              <span>Thông tin cá nhân</span>
            </button>

            <button
              type="button"
              onClick={() => setTab('password')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-white dark:bg-[#131c2e] text-[#002b80] dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <KeyRound size={15} />
              <span>Đổi mật khẩu</span>
            </button>

            <button
              type="button"
              onClick={() => setTab('sessions')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'sessions'
                  ? 'bg-white dark:bg-[#131c2e] text-[#002b80] dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Laptop size={15} />
              <span>Thiết bị đăng nhập</span>
            </button>
          </div>

          {activeTab === 'general' && (
            <GeneralProfileTab
              key={user?.id || 'admin-profile-form'}
              user={user}
              onUpdate={handleUpdate}
            />
          )}

          {activeTab === 'password' && <ChangePasswordTab />}

          {activeTab === 'sessions' && <SessionsTab />}
        </div>
      </div>

      <AvatarEditModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatarUrl={user?.profileUrl}
        onSaveAvatar={handleSaveAvatar}
        onDeleteAvatar={handleDeleteAvatar}
      />
    </div>
  );
};
