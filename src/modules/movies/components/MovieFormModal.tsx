import React, { useState, useEffect } from 'react';
import {
  Upload,
  UploadCloud,
  X,
  Film,
  Tv,
  Image as ImageIcon,
  Crown,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ImageCropModal } from '../../../components/ui/ImageCropModal';
import { adminMovieService } from '../services/adminMovieService';
import { adminGenreService } from '../../genres/services/adminGenreService';
import { useToast } from '../../../components/feedback';
import type { GenreItem } from '../../genres/types/genre.types';
import type {
  MovieItem,
  CreateMovieRequest,
  UpdateMovieRequest,
  MovieType,
  AgeRating,
  MovieActorAssignment,
} from '../types/movie.types';
import { GenreMultiSelect } from './GenreMultiSelect';
import { MovieActorManager } from './MovieActorManager';

interface MovieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMovieRequest | UpdateMovieRequest, videoFile?: File | null) => Promise<void>;
  initialData?: MovieItem | null;
  isLoading?: boolean;
}

export const MovieFormModal: React.FC<MovieFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEdit = Boolean(initialData);
  const toast = useToast();

  // Danh sách thể loại lấy động từ API
  const [availableGenres, setAvailableGenres] = useState<GenreItem[]>([]);

  // Form states
  const [movieType, setMovieType] = useState<MovieType>('SINGLE');
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseYear, setReleaseYear] = useState<number>(new Date().getFullYear());
  const [duration, setDuration] = useState<number | string>(120);
  const [totalEpisodes, setTotalEpisodes] = useState<number | string>(16);
  const [director, setDirector] = useState('');
  const [country, setCountry] = useState('Việt Nam');
  const [language, setLanguage] = useState('Tiếng Việt');
  const [trailerUrl, setTrailerUrl] = useState('');
  const [ageRating, setAgeRating] = useState<AgeRating>('P');
  const [isPremium, setIsPremium] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Media states
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [isUploadingBackdrop, setIsUploadingBackdrop] = useState(false);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [cropType, setCropType] = useState<'poster' | 'backdrop' | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  // Thể loại & Diễn viên
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
  const [movieActors, setMovieActors] = useState<MovieActorAssignment[]>([]);

  // Validation errors
  const [errors, setErrors] = useState<{
    title?: string;
    duration?: string;
    totalEpisodes?: string;
    genreIds?: string;
  }>({});

  // 1. Fetch danh sách thể loại từ Backend API
  useEffect(() => {
    let isMounted = true;
    const fetchGenres = async () => {
      try {
        const res = await adminGenreService.getGenres({ limit: 100 });
        if (isMounted) {
          setAvailableGenres(res.items || []);
        }
      } catch {
        if (isMounted) setAvailableGenres([]);
      }
    };

    if (isOpen) {
      fetchGenres();
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // 2. Điền form khi mở Modal
  useEffect(() => {
    if (initialData) {
      setMovieType(initialData.movieType || 'SINGLE');
      setTitle(initialData.title || '');
      setOriginalTitle(initialData.originalTitle || '');
      setDescription(initialData.description || '');
      setReleaseYear(initialData.releaseYear || new Date().getFullYear());
      setDuration(initialData.duration || 120);
      setTotalEpisodes(initialData.totalEpisodes || 16);
      setDirector(initialData.director || '');
      setCountry(initialData.country || 'Việt Nam');
      setLanguage(initialData.language || 'Tiếng Việt');
      setTrailerUrl(initialData.trailerUrl || '');
      setAgeRating(initialData.ageRating || 'P');
      setIsPremium(Boolean(initialData.isPremium));
      setIsFeatured(Boolean(initialData.isFeatured));
      setPosterUrl(initialData.posterUrl || '');
      setBackdropUrl(initialData.backdropUrl || '');
      setSelectedGenreIds(initialData.genres ? initialData.genres.map((g) => g.id) : []);

      // Diễn viên
      if (initialData.movieActors && initialData.movieActors.length > 0) {
        setMovieActors(
          initialData.movieActors.map((ma) => ({
            actorId: ma.actorId,
            characterName: ma.characterName || '',
            orderIndex: ma.orderIndex || 1,
          }))
        );
      } else {
        setMovieActors([]);
      }
    } else {
      setMovieType('SINGLE');
      setTitle('');
      setOriginalTitle('');
      setDescription('');
      setReleaseYear(new Date().getFullYear());
      setDuration(120);
      setTotalEpisodes(16);
      setDirector('');
      setCountry('Việt Nam');
      setLanguage('Tiếng Việt');
      setTrailerUrl('');
      setAgeRating('P');
      setIsPremium(false);
      setIsFeatured(false);
      setPosterUrl('');
      setBackdropUrl('');
      setSelectedGenreIds([]);
      setMovieActors([]);
    }
    setSelectedVideoFile(null);
    setErrors({});
  }, [initialData, isOpen]);

  // Chọn ảnh Poster (Tỷ lệ 2:3) để mở Modal cắt ảnh
  const handlePosterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Vui lòng chọn tệp hình ảnh (.jpg, .png, .webp...)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warning('Kích thước ảnh tối đa là 10MB');
      return;
    }

    setCropType('poster');
    setCropFile(file);
    setIsCropOpen(true);
    e.target.value = '';
  };

  // Chọn ảnh Backdrop (Tỷ lệ 16:9) để mở Modal cắt ảnh
  const handleBackdropSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.warning('Vui lòng chọn tệp hình ảnh (.jpg, .png, .webp...)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warning('Kích thước ảnh tối đa là 10MB');
      return;
    }

    setCropType('backdrop');
    setCropFile(file);
    setIsCropOpen(true);
    e.target.value = '';
  };

  // Xử lý sau khi cắt ảnh thành công
  const handleCropComplete = async (croppedFile: File) => {
    if (cropType === 'poster') {
      setIsUploadingPoster(true);
      try {
        const res = await adminMovieService.uploadPoster(croppedFile);
        const url = res.previewUrl || res.objectKey || res.url;
        if (url) {
          setPosterUrl(url);
          toast.success('Tải lên ảnh Poster chuẩn 2:3 thành công');
        } else {
          toast.error('Không nhận được URL ảnh từ máy chủ');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload Poster thất bại';
        toast.error(msg);
      } finally {
        setIsUploadingPoster(false);
      }
    } else if (cropType === 'backdrop') {
      setIsUploadingBackdrop(true);
      try {
        const res = await adminMovieService.uploadBackdrop(croppedFile);
        const url = res.previewUrl || res.objectKey || res.url;
        if (url) {
          setBackdropUrl(url);
          toast.success('Tải lên ảnh Backdrop chuẩn 16:9 thành công');
        } else {
          toast.error('Không nhận được URL ảnh từ máy chủ');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Upload Backdrop thất bại';
        toast.error(msg);
      } finally {
        setIsUploadingBackdrop(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Tên phim tiếng Việt không được để trống.';

    if (movieType === 'SINGLE') {
      const numDur = Number(duration);
      if (isNaN(numDur) || numDur <= 0) {
        newErrors.duration = 'Thời lượng phim lẻ phải lớn hơn 0 phút.';
      }
    } else {
      const numEp = Number(totalEpisodes);
      if (isNaN(numEp) || numEp <= 0) {
        newErrors.totalEpisodes = 'Tổng số tập phim bộ phải lớn hơn 0.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const commonPayload = {
      title: title.trim(),
      originalTitle: originalTitle.trim() || undefined,
      description: description.trim() || undefined,
      releaseYear: Number(releaseYear) || undefined,
      duration: movieType === 'SINGLE' ? Number(duration) : undefined,
      totalEpisodes: movieType === 'SERIES' ? Number(totalEpisodes) : undefined,
      director: director.trim() || undefined,
      country: country.trim() || undefined,
      language: language.trim() || undefined,
      trailerUrl: trailerUrl.trim() || undefined,
      posterUrl: posterUrl.trim() || undefined,
      backdropUrl: backdropUrl.trim() || undefined,
      movieType,
      ageRating,
      genreIds: selectedGenreIds,
    };

    if (isEdit) {
      // Dirty check actors: Chỉ gửi movieActors khi danh sách thực sự thay đổi
      const initialActors = initialData?.movieActors || [];
      const isActorsChanged =
        movieActors.length !== initialActors.length ||
        movieActors.some(
          (ma, i) =>
            ma.actorId !== initialActors[i]?.actorId ||
            ma.characterName !== (initialActors[i]?.characterName || '')
        );

      await onSubmit(
        {
          ...commonPayload,
          movieActors: isActorsChanged ? (movieActors.length > 0 ? movieActors : []) : undefined,
          isFeatured,
          isPremium,
        } as UpdateMovieRequest,
        selectedVideoFile
      );
    } else {
      await onSubmit(
        {
          ...commonPayload,
          movieActors: movieActors.length > 0 ? movieActors : undefined,
        } as CreateMovieRequest,
        selectedVideoFile
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      title={
        <div className="flex items-center gap-2">
          {movieType === 'SINGLE' ? (
            <Film className="w-5 h-5 text-cyan-500" />
          ) : (
            <Tv className="w-5 h-5 text-purple-500" />
          )}
          <span>
            {isEdit
              ? `Chỉnh Sửa Phim: ${initialData?.title}`
              : 'Thêm Mới Phim'}
          </span>
        </div>
      }
      description="Điền thông tin chi tiết, tải lên poster/backdrop, gán diễn viên và liên kết thể loại phù hợp cho phim."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. Lựa chọn Loại Phim: SINGLE vs SERIES */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
            Phân loại phim <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMovieType('SINGLE')}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                movieType === 'SINGLE'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 ring-2 ring-cyan-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl ${
                  movieType === 'SINGLE'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                <Film size={20} />
              </div>
              <div>
                <div className="font-bold text-sm">Phim Lẻ (Single Movie)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  1 tập duy nhất, yêu cầu thời lượng phim (phút)
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMovieType('SERIES')}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                movieType === 'SERIES'
                  ? 'border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl ${
                  movieType === 'SERIES'
                    ? 'bg-purple-500 text-white font-bold'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                <Tv size={20} />
              </div>
              <div>
                <div className="font-bold text-sm">Phim Bộ (Series)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Nhiều tập con, quản lý video theo từng tập phim
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Tiêu đề Phim */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tên phim (Tiếng Việt)"
            required
            placeholder="Ví dụ: Đất Rừng Phương Nam, Kẻ Hủy Diệt..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            disabled={isLoading}
          />
          <Input
            label="Tên phim gốc (Tiếng Anh/Bản xứ)"
            placeholder="Ví dụ: Song of the South, The Terminator..."
            value={originalTitle}
            onChange={(e) => setOriginalTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Mô tả tóm tắt */}
        <Input
          as="textarea"
          label="Mô tả tóm tắt nội dung phim"
          rows={3}
          maxLength={1000}
          showCharCount
          placeholder="Tóm tắt ngắn gọn cốt truyện chính, bối cảnh phim..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
        />

        {/* 3. Thông số kỹ thuật */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {movieType === 'SINGLE' ? (
            <div className="sm:col-span-3">
              <Input
                type="number"
                label="Thời lượng (Phút)"
                required
                min={1}
                max={600}
                placeholder="Ví dụ: 120"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                error={errors.duration}
                disabled={isLoading}
              />
            </div>
          ) : (
            <div className="sm:col-span-3">
              <Input
                type="number"
                label="Tổng số tập (Dự kiến)"
                required
                min={1}
                max={500}
                placeholder="Ví dụ: 16"
                value={totalEpisodes}
                onChange={(e) => setTotalEpisodes(e.target.value)}
                error={errors.totalEpisodes}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="sm:col-span-3">
            <Input
              type="number"
              label="Năm phát hành"
              required
              min={1900}
              max={2100}
              value={releaseYear}
              onChange={(e) => setReleaseYear(Number(e.target.value) || new Date().getFullYear())}
              disabled={isLoading}
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 select-none">
              Giới hạn độ tuổi
            </label>
            <select
              value={ageRating}
              onChange={(e) => setAgeRating(e.target.value as AgeRating)}
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="P">P - Mọi lứa tuổi (Phổ biến)</option>
              <option value="K">K - Dưới 13 tuổi có phụ huynh kèm</option>
              <option value="T13">T13 - Khán giả từ đủ 13 tuổi</option>
              <option value="T16">T16 - Khán giả từ đủ 16 tuổi</option>
              <option value="T18">T18 - Khán giả từ đủ 18 tuổi</option>
              <option value="C">C - Cấm phổ biến</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <Input
              label="Quốc gia"
              placeholder="Ví dụ: Việt Nam, Mỹ..."
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 4. Chọn Thể Loại: Multi-select Dropdown Combobox Hiện Đại */}
        <GenreMultiSelect
          genres={availableGenres}
          selectedIds={selectedGenreIds}
          onChange={setSelectedGenreIds}
          error={errors.genreIds}
        />

        {/* 5. Quản lý Gán Diễn Viên & Vai Diễn */}
        <MovieActorManager
          value={movieActors}
          onChange={setMovieActors}
        />

        {/* 6. Tải ảnh Poster (2:3) & Backdrop (16:9) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* Upload Poster (2:3) */}
          <div className="sm:col-span-5 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
              Ảnh Poster Đứng (Tỷ lệ chuẩn 2:3)
            </label>
            <div className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#002b80] dark:hover:border-cyan-400 p-2 text-center transition-all bg-slate-50/50 dark:bg-slate-900/40 h-52 flex flex-col items-center justify-center">
              {posterUrl ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden group">
                  <img
                    src={posterUrl}
                    alt="Poster"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPosterUrl('')}
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                      title="Xóa poster"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  {isUploadingPoster ? (
                    <Loader2 size={24} className="animate-spin text-cyan-500 mb-2" />
                  ) : (
                    <Upload size={24} className="text-slate-400 mb-2" />
                  )}
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isUploadingPoster ? 'Đang tải lên...' : 'Chọn file ảnh Poster'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    JPG, PNG, WebP (Max 10MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterSelect}
                    disabled={isUploadingPoster || isLoading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Upload Backdrop (16:9) */}
          <div className="sm:col-span-7 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
              Ảnh Backdrop Banner Ngang (Tỷ lệ chuẩn 16:9)
            </label>
            <div className="relative rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#002b80] dark:hover:border-cyan-400 p-2 text-center transition-all bg-slate-50/50 dark:bg-slate-900/40 h-52 flex flex-col items-center justify-center">
              {backdropUrl ? (
                <div className="relative w-full h-full rounded-xl overflow-hidden group">
                  <img
                    src={backdropUrl}
                    alt="Backdrop"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBackdropUrl('')}
                      className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                      title="Xóa backdrop"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  {isUploadingBackdrop ? (
                    <Loader2 size={24} className="animate-spin text-cyan-500 mb-2" />
                  ) : (
                    <ImageIcon size={24} className="text-slate-400 mb-2" />
                  )}
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isUploadingBackdrop ? 'Đang tải lên...' : 'Chọn file ảnh Backdrop'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Tỷ lệ 16:9 hiển thị trang chủ
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackdropSelect}
                    disabled={isUploadingBackdrop || isLoading}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* 7. Đạo diễn & Trailer URL */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <Input
              label="Đạo diễn"
              placeholder="Ví dụ: Christopher Nolan, Trấn Thành..."
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="sm:col-span-7">
            <Input
              label="Trailer URL (YouTube)"
              placeholder="https://www.youtube.com/watch?v=..."
              value={trailerUrl}
              onChange={(e) => setTrailerUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 8. Nội dung Video (Dành cho Phim lẻ) hoặc Hướng dẫn Tập phim (Phim bộ) */}
        {movieType === 'SINGLE' ? (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <UploadCloud size={15} className="text-cyan-500" />
                <span>Tệp Video Phim (Tải lên MinIO S3)</span>
              </label>
              {selectedVideoFile && (
                <button
                  type="button"
                  onClick={() => setSelectedVideoFile(null)}
                  className="text-[11px] text-rose-500 hover:underline"
                >
                  Bỏ chọn video
                </button>
              )}
            </div>

            {selectedVideoFile ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <Film size={16} className="text-cyan-500 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                    {selectedVideoFile.name}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px] shrink-0">
                    ({(selectedVideoFile.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 shrink-0">
                  Sẵn sàng tải lên
                </span>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg hover:border-cyan-500/60 cursor-pointer bg-white/50 dark:bg-slate-900/20 transition-all text-center">
                <UploadCloud size={22} className="text-slate-400 mb-1" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {isEdit && initialData?.status === 'READY'
                    ? 'Bấm vào đây nếu muốn tải tệp video mới để thay thế'
                    : 'Bấm để chọn tệp Video (.mp4, .mkv, .webm)'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Tệp video sẽ tự động được tải lên MinIO S3 sau khi lưu thông tin phim.
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/mkv,video/webm,video/quicktime"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSelectedVideoFile(file);
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-purple-500/20 bg-purple-500/5 text-xs flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Tv size={16} />
            </div>
            <div>
              <p className="font-semibold text-purple-600 dark:text-purple-300">
                Phim bộ (Series): Video được quản lý theo từng tập phim
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Sau khi tạo phim bộ, bạn có thể tải lên video và đặt thumbnail cho từng tập tại mục{' '}
                <strong className="text-purple-500 font-semibold">"Quản lý tập phim"</strong> trên danh sách phim.
              </p>
            </div>
          </div>
        )}

        {/* 9. Tùy chọn Phim VIP & Phim Nổi Bật */}
        <div className="flex flex-wrap items-center gap-6 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500/20"
            />
            <Crown size={14} className="text-amber-500" />
            <span>Yêu cầu Gói VIP Hội viên (Premium Only)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500/20"
            />
            <Sparkles size={14} className="text-cyan-500" />
            <span>Phim Nổi Bật (Featured Banner)</span>
          </label>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading || isUploadingPoster || isUploadingBackdrop}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading || isUploadingPoster || isUploadingBackdrop}
          >
            {isEdit ? 'Lưu thay đổi' : 'Tạo phim mới'}
          </Button>
        </div>
      </form>

      <ImageCropModal
        isOpen={isCropOpen}
        onClose={() => {
          setIsCropOpen(false);
          setCropFile(null);
          setCropType(null);
        }}
        imageFile={cropFile}
        shape="rect"
        aspectRatio={cropType === 'poster' ? 2 / 3 : 16 / 9}
        aspectRatioLabel={cropType === 'poster' ? '2:3 (Poster Dọc)' : '16:9 (Backdrop Banner)'}
        title={cropType === 'poster' ? 'Căn Chỉnh & Cắt Ảnh Poster Phim' : 'Căn Chỉnh & Cắt Ảnh Backdrop Banner'}
        description={
          cropType === 'poster'
            ? 'Cắt theo tỷ lệ chuẩn 2:3 để poster hiển thị sắc nét, không bị méo trên danh sách phim.'
            : 'Cắt theo tỷ lệ chuẩn 16:9 để banner hiển thị chuẩn trên trang chủ và trình phát.'
        }
        outputWidth={cropType === 'poster' ? 800 : 1920}
        outputHeight={cropType === 'poster' ? 1200 : 1080}
        onCropComplete={handleCropComplete}
        isSubmitting={cropType === 'poster' ? isUploadingPoster : isUploadingBackdrop}
      />
    </Modal>
  );
};
