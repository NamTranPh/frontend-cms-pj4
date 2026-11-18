import React, { useState, useEffect, useCallback } from 'react';
import { Film, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminMovieService } from '../services/adminMovieService';
import { adminGenreService } from '../../genres/services/adminGenreService';
import type {
  MovieItem,
  CreateMovieRequest,
  UpdateMovieRequest,
  MovieType,
  VideoStatus,
  AgeRating,
} from '../types/movie.types';
import type { GenreItem } from '../../genres/types/genre.types';
import { MovieFilterBar } from '../components/MovieFilterBar';
import { MovieStatisticsCards } from '../components/MovieStatisticsCards';
import { MovieTable } from '../components/MovieTable';
import { MovieFormModal } from '../components/MovieFormModal';
import { MovieDetailDrawer } from '../components/MovieDetailDrawer';
import { MovieCommentsDrawer } from '../../comments/components/MovieCommentsDrawer';
import { ChunkUploadModal } from '../../upload/components/ChunkUploadModal';
import { VideoPreviewModal } from '../../preview/components/VideoPreviewModal';
import type { VideoPreviewTarget } from '../../preview/types/preview.types';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useToast } from '../../../components/feedback';
import { useTableUrlParams } from '../../../hooks/useTableUrlParams';
import { ROUTES } from '../../../config/routes.config';

export const AdminMoviePage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();

  // URL Params Hook
  const {
    page,
    limit,
    search,
    debouncedSearch,
    setSearch,
    setPage,
    setLimit,
    setParam,
    getParam,
    resetFilters,
  } = useTableUrlParams({ defaultPage: 1, defaultLimit: 10, debounceMs: 400 });

  const typeFilter = (getParam('type') as MovieType | 'ALL') || 'ALL';
  const statusFilter = (getParam('status') as VideoStatus | 'ALL') || 'ALL';
  const genreFilter = getParam('genreId') || 'ALL';
  const ageRatingFilter = (getParam('ageRating') as AgeRating | 'ALL') || 'ALL';

  // Data states
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Danh sách thể loại động để đưa vào bộ lọc
  const [genres, setGenres] = useState<GenreItem[]>([]);

  // Modal Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<MovieItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drawer Detail state
  const [selectedMovieForDetail, setSelectedMovieForDetail] = useState<MovieItem | null>(null);

  // Modal Upload Video cho phim lẻ
  const [movieForUpload, setMovieForUpload] = useState<MovieItem | null>(null);

  // Drawer Quản lý Bình luận của phim
  const [movieForComments, setMovieForComments] = useState<MovieItem | null>(null);

  // Modal Xem trước Video (HLS Preview)
  const [previewTarget, setPreviewTarget] = useState<VideoPreviewTarget | null>(null);

  // Confirm Dialogs state
  const [movieToDelete, setMovieToDelete] = useState<MovieItem | null>(null);
  const [movieToRestore, setMovieToRestore] = useState<MovieItem | null>(null);
  const [movieToPublish, setMovieToPublish] = useState<MovieItem | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Tải danh sách thể loại cho FilterBar
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await adminGenreService.getGenres({ limit: 100, status: 'ACTIVE' });
        setGenres(res.items || []);
      } catch {
        // silent
      }
    };
    fetchGenres();
  }, []);

  // Tải danh sách phim
  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminMovieService.getMovies({
        page,
        limit,
        search: debouncedSearch || undefined,
        type: typeFilter,
        status: statusFilter,
        genreId: genreFilter,
        ageRating: ageRatingFilter,
      });

      setMovies(res.items || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể tải danh sách phim.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, typeFilter, statusFilter, genreFilter, ageRatingFilter, toast]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Xử lý Tạo / Cập nhật phim (kèm Video nếu có)
  const handleFormSubmit = async (
    data: CreateMovieRequest | UpdateMovieRequest,
    videoFile?: File | null
  ) => {
    setIsSubmitting(true);
    try {
      let savedMovie: MovieItem | undefined;
      if (editingMovie) {
        savedMovie = await adminMovieService.updateMovie(editingMovie.id, data as UpdateMovieRequest);
        toast.success(`Cập nhật phim "${data.title}" thành công.`);
      } else {
        savedMovie = await adminMovieService.createMovie(data as CreateMovieRequest);
        toast.success(`Tạo mới phim "${data.title}" thành công.`);
      }

      setIsFormOpen(false);
      setEditingMovie(null);
      fetchMovies();

      // Nếu có tệp video được chọn kèm theo trong form, tự động mở ChunkUploadModal để tải video lên
      if (videoFile && savedMovie) {
        setMovieForUpload(savedMovie);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Thao tác lưu phim thất bại.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xem trước video HLS
  const handlePreviewVideo = (movie: MovieItem) => {
    setPreviewTarget({
      contentId: movie.id,
      contentType: 'movie',
      title: movie.title,
      playbackUrl: `/api/v1/movies/${movie.id}/stream/master.m3u8`,
    });
  };

  // Mở modal tải video cho phim lẻ
  const handleUploadVideo = (movie: MovieItem) => {
    setMovieForUpload(movie);
  };

  // Xử lý Xóa mềm phim
  const handleDeleteConfirm = async () => {
    if (!movieToDelete) return;
    setIsActionLoading(true);
    try {
      await adminMovieService.deleteMovie(movieToDelete.id);
      toast.success(`Đã xóa mềm phim "${movieToDelete.title}".`);
      setMovieToDelete(null);
      fetchMovies();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Xóa phim thất bại.';
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Xử lý Khôi phục phim
  const handleRestoreConfirm = async () => {
    if (!movieToRestore) return;
    setIsActionLoading(true);
    try {
      await adminMovieService.restoreMovie(movieToRestore.id);
      toast.success(`Khôi phục phim "${movieToRestore.title}" thành công.`);
      setMovieToRestore(null);
      fetchMovies();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Khôi phục phim thất bại.';
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Xử lý Xuất bản phim (hoặc Retry Transcode)
  const handlePublishConfirm = async () => {
    if (!movieToPublish) return;
    setIsActionLoading(true);
    try {
      await adminMovieService.publishMovie(movieToPublish.id);
      toast.success(
        movieToPublish.status === 'FAILED'
          ? `Đã kích hoạt xử lý lại video cho phim "${movieToPublish.title}".`
          : `Xuất bản phim "${movieToPublish.title}" thành công!`,
      );
      setMovieToPublish(null);
      fetchMovies();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Xuất bản phim thất bại.';
      toast.error(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Trang Quản Trị Phim */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Film className="text-[#002b80] dark:text-cyan-400" />
            Quản Lý Phim (Movie Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý kho phim của hệ thống, 
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchMovies}
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Làm mới
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingMovie(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5"
          >
            <Plus size={16} />
            Thêm phim mới
          </Button>
        </div>
      </div>

      {/* 2. Thẻ thống kê chỉ số phim (Movie Summary Header) */}
      <MovieStatisticsCards
        movies={movies}
        totalItems={totalItems}
        loading={isLoading}
      />

      {/* 3. Thanh lọc & Tìm kiếm đa năng */}
      <MovieFilterBar
        search={search}
        onSearchChange={setSearch}
        typeFilter={typeFilter}
        onTypeFilterChange={(val) => setParam('type', val)}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => setParam('status', val)}
        genreFilter={genreFilter}
        onGenreFilterChange={(val) => setParam('genreId', val)}
        ageRatingFilter={ageRatingFilter}
        onAgeRatingFilterChange={(val) => setParam('ageRating', val)}
        genres={genres}
        onReset={resetFilters}
      />

      {/* 3. Bảng danh sách Phim */}
      <MovieTable
        movies={movies}
        isLoading={isLoading}
        onViewDetail={(m) => setSelectedMovieForDetail(m)}
        onEdit={(m) => {
          setEditingMovie(m);
          setIsFormOpen(true);
        }}
        onDelete={(m) => setMovieToDelete(m)}
        onRestore={(m) => setMovieToRestore(m)}
        onPublish={(m) => setMovieToPublish(m)}
        onNavigateToEpisodes={(m) => {
          navigate(`${ROUTES.ADMIN.EPISODES}?movieId=${m.id}`);
        }}
        onPreviewVideo={handlePreviewVideo}
        onUploadVideo={handleUploadVideo}
        onOpenComments={(m) => setMovieForComments(m)}
      />

      {/* 4. Phân trang đồng bộ URL */}
      {totalItems > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          limit={limit}
          totalItems={totalItems}
          onPageChange={setPage}
          onLimitChange={setLimit}
          limitOptions={[10, 20, 50]}
        />
      )}

      {/* 5. Modal Thêm / Chỉnh sửa Phim (Phim lẻ & Phim bộ) */}
      <MovieFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMovie(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingMovie}
        isLoading={isSubmitting}
      />

      {/* 6. Drawer Chi tiết phim */}
      <MovieDetailDrawer
        isOpen={Boolean(selectedMovieForDetail)}
        onClose={() => setSelectedMovieForDetail(null)}
        movie={selectedMovieForDetail}
        onEdit={(m) => {
          setSelectedMovieForDetail(null);
          setEditingMovie(m);
          setIsFormOpen(true);
        }}
        onPublish={(m) => {
          setSelectedMovieForDetail(null);
          setMovieToPublish(m);
        }}
        onPreviewVideo={handlePreviewVideo}
        onUploadVideo={handleUploadVideo}
        onOpenComments={(m) => setMovieForComments(m)}
        onNavigateToEpisodes={(m) => {
          setSelectedMovieForDetail(null);
          navigate(`${ROUTES.ADMIN.EPISODES}?movieId=${m.id}`);
        }}
      />

      {/* 7. Confirm Dialog: Xóa mềm phim */}
      <ConfirmDialog
        isOpen={Boolean(movieToDelete)}
        title="Xác nhận xóa phim"
        description={
          movieToDelete
            ? `Bạn có chắc chắn muốn xóa phim "${movieToDelete.title}"? Phim sẽ bị ẩn khỏi trang người xem và chuyển vào danh sách lưu trữ.`
            : ''
        }
        confirmText="Xóa phim"
        cancelText="Hủy bỏ"
        variant="danger"
        isLoading={isActionLoading}
        onConfirm={handleDeleteConfirm}
        onClose={() => setMovieToDelete(null)}
      />

      {/* 8. Confirm Dialog: Khôi phục phim */}
      <ConfirmDialog
        isOpen={Boolean(movieToRestore)}
        title="Khôi phục phim đã xóa"
        description={
          movieToRestore
            ? `Khôi phục phim "${movieToRestore.title}" về trạng thái hoạt động trong hệ thống?`
            : ''
        }
        confirmText="Khôi phục"
        cancelText="Hủy bỏ"
        variant="primary"
        isLoading={isActionLoading}
        onConfirm={handleRestoreConfirm}
        onClose={() => setMovieToRestore(null)}
      />

      {/* 9. Confirm Dialog: Xuất bản phim (hoặc Retry Transcode) */}
      <ConfirmDialog
        isOpen={Boolean(movieToPublish)}
        title={
          movieToPublish?.status === 'FAILED'
            ? 'Xử lý lại video transcode'
            : 'Xác nhận xuất bản phim'
        }
        description={
          movieToPublish
            ? movieToPublish.status === 'FAILED'
              ? `Kích hoạt tiến trình transcode lại video cho phim "${movieToPublish.title}"? Hệ thống sẽ quét lại dữ liệu và sinh luồng HLS mới.`
              : `Xuất bản phim "${movieToPublish.title}"? Khán giả trên Web Client sẽ có thể bắt đầu tìm kiếm và xem phim này.`
            : ''
        }
        confirmText={movieToPublish?.status === 'FAILED' ? 'Xử lý lại' : 'Xuất bản ngay'}
        cancelText="Hủy bỏ"
        variant="primary"
        isLoading={isActionLoading}
        onConfirm={handlePublishConfirm}
        onClose={() => setMovieToPublish(null)}
      />

      {/* 10. Modal Tải lên Video Chunked cho Phim lẻ */}
      {movieForUpload && (
        <ChunkUploadModal
          isOpen={Boolean(movieForUpload)}
          onClose={() => setMovieForUpload(null)}
          movieId={movieForUpload.id}
          movieTitle={movieForUpload.title}
          onSuccess={() => {
            fetchMovies();
          }}
          onPreview={(target) => {
            setMovieForUpload(null);
            setPreviewTarget({
              contentId: movieForUpload.id,
              contentType: 'movie',
              title: target.title,
              playbackUrl: target.playbackUrl,
            });
          }}
        />
      )}

      {/* 11. Modal Xem trước Video HLS Player */}
      <VideoPreviewModal
        isOpen={Boolean(previewTarget)}
        onClose={() => setPreviewTarget(null)}
        target={previewTarget}
      />

      {/* 12. Drawer Quản lý Bình luận của Phim */}
      <MovieCommentsDrawer
        isOpen={Boolean(movieForComments)}
        onClose={() => setMovieForComments(null)}
        movie={movieForComments}
        onCommentCountChange={fetchMovies}
      />
    </div>
  );
};
