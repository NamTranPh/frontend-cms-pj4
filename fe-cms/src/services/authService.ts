import { fetchClient } from '../api/fetchClient';

export const authService = {
  // Đăng nhập
  login: (data: any) => 
    fetchClient('/auth/login', { method: 'POST', body: JSON.stringify(data), requiresAuth: false }),

  // Đăng ký
  register: (data: any) => 
    fetchClient('/auth/register', { method: 'POST', body: JSON.stringify(data), requiresAuth: false }),

  // Xác thực OTP
  verifyOtp: (email: string, otp: string) => 
    fetchClient('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }), requiresAuth: false }),

  // Gửi lại mã OTP
  resendOtp: (email: string) => 
    fetchClient('/auth/resend-otp', { method: 'POST', body: JSON.stringify({ email }), requiresAuth: false }),

  // Lấy thông tin cá nhân
  getProfile: () => 
    fetchClient('/account/me', { method: 'GET' }),
};