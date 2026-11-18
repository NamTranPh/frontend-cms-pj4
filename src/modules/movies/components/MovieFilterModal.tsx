import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import type { GenreItem } from '../../genres/types/genre.types';
import type { MovieType, VideoStatus, AgeRating } from '../types/movie.types';

export interface MovieFilterValues {
  type: MovieType | 'ALL';
  status: VideoStatus | 'ALL';
  genreId: string | 'ALL';
  ageRating: AgeRating | 'ALL';
  year?: number;
  country?: string;
}

interface MovieFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: MovieFilterValues;
  genres: GenreItem[];
  onApply: (values: MovieFilterValues) => void;
  onReset: () => void;
}

export const MovieFilterModal: React.FC<MovieFilterModalProps> = ({
  isOpen,
  onClose,
  initialValues,
  genres,
  onApply,
  onReset,
}) => {
  const [type, setType] = useState<MovieType | 'ALL'>(initialValues.type);
  const [status, setStatus] = useState<VideoStatus | 'ALL'>(initialValues.status);
  const [genreId, setGenreId] = useState<string | 'ALL'>(initialValues.genreId);
  const [ageRating, setAgeRating] = useState<AgeRating | 'ALL'>(initialValues.ageRating);
  const [year, setYear] = useState<number | undefined>(initialValues.year);
  const [country, setCountry] = useState<string>(initialValues.country || '');

  useEffect(() => {
    if (isOpen) {
      setType(initialValues.type);
      setStatus(initialValues.status);
      setGenreId(initialValues.genreId);
      setAgeRating(initialValues.ageRating);
      setYear(initialValues.year);
      setCountry(initialValues.country || '');
    }
  }, [initialValues, isOpen]);

  const handleApply = () => {
    onApply({
      type,
      status,
      genreId,
      ageRating,
      year: year || undefined,
      country: country.trim() || undefined,
    });
    onClose();
  };

  const handleResetInternal = () => {
    setType('ALL');
    setStatus('ALL');
    setGenreId('ALL');
    setAgeRating('ALL');
    setYear(undefined);
    setCountry('');
    onReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-cyan-500" />
          <span>Bộ Lọc Nâng Cao Phim</span>
        </div>
      }
      description="Lựa chọn các tiêu chí để lọc danh sách phim chính xác và nhanh chóng."
    >
      <div className="space-y-4">
        {/* Loại phim & Trạng thái */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Select
              label="Loại phim"
              value={type}
              onChange={(e) => setType(e.target.value as MovieType | 'ALL')}
              options={[
                { value: 'ALL', label: 'Tất cả định dạng' },
                { value: 'SINGLE', label: 'Phim Lẻ (Single Movie)' },
                { value: 'SERIES', label: 'Phim Bộ (Series Movie)' },
              ]}
            />
          </div>

          <div>
            <Select
              label="Trạng thái xử lý"
              value={status}
              onChange={(e) => setStatus(e.target.value as VideoStatus | 'ALL')}
              options={[
                { value: 'ALL', label: 'Tất cả trạng thái' },
                { value: 'READY', label: 'Sẵn sàng phát (READY)' },
                { value: 'PROCESSING', label: 'Đang xử lý (PROCESSING)' },
                { value: 'DRAFT', label: 'Bản nháp (DRAFT)' },
                { value: 'FAILED', label: 'Thất bại (FAILED)' },
                { value: 'ARCHIVED', label: 'Lưu trữ (ARCHIVED)' },
              ]}
            />
          </div>
        </div>

        {/* Thể loại phim */}
        <div>
          <Select
            label="Thể loại phim"
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            options={[
              { value: 'ALL', label: 'Tất cả thể loại' },
              ...genres.map((g) => ({
                value: g.id,
                label: g.name,
              })),
            ]}
          />
        </div>

        {/* Giới hạn độ tuổi & Năm phát hành */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Select
              label="Giới hạn độ tuổi"
              value={ageRating}
              onChange={(e) => setAgeRating(e.target.value as AgeRating | 'ALL')}
              options={[
                { value: 'ALL', label: 'Tất cả độ tuổi' },
                { value: 'P', label: 'P - Mọi lứa tuổi' },
                { value: 'K', label: 'K - Dưới 13 tuổi' },
                { value: 'T13', label: 'T13 - Từ 13 tuổi' },
                { value: 'T16', label: 'T16 - Từ 16 tuổi' },
                { value: 'T18', label: 'T18 - Từ 18 tuổi' },
                { value: 'C', label: 'C - Cấm phổ biến' },
              ]}
            />
          </div>

          <div>
            <Input
              type="number"
              label="Năm phát hành"
              placeholder="Ví dụ: 2024"
              min={1900}
              max={2100}
              value={year || ''}
              onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        {/* Quốc gia */}
        <div>
          <Input
            type="text"
            label="Quốc gia"
            placeholder="Ví dụ: Việt Nam, Mỹ, Hàn Quốc..."
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={handleResetInternal}
            className="text-rose-500 hover:text-rose-600 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại mặc định</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="button" variant="primary" onClick={handleApply}>
              Áp dụng bộ lọc
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
