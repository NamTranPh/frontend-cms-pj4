import React from 'react';
import {
  LayoutDashboard,
  Film,
  Video,
  Users,
  Crown,
  CreditCard,
} from 'lucide-react';
import { ROUTES } from '../../config/routes.config';

export interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  {
    title: 'Dashboard',
    path: ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: 'Quản lý Phim',
    path: ROUTES.ADMIN.MOVIES,
    icon: Film,
  },
  {
    title: 'Tập phim & Video',
    path: ROUTES.ADMIN.EPISODES,
    icon: Video,
  },
  {
    title: 'Người dùng',
    path: ROUTES.ADMIN.USERS,
    icon: Users,
  },
  {
    title: 'Gói VIP',
    path: ROUTES.ADMIN.MEMBERSHIP,
    icon: Crown,
  },
  {
    title: 'Giao dịch PayOS',
    path: ROUTES.ADMIN.PAYMENTS,
    icon: CreditCard,
  },
];
