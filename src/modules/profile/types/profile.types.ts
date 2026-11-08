export type UserRole = 'USER' | 'ADMIN';

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
