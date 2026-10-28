import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../../config/routes.config';
import { useAuth } from '../../modules/auth/hooks/useAuth';

interface ProtectedRouteProps {
  requiredRole?: 'ADMIN' | 'USER';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const token = localStorage.getItem('accessToken');

  // Đang đồng bộ phiên đăng nhập
  if (isLoading && token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#090d16] text-[#002b80] dark:text-cyan-400">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-current border-t-transparent"></div>
      </div>
    );
  }

  // Nếu chưa có token hoặc chưa xác thực -> chuyển về trang Login
  if (!token || !isAuthenticated) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
  }

  // Kiểm tra quyền vai trò (Role-based access control)
  if (requiredRole && user && user.role !== requiredRole) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
  }

  // Hợp lệ -> Cho phép truy cập
  return <Outlet />;
};
