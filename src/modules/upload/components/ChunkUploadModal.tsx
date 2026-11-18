import React, { useState, useRef } from 'react';
import { UploadCloud, Film, Play, CheckCircle, RefreshCw } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { UploadProgressBar } from './UploadProgressBar';
import { useChunkedUpload } from '../hooks/useChunkedUpload';

export interface ChunkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieId: string;
  movieTitle: string;
  episodeId?: string;
  episodeNumber?: number;
  onSuccess?: () => void;
  onPreview?: (target: { title: string; playbackUrl: string; episodeNumber?: number }) => void;
}

export const ChunkUploadModal: React.FC<ChunkUploadModalProps> = ({
  isOpen,
  onClose,
  movieId,
  movieTitle,
  episodeId,
  episodeNumber,
  onSuccess,
  onPreview,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    progress,
    uploadedBytes,
    totalBytes,
    speed,
    eta,
    isUploading,
    isTranscoding,
    error,
    logs,
    uploadSession,
    startMovieUpload,
    startEpisodeUpload,
    cancelUpload,
    resetUpload,
  } = useChunkedUpload();

  const handleFileChange = (file: File) => {
    // Validate file video định dạng chuẩn
    const validExtensions = ['mp4', 'mkv', 'webm', 'mov'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !validExtensions.includes(ext)) {
      alert('Vui lòng chọn tệp video hợp lệ (.mp4, .mkv, .webm, .mov)');
      return;
    }
    setSelectedFile(file);
    resetUpload();
  };

  const handleStartUpload = async () => {
    if (!selectedFile) return;

    let result;
    if (episodeId) {
      result = await startEpisodeUpload(selectedFile, movieId, episodeId);
    } else {
      result = await startMovieUpload(selectedFile, movieId);
    }

    if (result && onSuccess) {
      onSuccess();
    }
  };

  const isCompleted = !isUploading && !isTranscoding && !error && progress === 100;

  const handleClose = () => {
    if (isUploading) {
      if (confirm('Video đang được tải lên. Bạn có chắc muốn hủy phiên upload?')) {
        cancelUpload();
        setSelectedFile(null);
        resetUpload();
        onClose();
      }
    } else {
      setSelectedFile(null);
      resetUpload();
      onClose();
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      // Backend streaming URL hoặc presigned raw URL
      const playbackUrl = `/api/v1/movies/${movieId}/stream/master.m3u8`;
      onPreview({
        title: movieTitle,
        playbackUrl,
        episodeNumber,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        episodeNumber
          ? `Tải Video: ${movieTitle} - Tập ${episodeNumber}`
          : `Tải Video Phim: ${movieTitle}`
      }
      size="lg"
    >
      <div className="space-y-5">
        {/* Khu vực kéo thả / chọn file */}
        {!isUploading && !isTranscoding && !isCompleted && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileChange(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-cyan-500 bg-cyan-50/10'
                : 'border-slate-300 dark:border-slate-700 hover:border-cyan-500/50 bg-slate-50/50 dark:bg-slate-900/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/mkv,video/webm,video/quicktime"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                <UploadCloud size={32} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selectedFile ? selectedFile.name : 'Kéo thả tệp video vào đây hoặc bấm để chọn'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Hỗ trợ định dạng MP4, MKV, WebM (Dung lượng lên tới 50GB, tải trực tiếp MinIO S3)
                </p>
              </div>

              {selectedFile && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 text-xs font-mono font-medium">
                  <Film size={14} /> {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </div>
              )}
            </div>
          </div>
        )}

        {/* Thanh tiến trình hiển thị khi đang upload hoặc đã xong */}
        {(isUploading || isTranscoding || isCompleted || error) && (
          <UploadProgressBar
            uploadState={{
              progress,
              uploadedBytes,
              totalBytes,
              speed,
              eta,
              isUploading,
              isTranscoding,
              error,
              logs,
              uploadSession,
            }}
            onCancel={cancelUpload}
            showLogs
          />
        )}

        {/* Hoàn tất upload: Nút xem trước video theo Rule 6.1 */}
        {isCompleted && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle size={22} />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-400">Tải lên video hoàn tất!</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Video đã được chuyển sang hàng đợi transcode HLS. Bạn có thể xem trước ngay.
                </p>
              </div>
            </div>

            {onPreview && (
              <Button
                type="button"
                variant="primary"
                onClick={handlePreview}
                className="flex items-center gap-1.5 shrink-0"
              >
                <Play size={16} /> Xem trước Video vừa đăng
              </Button>
            )}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={handleClose}>
            {isCompleted ? 'Đóng' : 'Hủy'}
          </Button>

          {!isUploading && !isTranscoding && !isCompleted && selectedFile && (
            <Button
              type="button"
              variant="primary"
              onClick={handleStartUpload}
              className="flex items-center gap-2"
            >
              <UploadCloud size={16} /> Bắt đầu tải lên MinIO
            </Button>
          )}

          {error && (
            <Button
              type="button"
              variant="danger"
              onClick={handleStartUpload}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} /> Thử lại
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
