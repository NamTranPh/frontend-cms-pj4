const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004/api/v1';
interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const fetchClient = async (endpoint: string, options: RequestOptions = {}) => {
  const { requiresAuth = true, headers, ...customConfig } = options;
  const token = localStorage.getItem('accessToken');

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
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

  let response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Xử lý tự động Refresh Token khi gặp lỗi 401 (Hết hạn Token)
  if (response.status === 401 && requiresAuth) {
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshRes.ok) {
      const { accessToken } = await refreshRes.json();
      localStorage.setItem('accessToken', accessToken);
      
      // Thử lại request ban đầu với Access Token mới
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
      response = await fetch(`${BASE_URL}${endpoint}`, config);
    } else {
      // Refresh token thất bại/hết hạn -> Xóa token và yêu cầu đăng nhập lại
      localStorage.removeItem('accessToken');
      window.location.reload();
      throw new Error('Phiên đăng nhập đã hết hạn');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
  }

  return response.json();
};