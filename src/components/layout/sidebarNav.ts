import React from 'react';
import {
  LayoutDashboard,
  Film,
  Tags,
  Users,
  Crown,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { ROUTES } from '../../config/routes.config';

export interface NavSubItem {
  title: string;
  path: string;
}

export interface NavGroup {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  path?: string; // Nếu là direct link
  children?: NavSubItem[]; // Nếu là collapsible group
}

export const SIDEBAR_NAV_GROUPS: NavGroup[] = [
  {
    id: 'dashboard',
    title: 'Tổng quan',
    path: ROUTES.ADMIN.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    id: 'movies-group',
    title: 'Quản lý Phim',
    icon: Film,
    children: [
      {
        title: 'Danh sách Phim',
        path: ROUTES.ADMIN.MOVIES,
      },
      {
        title: 'Tập phim & Video',
        path: ROUTES.ADMIN.EPISODES,
      },
    ],
  },
  {
    id: 'genres',
    title: 'Thể loại',
    path: ROUTES.ADMIN.GENRES,
    icon: Tags,
  },
  {
    id: 'actors',
    title: 'Diễn viên',
    path: ROUTES.ADMIN.ACTORS,
    icon: UserCheck,
  },
  {
    id: 'membership',
    title: 'Gói VIP',
    path: ROUTES.ADMIN.MEMBERSHIP,
    icon: Crown,
  },
  {
    id: 'finance-group',
    title: 'Giao dịch',
    icon: CreditCard,
    children: [
      {
        title: 'Lịch sử mua gói',
        path: ROUTES.ADMIN.PAYMENTS,
      },
      {
        title: 'Lịch sử hoàn tiền',
        path: ROUTES.ADMIN.REFUNDS,
      },
    ],
  },
  {
    id: 'users',
    title: 'Người dùng',
    path: ROUTES.ADMIN.USERS,
    icon: Users,
  },
];
