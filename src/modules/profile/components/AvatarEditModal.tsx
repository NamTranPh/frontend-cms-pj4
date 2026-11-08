import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Trash2,
  Check,
  User as UserIcon,
} from 'lucide-react';
import { Cropper, CircleStencil, type CropperRef } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { useToast } from '../../../components/feedback';

export interface AvatarEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string | null;
  onSaveAvatar: (file: File) => Promise<void>;
  onDeleteAvatar: () => Promise<void>;
}

export const AvatarEditModal: React.FC<AvatarEditModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSaveAvatar,
  onDeleteAvatar,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<CropperRef>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Thu hồi Object URL khi unmount hoặc khi đổi ảnh mới
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    if (imageSrc && imageSrc.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(null);
    setIsDeleting(false);
    setIsSaving(false);
    setZoomLevel(1);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Vui lòng chọn tệp hình ảnh (.jpg, .png, .webp...)', 'Cảnh báo');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.warning('Kích thước ảnh tối đa là 5MB', 'Cảnh báo');
      return;
    }

    // Tạo object URL mới cho cropper
    if (imageSrc && imageSrc.startsWith('blob:')) {
      URL.revokeObjectURL(imageSrc);
    }
    const newUrl = URL.createObjectURL(file);
    setImageSrc(newUrl);
    setIsDeleting(false);
    setZoomLevel(1);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleZoom = (factor: number) => {
    if (cropperRef.current) {
      cropperRef.current.zoomImage(factor);
      setZoomLevel((prev) => Math.min(Math.max(Number((prev * factor).toFixed(2)), 0.5), 3));
    }
  };

  const handleRotate = (angle: number) => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(angle);
    }
  };

  const handleFlip = () => {
    if (cropperRef.current) {
      cropperRef.current.flipImage(true, false);
    }
  };

  const handleReset = () => {
    if (cropperRef.current) {
      cropperRef.current.reset();
      setZoomLevel(1);
    }
  };

  const handleMarkDelete = () => {
    setIsDeleting(true);
    setImageSrc(null);
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isDeleting) {
        // Thực hiện xóa avatar
        await onDeleteAvatar();
        resetAndClose();
        return;
      }

      if (imageSrc && cropperRef.current) {
        const canvas = cropperRef.current.getCanvas({
          width: 512,
          height: 512,
        });

        if (!canvas) {
          toast.error('Không thể trích xuất ảnh đã cắt, vui lòng thử lại', 'Lỗi');
          setIsSaving(false);
          return;
        }

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              toast.error('Lỗi khi chuyển đổi ảnh thành tệp tin', 'Lỗi');
              setIsSaving(false);
              return;
            }
            try {
              const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
              await onSaveAvatar(file);
              resetAndClose();
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : 'Tải ảnh lên thất bại';
              toast.error(msg, 'Lỗi');
            } finally {
              setIsSaving(false);
            }
          },
          'image/jpeg',
          0.92,
        );
        return;
      }

      // Nếu không có thay đổi gì
      resetAndClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lưu ảnh đại diện thất bại';
      toast.error(msg, 'Lỗi');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Chỉnh Sửa Ảnh Đại Diện
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Input file ẩn */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Body Modal */}
        <div className="p-6 space-y-5">
          {/* TRƯỜNG HỢP 1: Chọn xóa ảnh */}
          {isDeleting ? (
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center">
                <Trash2 size={24} />
              </div>
              <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">
                Xác nhận gỡ ảnh đại diện
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto leading-relaxed">
                Sau khi bấm <strong>"Lưu Thay Đổi"</strong>, ảnh đại diện hiện tại sẽ bị xóa và quay về chữ cái mặc định.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors cursor-pointer"
                >
                  Giữ lại ảnh
                </button>
              </div>
            </div>
          ) : imageSrc ? (
            /* TRƯỜNG HỢP 2: Đang cắt ảnh mới với react-advanced-cropper */
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shadow-inner">
                <Cropper
                  ref={cropperRef}
                  src={imageSrc}
                  stencilComponent={CircleStencil}
                  className="h-72 w-full"
                  stencilProps={{
                    aspectRatio: 1,
                  }}
                />
              </div>

              {/* Thanh công cụ điều khiển Cropper */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                {/* Cụm Zoom Slider */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleZoom(0.85)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Thu nhỏ"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-[11px] font-mono text-slate-500 min-w-8 text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => handleZoom(1.15)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Phóng to"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>

                {/* Cụm Xoay / Lật / Reset */}
                <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
                  <button
                    type="button"
                    onClick={() => handleRotate(-90)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Xoay trái 90°"
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRotate(90)}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Xoay phải 90°"
                  >
                    <RotateCw size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={handleFlip}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Lật ảnh ngang"
                  >
                    <FlipHorizontal size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Đặt lại góc"
                  >
                    <RefreshCw size={15} />
                  </button>
                </div>

                {/* Đổi ảnh khác */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Upload size={13} />
                  <span>Ảnh khác</span>
                </button>
              </div>
            </div>
          ) : (
            /* TRƯỜNG HỢP 3: Chưa chọn ảnh mới, hiển thị ảnh hiện tại và nút tải ảnh */
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-500 to-gray-400 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                  {currentAvatarUrl ? (
                    <img
                      src={currentAvatarUrl}
                      alt="Avatar hiện tại"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={52} className="text-slate-400" />
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {currentAvatarUrl ? 'Ảnh đại diện hiện tại' : 'Chưa có ảnh đại diện'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                  Chọn ảnh chân dung rõ mặt để hiển thị đẹp nhất trên hệ thống quản trị.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 bg-[#002b80] hover:bg-[#00246b] text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
              >
                <Upload size={16} />
                <span>Tải ảnh mới từ máy tính</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          {/* Nút gỡ ảnh ở góc trái */}
          {currentAvatarUrl && !isDeleting ? (
            <button
              type="button"
              onClick={handleMarkDelete}
              disabled={isSaving}
              className="px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Trash2 size={14} />
              <span>Gỡ ảnh đại diện</span>
            </button>
          ) : (
            <div />
          )}

          {/* Cụm nút Hủy / Lưu */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetAndClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || (!imageSrc && !isDeleting)}
              className="px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 bg-[#002b80] hover:bg-[#00246b] text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 transition-all shadow-md shadow-cyan-500/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
