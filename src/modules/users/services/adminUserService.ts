import { fetchClient } from '../../../api/fetchClient';
import type { AdminUser, ToggleBanRequest, UserFilterParams } from '../types/user.types';
import type { PageResult } from '../../../types/common.types';

/**
 * Module Users - Service kết nối API Quản trị Người dùng (Spring Boot UserController)
 *
 * Endpoints thực tế:
 * 1. Danh sách người dùng: GET /api/v1/admin/users?page=&limit=&search=
 * 2. Chi tiết người dùng: GET /api/v1/admin/users/{id}
 * 3. Khóa / Mở khóa tài khoản: PATCH /api/v1/admin/users/{id}/ban
 */
export const adminUserService = {
  // Lấy danh sách tài khoản kèm tìm kiếm, phân trang
  getUsers: (params?: UserFilterParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString();
    return fetchClient<PageResult<AdminUser>>(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  // Xem chi tiết người dùng
  getUserById: (id: string) => fetchClient<AdminUser>(`/admin/users/${id}`),

  // Khóa / Mở khóa tài khoản
  toggleBan: (id: string, data: ToggleBanRequest) =>
    fetchClient<AdminUser>(`/admin/users/${id}/ban`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
