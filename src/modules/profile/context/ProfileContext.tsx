import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { profileService } from '../services/profileService';
import type { AdminProfile, UpdateProfileRequest } from '../types/profile.types';
import { ProfileContext } from './profileContext.types';

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<AdminProfile | null>(() => {
    try {
      const saved = localStorage.getItem('admin_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    return Boolean(isAuthenticated && !localStorage.getItem('admin_profile'));
  });

  // Tự động điều chỉnh state khi trạng thái đăng nhập thay đổi (render-time adjustment)
  const [prevAuth, setPrevAuth] = useState(isAuthenticated);
  if (prevAuth !== isAuthenticated) {
    setPrevAuth(isAuthenticated);
    if (!isAuthenticated) {
      setProfile(null);
      setIsLoading(false);
      localStorage.removeItem('admin_profile');
    }
  }

  // Tự động fetch profile khi người dùng đã đăng nhập (isAuthenticated = true)
  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      return;
    }

    profileService
      .getProfile()
      .then((res) => {
        if (isMounted) {
          setProfile(res);
          localStorage.setItem('admin_profile', JSON.stringify(res));
        }
      })
      .catch((error) => {
        console.warn('Không thể tải thông tin admin profile:', error);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const refreshProfile = useCallback(async (): Promise<AdminProfile | null> => {
    if (!isAuthenticated) {
      setProfile(null);
      return null;
    }

    try {
      const res = await profileService.getProfile();
      setProfile(res);
      localStorage.setItem('admin_profile', JSON.stringify(res));
      return res;
    } catch (error) {
      console.warn('Không thể làm mới profile admin:', error);
      return null;
    }
  }, [isAuthenticated]);

  const updateProfile = useCallback(
    async (data: UpdateProfileRequest): Promise<AdminProfile> => {
      const updated = await profileService.updateProfile(data);
      setProfile(updated);
      localStorage.setItem('admin_profile', JSON.stringify(updated));
      return updated;
    },
    [],
  );

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        refreshProfile,
        updateProfile,
        setProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
