import React from 'react';
import { Film, CheckCircle2, Clock, AlertCircle, FileText, Eye, MessageSquare } from 'lucide-react';
import type { MovieItem } from '../types/movie.types';

interface MovieStatisticsCardsProps {
  movies: MovieItem[];
  totalItems: number;
  loading?: boolean;
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

export const MovieStatisticsCards: React.FC<MovieStatisticsCardsProps> = ({
  movies,
  totalItems,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800/40 animate-pulse border border-slate-200 dark:border-slate-800"
          />
        ))}
      </div>
    );
  }

  // Đếm nhanh số lượng theo trạng thái từ danh sách phim hiện thời
  const readyCount = movies.filter((m) => m.status === 'READY').length;
  const processingCount = movies.filter((m) => m.status === 'PROCESSING').length;
  const failedCount = movies.filter((m) => m.status === 'FAILED').length;
  const draftCount = movies.filter((m) => m.status === 'DRAFT').length;

  const totalViews = movies.reduce((acc, m) => acc + (m.viewCount || 0), 0);
  const totalComments = movies.reduce((acc, m) => acc + (m.commentCount || 0), 0);

  const stats = [
    {
      title: 'Tổng số phim',
      count: totalItems,
      icon: Film,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Sẵn sàng phát',
      count: readyCount,
      subText: `${movies.length > 0 ? Math.round((readyCount / movies.length) * 100) : 0}% danh sách`,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Tổng lượt xem',
      count: formatNumber(totalViews),
      subText: 'Toàn bộ trang hiện tại',
      icon: Eye,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Tổng bình luận',
      count: formatNumber(totalComments),
      subText: 'Phản hồi khán giả',
      icon: MessageSquare,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Đang xử lý / Lỗi',
      count: processingCount + failedCount,
      subText: failedCount > 0 ? `${failedCount} lỗi transcode` : 'Bình thường',
      icon: failedCount > 0 ? AlertCircle : Clock,
      color: failedCount > 0 ? 'text-rose-500' : 'text-amber-500',
      bg: failedCount > 0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Bản nháp',
      count: draftCount,
      subText: 'Chưa xuất bản',
      icon: FileText,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10 border-slate-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {s.title}
              </p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {s.count}
              </h3>
              {s.subText && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                  {s.subText}
                </p>
              )}
            </div>
            <div className={`p-2 rounded-lg border ${s.bg} shrink-0`}>
              <Icon className={`w-4 h-4 ${s.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

