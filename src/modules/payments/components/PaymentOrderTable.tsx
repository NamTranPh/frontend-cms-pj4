import React from 'react';
import {
  Eye,
  RefreshCw,
  XCircle,
  RotateCcw,
  CreditCard,
  Crown,
} from 'lucide-react';
import type { PaymentOrder, PaymentOrderStatus } from '../types/payment.types';
import { Badge, type BadgeVariant } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface PaymentOrderTableProps {
  orders: PaymentOrder[];
  loading?: boolean;
  onViewDetail: (order: PaymentOrder) => void;
  onSync: (order: PaymentOrder) => void;
  onCancel: (order: PaymentOrder) => void;
  onCreateRefund: (order: PaymentOrder) => void;
  syncingId?: string | null;
}

const statusBadgeConfig: Record<
  PaymentOrderStatus,
  { label: string; variant: BadgeVariant }
> = {
  COMPLETED: { label: 'Thành công', variant: 'success' },
  PENDING: { label: 'Đang chờ', variant: 'warning' },
  FAILED: { label: 'Thất bại', variant: 'danger' },
  CANCELLED: { label: 'Đã hủy', variant: 'slate' },
  REFUNDED: { label: 'Đã hoàn tiền', variant: 'purple' },
};

export const PaymentOrderTable: React.FC<PaymentOrderTableProps> = ({
  orders,
  loading = false,
  onViewDetail,
  onSync,
  onCancel,
  onCreateRefund,
  syncingId,
}) => {
  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] rounded-xl overflow-hidden shadow-xs">
        <div className="p-8 text-center text-slate-400 dark:text-slate-500 animate-pulse">
          Đang tải danh sách đơn thanh toán...
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] rounded-xl p-12 text-center shadow-xs">
        <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
          <CreditCard className="w-8 h-8" />
        </div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Chưa có đơn thanh toán nào
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Không tìm thấy đơn thanh toán phù hợp với bộ lọc hiện tại.
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
                Mã đơn / GD
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Gói dịch vụ VIP
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Số tiền & Cổng
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Thời gian tạo / hoàn tất
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {orders.map((order) => {
              const statusCfg = statusBadgeConfig[order.status] || {
                label: order.status,
                variant: 'default',
              };
              const isSyncing = syncingId === order.id;
              const hasRefund = (order.refundedAmount || 0) > 0;
              const canRefund =
                order.status === 'COMPLETED' &&
                (order.refundedAmount || 0) < order.price;

              return (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Mã đơn */}
                  <td className="py-3 px-4">
                    <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                      #{order.transactionCode || order.id.slice(0, 8)}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                      ID: {order.id}
                    </div>
                  </td>

                  {/* Gói VIP */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                      <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{order.planName || 'Gói VIP'}</span>
                    </div>
                    {order.durationDays && (
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        Thời hạn: {order.durationDays} ngày
                      </div>
                    )}
                  </td>

                  {/* Số tiền & Cổng */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(order.price)}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {order.gateway || 'PayOS'}
                      </span>
                      {hasRefund && (
                        <span className="text-[11px] text-rose-500 font-medium">
                          Đã hoàn: {formatCurrency(order.refundedAmount)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3 px-4">
                    <Badge variant={statusCfg.variant} dot size="sm">
                      {statusCfg.label}
                    </Badge>
                    {order.failureReason && (
                      <p
                        className="text-[11px] text-rose-500 mt-1 max-w-[180px] truncate"
                        title={order.failureReason}
                      >
                        Lý do: {order.failureReason}
                      </p>
                    )}
                  </td>

                  {/* Thời gian */}
                  <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                    <div>Tạo: {formatDate(order.createdAt)}</div>
                    {order.completedAt && (
                      <div className="text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                        Xong: {formatDate(order.completedAt)}
                      </div>
                    )}
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Xem chi tiết */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Xem chi tiết đơn hàng"
                        onClick={() => onViewDetail(order)}
                      >
                        <Eye className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                      </Button>

                      {/* Đồng bộ PayOS */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Đồng bộ lại trạng thái từ PayOS"
                        disabled={isSyncing}
                        onClick={() => onSync(order)}
                      >
                        <RefreshCw
                          className={`w-4 h-4 text-cyan-600 dark:text-cyan-400 ${
                            isSyncing ? 'animate-spin' : ''
                          }`}
                        />
                      </Button>

                      {/* Hủy đơn PENDING */}
                      {order.status === 'PENDING' && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Hủy đơn treo đang chờ"
                          onClick={() => onCancel(order)}
                        >
                          <XCircle className="w-4 h-4 text-rose-500" />
                        </Button>
                      )}

                      {/* Tạo hoàn tiền */}
                      {canRefund && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          title="Tạo phiếu yêu cầu hoàn tiền"
                          onClick={() => onCreateRefund(order)}
                        >
                          <RotateCcw className="w-4 h-4 text-amber-500" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
