import React, { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw, X, Film, Tag, ShieldAlert } from 'lucide-react';
import type { GenreItem } from '../../genres/types/genre.types';
import type { MovieType, VideoStatus, AgeRating } from '../types/movie.types';
import { Button } from '../../../components/ui/Button';
import { MovieFilterModal, type MovieFilterValues } from './MovieFilterModal';

export interface MovieFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: MovieType | 'ALL';
  onTypeFilterChange: (value: MovieType | 'ALL') => void;
  statusFilter: VideoStatus | 'ALL';
  onStatusFilterChange: (value: VideoStatus | 'ALL') => void;
  genreFilter: string | 'ALL';
  onGenreFilterChange: (value: string | 'ALL') => void;
  ageRatingFilter: AgeRating | 'ALL';
  onAgeRatingFilterChange: (value: AgeRating | 'ALL') => void;
  genres: GenreItem[];
  onReset: () => void;
}

export const MovieFilterBar: React.FC<MovieFilterBarProps> = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  genreFilter,
  onGenreFilterChange,
  ageRatingFilter,
  onAgeRatingFilterChange,
  genres,
  onReset,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Đếm số lượng tiêu chí lọc đang được kích hoạt (ngoại trừ search)
  const activeFilterCount =
    (typeFilter !== 'ALL' ? 1 : 0) +
    (statusFilter !== 'ALL' ? 1 : 0) +
    (genreFilter !== 'ALL' ? 1 : 0) +
    (ageRatingFilter !== 'ALL' ? 1 : 0);

  const hasAnyFilter = Boolean(search.trim()) || activeFilterCount > 0;

  // Tìm tên thể loại đang chọn
  const selectedGenre = genres.find((g) => g.id === genreFilter);

  const handleApplyModal = (values: MovieFilterValues) => {
    onTypeFilterChange(values.type);
    onStatusFilterChange(values.status);
    onGenreFilterChange(values.genreId);
    onAgeRatingFilterChange(values.ageRating);
  };

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] shadow-xs space-y-3">
      {/* Hàng 1: Ô tìm kiếm chính & Nút mở Modal Bộ lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Ô Tìm Kiếm */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Tìm theo tên phim tiếng Việt, tên gốc tiếng Anh..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>

        {/* Nút Mở Modal Bộ Lọc & Nút Đặt Lại */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant={activeFilterCount > 0 ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setIsFilterModalOpen(true)}
            className="gap-2 h-9 text-xs"
          >
            <SlidersHorizontal size={14} />
            <span>Bộ lọc nâng cao</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-950 text-[#002b80] dark:text-cyan-400 text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {hasAnyFilter && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-slate-500 hover:text-rose-500 gap-1 h-9 text-xs"
              title="Đặt lại tất cả bộ lọc"
            >
              <RotateCcw size={13} />
              <span>Đặt lại</span>
            </Button>
          )}
        </div>
      </div>

      {/* Hàng 2: Các tag chip thể hiện tiêu chí đang lọc (Nếu có) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] font-medium text-slate-400">Đang lọc theo:</span>

          {/* Tag Loại phim */}
          {typeFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
              <Film size={12} />
              <span>{typeFilter === 'SINGLE' ? 'Phim Lẻ' : 'Phim Bộ'}</span>
              <button
                type="button"
                onClick={() => onTypeFilterChange('ALL')}
                className="hover:text-rose-500 transition-colors ml-1"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {/* Tag Trạng thái */}
          {statusFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
              <span>Trạng thái: {statusFilter}</span>
              <button
                type="button"
                onClick={() => onStatusFilterChange('ALL')}
                className="hover:text-rose-500 transition-colors ml-1"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {/* Tag Thể loại */}
          {genreFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              <Tag size={12} />
              <span>Thể loại: {selectedGenre?.name || genreFilter}</span>
              <button
                type="button"
                onClick={() => onGenreFilterChange('ALL')}
                className="hover:text-rose-500 transition-colors ml-1"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {/* Tag Độ tuổi */}
          {ageRatingFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
              <ShieldAlert size={12} />
              <span>Độ tuổi: {ageRatingFilter}</span>
              <button
                type="button"
                onClick={() => onAgeRatingFilterChange('ALL')}
                className="hover:text-rose-500 transition-colors ml-1"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Modal Lọc Nâng Cao */}
      <MovieFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialValues={{
          type: typeFilter,
          status: statusFilter,
          genreId: genreFilter,
          ageRating: ageRatingFilter,
        }}
        genres={genres}
        onApply={handleApplyModal}
        onReset={onReset}
      />
    </div>
  );
};
