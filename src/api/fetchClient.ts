import { env } from '../config/env';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

// Lưu trữ Promise làm mới Token duy nhất để tránh race condition khi nhiều request 401 cùng lúc
let refreshTokenPromise: Promise<string> | null = null;
let isRedirecting = false;

export function handleSessionExpired() {
  if (isRedirecting) return;
  isRedirecting = true;
  localStorage.removeItem('accessToken');
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
}

async function refreshAdminToken(): Promise<string> {
  if (!refreshTokenPromise) {
    refreshTokenPromise = (async () => {
      try {
        const response = await fetch(`${env.apiUrl}/admin/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include', // Gửi cookie admin_refresh_token
        });

        if (!response.ok) {
          throw new Error('Refresh token thất bại');
        }

        const text = await response.text();
        const json = text ? JSON.parse(text) : {};
        const newAccessToken = json.data?.accessToken || json.accessToken;

        if (!newAccessToken) {
          throw new Error('Không nhận được access token mới');
        }

        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
      } catch (err) {
        handleSessionExpired();
        throw err;
      } finally {
        refreshTokenPromise = null;
      }
    })();
  }
  return refreshTokenPromise;
}

export const fetchClient = async <T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { requiresAuth = true, headers, ...customConfig } = options;
  const token = localStorage.getItem('accessToken');

  const isFormData = customConfig.body instanceof FormData;
  const defaultHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(headers as Record<string, string>),
  };

  // Tự động gắn Bearer Token nếu yêu cầu xác thực
  if (requiresAuth && token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: defaultHeaders,
    credentials: 'include', // Bắt buộc để tự động gửi HttpOnly Refresh Token Cookie
    ...customConfig,
  };

  let response = await fetch(`${env.apiUrl}${endpoint}`, config);

  // Xử lý tự động Refresh Token khi gặp lỗi 401 (Hết hạn Token hoặc Bị thu hồi phiên)
  if (response.status === 401 && requiresAuth) {
    try {
      const newAccessToken = await refreshAdminToken();
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${newAccessToken}`;
      response = await fetch(`${env.apiUrl}${endpoint}`, config);
    } catch {
      handleSessionExpired();
      throw new Error('Phiên đăng nhập đã hết hạn');
    }
  }

  if (response.status === 403 && requiresAuth) {
    handleSessionExpired();
    throw new Error('Bạn không có quyền truy cập hoặc phiên đã bị thu hồi');
  }

  if (!response.ok) {
    if ((response.status === 401 || response.status === 403) && requiresAuth) {
      handleSessionExpired();
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  let result: any;
  try {
    result = JSON.parse(text);
  } catch {
    result = text;
  }

  if (result && typeof result === 'object' && result.data !== undefined) {
    if (result.pagination) {
      return {
        items: result.data,
        totalItems: result.pagination.totalItems,
        page: result.pagination.page,
        size: result.pagination.limit,
        totalPages: result.pagination.totalPages,
        pagination: result.pagination,
      } as unknown as T;
    }
    return result.data as T;
  }

  return result as T;
};