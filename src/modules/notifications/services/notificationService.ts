import { fetchClient } from '../../../api/fetchClient';
import type { PageResult } from '../../../types/common.types';
import type { NotificationItem, NotificationFilterParams } from '../types/notification.types';

/**
 * Service kết nối API Thông báo cá nhân & Quản trị
 */
export const notificationService = {
  getNotifications: (params?: NotificationFilterParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.isRead !== undefined) query.append('isRead', String(params.isRead));
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString();
    return fetchClient<PageResult<NotificationItem>>(
      `/me/notifications${queryString ? `?${queryString}` : ''}`
    );
  },

  // Đếm số lượng thông báo chưa đọc
  getUnreadCount: async (): Promise<number> => {
    try {
      const res = await fetchClient<{ unreadCount: number } | number | { data?: { unreadCount?: number } }>(
        '/me/notifications/unread-count'
      );
      if (typeof res === 'number') return res;
      if (res && typeof res === 'object') {
        if ('unreadCount' in res && typeof res.unreadCount === 'number') {
          return res.unreadCount;
        }
        if ('data' in res && res.data && typeof res.data.unreadCount === 'number') {
          return res.data.unreadCount;
        }
      }
      return 0;
    } catch {
      return 0;
    }
  },

  // Đánh dấu 1 thông báo là đã đọc
  markAsRead: (id: string) =>
    fetchClient<void>(`/me/notifications/${id}/read`, {
      method: 'PUT',
    }),
};
