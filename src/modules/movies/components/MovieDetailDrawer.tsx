import React from 'react';
import {
  Film,
  Calendar,
  Clock,
  Globe,
  User,
  Crown,
  Eye,
  Star,
  MessageSquare,
  Play,
  Pencil,
  UploadCloud,
  Layers,
} from 'lucide-react';
import { Drawer } from '../../../components/ui/Drawer';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Avatar } from '../../../components/ui/Avatar';
import type { MovieItem } from '../types/movie.types';

interface MovieDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieItem | null;
  onEdit?: (movie: MovieItem) => void;
  onPublish?: (movie: MovieItem) => void;
  onPreviewVideo?: (movie: MovieItem) => void;
  onUploadVideo?: (movie: MovieItem) => void;
  onNavigateToEpisodes?: (movie: MovieItem) => void;
  onOpenComments?: (movie: MovieItem) => void;
}

export const MovieDetailDrawer: React.FC<MovieDetailDrawerProps> = ({
  isOpen,
  onClose,
  movie,
  onEdit,
  onPublish,
  onPreviewVideo,
  onUploadVideo,
  onNavigateToEpisodes,
  onOpenComments,
}) => {
  if (!movie) return null;

  const isSeries = movie.movieType === 'SERIES';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} width="lg" title="Chi Tiết Phim">
      <div className="space-y-6 pb-6">
        {/* Banner Backdrop 16:9 ở đầu */}
        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          {movie.backdropUrl ? (
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-600">
              <Film size={48} />
            </div>
          )}

          {/* Lớp phủ gradient mờ */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/40 to-transparent pointer-events-none" />

          {/* Huy hiệu VIP & Định dạng phim trên banner */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge variant={isSeries ? 'purple' : 'info'} size="sm">
              {isSeries ? 'Phim Bộ' : 'Phim Lẻ'}
            </Badge>

            {movie.isPremium && (
              <Badge variant="warning" size="sm" className="flex items-center gap-1 font-bold">
                <Crown size={12} /> VIP
              </Badge>
            )}
          </div>
        </div>

        {/* Khối Thông tin chính: Poster + Tiêu đề */}
        <div className="flex gap-4 -mt-16 relative z-10 px-2">
          {/* Poster đứng 2:3 */}
          <div className="w-24 h-36 rounded-xl overflow-hidden bg-slate-800 border-2 border-white dark:border-slate-800 shadow-xl shrink-0">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <Film size={24} />
              </div>
            )}
          </div>

          {/* Tên phim & Năm */}
          <div className="flex-1 min-w-0 pt-10">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              {movie.title}
            </h2>
            {movie.originalTitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic truncate">
                {movie.originalTitle}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={movie.status === 'READY' ? 'success' : 'default'} dot size="sm">
                {movie.status}
              </Badge>
              {movie.ageRating && (
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                  {movie.ageRating}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Thống kê nhanh: Lượt xem, Đánh giá, Bình luận, Thời lượng */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
          <div>
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Eye size={12} className="text-cyan-500" /> Lượt xem
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {movie.viewCount || 0}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Star size={12} className="fill-amber-500 text-amber-500" /> Đánh giá
            </div>
            <div className="text-sm font-bold text-amber-500 mt-0.5">
              {movie.rating ? `${movie.rating}/10` : 'Chưa có'}
              {movie.ratingCount ? (
                <span className="text-[10px] text-slate-400 font-normal ml-1">({movie.ratingCount})</span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenComments?.(movie)}
            className="p-1 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group text-center"
            title="Quản lý bình luận của phim này"
          >
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 group-hover:text-purple-400">
              <MessageSquare size={12} className="text-purple-400" /> Bình luận
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 group-hover:text-purple-400 group-hover:underline underline-offset-2">
              {movie.commentCount || 0}
            </div>
          </button>

          <div>
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Clock size={12} className="text-slate-400" /> {isSeries ? 'Số tập' : 'Thời lượng'}
            </div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {isSeries ? `${movie.totalEpisodes || 0} tập` : `${movie.duration || 0} phút`}
            </div>
          </div>
        </div>

        {/* Nút tác vụ nhanh: Xem trước video / Upload video / Quản lý tập */}
        <div className="flex flex-wrap items-center gap-2">
          {movie.status === 'READY' && onPreviewVideo && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onPreviewVideo(movie)}
              className="flex items-center gap-1.5"
            >
              <Play size={14} /> Xem trước Video HLS
            </Button>
          )}

          {!isSeries && onUploadVideo && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onUploadVideo(movie)}
              className="flex items-center gap-1.5 text-cyan-500 border border-cyan-500/30"
            >
              <UploadCloud size={14} /> Tải lên Video
            </Button>
          )}

          {isSeries && onNavigateToEpisodes && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onNavigateToEpisodes(movie)}
              className="flex items-center gap-1.5 text-purple-400 border border-purple-500/30"
            >
              <Layers size={14} /> Quản lý danh sách tập phim
            </Button>
          )}
        </div>

        {/* Thể loại */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Thể loại phim
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {movie.genres && movie.genres.length > 0 ? (
              movie.genres.map((genre) => (
                <Badge key={genre.id} variant="cyan" size="sm">
                  {genre.name}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Chưa liên kết thể loại nào</span>
            )}
          </div>
        </div>

        {/* Thông tin sản xuất */}
        <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User size={13} /> Đạo diễn:
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {movie.director || 'Chưa cập nhật'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Globe size={13} /> Quốc gia & Ngôn ngữ:
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {movie.country || 'N/A'} • {movie.language || 'N/A'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar size={13} /> Năm phát hành:
            </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {movie.releaseYear || 'Chưa rõ'}
            </span>
          </div>

          {movie.trailerUrl && (
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Play size={13} /> Trailer:
              </span>
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-500 hover:underline font-mono text-xs truncate max-w-[200px]"
              >
                Xem trên YouTube
              </a>
            </div>
          )}
        </div>

        {/* Diễn viên & Vai diễn */}
        {movie.movieActors && movie.movieActors.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <User size={13} className="text-cyan-500" /> Diễn viên ({movie.movieActors.length})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {movie.movieActors.map((ma) => {
                const actorName = ma.name || ma.actorName || 'Diễn viên';
                const avatar = ma.avatarUrl || ma.actorAvatarUrl;
                return (
                  <div
                    key={ma.actorId}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <Avatar
                      src={avatar}
                      name={actorName}
                      size="sm"
                      shape="circle"
                    />
                    <div className="truncate min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 truncate" title={actorName}>
                        {actorName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate" title={ma.characterName || undefined}>
                        {ma.characterName || 'Chưa đặt vai'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tóm tắt nội dung */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Cốt truyện / Mô tả
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            {movie.description || 'Chưa có mô tả tóm tắt cho bộ phim này.'}
          </p>
        </div>

        {/* Nút hành động cuối Drawer */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          {onOpenComments && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onOpenComments(movie)}
              className="flex-1 flex items-center justify-center gap-1.5"
            >
              <MessageSquare size={14} className="text-purple-400" />
              Bình luận ({movie.commentCount || 0})
            </Button>
          )}

          {onPublish && movie.status !== 'READY' && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onPublish(movie);
              }}
              className="flex-1 flex items-center justify-center gap-1.5"
            >
              <UploadCloud size={15} />
              Xuất bản phim
            </Button>
          )}

          {onEdit && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(movie);
              }}
              className="flex-1 flex items-center justify-center gap-1.5"
            >
              <Pencil size={14} />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  );
};
