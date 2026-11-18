import { fetchClient } from "../../../api/fetchClient";
import type {
    AdminProfile,
    UpdateProfileRequest,
    ChangePasswordRequest,
    SessionResult,
} from "../types/profile.types";

export const profileService = {
  // 1. Lấy thông tin profile Admin hiện tại
  getProfile: async (): Promise<AdminProfile> => {
    return fetchClient<AdminProfile>("/admin/account/me", {
      method: "GET",
      requiresAuth: true,
    });
  },

    // 2. Cập nhật thông tin profile cá nhân (PATCH /api/v1/admin/account/me)
  updateProfile: async (data: UpdateProfileRequest): Promise<AdminProfile> => {
    return fetchClient<AdminProfile>("/admin/account/me", {
      method: "PATCH",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

   // 3. Tải ảnh đại diện Avatar lên MinIO (POST /api/v1/admin/account/avatar)
  uploadAvatar: async (file: File): Promise<AdminProfile> => {
    const formData = new FormData();
    formData.append("file", file);

    return fetchClient<AdminProfile>("/admin/account/avatar", {
      method: "POST",
      body: formData,
      requiresAuth: true,
    });
  },

  // 4. Xóa ảnh đại diện Avatar của Admin (DELETE /api/v1/admin/account/avatar)
  deleteAvatar: async (): Promise<void> => {
    return fetchClient<void>("/admin/account/avatar", {
      method: "DELETE",
      requiresAuth: true,
    });
  },

  // 5. Đổi mật khẩu tài khoản (POST /api/v1/admin/account/change-password)
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return fetchClient<void>("/admin/account/change-password", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // 6. Danh sách các phiên thiết bị đăng nhập (GET /api/v1/admin/account/sessions)
  getSessions: async (): Promise<SessionResult[]> => {
    const res = await fetchClient<
      SessionResult[] | { items: SessionResult[] } | { data: SessionResult[] }
    >('/admin/account/sessions', {
      method: 'GET',
      requiresAuth: true,
    });
    if (Array.isArray(res)) return res;
    if (res && 'items' in res && Array.isArray(res.items)) return res.items;
    if (res && 'data' in res && Array.isArray((res as any).data))
      return (res as any).data;
    return [];
  },

  // 7. Đăng xuất một phiên thiết bị cụ thể (DELETE /api/v1/admin/account/sessions/{sessionId})
  revokeSession: async (sessionId: string): Promise<void> => {
    return fetchClient<void>(`/admin/account/sessions/${sessionId}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },

  // 8. Đăng xuất khỏi tất cả thiết bị khác (DELETE /api/v1/admin/account/sessions/other)
  revokeOtherSessions: async (): Promise<void> => {
    return fetchClient<void>("/admin/account/sessions/other", {
      method: "DELETE",
      requiresAuth: true,
    });
  },
}