import React from 'react';
import { User, Pencil, Trash2, Calendar, Globe } from 'lucide-react';
import type { ActorItem } from '../types/actor.types';
import { Button } from '../../../components/ui/Button';
import { Avatar } from '../../../components/ui/Avatar';
import { formatDateOnly, formatDate } from '../../../utils/formatters';

interface ActorTableProps {
  actors: ActorItem[];
  loading?: boolean;
  onEdit: (actor: ActorItem) => void;
  onDelete: (actor: ActorItem) => void;
}

export const ActorTable: React.FC<ActorTableProps> = ({
  actors,
  loading = false,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] rounded-xl overflow-hidden shadow-xs">
        <div className="p-8 text-center text-slate-400 dark:text-slate-500 animate-pulse">
          Đang tải danh sách diễn viên...
        </div>
      </div>
    );
  }

  if (actors.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] rounded-xl p-12 text-center shadow-xs">
        <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
          <User className="w-8 h-8" />
        </div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Chưa có diễn viên nào
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Danh sách diễn viên chưa được tạo hoặc không phù hợp với từ khóa tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/50">
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Diễn viên
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Tên gốc / Nghệ danh
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Quốc tịch & Ngày sinh
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Tiểu sử tóm tắt
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {actors.map((actor) => (
              <tr
                key={actor.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Diễn viên (Avatar + Tên) */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={actor.avatarUrl}
                      name={actor.name}
                      size="md"
                      shape="circle"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {actor.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        ID: {actor.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </td>

                {/* Tên gốc */}
                <td className="py-3 px-4">
                  <div className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                    {actor.originalName || '—'}
                  </div>
                </td>

                {/* Quốc tịch & Ngày sinh */}
                <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>{actor.nationality || 'Chưa rõ'}</span>
                  </div>
                  {actor.birthDate && (
                    <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{formatDateOnly(actor.birthDate)}</span>
                    </div>
                  )}
                </td>

                {/* Tiểu sử */}
                <td className="py-3 px-4 max-w-xs">
                  <p
                    className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2"
                    title={actor.bio}
                  >
                    {actor.bio || 'Chưa có thông tin tiểu sử.'}
                  </p>
                </td>

                {/* Ngày tạo */}
                <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(actor.createdAt)}
                </td>

                {/* Thao tác */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title="Chỉnh sửa diễn viên"
                      onClick={() => onEdit(actor)}
                    >
                      <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      title="Xóa diễn viên"
                      onClick={() => onDelete(actor)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
