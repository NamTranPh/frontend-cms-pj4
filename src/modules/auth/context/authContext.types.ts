import { createContext } from 'react';
import type { AdminProfile, LoginRequest, UpdateProfileRequest } from '../types/auth.types';

export interface AuthContextType {
  user: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<AdminProfile>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<AdminProfile | null>;
  updateProfile: (data: UpdateProfileRequest) => Promise<AdminProfile>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

