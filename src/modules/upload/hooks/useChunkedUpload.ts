import { useState, useCallback, useRef } from 'react';
import { uploadService } from '../services/uploadService';
import type { UploadSessionResult } from '../types/upload.types';

const CHUNK_SIZE = 16 * 1024 * 1024; // 16MB per chunk theo UploadConstants

export interface ChunkedUploadProgress {
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  speed: string;
  eta: string;
  isUploading: boolean;
  isTranscoding: boolean;
  error: string | null;
  logs: string[];
  uploadSession: UploadSessionResult | null;
}

export const useChunkedUpload = () => {
  const [state, setState] = useState<ChunkedUploadProgress>({
    progress: 0,
    uploadedBytes: 0,
    totalBytes: 0,
    speed: '0 MB/s',
    eta: '--:--',
    isUploading: false,
    isTranscoding: false,
    error: null,
    logs: [],
    uploadSession: null,
  });

  const isCancelledRef = useRef(false);
  const activeSessionRef = useRef<{ movieId: string; episodeId?: string; uploadId: string } | null>(null);

  const addLog = useCallback((msg: string) => {
    setState((prev) => ({
      ...prev,
      logs: [...prev.logs.slice(-20), `[${new Date().toLocaleTimeString()}] ${msg}`],
    }));
  }, []);

  const formatETA = (seconds: number): string => {
    if (!isFinite(seconds) || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const uploadFileInternal = async (
    file: File,
    movieId: string,
    episodeId?: string,
  ): Promise<UploadSessionResult | null> => {
    isCancelledRef.current = false;
    const totalBytes = file.size;
    const totalParts = Math.ceil(totalBytes / CHUNK_SIZE);

    setState({
      progress: 0,
      uploadedBytes: 0,
      totalBytes,
      speed: '0 MB/s',
      eta: 'Đang ước tính...',
      isUploading: true,
      isTranscoding: false,
      error: null,
      logs: [`Bắt đầu chuẩn bị upload file: ${file.name} (${(totalBytes / (1024 * 1024)).toFixed(1)} MB, ${totalParts} chunks)`],
      uploadSession: null,
    });

    try {
      // 1. Khởi tạo phiên Upload Multipart trên Backend
      let session: UploadSessionResult;
      if (episodeId) {
        session = await uploadService.startEpisodeUpload(movieId, episodeId, {
          fileName: file.name,
          fileSizeBytes: totalBytes,
        });
      } else {
        session = await uploadService.startMovieUpload(movieId, {
          fileName: file.name,
          fileSizeBytes: totalBytes,
        });
      }

      activeSessionRef.current = { movieId, episodeId, uploadId: session.uploadId };
      setState((prev) => ({ ...prev, uploadSession: session }));
      addLog(`Đã khởi tạo phiên upload: ${session.uploadId}`);

      // 2. Lấy Presigned URLs cho tất cả các Part
      const partNumbers = Array.from({ length: totalParts }, (_, i) => i + 1);
      let presignedUrls;
      if (episodeId) {
        presignedUrls = await uploadService.getEpisodePartUrls(movieId, episodeId, session.uploadId, partNumbers);
      } else {
        presignedUrls = await uploadService.getMoviePartUrls(movieId, session.uploadId, partNumbers);
      }

      const urlMap = new Map<number, string>();
      for (const p of presignedUrls) {
        urlMap.set(p.partNumber, p.url);
      }

      // 3. Tiến hành Upload tuần tự / 2 luồng song song lên MinIO S3
      const startTime = Date.now();
      let uploadedBytes = 0;

      // Xử lý song song 2 chunks cùng lúc
      const concurrency = 2;
      let currentIndex = 0;

      const uploadWorker = async (): Promise<void> => {
        while (currentIndex < totalParts) {
          if (isCancelledRef.current) {
            throw new Error('Upload đã bị hủy bởi người dùng');
          }

          const partNumber = ++currentIndex;
          if (partNumber > totalParts) break;

          const startByte = (partNumber - 1) * CHUNK_SIZE;
          const endByte = Math.min(startByte + CHUNK_SIZE, totalBytes);
          const chunkBlob = file.slice(startByte, endByte);
          const putUrl = urlMap.get(partNumber);

          if (!putUrl) {
            throw new Error(`Không tìm thấy Presigned URL cho part ${partNumber}`);
          }

          // Upload trực tiếp từ browser lên MinIO S3 qua native fetch PUT
          const res = await fetch(putUrl, {
            method: 'PUT',
            body: chunkBlob,
          });

          if (!res.ok) {
            throw new Error(`Upload chunk ${partNumber} thất bại (HTTP ${res.status})`);
          }

          // Trích xuất ETag từ response headers
          const rawEtag = res.headers.get('ETag') || res.headers.get('etag') || `part-${partNumber}`;
          const etag = rawEtag.replace(/^"|"$/g, '');

          // Ghi nhận part hoàn tất với Backend
          if (episodeId) {
            await uploadService.recordEpisodePart(movieId, episodeId, session.uploadId, partNumber, {
              etag,
              sizeBytes: chunkBlob.size,
            });
          } else {
            await uploadService.recordMoviePart(movieId, session.uploadId, partNumber, {
              etag,
              sizeBytes: chunkBlob.size,
            });
          }

          uploadedBytes += chunkBlob.size;
          const elapsedSecs = (Date.now() - startTime) / 1000;
          const currentSpeedMBps = (uploadedBytes / (1024 * 1024)) / Math.max(elapsedSecs, 0.1);
          const remainingBytes = totalBytes - uploadedBytes;
          const etaSecs = remainingBytes / Math.max(uploadedBytes / elapsedSecs, 1024);
          const currentProgress = Math.min(100, Math.round((uploadedBytes / totalBytes) * 100));

          setState((prev) => ({
            ...prev,
            progress: currentProgress,
            uploadedBytes,
            speed: `${currentSpeedMBps.toFixed(1)} MB/s`,
            eta: formatETA(etaSecs),
          }));

          addLog(`Part ${partNumber}/${totalParts} hoàn tất (${(chunkBlob.size / (1024 * 1024)).toFixed(1)}MB)`);
        }
      };

      const workers = Array.from({ length: Math.min(concurrency, totalParts) }, () => uploadWorker());
      await Promise.all(workers);

      // 4. Báo Backend gộp file và kích hoạt FFmpeg Transcode
      addLog('Đã tải lên đủ 100% dung lượng. Đang yêu cầu máy chủ ghép file & transcode HLS...');
      setState((prev) => ({
        ...prev,
        isUploading: false,
        isTranscoding: true,
        progress: 100,
        speed: '0 MB/s',
        eta: 'Đang xử lý...',
      }));

      let finalSession: UploadSessionResult;
      if (episodeId) {
        finalSession = await uploadService.completeEpisodeUpload(movieId, episodeId, session.uploadId);
      } else {
        finalSession = await uploadService.completeMovieUpload(movieId, session.uploadId);
      }

      addLog('Hoàn tất upload video! Backend đã tiếp nhận phiên transcode HLS.');
      setState((prev) => ({
        ...prev,
        isTranscoding: false,
        uploadSession: finalSession,
      }));

      activeSessionRef.current = null;
      return finalSession;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload video thất bại';
      addLog(`Lỗi: ${msg}`);
      setState((prev) => ({
        ...prev,
        isUploading: false,
        isTranscoding: false,
        error: msg,
      }));
      return null;
    }
  };

  const startMovieUpload = useCallback((file: File, movieId: string) => {
    return uploadFileInternal(file, movieId);
  }, []);

  const startEpisodeUpload = useCallback((file: File, movieId: string, episodeId: string) => {
    return uploadFileInternal(file, movieId, episodeId);
  }, []);

  const cancelUpload = useCallback(async () => {
    isCancelledRef.current = true;
    if (activeSessionRef.current) {
      const { movieId, episodeId, uploadId } = activeSessionRef.current;
      try {
        if (episodeId) {
          await uploadService.cancelEpisodeUpload(movieId, episodeId, uploadId);
        } else {
          await uploadService.cancelMovieUpload(movieId, uploadId);
        }
      } catch {
        // silent
      }
      activeSessionRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isUploading: false,
      isTranscoding: false,
      error: 'Đã hủy phiên upload',
    }));
  }, []);

  const resetUpload = useCallback(() => {
    isCancelledRef.current = false;
    activeSessionRef.current = null;
    setState({
      progress: 0,
      uploadedBytes: 0,
      totalBytes: 0,
      speed: '0 MB/s',
      eta: '--:--',
      isUploading: false,
      isTranscoding: false,
      error: null,
      logs: [],
      uploadSession: null,
    });
  }, []);

  return {
    ...state,
    startMovieUpload,
    startEpisodeUpload,
    cancelUpload,
    resetUpload,
  };
};
