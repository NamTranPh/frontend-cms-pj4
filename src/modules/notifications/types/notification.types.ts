export type NotificationType =
  | 'NEW_REPORT'
  | 'REPORT_RESOLVED'
  | 'NEW_EPISODE'
  | 'MEMBERSHIP_EXPIRY'
  | 'COMMENT_REPLY'
  | 'SYSTEM';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  referenceType?: string;
  referenceId?: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationFilterParams {
  isRead?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
