import { fetchClient } from "../../../api/fetchClient";
import type {
  StartUploadRequest,
  UploadSessionResult,
  PresignedUrlResult,
  RecordPartRequest,
} from "../types/upload.types";

export const uploadService = {
  // 1. Khởi tạo phiên upload cho tập phim
  startEpisodeUpload: (
    movieId: string,
    episodeId: string,
    data: StartUploadRequest,
  ) =>
    fetchClient<UploadSessionResult>(
      `/admin/movies/${movieId}/episodes/${episodeId}/uploads`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),

  // 2. Lấy danh sách Presigned PUT URLs cho từng chunk
  getEpisodePartUrls: (
    movieId: string,
    episodeId: string,
    uploadId: string,
    partNumbers: number[],
  ) =>
    fetchClient<PresignedUrlResult[]>(
      `/admin/movies/${movieId}/episodes/${episodeId}/uploads/${uploadId}/part-urls`,
      {
        method: "POST",
        body: JSON.stringify({ partNumbers }),
      },
    ),

  // 3. Ghi nhận 1 part chunk đã upload xong lên MinIO S3
  recordEpisodePart: (
    movieId: string,
    episodeId: string,
    uploadId: string,
    partNumber: number,
    data: RecordPartRequest,
  ) =>
    fetchClient<void>(
      `/admin/movies/${movieId}/episodes/${episodeId}/uploads/${uploadId}/parts/${partNumber}/completed`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),

  // 4. Hoàn tất gộp file trên MinIO
  completeEpisodeUpload: (
    movieId: string,
    episodeId: string,
    uploadId: string,
  ) =>
    fetchClient<UploadSessionResult>(
      `/admin/movies/${movieId}/episodes/${episodeId}/uploads/${uploadId}/complete`,
      {
        method: "POST",
      },
    ),

  // 5. Hủy phiên upload
  cancelEpisodeUpload: (movieId: string, episodeId: string, uploadId: string) =>
    fetchClient<void>(
      `/admin/movies/${movieId}/episodes/${episodeId}/uploads/${uploadId}`,
      {
        method: "DELETE",
      },
    ),
};
