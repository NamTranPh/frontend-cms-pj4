import React, { useState, useEffect } from 'react';
import { Video, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ImageCropModal } from '../../../components/ui/ImageCropModal';
import { useToast } from '../../../components/feedback';
import { adminEpisodeService } from '../services/adminEpisodeService';
import type { Episode, CreateEpisodeRequest, UpdateEpisodeRequest } from '../types/episode.types';

export interface EpisodeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEpisodeRequest | UpdateEpisodeRequest) => Promise<void>;
  movieId: string;
  initialData?: Episode | null;
  suggestedEpisodeNumber?: number;
  isLoading?: boolean;
}

export const EpisodeFormModal: React.FC<EpisodeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  movieId,
  initialData,
  suggestedEpisodeNumber = 1,
  isLoading = false,
}) => {
  const isEdit = Boolean(initialData);
  const toast = useToast();

  const [episodeNumber, setEpisodeNumber] = useState<number | string>(suggestedEpisodeNumber);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState<number | string>(45);
  const [airDate, setAirDate] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const [errors, setErrors] = useState<{
    episodeNumber?: string;
    title?: string;
    duration?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setEpisodeNumber(initialData.episodeNumber);
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDuration(initialData.duration || 45);
      setAirDate(initialData.airDate ? initialData.airDate.slice(0, 10) : '');
      setThumbnailUrl(initialData.thumbnailUrl || '');
    } else {
      setEpisodeNumber(suggestedEpisodeNumber);
      setTitle(`Tập ${suggestedEpisodeNumber}`);
      setDescription('');
      setDuration(45);
      setAirDate(new Date().toISOString().slice(0, 10));
      setThumbnailUrl('');
    }
    setErrors({});
  }, [initialData, suggestedEpisodeNumber, isOpen]);

  // Chọn ảnh Thumbnail tập phim (Tỷ lệ 16:9) để mở Modal cắt ảnh
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Vui lòng chọn tệp hình ảnh (.jpg, .png, .webp...)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warning('Kích thước ảnh tối đa là 10MB');
      return;
    }

    setCropFile(file);
    setIsCropOpen(true);
    e.target.value = '';
  };

  // Upload Thumbnail tập phim sau khi đã cắt chuẩn 16:9
  const handleCropComplete = async (croppedFile: File) => {
    if (!movieId) return;
    setIsUploadingThumb(true);
    try {
      const res = await adminEpisodeService.uploadThumbnail(movieId, croppedFile);
      const url = res.previewUrl || res.objectKey || res.url;
      if (url) {
        setThumbnailUrl(url);
        toast.success('Tải lên ảnh thu nhỏ (Thumbnail) chuẩn 16:9 thành công');
      } else {
        toast.error('Không nhận được URL ảnh từ máy chủ');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tải lên Thumbnail thất bại';
      toast.error(msg);
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    const num = Number(episodeNumber);
    if (isNaN(num) || num <= 0) {
      newErrors.episodeNumber = 'Số tập phải là số nguyên dương lớn hơn 0.';
    }
    if (!title.trim()) {
      newErrors.title = 'Tiêu đề tập phim không được để trống.';
    }
    const dur = Number(duration);
    if (isNaN(dur) || dur <= 0) {
      newErrors.duration = 'Thời lượng tập phim phải lớn hơn 0 phút.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const payload: CreateEpisodeRequest | UpdateEpisodeRequest = {
      episodeNumber: num,
      title: title.trim(),
      description: description.trim() || undefined,
      duration: dur,
      airDate: airDate || undefined,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
    };

    await onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Chỉnh Sửa Tập ${initialData?.episodeNumber}` : 'Thêm Tập Phim Mới'}
      description="Điền thông tin số tập, tiêu đề, thời lượng và ảnh thumbnail của tập phim."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Số tập & Thời lượng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Số thứ tự tập (Episode Number) *"
            type="number"
            min={1}
            value={episodeNumber}
            onChange={(e) => setEpisodeNumber(e.target.value)}
            error={errors.episodeNumber}
            disabled={isLoading}
            required
          />

          <Input
            label="Thời lượng (Phút) *"
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            error={errors.duration}
            disabled={isLoading}
            required
          />
        </div>

        {/* Tiêu đề tập & Ngày chiếu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tiêu đề tập phim *"
            placeholder="Ví dụ: Tập 1: Khởi đầu mới..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            disabled={isLoading}
            required
          />

          <Input
            label="Ngày phát sóng (Air Date)"
            type="date"
            value={airDate}
            onChange={(e) => setAirDate(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Tóm tắt nội dung tập */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Tóm tắt tập phim
          </label>
          <textarea
            rows={3}
            placeholder="Nội dung chính diễn biến trong tập này..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c2e] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
          />
        </div>

        {/* Upload Thumbnail tập phim 16:9 */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Ảnh đại diện tập phim (Thumbnail 16:9)
          </label>

          <div className="flex items-center gap-4">
            <div className="w-36 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              ) : (
                <Video size={24} className="text-slate-400" />
              )}
            </div>

            <label className="flex-1 flex flex-col items-center justify-center p-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-cyan-500/60 cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 text-center transition-all">
              {isUploadingThumb ? (
                <Loader2 size={18} className="animate-spin text-cyan-500" />
              ) : (
                <ImageIcon size={18} className="text-slate-400" />
              )}
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                {isUploadingThumb ? 'Đang tải lên...' : 'Chọn file ảnh Thumbnail'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">Tỷ lệ 16:9 (JPG, PNG, WebP)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                disabled={isUploadingThumb || isLoading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading || isUploadingThumb}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading || isUploadingThumb}>
            {isEdit ? 'Lưu thay đổi' : 'Thêm tập phim'}
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
        shape="rect"
        aspectRatio={16 / 9}
        aspectRatioLabel="16:9 (Video 16:9)"
        title="Căn Chỉnh & Cắt Ảnh Thumbnail Tập Phim"
        description="Cắt ảnh theo chuẩn 16:9 để khung hình hiển thị đẹp mắt trên danh sách tập phim."
        outputWidth={1280}
        outputHeight={720}
        onCropComplete={handleCropComplete}
        isSubmitting={isUploadingThumb}
      />
    </Modal>
  );
};
