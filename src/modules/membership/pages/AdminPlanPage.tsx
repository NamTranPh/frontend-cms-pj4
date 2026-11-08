import React, { useState, useEffect, useCallback } from 'react';
import { Crown, Plus, RefreshCw, Search } from 'lucide-react';
import { adminPlanService } from '../services/adminPlanService';
import type {
  MembershipPlan,
  CreatePlanRequest,
  UpdatePlanRequest,
} from '../types/plan.types';
import { PlanTable } from '../components/PlanTable';
import { PlanFormModal } from '../components/PlanFormModal';
import { PlanPreviewModal } from '../components/PlanPreviewModal';
import { Button } from '../../../components/ui/Button';
import { Pagination } from '../../../components/ui/Pagination';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useToast } from '../../../components/feedback';
import { useTableUrlParams } from '../../../hooks/useTableUrlParams';

export const AdminPlanPage: React.FC = () => {
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

  const activeFilter = getParam('isActive') || 'ALL';

  // Data states
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview Modal
  const [previewPlan, setPreviewPlan] = useState<MembershipPlan | null>(null);

  // Delete Confirm
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tải danh sách gói VIP
  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const isActiveParam =
        activeFilter === 'TRUE'
          ? true
          : activeFilter === 'FALSE'
            ? false
            : undefined;

      const res = await adminPlanService.getPlans({
        page,
        limit,
        search: debouncedSearch || undefined,
        isActive: isActiveParam,
      });

      setPlans(res.items || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Không thể tải danh sách gói VIP.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, activeFilter, toast]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Xử lý tạo mới hoặc sửa gói
  const handleFormSubmit = async (
    data: CreatePlanRequest | UpdatePlanRequest,
  ) => {
    setIsSubmitting(true);
    try {
      if (editingPlan) {
        await adminPlanService.updatePlan(
          editingPlan.id,
          data as UpdatePlanRequest,
        );
        toast.success(`Đã cập nhật gói VIP "${data.name}" thành công.`);
      } else {
        await adminPlanService.createPlan(data as CreatePlanRequest);
        toast.success(`Đã tạo mới gói VIP "${data.name}" thành công.`);
      }
      setIsFormOpen(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Thao tác không thành công.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý xóa gói
  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    setIsDeleting(true);
    try {
      await adminPlanService.deletePlan(planToDelete.id);
      toast.success(`Đã vô hiệu hóa gói "${planToDelete.name}" thành công.`);
      setPlanToDelete(null);
      fetchPlans();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Không thể xóa gói VIP.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Crown className="text-[#002b80] dark:text-cyan-400" />
            Quản Lý Gói VIP (Membership Management)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Thiết lập bảng giá, thời hạn và quyền lợi các gói hội viên xem phim 1080p/4K không quảng cáo.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchPlans}
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
            Tạo gói VIP
          </Button>
        </div>
      </div>

      {/* Thanh tìm kiếm & Bộ lọc */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm gói VIP theo tên, slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#002b80] dark:focus:border-cyan-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Trạng thái hiển thị:
          </span>
          <select
            value={activeFilter}
            onChange={(e) => setParam('isActive', e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#002b80] dark:focus:border-cyan-400"
          >
            <option value="ALL">Tất cả gói</option>
            <option value="TRUE">Đang hiển thị (Active)</option>
            <option value="FALSE">Đang tạm ẩn (Inactive)</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách gói */}
      <PlanTable
        plans={plans}
        isLoading={isLoading}
        onPreview={(plan) => setPreviewPlan(plan)}
        onEdit={handleOpenEdit}
        onDelete={(plan) => setPlanToDelete(plan)}
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

      {/* Modal Tạo / Sửa gói VIP (Có Live Client Preview 2 cột) */}
      <PlanFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPlan(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingPlan}
        isLoading={isSubmitting}
      />

      {/* Modal Xem trước Client Card */}
      <PlanPreviewModal
        isOpen={Boolean(previewPlan)}
        onClose={() => setPreviewPlan(null)}
        plan={previewPlan}
        onEdit={handleOpenEdit}
      />

      {/* Dialog xác nhận xóa / vô hiệu hóa gói */}
      <ConfirmDialog
        isOpen={Boolean(planToDelete)}
        title="Xác nhận vô hiệu hóa gói VIP"
        description={
          planToDelete
            ? `Bạn có chắc chắn muốn vô hiệu hóa gói "${planToDelete.name}"? Gói này sẽ bị ẩn khỏi trang người xem và hệ thống sẽ xử lý thông báo hoàn tiền cho các thành viên đăng ký (nếu có).`
            : ''
        }
        confirmText="Vô hiệu hóa gói"
        cancelText="Hủy bỏ"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setPlanToDelete(null)}
      />
    </div>
  );
};
