import { useState, useCallback } from 'react';

/**
 * Module Upload - Hook useChunkedUpload (Khung điều phối tải lên Video dung lượng lớn)
 *
 * Chức năng tương lai:
 * 1. Chia tệp video lớn (MP4) thành các chunk 16MB.
 * 2. Gọi uploadService.startEpisodeUpload để lấy uploadId và presigned URLs.
 * 3. Tải song song (2-3 luồng) trực tiếp từ trình duyệt lên MinIO S3 bằng native fetch PUT.
 * 4. Tính toán phần trăm tiến độ, tốc độ upload (MB/s), thời gian còn lại (ETA).
 * 5. Gọi completeEpisodeUpload để yêu cầu backend gộp file và kích hoạt FFmpeg transcode HLS.
 *
 * [Ghi chú]: Khung stub sẵn sàng, chưa kích hoạt logic upload thực tế.
 */
export interface ChunkedUploadProgress {
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  speed: string;
  isUploading: boolean;
  isTranscoding: boolean;
  error: string | null;
}

export const useChunkedUpload = () => {
  const [state, setState] = useState<ChunkedUploadProgress>({
    progress: 0,
    uploadedBytes: 0,
    totalBytes: 0,
    speed: '0 MB/s',
    isUploading: false,
    isTranscoding: false,
    error: null,
  });

  const startUpload = useCallback(async (_file: File, _movieId: string, _episodeId: string) => {
    // Sẽ kích hoạt quy trình upload chunked khi triển khai logic nghiệp vụ
    setState((prev) => ({ ...prev, isUploading: true, error: null }));
  }, []);

  const cancelUpload = useCallback(() => {
    setState((prev) => ({ ...prev, isUploading: false, error: 'Đã hủy upload' }));
  }, []);

  return {
    ...state,
    startUpload,
    cancelUpload,
  };
};
