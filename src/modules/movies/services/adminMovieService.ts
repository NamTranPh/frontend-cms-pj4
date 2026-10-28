import { fetchClient } from '../../../api/fetchClient';
import type { Movie } from '../types/movie.types';

/**
 * Module Movies - Service gọi API Quản trị Phim
 * Khớp nối với AdminMovieController trong Spring Boot backend:
 * - GET    /api/v1/admin/movies (Danh sách phim có phân trang & lọc)
 * - POST   /api/v1/admin/movies (Tạo mới phim)
 * - PUT    /api/v1/admin/movies/{id} (Cập nhật phim)
 * - DELETE /api/v1/admin/movies/{id} (Xóa mềm phim)
 * - POST   /api/v1/admin/movies/{id}/restore (Khôi phục phim)
 * - POST   /api/v1/admin/movies/{id}/publish (Xuất bản phim)
 */
export const adminMovieService = {
  // Lấy danh sách phim
  getMovies: (params?: Record<string, any>) =>
    fetchClient<Movie[]>('/admin/movies', { method: 'GET', ...params }),
};
