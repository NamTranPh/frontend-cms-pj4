import { fetchClient } from "../../../api/fetchClient";
import type {
  StartUploadRequest,
  UploadSessionResult,
  PresignedUrlResult,
  RecordPartRequest,
} from "../types/upload.types";

export const uploadService = {
  // === PHIM LẺ (SINGLE MOVIE) ===
  // 1. Khởi tạo phiên upload cho phim lẻ
  startMovieUpload: (movieId: string, data: StartUploadRequest) =>
    fetchClient<UploadSessionResult>(`/admin/movies/${movieId}/uploads`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 2. Lấy danh sách Presigned PUT URLs cho từng chunk phim lẻ
  getMoviePartUrls: (movieId: string, uploadId: string, partNumbers: number[]) =>
    fetchClient<PresignedUrlResult[]>(
      `/admin/movies/${movieId}/uploads/${uploadId}/part-urls`,
      {
        method: "POST",
        body: JSON.stringify({ partNumbers }),
      },
    ),

  // 3. Ghi nhận 1 part chunk đã upload xong lên MinIO S3 cho phim lẻ
  recordMoviePart: (
    movieId: string,
    uploadId: string,
    partNumber: number,
    data: RecordPartRequest,
  ) =>
    fetchClient<void>(
      `/admin/movies/${movieId}/uploads/${uploadId}/parts/${partNumber}/completed`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),

  // 4. Hoàn tất gộp file trên MinIO cho phim lẻ
  completeMovieUpload: (movieId: string, uploadId: string) =>
    fetchClient<UploadSessionResult>(
      `/admin/movies/${movieId}/uploads/${uploadId}/complete`,
      {
        method: "POST",
      },
    ),

  // 5. Lấy trạng thái phiên upload phim lẻ
  getMovieUploadStatus: (movieId: string, uploadId: string) =>
    fetchClient<UploadSessionResult>(
      `/admin/movies/${movieId}/uploads/${uploadId}/status`,
      {
        method: "GET",
      },
    ),

  // 6. Hủy phiên upload phim lẻ
  cancelMovieUpload: (movieId: string, uploadId: string) =>
    fetchClient<void>(`/admin/movies/${movieId}/uploads/${uploadId}`, {
      method: "DELETE",
    }),

  // === TẬP PHIM (EPISODE) ===
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

  // 2. Lấy danh sách Presigned PUT URLs cho từng chunk tập phim
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

  // 3. Ghi nhận 1 part chunk đã upload xong lên MinIO S3 cho tập phim
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

  // 4. Hoàn tất gộp file trên MinIO cho tập phim
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

  // 5. Lấy trạng thái phiên upload tập phim
  getEpisodeUploadStatus: (
    movieId: string,
    episodeId: string,
    uploadId: string,
  ) =>
    fetchClient<UploadSessionResult>(
      `/admin/movies/${movieId}/episodes/${episodeId}/uploads/${uploadId}/status`,
      {
        method: "GET",
      },
    ),

  // 6. Hủy phiên upload tập phim
  cancelEpisodeUpload: (movieId: string, episodeId: string, uploadId: string) =>
    fetchClient<void>(
      `/admin/movies/${movieId}/episodes/${episodeId}/uploads/${uploadId}`,
      {
        method: "DELETE",
      },
    ),
};
