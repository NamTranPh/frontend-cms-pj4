import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Film,
  Crown,
  MessageSquare,
  Clock,
  CheckCheck,
  RefreshCw,
  Loader2,
  X,
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import type { NotificationItem, NotificationType } from '../types/notification.types';
import { formatDate } from '../../../utils/formatters';

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
  onUnreadCountChange: () => void;
}

const typeConfig: Record<
  NotificationType,
  { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
> = {
  NEW_REPORT: {
    label: 'Báo cáo vi phạm',
    icon: <AlertTriangle size={15} />,
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30',
  },
  REPORT_RESOLVED: {
    label: 'Đã xử lý báo cáo',
    icon: <CheckCircle2 size={15} />,
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
  },
  NEW_EPISODE: {
    label: 'Tập phim mới',
    icon: <Film size={15} />,
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-500/30',
  },
  MEMBERSHIP_EXPIRY: {
    label: 'Hội viên VIP',
    icon: <Crown size={15} />,
    bg: 'bg-purple-500/10 dark:bg-purple-500/15',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
  },
  COMMENT_REPLY: {
    label: 'Bình luận',
    icon: <MessageSquare size={15} />,
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
  },
  SYSTEM: {
    label: 'Hệ thống',
    icon: <Bell size={15} />,
    bg: 'bg-slate-500/10 dark:bg-slate-500/15',
    text: 'text-slate-600 dark:text-slate-300',
    border: 'border-slate-500/30',
  },
};

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  unreadCount,
  onUnreadCountChange,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await notificationService.getNotifications({
        isRead: filter === 'unread' ? false : undefined,
        limit: 20,
      });
      setNotifications(res.items || []);
      if (filter === 'all' || totalCount === 0) {
        setTotalCount(res.totalItems || 0);
      }
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter, totalCount]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Đánh dấu 1 thông báo đã đọc
  const handleItemClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      try {
        await notificationService.markAsRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
        onUnreadCountChange();
      } catch {
        // silent
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[520px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Bell size={16} className="text-[#002b80] dark:text-cyan-400" />
            Thông Báo
          </h4>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500 text-slate-950">
              {unreadCount} mới
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={fetchNotifications}
            disabled={isLoading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-cyan-500' : ''} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 gap-2 bg-slate-50/40 dark:bg-slate-900/30 text-xs">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Tất cả {totalCount > 0 ? `(${totalCount})` : ''}
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Chưa đọc ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
            <Loader2 size={24} className="animate-spin text-cyan-500" />
            <p className="text-xs text-slate-400">Đang tải thông báo...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center p-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-2">
              <CheckCheck size={20} />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {filter === 'unread' ? 'Không có thông báo chưa đọc nào' : 'Bạn chưa có thông báo nào'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Các thông báo liên quan đến báo cáo, phản hồi hoặc hệ thống sẽ xuất hiện ở đây.
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const config = typeConfig[n.type] || typeConfig.SYSTEM;

            return (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                  n.isRead
                    ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-75'
                    : 'bg-cyan-50/30 dark:bg-cyan-500/5 hover:bg-cyan-50/50 dark:hover:bg-cyan-500/10'
                }`}
              >
                {/* Icon loại thông báo */}
                <div
                  className={`p-2 rounded-xl shrink-0 border ${config.bg} ${config.text} ${config.border}`}
                >
                  {config.icon}
                </div>

                {/* Nội dung thông báo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate block">
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span
                        className="w-2 h-2 rounded-full bg-cyan-500 shrink-0"
                        title="Chưa đọc"
                      />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                    {n.content}
                  </p>

                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                    <Clock size={10} />
                    <span>{formatDate(n.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
