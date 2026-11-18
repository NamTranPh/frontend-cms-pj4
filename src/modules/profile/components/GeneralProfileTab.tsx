import { Mail, MapPin, Phone, Save, Shield, User } from 'lucide-react';
import React, { useState } from 'react';
import { useToast } from '../../../components/feedback';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { AdminProfile, UpdateProfileRequest } from '../types/profile.types';

interface GeneralProfileTabProps {
  user: AdminProfile | null;
  onUpdate: (data: UpdateProfileRequest) => Promise<void>;
}

export const GeneralProfileTab: React.FC<GeneralProfileTabProps> = ({
  user,
  onUpdate,
}) => {
  const toast = useToast();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Họ và tên không được để trống', 'Cảnh báo');
      return;
    }

    setIsSaving(true);
    try {
      await onUpdate({
        name: name.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
      });
      toast.success('Cập nhật thông tin quản trị viên thành công!', 'Thành công');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Cập nhật hồ sơ thất bại';
      toast.error(msg, 'Lỗi');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-xs">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pb-3">
        Thông tin tài khoản
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Họ và tên"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<User size={16} />}
            placeholder="Nhập họ và tên..."
          />

          <Input
            label="Địa chỉ Email"
            type="email"
            value={user?.email || 'admin@admin.vn'}
            disabled
            leftIcon={<Mail size={16} />}
          />

          <Input
            label="Số điện thoại"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone size={16} />}
            placeholder="Nhập số điện thoại..."
          />

          <Input
            label="Vai trò hệ thống"
            value="Quản trị viên cấp cao (ADMIN)"
            disabled
            leftIcon={<Shield size={16} />}
          />
        </div>

        <Input
          label="Địa chỉ liên hệ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          leftIcon={<MapPin size={16} />}
          placeholder="Nhập địa chỉ liên hệ..."
        />

        <div className="pt-3 flex items-center justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isSaving}
            className="px-5 py-2.5 font-bold text-xs gap-2 cursor-pointer"
          >
            <Save size={16} />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
