import { fetchClient } from '../../../api/fetchClient';
import type { Episode, CreateEpisodeRequest, UpdateEpisodeRequest } from '../types/episode.types';
import type { MediaUploadResponse } from '../../movies/types/movie.types';

export const adminEpisodeService = {
  // Lấy danh sách tập phim theo bộ
  getEpisodesByMovie: (movieId: string) =>
    fetchClient<Episode[]>(`/admin/movies/${movieId}/episodes`, { method: 'GET' }),

  // Tạo mới một tập phim
  createEpisode: (movieId: string, data: CreateEpisodeRequest) =>
    fetchClient<Episode>(`/admin/movies/${movieId}/episodes`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Cập nhật tập phim
  updateEpisode: (movieId: string, episodeId: string, data: UpdateEpisodeRequest) =>
    fetchClient<Episode>(`/admin/movies/${movieId}/episodes/${episodeId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Xóa tập phim
  deleteEpisode: (movieId: string, episodeId: string) =>
    fetchClient<void>(`/admin/movies/${movieId}/episodes/${episodeId}`, {
      method: 'DELETE',
    }),

  // Xuất bản tập phim
  publishEpisode: (movieId: string, episodeId: string) =>
    fetchClient<Episode>(`/admin/movies/${movieId}/episodes/${episodeId}/publish`, {
      method: 'POST',
    }),

  // Upload Thumbnail cho tập phim (16:9)
  uploadThumbnail: async (movieId: string, file: File): Promise<MediaUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    return fetchClient<MediaUploadResponse>(
      `/admin/movies/${movieId}/episodes/thumbnails`,
      {
        method: 'POST',
        body: formData,
      },
    );
  },
};
