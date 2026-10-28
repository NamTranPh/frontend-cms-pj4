import React from "react";
import { X, Play } from "lucide-react";
import type { VideoPreviewTarget } from "../types/preview.types";

export interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: VideoPreviewTarget | null;
}

/**
 * Module Preview - Trình phát Video Xem trước dành cho Admin (VideoPreviewModal)
 *
 * Chức năng tương lai:
 * 1. Xem trước video ngay sau khi hoàn tất Multipart Upload để kiểm tra lỗi âm thanh / hình ảnh.
 * 2. Xem trước luồng HLS master.m3u8 của các tập phim đã có trên hệ thống trước khi bấm "Xuất bản".
 * 3. Tích hợp Vidstack Player (@vidstack/react) hoặc HLS.js nội bộ, hỗ trợ tua nhanh, đổi độ phân giải.
 */
export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  isOpen,
  onClose,
  target,
}) => {
  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Play size={18} className="text-cyan-400" />
              Xem trước: {target.title}{" "}
              {target.episodeNumber ? `- Tập ${target.episodeNumber}` : ""}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Đường dẫn phát: {target.playbackUrl}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Khung Video Placeholder */}
        <div className="relative aspect-video bg-black flex flex-col items-center justify-center text-slate-400 text-sm">
          <Play size={48} className="text-cyan-400 mb-2 opacity-80" />
          <p>
            [Khung phát Video HLS Preview Player - Sẵn sàng tích hợp khi triển
            khai]
          </p>
          <span className="text-xs text-slate-500 mt-1">
            Độ phân giải dự kiến: Auto / 1080p / 720p / 480p
          </span>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
