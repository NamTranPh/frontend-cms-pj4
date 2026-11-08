import React, { useState, useEffect, useCallback } from 'react';
import { Users, RefreshCw } from 'lucide-react';
import { adminUserService } from '../services/adminUserService';
import type { AdminUser } from '../types/user.types';
import { UserTable } from '../components/UserTable';
import { UserFilterBar } from '../components/UserFilterBar';
import { UserDetailDrawer } from '../components/UserDetailDrawer';
import { Pagination } from '../../../components/ui/Pagination';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useToast } from '../../../components/feedback';
import { useProfile } from '../../profile/hooks/useProfile';
import { useTableUrlParams } from '../../../hooks/useTableUrlParams';

export const AdminUserPage: React.FC = () => {
  const toast = useToast();
  const { profile: currentAdmin } = useProfile();

  // Quản lý URL params (page, limit, search debounce, role, status)
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

  const roleFilter = getParam('role') || 'ALL';
  const statusFilter = getParam('status') || 'ALL';

  // State dữ liệu
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // State Drawer & ConfirmDialog
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<AdminUser | null>(null);
  const [userToToggleBan, setUserToToggleBan] = useState<AdminUser | null>(null);
  const [isBanningLoading, setIsBanningLoading] = useState(false);

  // Gọi API lấy danh sách người dùng khi người dùng bấm nút Làm mới thủ công
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminUserService.getUsers({
        page,
        limit,
        search: debouncedSearch || undefined,
      });

      let items = res.items || [];

      if (roleFilter !== 'ALL') {
        items = items.filter((u) => u.role === roleFilter);
      }
      if (statusFilter !== 'ALL') {
        items = items.filter((u) =>
          statusFilter === 'BANNED' ? u.isBanned : !u.isBanned,
        );
      }

      setUsers(items);
      setTotalItems(res.totalItems || items.length);
      setTotalPages(res.totalPages || Math.ceil((res.totalItems || items.length) / limit) || 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách người dùng';
      toast.error(msg, 'Lỗi kết nối');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, roleFilter, statusFilter, toast]);

  useEffect(() => {
    let isCancelled = false;

    adminUserService
      .getUsers({
        page,
        limit,
        search: debouncedSearch || undefined,
      })
      .then((res) => {
        if (!isCancelled) {
          let items = res.items || [];
          if (roleFilter !== 'ALL') {
            items = items.filter((u) => u.role === roleFilter);
          }
          if (statusFilter !== 'ALL') {
            items = items.filter((u) =>
              statusFilter === 'BANNED' ? u.isBanned : !u.isBanned,
            );
          }
          setUsers(items);
          setTotalItems(res.totalItems || items.length);
          setTotalPages(res.totalPages || Math.ceil((res.totalItems || items.length) / limit) || 1);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          const msg = err instanceof Error ? err.message : 'Không thể tải danh sách người dùng';
          toast.error(msg, 'Lỗi kết nối');
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [page, limit, debouncedSearch, roleFilter, statusFilter, toast]);

  // Thao tác xem chi tiết
  const handleViewDetail = (user: AdminUser) => {
    setSelectedUserForDrawer(user);
  };

  // Mở hộp thoại xác nhận Khóa / Mở khóa
  const handlePromptToggleBan = (user: AdminUser) => {
    setUserToToggleBan(user);
  };

  // Thực hiện Khóa / Mở khóa tài khoản
  const handleConfirmToggleBan = async () => {
    if (!userToToggleBan) return;

    setIsBanningLoading(true);
    const targetBanned = !userToToggleBan.isBanned;

    try {
      await adminUserService.toggleBan(userToToggleBan.id, { banned: targetBanned });

      // Cập nhật state cục bộ ngay lập tức để UI mượt mà
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userToToggleBan.id ? { ...u, isBanned: targetBanned } : u,
        ),
      );

      if (selectedUserForDrawer && selectedUserForDrawer.id === userToToggleBan.id) {
        setSelectedUserForDrawer((prev) => (prev ? { ...prev, isBanned: targetBanned } : null));
      }

      const actionName = targetBanned ? 'Khóa' : 'Mở khóa';
      toast.success(`Đã ${actionName.toLowerCase()} tài khoản "${userToToggleBan.name}" thành công!`, 'Thành công');
      setUserToToggleBan(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Thao tác khóa/mở khóa thất bại';
      toast.error(msg, 'Lỗi');
    } finally {
      setIsBanningLoading(false);
    }
  };

  const hasActiveFilters = Boolean(search || (roleFilter && roleFilter !== 'ALL') || (statusFilter && statusFilter !== 'ALL'));

  return (
    <div className="space-y-6">
      {/* 1. Header Trang Quản Trị Người Dùng */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Users size={22} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Quản Lý Người Dùng
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {totalItems} tài khoản
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kiểm soát danh sách tài khoản, thông tin hội viên VIP và phân quyền quản trị hệ thống.
          </p>
        </div>

        {/* Nút Làm mới */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={fetchUsers}
            disabled={isLoading}
            className="flex items-center gap-1.5"
            title="Tải lại danh sách"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* 2. Thanh lọc & Tìm kiếm */}
      <UserFilterBar
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={(val) => setParam('role', val)}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => setParam('status', val)}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 3. Bảng Dữ Liệu Người Dùng */}
      <div className="space-y-4">
        <UserTable
          users={users}
          isLoading={isLoading}
          currentAdminId={currentAdmin?.id}
          onViewDetail={handleViewDetail}
          onToggleBan={handlePromptToggleBan}
        />

        {/* 4. Thanh phân trang đồng bộ URL */}
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </div>

      {/* 5. Drawer Xem Chi Tiết Người Dùng */}
      <UserDetailDrawer
        isOpen={Boolean(selectedUserForDrawer)}
        onClose={() => setSelectedUserForDrawer(null)}
        user={selectedUserForDrawer}
        onToggleBan={handlePromptToggleBan}
        isCurrentAdmin={selectedUserForDrawer?.id === currentAdmin?.id}
      />

      {/* 6. ConfirmDialog Khóa / Mở Khóa Tài Khoản */}
      <ConfirmDialog
        isOpen={Boolean(userToToggleBan)}
        onClose={() => setUserToToggleBan(null)}
        onConfirm={handleConfirmToggleBan}
        isLoading={isBanningLoading}
        variant={userToToggleBan?.isBanned ? 'warning' : 'danger'}
        title={
          userToToggleBan?.isBanned
            ? `Mở khóa tài khoản "${userToToggleBan?.name}"?`
            : `Khóa tài khoản "${userToToggleBan?.name}"?`
        }
        description={
          userToToggleBan?.isBanned ? (
            <span>
              Người dùng này sẽ được phép đăng nhập lại và tiếp tục sử dụng các dịch vụ xem phim trên hệ thống.
            </span>
          ) : (
            <span>
              Tài khoản này sẽ bị thu hồi toàn bộ phiên đăng nhập lập tức và không thể truy cập vào hệ thống cho đến khi được mở khóa.
            </span>
          )
        }
        confirmText={userToToggleBan?.isBanned ? 'Mở Khóa' : 'Khóa Tài Khoản'}
        cancelText="Hủy bỏ"
      />
    </div>
  );
};
