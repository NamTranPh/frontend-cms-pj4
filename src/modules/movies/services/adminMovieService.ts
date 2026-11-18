import { fetchClient } from '../../../api/fetchClient';
import type { PageResult } from '../../../types/common.types';
import type {
  MovieItem,
  CreateMovieRequest,
  UpdateMovieRequest,
  MovieFilterParams,
  MediaUploadResponse,
} from '../types/movie.types';

/**
 * Module Movies - Service gọi API Quản trị Phim
 * Khớp nối với AdminMovieController trong Spring Boot backend:
 * - GET    /api/v1/admin/movies (Danh sách phim có phân trang & lọc đa tiêu chí)
 * - POST   /api/v1/admin/movies (Tạo mới phim)
 * - PATCH  /api/v1/admin/movies/{id} (Cập nhật phim)
 * - GET    /api/v1/admin/movies/{slug} (Chi tiết phim)
 * - DELETE /api/v1/admin/movies/{id} (Xóa mềm phim)
 * - PATCH  /api/v1/admin/movies/{id}/restore (Khôi phục phim)
 * - POST   /api/v1/admin/movies/{id}/publish (Xuất bản phim)
 * - POST   /api/v1/admin/movies/posters (Upload ảnh Poster 2:3)
 * - POST   /api/v1/admin/movies/backdrops (Upload ảnh Backdrop 16:9)
 */
export const adminMovieService = {
  // 1. Lấy danh sách phim phân trang & lọc
  getMovies: (params?: MovieFilterParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    if (params?.type && params.type !== 'ALL') query.append('type', params.type);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.genreId && params.genreId !== 'ALL') query.append('genreId', params.genreId);
    if (params?.year) query.append('year', String(params.year));
    if (params?.country) query.append('country', params.country);
    if (params?.ageRating && params.ageRating !== 'ALL') query.append('ageRating', params.ageRating);
    if (params?.quality && params.quality !== 'ALL') query.append('quality', params.quality);
    if (params?.audioTrack && params.audioTrack !== 'ALL') query.append('audioTrack', params.audioTrack);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortDir) query.append('sortDir', params.sortDir);

    const queryString = query.toString();
    return fetchClient<PageResult<MovieItem>>(
      `/admin/movies${queryString ? `?${queryString}` : ''}`,
    );
  },

  // 2. Lấy chi tiết phim theo Slug
  getMovieBySlug: (slug: string) =>
    fetchClient<MovieItem>(`/admin/movies/${slug}`),

  // 3. Tạo mới phim
  createMovie: (data: CreateMovieRequest) =>
    fetchClient<MovieItem>('/admin/movies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 4. Cập nhật thông tin phim theo ID
  updateMovie: (id: string, data: UpdateMovieRequest) =>
    fetchClient<MovieItem>(`/admin/movies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // 5. Xóa mềm phim theo ID
  deleteMovie: (id: string) =>
    fetchClient<void>(`/admin/movies/${id}`, {
      method: 'DELETE',
    }),

  // 6. Khôi phục phim đã xóa theo ID
  restoreMovie: (id: string) =>
    fetchClient<MovieItem>(`/admin/movies/${id}/restore`, {
      method: 'PATCH',
    }),

  // 7. Xuất bản phim (hoặc Retry Publish khi bị FAILED)
  publishMovie: (id: string) =>
    fetchClient<MovieItem>(`/admin/movies/${id}/publish`, {
      method: 'POST',
    }),

  // 8. Upload ảnh Poster (tỷ lệ 2:3) lên MinIO S3
  uploadPoster: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchClient<MediaUploadResponse>('/admin/movies/posters', {
      method: 'POST',
      body: formData,
    });
  },

  // 9. Upload ảnh Backdrop (banner ngang 16:9) lên MinIO S3
  uploadBackdrop: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchClient<MediaUploadResponse>('/admin/movies/backdrops', {
      method: 'POST',
      body: formData,
    });
  },
};
