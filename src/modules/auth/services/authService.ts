import { fetchClient } from "../../../api/fetchClient";
import type {
  LoginRequest,
  LoginResponse,
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

  // 2. Đăng xuất tài khoản Admin và xóa Cookie trên server
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
      localStorage.removeItem("admin_profile");
    }
  },
};
