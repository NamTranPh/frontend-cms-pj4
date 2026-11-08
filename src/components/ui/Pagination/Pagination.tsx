import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  limit?: number;
  limitOptions?: number[];
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalItems,
  limit = 10,
  limitOptions = [10, 20, 50],
  onPageChange,
  onLimitChange,
  className = '',
}) => {
  if (totalPages <= 0 && (!totalItems || totalItems === 0)) {
    return null;
  }

  // Tính khoảng bản ghi đang hiển thị
  const startItem = totalItems ? Math.min((page - 1) * limit + 1, totalItems) : (page - 1) * limit + 1;
  const endItem = totalItems ? Math.min(page * limit, totalItems) : page * limit;

  // Tính dải số trang hiển thị (thông minh với dấu ...)
  const getPageNumbers = () => {
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 px-2 py-3 text-xs text-slate-600 dark:text-slate-400 ${className}`}
    >
      {/* Thông tin số lượng */}
      <div className="flex items-center gap-3">
        {totalItems !== undefined && (
          <span>
            Hiển thị <strong className="text-slate-800 dark:text-slate-200">{startItem}</strong> -{' '}
            <strong className="text-slate-800 dark:text-slate-200">{endItem}</strong> trong tổng số{' '}
            <strong className="text-slate-900 dark:text-slate-100">{totalItems}</strong> kết quả
          </span>
        )}

        {/* Chọn số dòng mỗi trang */}
        {onLimitChange && (
          <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
            <span>Dòng/trang:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Cụm điều khiển chuyển trang */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1 self-end sm:self-auto">
          {/* Nút Trước */}
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Trang trước"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dãy số trang */}
          <div className="flex items-center gap-1">
            {pages.map((p, idx) => {
              if (p === '...') {
                return (
                  <span
                    key={`dots-${idx}`}
                    className="px-2 py-1 text-slate-400 select-none"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = Number(p);
              const isActive = pageNum === page;

              return (
                <button
                  key={`page-${pageNum}`}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-8 h-8 px-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#002b80] text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm shadow-cyan-500/10'
                      : 'border border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Nút Sau */}
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Trang sau"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
