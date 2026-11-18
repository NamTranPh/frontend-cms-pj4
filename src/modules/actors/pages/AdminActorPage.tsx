import React, { useState, useEffect, useCallback } from 'react';
import { User, Plus, Search, RefreshCw, X } from 'lucide-react';
import { adminActorService } from '../services/adminActorService';
import type {
  ActorItem,
  CreateActorRequest,
  UpdateActorRequest,
} from '../types/actor.types';
import { ActorTable } from '../components/ActorTable';
import { ActorFormModal } from '../components/ActorFormModal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Pagination } from '../../../components/ui/Pagination';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useToast } from '../../../components/feedback/useToast';

export const AdminActorPage: React.FC = () => {
  const toast = useToast();

  const [actors, setActors] = useState<ActorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [nationality, setNationality] = useState('');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActor, setEditingActor] = useState<ActorItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [actorToDelete, setActorToDelete] = useState<ActorItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadActors = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminActorService.getActors({
        page,
        limit,
        search: search.trim() || undefined,
        nationality: nationality.trim() || undefined,
      });
      setActors(res.items || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải danh sách diễn viên');
      setActors([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, nationality, toast]);

  useEffect(() => {
    loadActors();
  }, [loadActors]);

  const handleFormSubmit = async (
    data: CreateActorRequest | UpdateActorRequest
  ) => {
    setIsSubmitting(true);
    try {
      if (editingActor) {
        await adminActorService.updateActor(editingActor.id, data);
        toast.success(`Cập nhật diễn viên "${data.name}" thành công`);
      } else {
        await adminActorService.createActor(data as CreateActorRequest);
        toast.success(`Thêm diễn viên "${data.name}" thành công`);
      }
      setIsFormOpen(false);
      setEditingActor(null);
      loadActors();
    } catch (err: any) {
      toast.error(err?.message || 'Lưu thông tin diễn viên thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!actorToDelete) return;
    setIsDeleting(true);
    try {
      await adminActorService.deleteActor(actorToDelete.id);
      toast.success(`Đã xóa diễn viên "${actorToDelete.name}"`);
      setActorToDelete(null);
      loadActors();
    } catch (err: any) {
      toast.error(err?.message || 'Xóa diễn viên thất bại');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setNationality('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <User className="text-[#002b80] dark:text-cyan-400 w-7 h-7" />
            <span>Quản Lý Diễn Viên (Actor Management)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý hồ sơ diễn viên, nghệ danh, tiểu sử và hình ảnh avatar đại diện.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadActors}
            className="gap-1.5"
            title="Làm mới"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingActor(null);
              setIsFormOpen(true);
            }}
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm diễn viên</span>
          </Button>
        </div>
      </div>

      {/* Bộ Lọc Tìm Kiếm */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px]">
          <Input
            type="text"
            placeholder="Tìm theo tên diễn viên, tên gốc..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="w-48">
          <Input
            type="text"
            placeholder="Lọc theo quốc tịch..."
            value={nationality}
            onChange={(e) => {
              setNationality(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {(search || nationality) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-4 h-4 mr-1" />
            <span>Đặt lại</span>
          </Button>
        )}
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="space-y-4">
        <ActorTable
          actors={actors}
          loading={isLoading}
          onEdit={(actor) => {
            setEditingActor(actor);
            setIsFormOpen(true);
          }}
          onDelete={(actor) => setActorToDelete(actor)}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>

      {/* Modal Thêm / Sửa Diễn Viên */}
      <ActorFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingActor(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingActor}
        isLoading={isSubmitting}
      />

      {/* Dialog Xác Nhận Xóa Diễn Viên */}
      <ConfirmDialog
        isOpen={Boolean(actorToDelete)}
        onClose={() => setActorToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa diễn viên"
        description={`Bạn có chắc chắn muốn xóa hồ sơ diễn viên "${actorToDelete?.name}" không? Thao tác này có thể ảnh hưởng đến các phim đang gán diễn viên này.`}
        confirmText="Xác nhận xóa"
        cancelText="Hủy bỏ"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
