import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Search,
  Eye,
  EyeOff,
  Heart,
  Calendar,
  Loader2,
  RefreshCw,
  Film,
} from 'lucide-react';
import { Drawer } from '../../../components/ui/Drawer';
import { Button } from '../../../components/ui/Button';
import { Avatar } from '../../../components/ui/Avatar';
import { useToast } from '../../../components/feedback';
import { formatDate } from '../../../utils/formatters';
import { adminCommentService } from '../services/adminCommentService';
import type { AdminCommentItem } from '../types/comment.types';
import type { MovieItem } from '../../movies/types/movie.types';

export interface MovieCommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieItem | null;
  onCommentCountChange?: () => void;
}

export const MovieCommentsDrawer: React.FC<MovieCommentsDrawerProps> = ({
  isOpen,
  onClose,
  movie,
  onCommentCountChange,
}) => {
  const toast = useToast();

  const [comments, setComments] = useState<AdminCommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'hidden'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!movie?.id) return;

    setIsLoading(true);
    try {
      const isApprovedParam =
        statusFilter === 'approved' ? true : statusFilter === 'hidden' ? false : undefined;

      const res = await adminCommentService.getComments({
        movieId: movie.id,
        isApproved: isApprovedParam,
        search: search.trim() || undefined,
        page,
        limit: 10,
      });

      setComments(res.items || []);
      setTotalPages(res.totalPages || 1);
      setTotalItems(res.totalItems || 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách bình luận';
      toast.error(msg);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [movie?.id, statusFilter, search, page, toast]);

  useEffect(() => {
    if (isOpen && movie?.id) {
      fetchComments();
    }
  }, [isOpen, movie?.id, fetchComments]);

  // Reset trang khi đổi filter
  const handleFilterChange = (status: 'all' | 'approved' | 'hidden') => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchComments();
  };

  // Ẩn / Bỏ ẩn bình luận
  const handleToggleApproval = async (commentId: string, currentStatus: boolean) => {
    setActionInProgressId(commentId);
    try {
      const newStatus = !currentStatus;
      await adminCommentService.setApproval(commentId, newStatus);
      toast.success(newStatus ? 'Đã duyệt / hiển thị bình luận' : 'Đã ẩn bình luận thành công');

      // Cập nhật state nội bộ
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, isApproved: newStatus } : c))
      );

      if (onCommentCountChange) {
        onCommentCountChange();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Thao tác thất bại';
      toast.error(msg);
    } finally {
      setActionInProgressId(null);
    }
  };

  if (!movie) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="lg"
      title={
        <div className="flex items-center gap-2">
          <MessageSquare className="text-cyan-500 shrink-0" size={20} />
          <span className="truncate">Bình luận phim: {movie.title}</span>
        </div>
      }
      description={`Kiểm duyệt, ẩn hoặc hiển thị các phản hồi của người xem (${totalItems} bình luận)`}
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Trang {page} / {totalPages} (Tổng {totalItems} bình luận)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Trang trước
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Trang sau
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Banner tóm tắt phim */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/60">
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <Film size={20} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
              {movie.title}
            </h4>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {movie.originalTitle || 'Chưa có tên gốc'} • {movie.releaseYear || '—'}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                <MessageSquare size={12} />
                {totalItems} bình luận
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-[11px] text-slate-400">
                {movie.movieType === 'SERIES' ? 'Phim bộ' : 'Phim lẻ'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchComments}
            disabled={isLoading}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-colors cursor-pointer"
            title="Làm mới bình luận"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin text-cyan-500' : ''} />
          </button>
        </div>

        {/* Bộ lọc & Tìm kiếm */}
        <div className="space-y-3">
          {/* Ô tìm kiếm */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung hoặc tên người bình luận..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              Tìm
            </button>
          </form>

          {/* Tab trạng thái kiểm duyệt */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => handleFilterChange('all')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-[#131c2e] text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('approved')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'approved'
                  ? 'bg-white dark:bg-[#131c2e] text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Đang hiển thị
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('hidden')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === 'hidden'
                  ? 'bg-white dark:bg-[#131c2e] text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Đang bị ẩn
            </button>
          </div>
        </div>

        {/* Danh sách bình luận */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 size={28} className="animate-spin text-cyan-500" />
            <p className="text-xs text-slate-500 dark:text-slate-400">Đang tải bình luận của phim...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
              <MessageSquare size={24} />
            </div>
            <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Không tìm thấy bình luận nào
            </h5>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {search
                ? 'Không có bình luận nào khớp với từ khóa tìm kiếm.'
                : statusFilter !== 'all'
                ? 'Không có bình luận nào thuộc trạng thái lọc này.'
                : 'Phim này hiện chưa có phản hồi hoặc bình luận nào từ khán giả.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => {
              const isBusy = actionInProgressId === comment.id;

              return (
                <div
                  key={comment.id}
                  className={`p-4 rounded-xl border transition-all ${
                    comment.isApproved
                      ? 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      : 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200/60 dark:border-rose-900/40'
                  }`}
                >
                  {/* Header bình luận: Tác giả, Thời gian, Trạng thái */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar
                        src={comment.author?.avatarUrl}
                        name={comment.author?.name || 'Khán giả'}
                        size="sm"
                        shape="circle"
                      />
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate block">
                          {comment.author?.name || 'Khán giả ẩn danh'}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {formatDate(comment.createdAt)}
                          </span>
                          {comment.episodeId && (
                            <span className="text-cyan-500 font-medium">
                              (Tập phim)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Trạng thái duyệt */}
                    <div>
                      {comment.isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          Hiển thị
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                          Đang bị ẩn
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nội dung bình luận */}
                  <div className="mt-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </div>

                  {/* Footer bình luận: Like count & Action */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                      <Heart size={13} className="text-rose-500 fill-rose-500/20" />
                      <span>{comment.likeCount || 0} lượt thích</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {comment.isApproved ? (
                        <button
                          type="button"
                          onClick={() => handleToggleApproval(comment.id, comment.isApproved)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isBusy ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <EyeOff size={12} />
                          )}
                          <span>Ẩn bình luận</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleApproval(comment.id, comment.isApproved)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isBusy ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Eye size={12} />
                          )}
                          <span>Hiện bình luận</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Drawer>
  );
};
