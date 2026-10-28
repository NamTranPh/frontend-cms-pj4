import { fetchClient } from '../../../api/fetchClient';
import type { Episode } from '../types/episode.types';

/**
 * Module Episodes - Service gọi API Quản trị Tập phim
 * Khớp nối với AdminEpisodeController trong Spring Boot backend:
 * - GET    /api/v1/admin/movies/{movieId}/episodes (Danh sách tập phim theo bộ)
 * - POST   /api/v1/admin/movies/{movieId}/episodes (Tạo mới tập phim)
 * - PUT    /api/v1/admin/movies/{movieId}/episodes/{id} (Cập nhật tập phim)
 * - DELETE /api/v1/admin/movies/{movieId}/episodes/{id} (Xóa tập phim)
 * - POST   /api/v1/admin/movies/{movieId}/episodes/{id}/publish (Xuất bản tập phim)
 */
export const adminEpisodeService = {
  // Lấy danh sách tập phim theo bộ
  getEpisodesByMovie: (movieId: string) =>
    fetchClient<Episode[]>(`/admin/movies/${movieId}/episodes`, { method: 'GET' }),
};
