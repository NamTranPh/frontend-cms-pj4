import { fetchClient } from '../../../api/fetchClient';
import type {
  ActorItem,
  CreateActorRequest,
  UpdateActorRequest,
  ActorFilterParams,
  ActorAvatarUploadResponse,
} from '../types/actor.types';
import type { PageResult } from '../../../types/common.types';

export const adminActorService = {
  // Lấy danh sách diễn viên (Phân trang + Tìm kiếm theo tên / quốc tịch)
  getActors: (params?: ActorFilterParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    if (params?.nationality) query.append('nationality', params.nationality);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortDir) query.append('sortDir', params.sortDir);

    const queryString = query.toString();
    return fetchClient<PageResult<ActorItem>>(
      `/admin/actors${queryString ? `?${queryString}` : ''}`
    );
  },

  // Chi tiết diễn viên theo ID
  getActorById: (id: string) =>
    fetchClient<ActorItem>(`/admin/actors/${id}`),

  // Tạo mới diễn viên
  createActor: (data: CreateActorRequest) =>
    fetchClient<ActorItem>('/admin/actors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Cập nhật diễn viên
  updateActor: (id: string, data: UpdateActorRequest) =>
    fetchClient<ActorItem>(`/admin/actors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Xóa diễn viên
  deleteActor: (id: string) =>
    fetchClient<void>(`/admin/actors/${id}`, {
      method: 'DELETE',
    }),

  // Upload Avatar diễn viên
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchClient<ActorAvatarUploadResponse>('/admin/actors/avatars', {
      method: 'POST',
      body: formData,
    });
  },
};
