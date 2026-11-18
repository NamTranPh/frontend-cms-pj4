import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Crown,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Lock,
  Unlock,
} from 'lucide-react';
import { Drawer } from '../../../components/ui/Drawer';
import { Badge } from '../../../components/ui/Badge';
import { Avatar } from '../../../components/ui/Avatar';
import type { AdminUser } from '../types/user.types';

export interface UserDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onToggleBan: (user: AdminUser) => void;
  isCurrentAdmin?: boolean;
}

export const UserDetailDrawer: React.FC<UserDetailDrawerProps> = ({
  isOpen,
  onClose,
  user,
  onToggleBan,
  isCurrentAdmin = false,
}) => {
  const [hasCopiedId, setHasCopiedId] = useState(false);

  if (!user) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setHasCopiedId(true);
    setTimeout(() => setHasCopiedId(false), 2000);
  };

  const formattedJoinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Chưa cập nhật';

  const formattedVipExpiry = user.membershipEndDate
    ? new Date(user.membershipEndDate).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Chi Tiết Tài Khoản"
      description="Thông tin chi tiết và quyền hạn của người dùng trên hệ thống"
      width="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-400">
            {isCurrentAdmin && '(Tài khoản của bạn)'}
          </div>
          <div className="flex items-center gap-2">
            {!isCurrentAdmin && (
              <button
                type="button"
                onClick={() => onToggleBan(user)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                  user.isBanned
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30'
                }`}
              >
                {user.isBanned ? (
                  <>
                    <Unlock size={14} />
                    <span>Mở khóa tài khoản</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Khóa tài khoản này</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Khối Header Profile */}
        <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80">
          <div className="relative mb-3">
            <Avatar
              src={user.profileUrl}
              name={user.name}
              size="2xl"
              shape="rounded"
              className="shadow-md shadow-cyan-500/15"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#131c2e] ${
                user.isBanned ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              title={user.isBanned ? 'Đã bị khóa' : 'Đang hoạt động'}
            />
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {user.name || 'Chưa cập nhật'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {user.email}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
            <Badge variant={user.role === 'ADMIN' ? 'cyan' : 'slate'} size="sm">
              <Shield size={12} />
              <span>{user.role}</span>
            </Badge>

            <Badge variant={user.isBanned ? 'danger' : 'success'} size="sm" dot>
              <span>{user.isBanned ? 'BANNED' : user.accountStatus || 'ACTIVE'}</span>
            </Badge>

            {user.isVip ? (
              <Badge variant="purple" size="sm">
                <Crown size={12} />
                <span>{user.currentPlanName || 'Gói VIP'}</span>
              </Badge>
            ) : (
              <Badge variant="default" size="sm">
                <span>Free Plan</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Mã ID Người Dùng */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="space-y-0.5 overflow-hidden">
            <span className="text-[11px] font-medium text-slate-400 block">
              Mã định danh User ID
            </span>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 block truncate">
              {user.id}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyId}
            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-500 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Sao chép ID"
          >
            {hasCopiedId ? (
              <Check size={16} className="text-emerald-500" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>

        {/* Thông tin liên hệ & hệ thống */}
        <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-400">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Thông Tin Chi Tiết
          </h4>

          <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-slate-500">
                <Mail size={14} />
                <span>Xác thực Email</span>
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                {user.emailVerified ? (
                  <>
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>Đã xác minh</span>
                  </>
                ) : (
                  <>
                    <XCircle size={13} className="text-amber-500" />
                    <span>Chưa xác minh</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
              <span className="flex items-center gap-2 text-slate-500">
                <Phone size={14} />
                <span>Số điện thoại</span>
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {user.phone || 'Chưa cập nhật'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
              <span className="flex items-center gap-2 text-slate-500">
                <MapPin size={14} />
                <span>Địa chỉ</span>
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200 text-right max-w-xs truncate">
                {user.address || 'Chưa cập nhật'}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
              <span className="flex items-center gap-2 text-slate-500">
                <Calendar size={14} />
                <span>Ngày tham gia</span>
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formattedJoinDate}
              </span>
            </div>

            {user.isVip && formattedVipExpiry && (
              <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                <span className="flex items-center gap-2 text-purple-500">
                  <Crown size={14} />
                  <span>Hạn gói VIP</span>
                </span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {formattedVipExpiry}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};
