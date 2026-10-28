import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../config/routes.config';
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { AdminMoviePage } from '../modules/movies/pages/AdminMoviePage';
import { AdminEpisodePage } from '../modules/episodes/pages/AdminEpisodePage';
import { AdminUserPage } from '../modules/users/pages/AdminUserPage';
import { AdminPlanPage } from '../modules/membership/pages/AdminPlanPage';
import { AdminPaymentPage } from '../modules/payments/pages/AdminPaymentPage';
import { AdminProfilePage } from '../modules/auth/pages/AdminProfilePage';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from '../components/feedback/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route Công khai: Trang đăng nhập */}
      <Route path={ROUTES.PUBLIC.LOGIN} element={<LoginPage />} />

      {/* Cụm Route Quản trị Admin: Có ProtectedRoute và khung AdminLayout */}
      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route
            path={ROUTES.ADMIN.ROOT}
            element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />}
          />
          <Route
            path={ROUTES.ADMIN.DASHBOARD}
            element={<DashboardPage />}
          />
          <Route
            path={ROUTES.ADMIN.MOVIES}
            element={<AdminMoviePage />}
          />
          <Route
            path={ROUTES.ADMIN.EPISODES}
            element={<AdminEpisodePage />}
          />
          <Route
            path={ROUTES.ADMIN.USERS}
            element={<AdminUserPage />}
          />
          <Route
            path={ROUTES.ADMIN.MEMBERSHIP}
            element={<AdminPlanPage />}
          />
          <Route
            path={ROUTES.ADMIN.PAYMENTS}
            element={<AdminPaymentPage />}
          />
          <Route
            path={ROUTES.ADMIN.PROFILE}
            element={<AdminProfilePage />}
          />
        </Route>
      </Route>

      {/* Điều hướng mặc định */}
      <Route
        path="*"
        element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />}
      />
    </Routes>
  );
};

