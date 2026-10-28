import { useState, useCallback } from 'react';
import type { VideoPreviewTarget, VideoPreviewState } from '../types/preview.types';

/**
 * Module Preview - Hook useVideoPreview
 *
 * Chức năng tương lai:
 * - Điều khiển trạng thái mở/đóng Modal xem trước video
 * - Lấy playbackToken bảo mật từ backend để giải mã luồng video HLS
 * - Quản lý việc chuyển đổi độ phân giải (1080p, 720p, 480p)
 */
export const useVideoPreview = () => {
  const [state, setState] = useState<VideoPreviewState>({
    isOpen: false,
    target: null,
    isPlaying: false,
  });

  const openPreview = useCallback((target: VideoPreviewTarget) => {
    setState({
      isOpen: true,
      target,
      isPlaying: false,
    });
  }, []);

  const closePreview = useCallback(() => {
    setState({
      isOpen: false,
      target: null,
      isPlaying: false,
    });
  }, []);

  return {
    ...state,
    openPreview,
    closePreview,
  };
};
