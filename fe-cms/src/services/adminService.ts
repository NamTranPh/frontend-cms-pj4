import { fetchClient } from '../api/fetchClient';

export const adminService = {
  // Khởi tạo Multipart Upload
  initMultipartUpload: (filename: string, totalChunks: number) =>
    fetchClient('/admin/episodes/upload/init', {
      method: 'POST',
      body: JSON.stringify({ filename, totalChunks }),
    }),

  // Hoàn tất Multipart Upload
  completeMultipartUpload: (uploadId: string, fileKey: string, parts: { PartNumber: number; ETag: string }[]) =>
    fetchClient('/admin/episodes/upload/complete', {
      method: 'POST',
      body: JSON.stringify({ uploadId, fileKey, parts }),
    }),

  // Transcode Video sang HLS
  triggerTranscodeHls: (episodeId: string, fileKey: string) =>
    fetchClient(`/admin/episodes/${episodeId}/transcode`, {
      method: 'POST',
      body: JSON.stringify({ fileKey }),
    }),
};