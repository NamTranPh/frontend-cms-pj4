export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
  isVip: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export type AuthModalType = 'LOGIN' | 'REGISTER' | 'VERIFY_OTP' | 'FORGOT_PASSWORD' | null;