export type UserRole = "USER" | "ADMIN";

export interface AdminUser {
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
  isVip?: boolean;
  currentPlanName?: string | null;
  membershipEndDate?: string | null;
  createdAt: string;
}

export interface ToggleBanRequest {
  banned: boolean;
}

export interface UserFilterParams {
  search?: string;
  role?: UserRole;
  status?: string;
  page?: number;
  limit?: number;
}
