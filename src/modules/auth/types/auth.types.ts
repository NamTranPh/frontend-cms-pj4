/**
 * Module Auth - Định nghĩa kiểu dữ liệu Xác thực Quản trị viên (Admin Auth)
 * Khớp 100% với Spring Boot AdminAuthController (backend-pj4):
 * - LoginRequest: email, password
 * - LoginResponse: accessToken, expiresIn
 * - UserProfileResult: id, email, name, phone, address, profileUrl, role, accountStatus, isBanned, emailVerified, createdAt, isVip, currentPlanName, membershipEndDate
 */
export type UserRole = 'USER' | 'ADMIN';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  profileUrl?: string;
  role: UserRole;
  accountStatus: string;
  isBanned: boolean;
  emailVerified: boolean;
  createdAt: string;
  isVip?: boolean;
  currentPlanName?: string | null;
  membershipEndDate?: string | null;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
  profileUrl?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface SessionResult {
  sessionId: string;
  userAgent: string;
  ipAddress: string;
  admin: boolean;
  current: boolean;
  lastUsedAt: string;
  createdAt: string;
  expiresAt: string;
}

