import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { profileService } from '../services/profileService';
import { handleSessionExpired } from '../../../api/fetchClient';
import type { AdminProfile, UpdateProfileRequest } from '../types/profile.types';
import { ProfileContext } from './profileContext.types';

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Hồ sơ người dùng lưu hoàn toàn trên RAM (In-Memory State), không lưu vào localStorage để bảo mật
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(isAuthenticated));

  // Tự động điều chỉnh state khi trạng thái đăng nhập thay đổi (render-time adjustment)
  const [prevAuth, setPrevAuth] = useState(isAuthenticated);
  if (prevAuth !== isAuthenticated) {
    setPrevAuth(isAuthenticated);
    if (!isAuthenticated) {
      setProfile(null);
      setIsLoading(false);
    }
  }

  // Tự động fetch profile khi người dùng đã đăng nhập (isAuthenticated = true)
  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    profileService
      .getProfile()
      .then((res) => {
        if (isMounted) {
          setProfile(res);
        }
      })
      .catch((error) => {
        console.warn('Không thể tải thông tin admin profile:', error);
        setProfile(null);
        handleSessionExpired();
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
