import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Check,
} from 'lucide-react';
import {
  Cropper,
  CircleStencil,
  RectangleStencil,
  type CropperRef,
} from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import { useToast } from '../feedback';
import { Button } from './Button';

export type CropShape = 'circle' | 'rect';

export interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Tệp ảnh ban đầu cần cắt */
  imageFile?: File | null;
  /** Hoặc URL ảnh có sẵn */
  imageSrc?: string | null;
  /** Tiêu đề modal */
  title?: string;
  /** Hướng dẫn ngắn */
  description?: string;
  /** Hình dạng stencil: 'circle' (tròn cho Avatar) hoặc 'rect' (chữ nhật cho Poster/Backdrop) */
  shape?: CropShape;
  /** Tỷ lệ khung (width / height): 1 (1:1), 2/3 (Poster 2:3), 16/9 (Backdrop / Thumbnail 16:9) */
  aspectRatio?: number;
  /** Nhãn tỷ lệ hiển thị trên header (ví dụ "1:1", "2:3", "16:9") */
  aspectRatioLabel?: string;
  /** Kích thước ảnh xuất ra tối đa (px) */
  outputWidth?: number;
  outputHeight?: number;
  /** Định dạng ảnh xuất ra */
  mimeType?: 'image/jpeg' | 'image/png' | 'image/webp';
  /** Chất lượng nén ảnh (0.1 - 1.0) */
  quality?: number;
  /** Hàm callback khi bấm "Cắt & Áp dụng": nhận file kết quả đã cắt */
  onCropComplete: (file: File) => Promise<void> | void;
  /** Trạng thái đang tải lên từ component cha */
  isSubmitting?: boolean;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageFile,
  imageSrc,
  title = 'Căn Chỉnh & Cắt Ảnh',
  description,
  shape = 'rect',
  aspectRatio,
  aspectRatioLabel,
  outputWidth,
  outputHeight,
  mimeType = 'image/jpeg',
  quality = 0.92,
  onCropComplete,
  isSubmitting = false,
}) => {
  const toast = useToast();
  const cropperRef = useRef<CropperRef>(null);

  const [activeSrc, setActiveSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Tạo Object URL cho File hoặc nhận imageSrc
  useEffect(() => {
    if (!isOpen) return;

    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setActiveSrc(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (imageSrc) {
      setActiveSrc(imageSrc);
    } else {
      setActiveSrc(null);
    }
  }, [isOpen, imageFile, imageSrc]);

  if (!isOpen || !activeSrc) return null;

  // Điều khiển Zoom
  const handleZoom = (factor: number) => {
    if (cropperRef.current) {
      cropperRef.current.zoomImage(factor);
    }
  };

  // Điều khiển Xoay 90 độ
  const handleRotate = (angle: number) => {
    if (cropperRef.current) {
      cropperRef.current.rotateImage(angle);
    }
  };

  // Điều khiển Lật ngang
  const handleFlip = () => {
    if (cropperRef.current) {
      cropperRef.current.flipImage(true, false);
    }
  };

  // Đặt lại nguyên bản
  const handleReset = () => {
    if (cropperRef.current) {
      cropperRef.current.reset();
    }
  };

  // Thực hiện cắt ảnh và tạo File
  const handleConfirmCrop = async () => {
    if (!cropperRef.current) return;

    setIsProcessing(true);
    try {
      const canvas = cropperRef.current.getCanvas({
        width: outputWidth,
        height: outputHeight,
      });

      if (!canvas) {
        toast.error('Không thể trích xuất khung ảnh đã cắt, vui lòng thử lại');
        setIsProcessing(false);
        return;
      }

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            toast.error('Lỗi khi chuyển đổi ảnh thành tệp tin');
            setIsProcessing(false);
            return;
          }

          try {
            const fileName = imageFile?.name
              ? imageFile.name.replace(/\.[^/.]+$/, '') + '-cropped.jpg'
              : 'cropped-image.jpg';
            const croppedFile = new File([blob], fileName, { type: mimeType });

            await onCropComplete(croppedFile);
            onClose();
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Tải lên ảnh thất bại';
            toast.error(msg);
          } finally {
            setIsProcessing(false);
          }
        },
        mimeType,
        quality
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi khi xử lý cắt ảnh';
      toast.error(msg);
      setIsProcessing(false);
    }
  };

  const isBusy = isProcessing || isSubmitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20">
              <Crop size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h3>
                {aspectRatioLabel && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    Tỷ lệ {aspectRatioLabel}
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Modal: Cropper Canvas */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-inner flex items-center justify-center min-h-[320px] max-h-[500px]">
            {shape === 'circle' ? (
              <Cropper
                ref={cropperRef}
                src={activeSrc}
                stencilComponent={CircleStencil}
                className="h-[360px] w-full"
                stencilProps={{
                  aspectRatio: 1,
                }}
              />
            ) : (
              <Cropper
                ref={cropperRef}
                src={activeSrc}
                stencilComponent={RectangleStencil}
                className="h-[360px] w-full"
                stencilProps={{
                  aspectRatio: aspectRatio,
                }}
              />
            )}
          </div>

          {/* Thanh công cụ điều khiển: Zoom, Rotate, Flip, Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            {/* Nhóm Phóng to / Thu nhỏ */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">
                Thu phóng:
              </span>
              <button
                type="button"
                onClick={() => handleZoom(0.85)}
                disabled={isBusy}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-500 transition-colors cursor-pointer"
                title="Thu nhỏ (-)"
              >
                <ZoomOut size={15} />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(1.15)}
                disabled={isBusy}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-500 transition-colors cursor-pointer"
                title="Phóng to (+)"
              >
                <ZoomIn size={15} />
              </button>
            </div>

            {/* Nhóm Xoay & Lật */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleRotate(-90)}
                disabled={isBusy}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-500 transition-colors cursor-pointer"
                title="Xoay trái 90°"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                onClick={() => handleRotate(90)}
                disabled={isBusy}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-500 transition-colors cursor-pointer"
                title="Xoay phải 90°"
              >
                <RotateCw size={15} />
              </button>
              <button
                type="button"
                onClick={handleFlip}
                disabled={isBusy}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-500 transition-colors cursor-pointer"
                title="Lật ảnh ngang"
              >
                <FlipHorizontal size={15} />
              </button>
            </div>

            {/* Đặt lại */}
            <button
              type="button"
              onClick={handleReset}
              disabled={isBusy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-rose-500 hover:border-rose-500/50 transition-colors cursor-pointer"
              title="Đặt lại vị trí ban đầu"
            >
              <RefreshCw size={13} />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>

        {/* Footer Modal: Hủy & Áp dụng */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isBusy}
          >
            Hủy bỏ
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleConfirmCrop}
            isLoading={isBusy}
            disabled={isBusy}
          >
            <Check size={16} />
            <span>Cắt & Áp Dụng</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
