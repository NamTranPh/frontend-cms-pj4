import React from 'react';
import {
  Eye,
  Lock,
  Unlock,
  Shield,
  Crown,
  User as UserIcon,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableEmpty,
  TableSkeleton,
} from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import type { AdminUser } from '../types/user.types';

export interface UserTableProps {
  users: AdminUser[];
  isLoading: boolean;
  currentAdminId?: string;
  onViewDetail: (user: AdminUser) => void;
  onToggleBan: (user: AdminUser) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  currentAdminId,
  onViewDetail,
  onToggleBan,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Người dùng</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>Gói VIP</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày tham gia</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : users.length === 0 ? (
          <TableEmpty
            colSpan={6}
            title="Không tìm thấy người dùng"
            description="Không có tài khoản nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại."
          />
        ) : (
          users.map((user) => {
            const isSelf = user.id === currentAdminId;
            const formattedDate = user.createdAt
              ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : '—';

            return (
              <TableRow key={user.id}>
                {/* Người dùng: Avatar + Tên + Email */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shrink-0 shadow-sm shadow-cyan-500/10">
                      <div className="w-full h-full rounded-[10px] overflow-hidden bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                        {user.profileUrl ? (
                          <img
                            src={user.profileUrl}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase() || <UserIcon size={16} />
                        )}
                      </div>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate block text-sm">
                          {user.name}
                        </span>
                        {isSelf && (
                          <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-200 dark:border-cyan-500/30">
                            Bạn
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 block truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Vai trò */}
                <TableCell>
                  <Badge
                    variant={user.role === 'ADMIN' ? 'cyan' : 'slate'}
                    size="sm"
                  >
                    <Shield size={11} />
                    <span>{user.role}</span>
                  </Badge>
                </TableCell>

                {/* Gói VIP */}
                <TableCell>
                  {user.isVip ? (
                    <Badge variant="purple" size="sm">
                      <Crown size={11} />
                      <span>{user.currentPlanName || 'VIP'}</span>
                    </Badge>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Free
                    </span>
                  )}
                </TableCell>

                {/* Trạng thái */}
                <TableCell>
                  <Badge
                    variant={user.isBanned ? 'danger' : 'success'}
                    size="sm"
                    dot
                  >
                    <span>{user.isBanned ? 'BANNED' : user.accountStatus || 'ACTIVE'}</span>
                  </Badge>
                </TableCell>

                {/* Ngày tham gia */}
                <TableCell>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formattedDate}
                  </span>
                </TableCell>

                {/* Thao tác */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Nút Xem chi tiết */}
                    <button
                      type="button"
                      onClick={() => onViewDetail(user)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Nút Khóa / Mở khóa (Ẩn nếu là chính mình) */}
                    {!isSelf && (
                      <button
                        type="button"
                        onClick={() => onToggleBan(user)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          user.isBanned
                            ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10'
                            : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10'
                        }`}
                        title={user.isBanned ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                      >
                        {user.isBanned ? <Unlock size={16} /> : <Lock size={16} />}
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};
