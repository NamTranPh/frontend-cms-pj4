import { createContext } from 'react';
import type { AdminProfile, UpdateProfileRequest } from '../types/profile.types';

export interface ProfileContextType {
  profile: AdminProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<AdminProfile | null>;
  updateProfile: (data: UpdateProfileRequest) => Promise<AdminProfile>;
  setProfile: React.Dispatch<React.SetStateAction<AdminProfile | null>>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);
