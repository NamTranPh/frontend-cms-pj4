import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { IconPicker } from './IconPicker';
import { IconRenderer } from './IconRenderer';
import type {
  GenreItem,
  CreateGenreRequest,
  UpdateGenreRequest,
  GenreStatus,
} from '../types/genre.types';

interface GenreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGenreRequest | UpdateGenreRequest) => Promise<void>;
  initialData?: GenreItem | null;
  isLoading?: boolean;
}

export const GenreFormModal: React.FC<GenreFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEdit = Boolean(initialData);

  const [name, setName] = useState('');
  const [hasIcon, setHasIcon] = useState(false);
  const [icon, setIcon] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<GenreStatus>('ACTIVE');
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      const existingIcon = initialData.icon || '';
      setIcon(existingIcon);
      setHasIcon(Boolean(existingIcon.trim()));
      setDescription(initialData.description || '');
      setStatus(initialData.status || 'ACTIVE');
      setShowPicker(false);
    } else {
      setName('');
      setIcon('');
      setHasIcon(false);
      setDescription('');
      setStatus('ACTIVE');
      setShowPicker(false);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrors({ name: 'Tên thể loại không được để trống.' });
      return;
    }
    if (name.trim().length > 100) {
      setErrors({ name: 'Tên thể loại không được vượt quá 100 ký tự.' });
      return;
    }

    setErrors({});

    const finalIcon = hasIcon && icon.trim() ? icon.trim() : undefined;

    if (isEdit) {
      await onSubmit({
        name: name.trim(),
        icon: finalIcon,
        description: description.trim() || undefined,
        status,
      } as UpdateGenreRequest);
    } else {
      await onSubmit({
        name: name.trim(),
        icon: finalIcon,
        description: description.trim() || undefined,
      } as CreateGenreRequest);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={isEdit ? 'Chỉnh Sửa Thể Loại Phim' : 'Thêm Thể Loại Phim Mới'}
      description={
        isEdit
          ? 'Cập nhật tên, icon nhận diện và trạng thái hiển thị cho thể loại này.'
          : 'Tạo thể loại mới để phân loại phim và hiển thị danh mục trên ứng dụng.'
      }
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo thể loại'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1. Tên thể loại (Input chuẩn hóa, required tự hiển thị ngôi sao đỏ) */}
        <div>
          <Input
            label="Tên thể loại"
            required
            placeholder="Ví dụ: Hành Động, Khoa Học Viễn Tưởng, Kinh Dị..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({});
            }}
            error={errors.name}
            disabled={isLoading}
            autoFocus
          />
        </div>

        {/* 2. Thiết lập Icon: Tối ưu 1 dòng duy nhất (Compact), Custom Checkbox với icon Check trắng */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 p-3 transition-all">
          <div className="flex items-center justify-between gap-3">
            {/* Custom Checkbox sáng sủa + Icon check trắng nổi bật */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div
                onClick={() => {
                  if (isLoading) return;
                  const nextHasIcon = !hasIcon;
                  setHasIcon(nextHasIcon);
                  if (!nextHasIcon) {
                    setIcon('');
                    setShowPicker(false);
                  } else if (!icon) {
                    setIcon('Film');
                  }
                }}
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                  hasIcon
                    ? 'bg-[#002b80] dark:bg-cyan-500 border-[#002b80] dark:border-cyan-500 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:border-slate-400'
                }`}
              >
                {hasIcon && (
                  <Check
                    size={13}
                    strokeWidth={3}
                    className="text-white dark:text-slate-950"
                  />
                )}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Gán biểu tượng Icon (Tùy chọn)
              </span>
            </label>

            {/* Khi bật checkbox: Hiển thị ngay icon preview và nút đổi icon trên cùng 1 dòng */}
            {hasIcon && (
              <div className="flex items-center gap-2 animate-fadeIn">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <div className="text-[#002b80] dark:text-cyan-400 shrink-0">
                    <IconRenderer icon={icon} size={16} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {icon || 'Film'}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPicker(!showPicker)}
                  className="text-xs py-1 px-2.5 h-auto"
                >
                  {showPicker ? 'Đóng bảng' : 'Đổi icon'}
                </Button>
              </div>
            )}
          </div>

          {/* Bảng chọn icon: Chỉ trượt mở ra khi Admin chủ động bấm "Đổi icon", không chiếm chỗ trước */}
          {hasIcon && showPicker && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <IconPicker
                value={icon}
                onChange={(selected) => {
                  setIcon(selected);
                  setShowPicker(false); // Tự động đóng lại sau khi chọn để giao diện luôn gọn gàng
                }}
              />
            </div>
          )}
        </div>

        {/* 3. Trạng thái hoạt động (chỉ hiện khi chỉnh sửa) */}
        {isEdit && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Trạng thái hoạt động
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="genre-status"
                  value="ACTIVE"
                  checked={status === 'ACTIVE'}
                  onChange={() => setStatus('ACTIVE')}
                  className="accent-[#002b80] dark:accent-cyan-500 cursor-pointer"
                />
                <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                  Hoạt động (ACTIVE)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="genre-status"
                  value="INACTIVE"
                  checked={status === 'INACTIVE'}
                  onChange={() => setStatus('INACTIVE')}
                  className="accent-[#002b80] dark:accent-cyan-500 cursor-pointer"
                />
                <span className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                  Ngừng hoạt động (INACTIVE)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* 4. Mô tả tóm tắt (Dùng chung component Input as="textarea", resizable=false cố định cao 3 ô, không còn góc kéo) */}
        <div>
          <Input
            as="textarea"
            label="Mô tả tóm tắt (Tùy chọn)"
            placeholder="Mô tả nội dung, đặc trưng của thể loại phim này..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            resizable={false}
            rows={3}
            maxLength={500}
            showCharCount
          />
        </div>
      </form>
    </Modal>
  );
};
