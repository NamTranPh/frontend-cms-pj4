import { Eye, EyeOff, KeyRound } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../components/feedback';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ROUTES } from '../../../config/routes.config';
import { useAuth } from '../../../modules/auth/hooks/useAuth';
import { profileService } from '../services/profileService';

export const ChangePasswordTab: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword) {
      toast.warning('Vui lòng nhập mật khẩu hiện tại', 'Cảnh báo');
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('Mật khẩu mới phải có ít nhất 6 ký tự', 'Cảnh báo');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.warning('Xác nhận mật khẩu mới không khớp', 'Cảnh báo');
      return;
    }

    setIsChanging(true);
    try {
      await profileService.changePassword({ oldPassword, newPassword });
      setIsSuccess(true);
      toast.success(
        'Đổi mật khẩu thành công! Hệ thống sẽ chuyển hướng về trang đăng nhập sau 1.5 giây...',
        'Thành công'
      );
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Thu hồi refresh token và điều hướng về trang đăng nhập
      setTimeout(async () => {
        try {
          await logout();
        } finally {
          navigate(ROUTES.PUBLIC.LOGIN);
        }
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đổi mật khẩu thất bại';
      toast.error(msg, 'Lỗi');
      setIsChanging(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-xs">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pb-3">
        Đổi mật khẩu đăng nhập
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Mật khẩu hiện tại"
          type={showOldPassword ? 'text' : 'password'}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          disabled={isChanging || isSuccess}
          leftIcon={<KeyRound size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              disabled={isChanging || isSuccess}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          placeholder="Nhập mật khẩu hiện tại..."
        />

        <Input
          label="Mật khẩu mới"
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={isChanging || isSuccess}
          leftIcon={<KeyRound size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              disabled={isChanging || isSuccess}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
        />

        <Input
          label="Xác nhận mật khẩu mới"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isChanging || isSuccess}
          leftIcon={<KeyRound size={16} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isChanging || isSuccess}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
          placeholder="Nhập lại mật khẩu mới..."
        />

        <div className="pt-3 flex justify-end items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={isChanging || isSuccess}
            className="px-5 py-2.5 font-bold text-xs gap-2 cursor-pointer"
          >
            <KeyRound size={16} />
            <span>
              {isSuccess
                ? 'Đang chuyển hướng...'
                : isChanging
                  ? 'Đang xử lý...'
                  : 'Cập Nhật Mật Khẩu'}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};
