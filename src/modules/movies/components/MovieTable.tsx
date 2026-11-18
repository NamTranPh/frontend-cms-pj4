import React from 'react';
import {
  Eye,
  Star,
  MessageSquare,
  Play,
  Pencil,
  Trash2,
  RotateCcw,
  UploadCloud,
  Layers,
  Crown,
  Film,
  Tv,
  Clock,
  Loader2,
} from 'lucide-react';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Tooltip } from '../../../components/ui/Tooltip';
import type { MovieItem } from '../types/movie.types';

const formatCount = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

interface MovieTableProps {
  movies: MovieItem[];
  isLoading: boolean;
  onViewDetail: (movie: MovieItem) => void;
  onEdit: (movie: MovieItem) => void;
  onDelete: (movie: MovieItem) => void;
  onRestore?: (movie: MovieItem) => void;
  onPublish: (movie: MovieItem) => void;
  onNavigateToEpisodes?: (movie: MovieItem) => void;
  onPreviewVideo?: (movie: MovieItem) => void;
  onUploadVideo?: (movie: MovieItem) => void;
  onOpenComments?: (movie: MovieItem) => void;
}

export const MovieTable: React.FC<MovieTableProps> = ({
  movies,
  isLoading,
  onViewDetail,
  onEdit,
  onDelete,
  onRestore,
  onPublish,
  onNavigateToEpisodes,
  onPreviewVideo,
  onUploadVideo,
  onOpenComments,
}) => {
  if (isLoading) {
    return (
      <Table>
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase w-16">Poster</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Thông tin phim</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Thể loại</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Định dạng</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="py-3 px-4"><Skeleton className="w-12 h-16 rounded-lg" /></td>
              <td className="py-3 px-4 space-y-2">
                <Skeleton className="w-48 h-4" />
                <Skeleton className="w-32 h-3" />
              </td>
              <td className="py-3 px-4"><Skeleton className="w-24 h-5 rounded-full" /></td>
              <td className="py-3 px-4"><Skeleton className="w-20 h-5 rounded-full" /></td>
              <td className="py-3 px-4"><Skeleton className="w-20 h-5 rounded-full" /></td>
              <td className="py-3 px-4 text-right"><Skeleton className="w-28 h-8 ml-auto rounded-lg" /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  if (movies.length === 0) {
    return (
      <Table>
        <tbody>
          <tr>
            <td colSpan={6} className="py-14 text-center text-slate-400">
              <div className="flex flex-col items-center justify-center gap-2">
                <Film size={38} className="text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Không tìm thấy phim nào phù hợp
                </p>
                <p className="text-xs text-slate-500">
                  Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Thêm phim mới".
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  return (
    <Table>
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <th className="py-3.5 px-4 w-16">Poster</th>
          <th className="py-3.5 px-4 min-w-[200px]">Thông tin phim</th>
          <th className="py-3.5 px-4 min-w-[150px]">Thể loại</th>
          <th className="py-3.5 px-4 min-w-[120px]">Định dạng</th>
          <th className="py-3.5 px-4 w-32">Trạng thái</th>
          <th className="py-3.5 px-4 w-44 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
        {movies.map((movie) => {
          const isSeries = movie.movieType === 'SERIES';
          const isDeleted = Boolean(movie.deletedAt);

          // Trạng thái hiển thị badge
          const statusBadge = (() => {
            switch (movie.status) {
              case 'READY':
                return (
                  <Badge variant="success" dot size="sm">
                    Sẵn sàng
                  </Badge>
                );
              case 'PROCESSING':
                return (
                  <Badge variant="warning" size="sm" className="flex items-center gap-1">
                    <Loader2 size={11} className="animate-spin text-amber-500" />
                    Đang xử lý
                  </Badge>
                );
              case 'FAILED':
                return (
                  <Badge variant="danger" dot size="sm">
                    Lỗi transcode
                  </Badge>
                );
              case 'DRAFT':
              default:
                return (
                  <Badge variant="default" dot size="sm">
                    Bản nháp
                  </Badge>
                );
            }
          })();

          return (
            <tr
              key={movie.id}
              className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                isDeleted ? 'opacity-60 bg-rose-50/20 dark:bg-rose-950/10' : ''
              }`}
            >
              {/* Poster 2:3 */}
              <td className="py-3 px-4">
                <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center shadow-xs">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Film size={20} className="text-slate-400" />
                  )}
                </div>
              </td>

              {/* Thông tin phim */}
              <td className="py-3 px-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 truncate block text-sm">
                      {movie.title}
                    </span>
                    {movie.isPremium && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-500 border border-amber-500/30">
                        <Crown size={10} /> VIP
                      </span>
                    )}
                  </div>

                  {movie.originalTitle && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate italic">
                      {movie.originalTitle}
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 text-[11px] text-slate-400 pt-0.5">
                    {movie.releaseYear && <span>Năm: {movie.releaseYear}</span>}
                    {movie.duration ? (
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {movie.duration} phút
                      </span>
                    ) : isSeries && movie.totalEpisodes ? (
                      <span>{movie.totalEpisodes} tập</span>
                    ) : null}
                    {movie.ageRating && (
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        [{movie.ageRating}]
                      </span>
                    )}
                  </div>

                  {/* Chỉ số Tương tác: Lượt xem, Đánh giá, Bình luận */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300" title="Lượt xem">
                      <Eye size={12} className="text-cyan-500" />
                      {formatCount(movie.viewCount || 0)}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-amber-500" title="Điểm đánh giá">
                      <Star size={12} className="fill-amber-500 text-amber-500" />
                      {movie.rating ? `${movie.rating}` : '0'}
                      {movie.ratingCount ? (
                        <span className="text-[10px] text-slate-400 font-normal">({movie.ratingCount})</span>
                      ) : null}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenComments?.(movie)}
                      className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 font-medium transition-colors cursor-pointer group"
                      title="Quản lý bình luận của phim"
                    >
                      <MessageSquare size={12} className="text-purple-400 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:underline underline-offset-2">{movie.commentCount || 0}</span>
                    </button>
                  </div>
                </div>
              </td>

              {/* Thể loại */}
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {movie.genres && movie.genres.length > 0 ? (
                    movie.genres.slice(0, 3).map((g) => (
                      <Badge key={g.id} variant="cyan" size="sm">
                        {g.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Chưa gán</span>
                  )}
                  {movie.genres && movie.genres.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      +{movie.genres.length - 3}
                    </span>
                  )}
                </div>
              </td>

              {/* Định dạng Phim */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-1.5">
                  {isSeries ? (
                    <Badge variant="purple" size="sm" className="flex items-center gap-1 font-semibold">
                      <Tv size={11} /> Phim Bộ
                    </Badge>
                  ) : (
                    <Badge variant="info" size="sm" className="flex items-center gap-1 font-semibold">
                      <Film size={11} /> Phim Lẻ
                    </Badge>
                  )}
                </div>
              </td>

              {/* Trạng thái */}
              <td className="py-3 px-4">
                {isDeleted ? (
                  <Badge variant="danger" dot size="sm">
                    Đã xóa
                  </Badge>
                ) : (
                  statusBadge
                )}
              </td>

              {/* Cụm Thao tác */}
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  {/* Nút Retry Publish khi bị FAILED hoặc Xuất bản khi DRAFT */}
                  {!isDeleted && (movie.status === 'FAILED' || movie.status === 'DRAFT') && (
                    <Tooltip
                      content={
                        movie.status === 'FAILED'
                          ? 'Xử lý lại video (Retry Transcode)'
                          : 'Xuất bản phim công khai'
                      }
                    >
                      <Button
                        type="button"
                        variant={movie.status === 'FAILED' ? 'danger' : 'ghost'}
                        size="icon-sm"
                        onClick={() => onPublish(movie)}
                        title={movie.status === 'FAILED' ? 'Thử lại' : 'Xuất bản'}
                        className={
                          movie.status === 'FAILED'
                            ? ''
                            : 'text-cyan-600 dark:text-cyan-400 hover:text-cyan-700'
                        }
                      >
                        {movie.status === 'FAILED' ? (
                          <RotateCcw size={15} />
                        ) : (
                          <UploadCloud size={15} />
                        )}
                      </Button>
                    </Tooltip>
                  )}

                  {/* Nút Xem trước Video khi đã READY */}
                  {!isDeleted && movie.status === 'READY' && onPreviewVideo && (
                    <Tooltip content="Xem trước Video (HLS Player)">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onPreviewVideo(movie)}
                        title="Xem trước video"
                        className="text-cyan-500 hover:text-cyan-600"
                      >
                        <Play size={15} />
                      </Button>
                    </Tooltip>
                  )}

                  {/* Nút Tải lên Video cho Phim lẻ (SINGLE) */}
                  {!isDeleted && !isSeries && onUploadVideo && (
                    <Tooltip content="Tải lên hoặc thay thế Video cho phim lẻ này">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onUploadVideo(movie)}
                        title="Tải video"
                        className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700"
                      >
                        <UploadCloud size={15} />
                      </Button>
                    </Tooltip>
                  )}

                  {/* Nút Quản lý Tập phim (Chỉ với Phim Bộ SERIES) */}
                  {!isDeleted && isSeries && onNavigateToEpisodes && (
                    <Tooltip content="Quản lý danh sách tập phim">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onNavigateToEpisodes(movie)}
                        title="Tập phim"
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700"
                      >
                        <Layers size={15} />
                      </Button>
                    </Tooltip>
                  )}

                  {/* Nút Xem chi tiết */}
                  <Tooltip content="Xem chi tiết phim">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onViewDetail(movie)}
                      title="Xem chi tiết"
                    >
                      <Eye size={15} />
                    </Button>
                  </Tooltip>

                  {/* Nút Chỉnh sửa */}
                  {!isDeleted && (
                    <Tooltip content="Chỉnh sửa thông tin phim">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEdit(movie)}
                        title="Chỉnh sửa"
                      >
                        <Pencil size={15} />
                      </Button>
                    </Tooltip>
                  )}

                  {/* Nút Xóa mềm hoặc Khôi phục */}
                  {isDeleted && onRestore ? (
                    <Tooltip content="Khôi phục phim">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onRestore(movie)}
                        title="Khôi phục"
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        <RotateCcw size={15} />
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip content="Xóa mềm phim">
                      <Button
                        type="button"
                        variant="danger"
                        size="icon-sm"
                        onClick={() => onDelete(movie)}
                        title="Xóa phim"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
