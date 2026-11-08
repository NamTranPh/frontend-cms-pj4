import React from 'react';
import { Crown, Eye, Pencil, Trash2, Smartphone, Download, Monitor } from 'lucide-react';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Tooltip } from '../../../components/ui/Tooltip';
import type { MembershipPlan } from '../types/plan.types';

interface PlanTableProps {
  plans: MembershipPlan[];
  isLoading: boolean;
  onPreview: (plan: MembershipPlan) => void;
  onEdit: (plan: MembershipPlan) => void;
  onDelete: (plan: MembershipPlan) => void;
}

export const PlanTable: React.FC<PlanTableProps> = ({
  plans,
  isLoading,
  onPreview,
  onEdit,
  onDelete,
}) => {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val || 0);
  };

  if (isLoading) {
    return (
      <Table>
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Gói VIP</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Giá tiền</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Thời hạn</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Đặc quyền kỹ thuật</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {Array.from({ length: 4 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="py-4 px-4"><Skeleton className="w-36 h-5" /></td>
              <td className="py-4 px-4"><Skeleton className="w-24 h-5" /></td>
              <td className="py-4 px-4"><Skeleton className="w-20 h-5" /></td>
              <td className="py-4 px-4"><Skeleton className="w-48 h-5" /></td>
              <td className="py-4 px-4"><Skeleton className="w-20 h-5 rounded-full" /></td>
              <td className="py-4 px-4 text-right"><Skeleton className="w-24 h-8 ml-auto rounded-lg" /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  if (plans.length === 0) {
    return (
      <Table>
        <tbody>
          <tr>
            <td colSpan={6} className="py-14 text-center text-slate-400">
              <div className="flex flex-col items-center justify-center gap-2">
                <Crown size={40} className="text-amber-500/40" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Chưa có gói VIP nào được cấu hình
                </p>
                <p className="text-xs text-slate-500">
                  Bấm nút "Tạo gói VIP" phía trên để tạo bảng giá dịch vụ cho khách hàng.
                </p>
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
          <th className="py-3.5 px-4 min-w-[180px]">Gói VIP</th>
          <th className="py-3.5 px-4 min-w-[120px]">Giá tiền</th>
          <th className="py-3.5 px-4 min-w-[100px]">Thời hạn</th>
          <th className="py-3.5 px-4 min-w-[240px]">Đặc quyền kỹ thuật</th>
          <th className="py-3.5 px-4 w-32">Trạng thái</th>
          <th className="py-3.5 px-4 w-36 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
        {plans.map((plan, index) => {
          const isLastRow = index === plans.length - 1;
          const tooltipPosition = isLastRow ? 'top-end' : 'bottom-end';

          return (
            <tr
            key={plan.id}
            className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
          >
            {/* Tên gói */}
            <td className="py-3.5 px-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                  <Crown size={18} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                    {plan.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 truncate">
                    {plan.slug}
                  </div>
                </div>
              </div>
            </td>

            {/* Giá tiền */}
            <td className="py-3.5 px-4 font-bold text-cyan-600 dark:text-cyan-400">
              {formatPrice(plan.price)}{' '}
              <span className="text-xs font-normal text-slate-400">₫</span>
            </td>

            {/* Thời hạn */}
            <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
              {plan.durationDays} ngày
            </td>

            {/* Thông số kỹ thuật */}
            <td className="py-3.5 px-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* Chất lượng */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Monitor size={12} className="text-cyan-500" />
                  {plan.videoQuality || '1080p'}
                </span>

                {/* Thiết bị */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Smartphone size={12} className="text-purple-500" />
                  {plan.maxDevices || 1} máy
                </span>

                {/* Tải xuống */}
                {plan.canDownload ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <Download size={12} />
                    Tải về
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-400 line-through">
                    Tải về
                  </span>
                )}
              </div>
            </td>

            {/* Trạng thái Active */}
            <td className="py-3.5 px-4">
              <Badge variant={plan.isActive ? 'success' : 'default'} dot size="sm">
                {plan.isActive ? 'Hiển thị' : 'Đang ẩn'}
              </Badge>
            </td>

            {/* Thao tác */}
            <td className="py-3.5 px-4 text-right">
              <div className="flex items-center justify-end gap-1">
                {/* Nút Xem trước Client Card */}
                <Tooltip content="Xem định dạng hiển thị Client" position={tooltipPosition}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onPreview(plan)}
                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                  >
                    <Eye size={15} />
                  </Button>
                </Tooltip>

                {/* Nút Sửa */}
                <Tooltip content="Chỉnh sửa gói VIP" position={tooltipPosition}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(plan)}
                  >
                    <Pencil size={15} />
                  </Button>
                </Tooltip>

                {/* Nút Xóa / Ẩn */}
                <Tooltip content="Xóa / Vô hiệu hóa gói" position={tooltipPosition}>
                  <Button
                    type="button"
                    variant="danger"
                    size="icon-sm"
                    onClick={() => onDelete(plan)}
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
