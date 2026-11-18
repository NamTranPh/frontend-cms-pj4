import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Video, Plus, ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useToast } from '../../../components/feedback';
import { adminEpisodeService } from '../services/adminEpisodeService';
import { adminMovieService } from '../../movies/services/adminMovieService';
import type { Episode, CreateEpisodeRequest, UpdateEpisodeRequest } from '../types/episode.types';
import type { MovieItem } from '../../movies/types/movie.types';
import { EpisodeTable } from '../components/EpisodeTable';
import { EpisodeFormModal } from '../components/EpisodeFormModal';
import { ChunkUploadModal } from '../../upload/components/ChunkUploadModal';
import { VideoPreviewModal } from '../../preview/components/VideoPreviewModal';
import type { VideoPreviewTarget } from '../../preview/types/preview.types';
import { ROUTES } from '../../../config/routes.config';

export const AdminEpisodePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const queryMovieId = searchParams.get('movieId') || '';

  // Danh sách các phim bộ để chọn
  const [seriesMovies, setSeriesMovies] = useState<MovieItem[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string>(queryMovieId);
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);

  // Danh sách tập phim
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Thêm/Sửa Tập
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Upload Video
  const [uploadEpisodeTarget, setUploadEpisodeTarget] = useState<Episode | null>(null);

  // Modal Xem trước Video (HLS Preview)
  const [previewTarget, setPreviewTarget] = useState<VideoPreviewTarget | null>(null);

  // Confirm Xóa
  const [episodeToDelete, setEpisodeToDelete] = useState<Episode | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Tải danh sách các Phim Bộ (SERIES)
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await adminMovieService.getMovies({ type: 'SERIES', limit: 100 });
        const items = res.items || [];
        setSeriesMovies(items);

        if (!selectedMovieId && items.length > 0) {
          setSelectedMovieId(items[0].id);
          setSearchParams({ movieId: items[0].id });
        }
      } catch {
        toast.error('Không thể tải danh sách phim bộ');
      }
    };
    fetchSeries();
  }, []);

  // 2. Cập nhật selectedMovie khi selectedMovieId thay đổi
  useEffect(() => {
    if (selectedMovieId) {
      const found = seriesMovies.find((m) => m.id === selectedMovieId);
      setSelectedMovie(found || null);
    }
  }, [selectedMovieId, seriesMovies]);

  // 3. Tải danh sách tập phim theo movieId
  const fetchEpisodes = useCallback(async () => {
    if (!selectedMovieId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await adminEpisodeService.getEpisodesByMovie(selectedMovieId);
      // Sắp xếp theo số tập tăng dần
      const sorted = (data || []).sort((a, b) => a.episodeNumber - b.episodeNumber);
      setEpisodes(sorted);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách tập phim';
      toast.error(msg);
      setEpisodes([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMovieId, toast]);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  // Thay đổi phim bộ từ dropdown
  const handleSelectMovie = (movieId: string) => {
    setSelectedMovieId(movieId);
    setSearchParams({ movieId });
  };

  // Thêm hoặc Cập nhật tập phim
  const handleFormSubmit = async (data: CreateEpisodeRequest | UpdateEpisodeRequest) => {
    if (!selectedMovieId) return;
    setIsSubmitting(true);
    try {
      if (editingEpisode) {
        await adminEpisodeService.updateEpisode(selectedMovieId, editingEpisode.id, data as UpdateEpisodeRequest);
        toast.success(`Cập nhật tập ${data.episodeNumber} thành công`);
      } else {
        await adminEpisodeService.createEpisode(selectedMovieId, data as CreateEpisodeRequest);
        toast.success(`Tạo mới tập ${data.episodeNumber} thành công`);
      }
      setIsFormOpen(false);
      setEditingEpisode(null);
      fetchEpisodes();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lưu tập phim thất bại';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa tập phim
  const handleDeleteConfirm = async () => {
    if (!selectedMovieId || !episodeToDelete) return;
    setIsDeleting(true);
    try {
      await adminEpisodeService.deleteEpisode(selectedMovieId, episodeToDelete.id);
      toast.success(`Đã xóa tập ${episodeToDelete.episodeNumber}`);
      setEpisodeToDelete(null);
      fetchEpisodes();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Xóa tập phim thất bại';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Xuất bản tập phim
  const handlePublishEpisode = async (episode: Episode) => {
    if (!selectedMovieId) return;
    try {
      await adminEpisodeService.publishEpisode(selectedMovieId, episode.id);
      toast.success(`Đã xuất bản tập ${episode.episodeNumber}`);
      fetchEpisodes();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Xuất bản tập phim thất bại';
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Trang Quản Trị Tập Phim */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate(ROUTES.ADMIN.MOVIES)}
              title="Quay lại Quản lý Phim"
            >
              <ArrowLeft size={18} />
            </Button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
              <Video className="text-[#002b80] dark:text-cyan-400" />
              Quản Lý Tập Phim (Episode Management)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-8">
            Quản lý danh sách các tập của phim bộ, tải lên video dung lượng lớn và theo dõi xử lý HLS Transcode.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={fetchEpisodes}
            disabled={isLoading || !selectedMovieId}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            Làm mới
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setEditingEpisode(null);
              setIsFormOpen(true);
            }}
            disabled={!selectedMovieId}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm tập mới
          </Button>
        </div>
      </div>

      {/* 2. Thanh Chọn Bộ Phim Cần Quản Lý Tập */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
            <Layers size={20} />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Đang chọn phim bộ:
            </label>
            <select
              value={selectedMovieId}
              onChange={(e) => handleSelectMovie(e.target.value)}
              className="mt-0.5 font-bold text-slate-900 dark:text-slate-100 bg-transparent text-sm sm:text-base border-b border-slate-300 dark:border-slate-700 pb-0.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {seriesMovies.length === 0 ? (
                <option value="">Không có phim bộ nào</option>
              ) : (
                seriesMovies.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                    {m.title} ({m.totalEpisodes || '?'} tập)
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {selectedMovie && (
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <span>Tổng tập dự kiến: <strong>{selectedMovie.totalEpisodes || 0}</strong></span>
            <span>•</span>
            <span>Đã tạo: <strong>{episodes.length}</strong> tập</span>
          </div>
        )}
      </div>

      {/* 3. Bảng Danh Sách Tập Phim */}
      <div className="rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <EpisodeTable
          episodes={episodes}
          isLoading={isLoading}
          onUploadVideo={(ep) => setUploadEpisodeTarget(ep)}
          onPreview={(ep) => {
            setPreviewTarget({
              contentId: ep.id,
              contentType: 'episode',
              title: selectedMovie ? selectedMovie.title : 'Phim',
              episodeNumber: ep.episodeNumber,
              playbackUrl: `/api/v1/movies/${selectedMovieId}/episodes/${ep.id}/stream/master.m3u8`,
            });
          }}
          onEdit={(ep) => {
            setEditingEpisode(ep);
            setIsFormOpen(true);
          }}
          onDelete={(ep) => setEpisodeToDelete(ep)}
          onPublish={handlePublishEpisode}
        />
      </div>

      {/* Modal Thêm / Chỉnh Sửa Tập Phim */}
      <EpisodeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEpisode(null);
        }}
        onSubmit={handleFormSubmit}
        movieId={selectedMovieId}
        initialData={editingEpisode}
        suggestedEpisodeNumber={episodes.length + 1}
        isLoading={isSubmitting}
      />

      {/* Modal Upload Video Cho Tập Phim */}
      {uploadEpisodeTarget && selectedMovie && (
        <ChunkUploadModal
          isOpen={Boolean(uploadEpisodeTarget)}
          onClose={() => setUploadEpisodeTarget(null)}
          movieId={selectedMovieId}
          movieTitle={selectedMovie.title}
          episodeId={uploadEpisodeTarget.id}
          episodeNumber={uploadEpisodeTarget.episodeNumber}
          onSuccess={() => {
            fetchEpisodes();
          }}
          onPreview={(target) => {
            setUploadEpisodeTarget(null);
            setPreviewTarget({
              contentId: uploadEpisodeTarget.id,
              contentType: 'episode',
              title: target.title,
              episodeNumber: target.episodeNumber,
              playbackUrl: target.playbackUrl,
            });
          }}
        />
      )}

      {/* Modal Xem Trước Video HLS Player */}
      <VideoPreviewModal
        isOpen={Boolean(previewTarget)}
        onClose={() => setPreviewTarget(null)}
        target={previewTarget}
      />

      {/* Confirm Dialog Xóa Tập Phim */}
      <ConfirmDialog
        isOpen={Boolean(episodeToDelete)}
        onClose={() => setEpisodeToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Xóa tập ${episodeToDelete?.episodeNumber}`}
        description={`Bạn có chắc muốn xóa tập ${episodeToDelete?.episodeNumber} (${episodeToDelete?.title})? Dữ liệu video của tập này cũng sẽ bị gỡ bỏ.`}
        confirmText="Xóa tập"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
