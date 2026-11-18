import React, { useState, useEffect } from 'react';
import { User, Upload, X, Loader2 } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Avatar } from '../../../components/ui/Avatar';
import { ImageCropModal } from '../../../components/ui/ImageCropModal';
import { adminActorService } from '../services/adminActorService';
import { useToast } from '../../../components/feedback';
import type {
  ActorItem,
  CreateActorRequest,
  UpdateActorRequest,
} from '../types/actor.types';

interface ActorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateActorRequest | UpdateActorRequest) => Promise<void>;
  initialData?: ActorItem | null;
  isLoading?: boolean;
}

export const ActorFormModal: React.FC<ActorFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEdit = Boolean(initialData);
  const toast = useToast();

  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [nationality, setNationality] = useState('Việt Nam');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setOriginalName(initialData.originalName || '');
      setNationality(initialData.nationality || 'Việt Nam');
      setBirthDate(initialData.birthDate || '');
      setBio(initialData.bio || '');
      setAvatarUrl(initialData.avatarUrl || '');
    } else {
      setName('');
      setOriginalName('');
      setNationality('Việt Nam');
      setBirthDate('');
      setBio('');
      setAvatarUrl('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Vui lòng chọn tệp hình ảnh (.jpg, .png, .webp...)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning('Kích thước ảnh tối đa là 5MB');
      return;
    }

    setCropFile(file);
    setIsCropOpen(true);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    setIsUploadingAvatar(true);
    try {
      const res = await adminActorService.uploadAvatar(croppedFile);
      const url = res.previewUrl || res.objectKey;
      if (url) {
        setAvatarUrl(url);
        toast.success('Tải lên ảnh đại diện đã cắt thành công');
      } else {
        toast.error('Không nhận được URL ảnh từ máy chủ');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload Avatar thất bại';
      toast.error(msg);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrors({ name: 'Tên diễn viên không được để trống' });
      return;
    }

    setErrors({});

    const payload: CreateActorRequest = {
      name: name.trim(),
      originalName: originalName.trim() || undefined,
      nationality: nationality.trim() || undefined,
      birthDate: birthDate || undefined,
      bio: bio.trim() || undefined,
      avatarUrl: avatarUrl || undefined,
    };

    await onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-500" />
          <span>{isEdit ? `Chỉnh Sửa Diễn Viên: ${initialData?.name}` : 'Thêm Mới Diễn Viên'}</span>
        </div>
      }
      description="Điền thông tin hồ sơ, tải lên ảnh đại diện và lưu trữ thông tin diễn viên."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Upload Avatar Tròn */}
        <div className="flex flex-col items-center justify-center pb-2">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center group">
            {avatarUrl ? (
              <>
                <Avatar
                  src={avatarUrl}
                  name={name}
                  size="2xl"
                  shape="circle"
                  className="w-full h-full border-none"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer transition-colors" title="Đổi ảnh">
                    <Upload size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={isUploadingAvatar || isLoading}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 cursor-pointer transition-colors"
                    title="Xóa avatar"
                  >
                    <X size={14} />
                  </button>
                </div>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                {isUploadingAvatar ? (
                  <Loader2 size={24} className="animate-spin text-cyan-500" />
                ) : (
                  <>
                    <Upload size={20} className="text-slate-400 mb-1" />
                    <span className="text-[10px] text-slate-400 font-medium">Tải ảnh</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isUploadingAvatar || isLoading}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <span className="text-xs text-slate-400 mt-1.5">Ảnh đại diện diễn viên (Tỷ lệ 1:1)</span>
        </div>

        {/* Tên & Tên gốc */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Tên diễn viên"
            required
            placeholder="Ví dụ: Trấn Thành, Robert Downey Jr."
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            disabled={isLoading}
          />
          <Input
            label="Tên gốc / Nghệ danh"
            placeholder="Ví dụ: Huỳnh Trấn Thành..."
            value={originalName}
            onChange={(e) => setOriginalName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Quốc tịch & Ngày sinh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Quốc tịch"
            placeholder="Ví dụ: Việt Nam, Mỹ, Hàn Quốc..."
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            disabled={isLoading}
          />
          <Input
            type="date"
            label="Ngày sinh"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Tiểu sử */}
        <Input
          as="textarea"
          label="Tiểu sử / Giới thiệu tóm tắt"
          rows={3}
          maxLength={500}
          showCharCount
          placeholder="Giới thiệu sơ lược về sự nghiệp, giải thưởng, phong cách diễn xuất..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={isLoading}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading || isUploadingAvatar}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || isUploadingAvatar}
          >
            {isEdit ? 'Lưu thay đổi' : 'Thêm diễn viên'}
          </Button>
        </div>
      </form>

      <ImageCropModal
        isOpen={isCropOpen}
        onClose={() => {
          setIsCropOpen(false);
          setCropFile(null);
        }}
        imageFile={cropFile}
        shape="circle"
        aspectRatio={1}
        aspectRatioLabel="1:1 (Tròn)"
        title="Cắt Ảnh Đại Diện Diễn Viên"
        description="Kéo, phóng to/thu nhỏ và xoay để có khung hình chân dung chuẩn nhất."
        outputWidth={512}
        outputHeight={512}
        onCropComplete={handleCropComplete}
        isSubmitting={isUploadingAvatar}
      />
    </Modal>
  );
};
