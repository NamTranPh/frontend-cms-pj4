import React, { useState, useCallback } from 'react';
import { authService } from '../services/authService';
import type { LoginRequest, LoginResponse } from '../types/auth.types';
import { AuthContext } from './authContext.types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isAuthenticated = Boolean(token);

  const login = useCallback(async (credentials: LoginRequest): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      localStorage.setItem('accessToken', res.accessToken);
      setToken(res.accessToken);
      return res;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
