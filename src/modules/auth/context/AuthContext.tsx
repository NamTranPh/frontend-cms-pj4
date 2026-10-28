import React, { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { AdminProfile, LoginRequest } from '../types/auth.types';
import { AuthContext } from './authContext.types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminProfile | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    // Chỉ bật loading nếu có token nhưng chưa có dữ liệu user trong localStorage
    return Boolean(localStorage.getItem('accessToken') && !localStorage.getItem('user'));
  });

  const isAuthenticated = Boolean(user && localStorage.getItem('accessToken'));

  // Đồng bộ lại profile ngầm khi ứng dụng khởi chạy
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('accessToken');

    if (token) {
      authService
        .getProfile()
        .then((profile) => {
          if (isMounted) {
            setUser(profile);
            localStorage.setItem('user', JSON.stringify(profile));
          }
        })
        .catch((error) => {
          console.warn('Không thể đồng bộ profile admin:', error);
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshProfile = useCallback(async (): Promise<AdminProfile | null> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.warn('Không thể làm mới profile admin:', error);
      return null;
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<AdminProfile> => {
    setIsLoading(true);
    try {
      // 1. Gửi thông tin đăng nhập, nhận Access Token và Set-Cookie admin_refresh_token
      const res = await authService.login(credentials);
      localStorage.setItem('accessToken', res.accessToken);

      // 2. Lấy thông tin chi tiết Admin Profile từ /admin/auth/me
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: Parameters<typeof authService.updateProfile>[0]): Promise<AdminProfile> => {
      const updated = await authService.updateProfile(data);
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

