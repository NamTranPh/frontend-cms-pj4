import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { Select } from '../../../components/ui/Select';

export interface UserFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

const roleOptions = [
  { value: 'ALL', label: 'Tất cả vai trò' },
  { value: 'ADMIN', label: 'Quản trị viên (ADMIN)' },
  { value: 'USER', label: 'Người dùng (USER)' },
];

const statusOptions = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'BANNED', label: 'Đã bị khóa' },
];

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
  hasActiveFilters,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Ô tìm kiếm */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo tên hoặc email người dùng..."
          className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-[#002b80] dark:focus:border-cyan-400 transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            title="Xóa tìm kiếm"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Cụm Dropdown bộ lọc & Reset */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="w-40 sm:w-44">
          <Select
            options={roleOptions}
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
          />
        </div>

        <div className="w-36 sm:w-40">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="p-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-1 cursor-pointer"
            title="Đặt lại bộ lọc"
          >
            <RotateCcw size={15} />
            <span className="hidden sm:inline">Đặt lại</span>
          </button>
        )}
      </div>
    </div>
  );
};
