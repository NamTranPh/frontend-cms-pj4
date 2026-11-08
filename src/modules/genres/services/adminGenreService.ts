import { fetchClient } from '../../../api/fetchClient';
import type {
  GenreItem,
  CreateGenreRequest,
  UpdateGenreRequest,
  GenreFilterParams,
} from '../types/genre.types';
import type { PageResult } from '../../../types/common.types';

/**
 * Module Genres - Service quản trị Thể loại phim
 * Khớp nối với Spring Boot AdminGenreController (/api/v1/admin/genres)
 */
export const adminGenreService = {
  // Lấy danh sách thể loại có lọc & phân trang
  getGenres: (params?: GenreFilterParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'ALL') {
      query.append('status', params.status);
    }
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortDir) query.append('sortDir', params.sortDir);

    const queryString = query.toString();
    return fetchClient<PageResult<GenreItem>>(
      `/admin/genres${queryString ? `?${queryString}` : ''}`,
    );
  },

  // Chi tiết thể loại theo slug
  getGenreBySlug: (slug: string) =>
    fetchClient<GenreItem>(`/admin/genres/${slug}`),

  // Tạo mới thể loại
  createGenre: (data: CreateGenreRequest) =>
    fetchClient<GenreItem>('/admin/genres', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Cập nhật thể loại theo ID
  updateGenre: (id: string, data: UpdateGenreRequest) =>
    fetchClient<GenreItem>(`/admin/genres/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Xóa mềm thể loại theo ID
  deleteGenre: (id: string) =>
    fetchClient<void>(`/admin/genres/${id}`, {
      method: 'DELETE',
    }),
};
