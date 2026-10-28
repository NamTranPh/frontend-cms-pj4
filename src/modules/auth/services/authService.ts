import { fetchClient } from "../../../api/fetchClient";
import type {
  LoginRequest,
  LoginResponse,
  AdminProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  SessionResult,
} from "../types/auth.types";

export const authService = {
  // 1. Đăng nhập tài khoản Quản trị viên
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return fetchClient<LoginResponse>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: false,
    });
  },

  // 2. Lấy thông tin profile Admin hiện tại
  getProfile: async (): Promise<AdminProfile> => {
    return fetchClient<AdminProfile>("/admin/auth/me", {
      method: "GET",
      requiresAuth: true,
    });
  },

  // 3. Đăng xuất tài khoản Admin và xóa Cookie trên server
  logout: async (): Promise<void> => {
    try {
      await fetchClient<void>("/admin/auth/logout", {
        method: "POST",
        requiresAuth: false,
      });
    } catch (error) {
      console.warn("Lỗi khi gọi API đăng xuất backend:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },

  // 4. Cập nhật thông tin profile cá nhân (PATCH /api/v1/account/me)
  updateProfile: async (data: UpdateProfileRequest): Promise<AdminProfile> => {
    return fetchClient<AdminProfile>("/account/me", {
      method: "PATCH",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // 5. Đổi mật khẩu tài khoản (POST /api/v1/auth/change-password)
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return fetchClient<void>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // 6. Danh sách các phiên thiết bị đăng nhập (GET /api/v1/account/sessions)
  getSessions: async (): Promise<SessionResult[]> => {
    return fetchClient<SessionResult[]>("/account/sessions", {
      method: "GET",
      requiresAuth: true,
    });
  },

  // 7. Đăng xuất một phiên thiết bị cụ thể (DELETE /api/v1/account/sessions/{sessionId})
  revokeSession: async (sessionId: string): Promise<void> => {
    return fetchClient<void>(`/account/sessions/${sessionId}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },

  // 8. Đăng xuất khỏi tất cả thiết bị khác (DELETE /api/v1/account/sessions/other)
  revokeOtherSessions: async (): Promise<void> => {
    return fetchClient<void>("/account/sessions/other", {
      method: "DELETE",
      requiresAuth: true,
    });
  },
};

