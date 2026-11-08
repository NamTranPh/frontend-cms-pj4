import React, { useState, useEffect, useCallback } from 'react';
import { Tags, Plus, RefreshCw, Search } from 'lucide-react';
import { adminGenreService } from '../services/adminGenreService';
import type {
  GenreItem,
  CreateGenreRequest,
  UpdateGenreRequest,
  GenreStatus,
} from '../types/genre.types';
import { GenreTable } from '../components/GenreTable';
import { GenreFormModal } from '../components/GenreFormModal';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useToast } from '../../../components/feedback';
import { useTableUrlParams } from '../../../hooks/useTableUrlParams';

export const AdminGenrePage: React.FC = () => {
  const toast = useToast();

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
  } = useTableUrlParams({ defaultPage: 1, defaultLimit: 10, debounceMs: 400 });

  const statusFilter = (getParam('status') as GenreStatus | 'ALL') || 'ALL';

  // State dữ liệu
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // State Modal Form & Confirm Delete
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<GenreItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [genreToDelete, setGenreToDelete] = useState<GenreItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tải danh sách thể loại
  const fetchGenres = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminGenreService.getGenres({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: statusFilter,
      });

      setGenres(res.items || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Không thể tải danh sách thể loại.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, statusFilter, toast]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  // Xử lý tạo mới hoặc cập nhật
  const handleFormSubmit = async (
    data: CreateGenreRequest | UpdateGenreRequest,
  ) => {
    setIsSubmitting(true);
    try {
      if (editingGenre) {
        await adminGenreService.updateGenre(
          editingGenre.id,
          data as UpdateGenreRequest,
        );
        toast.success(`Đã cập nhật thể loại "${data.name}" thành công.`);
      } else {
        await adminGenreService.createGenre(data as CreateGenreRequest);
        toast.success(`Đã tạo thể loại "${data.name}" thành công.`);
      }
      setIsFormOpen(false);
      setEditingGenre(null);
      fetchGenres();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Thao tác không thành công.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý xóa mềm thể loại
  const handleDeleteConfirm = async () => {
    if (!genreToDelete) return;
    setIsDeleting(true);
    try {
      await adminGenreService.deleteGenre(genreToDelete.id);
      toast.success(`Đã xóa thể loại "${genreToDelete.name}" thành công.`);
      setGenreToDelete(null);
      fetchGenres();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Không thể xóa thể loại.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingGenre(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (genre: GenreItem) => {
    setEditingGenre(genre);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Tags className="text-[#002b80] dark:text-cyan-400" />
            Quản Lý Thể Loại Phim (Genre Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý danh mục các thể loại, gán icon trực quan để phim lựa chọn và hiển thị trên Web Client.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchGenres}
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            Làm mới
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5"
          >
            <Plus size={16} />
            Thêm thể loại
          </Button>
        </div>
      </div>

      {/* Thanh bộ lọc & Tìm kiếm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Tìm theo tên thể loại, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#002b80] dark:focus:border-cyan-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Trạng thái:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setParam('status', e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#002b80] dark:focus:border-cyan-400"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="INACTIVE">Ngừng hoạt động</option>
          </select>
        </div>
      </div>

      {/* Bảng dữ liệu thể loại */}
      <GenreTable
        genres={genres}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={(genre) => setGenreToDelete(genre)}
      />

      {/* Phân trang */}
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

      {/* Modal Thêm / Chỉnh sửa thể loại */}
      <GenreFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingGenre(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingGenre}
        isLoading={isSubmitting}
      />

      {/* Dialog xác nhận xóa mềm */}
      <ConfirmDialog
        isOpen={Boolean(genreToDelete)}
        title="Xác nhận xóa thể loại"
        description={
          genreToDelete
            ? `Bạn có chắc chắn muốn xóa thể loại "${genreToDelete.name}"? Hành động này sẽ chuyển trạng thái thể loại sang đã xóa.`
            : ''
        }
        confirmText="Xóa thể loại"
        cancelText="Hủy bỏ"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setGenreToDelete(null)}
      />
    </div>
  );
};
