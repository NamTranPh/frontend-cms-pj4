import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, HardDrive, Zap, Clock } from 'lucide-react';
import type { ChunkedUploadProgress } from '../hooks/useChunkedUpload';

interface UploadProgressBarProps {
  uploadState: ChunkedUploadProgress;
  onCancel?: () => void;
  showLogs?: boolean;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const UploadProgressBar: React.FC<UploadProgressBarProps> = ({
  uploadState,
  onCancel,
  showLogs = false,
}) => {
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
  } = uploadState;

  const isCompleted = !isUploading && !isTranscoding && !error && progress === 100;

  return (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
      {/* Header trạng thái */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-semibold">
          {isUploading && (
            <>
              <Loader2 size={15} className="animate-spin text-cyan-500" />
              <span className="text-cyan-600 dark:text-cyan-400">Đang tải video lên MinIO...</span>
            </>
          )}
          {isTranscoding && (
            <>
              <Loader2 size={15} className="animate-spin text-amber-500" />
              <span className="text-amber-600 dark:text-amber-400">Đang ghép file & kích hoạt Transcode HLS...</span>
            </>
          )}
          {isCompleted && (
            <>
              <CheckCircle2 size={15} className="text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Tải lên video thành công!</span>
            </>
          )}
          {error && (
            <>
              <AlertCircle size={15} className="text-rose-500" />
              <span className="text-rose-600 dark:text-rose-400">Tải lên thất bại: {error}</span>
            </>
          )}
        </div>

        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
          {progress}%
        </span>
      </div>

      {/* Thanh tiến trình */}
      <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            error
              ? 'bg-rose-500'
              : isCompleted
              ? 'bg-emerald-500'
              : isTranscoding
              ? 'bg-amber-500 animate-pulse'
              : 'bg-gradient-to-r from-cyan-500 to-[#002b80]'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Thông số chi tiết: Dung lượng, Tốc độ, ETA */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <div className="flex items-center gap-1.5">
          <HardDrive size={13} className="text-slate-400" />
          <span>
            {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}
          </span>
        </div>

        {isUploading && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-medium">
              <Zap size={13} /> {speed}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> Còn lại: {eta}
            </span>
          </div>
        )}

        {isUploading && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-rose-500 hover:text-rose-600 font-semibold underline text-xs"
          >
            Hủy tải
          </button>
        )}
      </div>

      {/* Nhật ký upload (Logs) */}
      {showLogs && logs.length > 0 && (
        <div className="mt-2 max-h-24 overflow-y-auto rounded-lg bg-black/60 p-2 font-mono text-[10px] text-slate-300 space-y-0.5 border border-slate-800">
          {logs.map((log, index) => (
            <div key={index} className="truncate">
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
