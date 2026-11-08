import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Tooltip } from '../../../components/ui/Tooltip';
import { IconRenderer } from './IconRenderer';
import type { GenreItem } from '../types/genre.types';

interface GenreTableProps {
  genres: GenreItem[];
  isLoading: boolean;
  onEdit: (genre: GenreItem) => void;
  onDelete: (genre: GenreItem) => void;
}

export const GenreTable: React.FC<GenreTableProps> = ({
  genres,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <Table>
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Icon</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Tên thể loại</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Slug</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Mô tả</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="py-3.5 px-4"><Skeleton className="w-8 h-8 rounded-lg" /></td>
              <td className="py-3.5 px-4"><Skeleton className="w-32 h-4" /></td>
              <td className="py-3.5 px-4"><Skeleton className="w-24 h-4" /></td>
              <td className="py-3.5 px-4"><Skeleton className="w-48 h-4" /></td>
              <td className="py-3.5 px-4"><Skeleton className="w-16 h-5 rounded-full" /></td>
              <td className="py-3.5 px-4 text-right"><Skeleton className="w-16 h-8 ml-auto rounded-lg" /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  if (genres.length === 0) {
    return (
      <Table>
        <tbody>
          <tr>
            <td colSpan={6} className="py-12 text-center text-slate-400">
              <div className="flex flex-col items-center justify-center gap-2">
                <IconRenderer icon="Film" size={36} className="text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium">Chưa có thể loại phim nào được tìm thấy.</p>
                <p className="text-xs text-slate-500">Hãy thêm thể loại mới hoặc thay đổi bộ lọc tìm kiếm.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  return (
    <Table>
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <th className="py-3.5 px-4 w-14">Icon</th>
          <th className="py-3.5 px-4 min-w-[160px]">Tên thể loại</th>
          <th className="py-3.5 px-4 min-w-[140px]">Slug</th>
          <th className="py-3.5 px-4 min-w-[220px]">Mô tả</th>
          <th className="py-3.5 px-4 w-32">Trạng thái</th>
          <th className="py-3.5 px-4 w-28 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
        {genres.map((genre, index) => {
          const isActive = genre.status === 'ACTIVE';
          const isLastRow = index === genres.length - 1;
          const tooltipPosition = isLastRow ? 'top-end' : 'bottom-end';

          return (
            <tr
              key={genre.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              {/* Icon */}
              <td className="py-3 px-4">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-[#002b80] dark:text-cyan-400">
                  <IconRenderer icon={genre.icon} size={20} />
                </div>
              </td>

              {/* Tên thể loại */}
              <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                {genre.name}
              </td>

              {/* Slug */}
              <td className="py-3 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                {genre.slug}
              </td>

              {/* Mô tả */}
              <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">
                {genre.description || <span className="text-slate-400 italic">(Không có mô tả)</span>}
              </td>

              {/* Trạng thái */}
              <td className="py-3 px-4">
                <Badge variant={isActive ? 'success' : 'default'} dot size="sm">
                  {isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                </Badge>
              </td>

              {/* Nút thao tác */}
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Tooltip content="Chỉnh sửa thể loại" position={tooltipPosition}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(genre)}
                    >
                      <Pencil size={15} />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Xóa thể loại" position={tooltipPosition}>
                    <Button
                      type="button"
                      variant="danger"
                      size="icon-sm"
                      onClick={() => onDelete(genre)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
