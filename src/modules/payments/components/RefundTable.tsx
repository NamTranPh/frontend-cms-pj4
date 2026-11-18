import React from 'react';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  User,
} from 'lucide-react';
import type { PaymentRefund, RefundStatus } from '../types/payment.types';
import { Badge, type BadgeVariant } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface RefundTableProps {
  refunds: PaymentRefund[];
  loading?: boolean;
  onProcess: (refund: PaymentRefund) => void;
  onCancel: (refund: PaymentRefund) => void;
}

const statusBadgeConfig: Record<
  RefundStatus,
  { label: string; variant: BadgeVariant }
> = {
  REQUESTED: { label: 'Chờ xử lý', variant: 'warning' },
  PROCESSING: { label: 'Đang xử lý', variant: 'info' },
  COMPLETED: { label: 'Đã hoàn tất', variant: 'success' },
  CANCELLED: { label: 'Đã hủy', variant: 'slate' },
  REJECTED: { label: 'Bị từ chối', variant: 'danger' },
};

export const RefundTable: React.FC<RefundTableProps> = ({
  refunds,
  loading = false,
  onProcess,
  onCancel,
}) => {
  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] rounded-xl overflow-hidden shadow-xs">
        <div className="p-8 text-center text-slate-400 dark:text-slate-500 animate-pulse">
          Đang tải danh sách phiếu hoàn tiền...
        </div>
      </div>
    );
  }

  if (refunds.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] rounded-xl p-12 text-center shadow-xs">
        <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
          <RotateCcw className="w-8 h-8" />
        </div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Chưa có yêu cầu hoàn tiền nào
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Các yêu cầu hoàn tiền từ khách hàng hoặc Admin tạo sẽ hiển thị tại đây.
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
                Mã phiếu / Đơn hàng
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Số tiền hoàn
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Lý do & Mã GD hoàn
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Thời gian
              </th>
              <th className="py-3 px-4 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {refunds.map((rf) => {
              const statusCfg = statusBadgeConfig[rf.status] || {
                label: rf.status,
                variant: 'default',
              };
              const canProcess =
                rf.status === 'REQUESTED' || rf.status === 'PROCESSING';
              const canCancel =
                rf.status === 'REQUESTED' || rf.status === 'PROCESSING';

              return (
                <tr
                  key={rf.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Mã phiếu & Đơn gốc */}
                  <td className="py-3 px-4">
                    <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                      #{rf.id.slice(0, 8)}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                      Đơn: #{rf.paymentOrderId.slice(0, 8)}
                    </div>
                  </td>

                  {/* Khách hàng */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <User className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span className="font-mono truncate max-w-[120px]">
                        {rf.userId.slice(0, 8)}...
                      </span>
                    </div>
                  </td>

                  {/* Số tiền hoàn */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-rose-600 dark:text-rose-400">
                      {formatCurrency(rf.amount)}
                    </div>
                  </td>

                  {/* Lý do & Mã GD hoàn */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="text-xs text-slate-800 dark:text-slate-200 line-clamp-1" title={rf.reason}>
                      {rf.reason || '—'}
                    </div>
                    {rf.refundTransactionCode && (
                      <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                        Mã GD: {rf.refundTransactionCode}
                      </div>
                    )}
                    {rf.adminNote && (
                      <div className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5" title={rf.adminNote}>
                        Ghi chú: {rf.adminNote}
                      </div>
                    )}
                  </td>

                  {/* Trạng thái */}
                  <td className="py-3 px-4">
                    <Badge variant={statusCfg.variant} dot size="sm">
                      {statusCfg.label}
                    </Badge>
                  </td>

                  {/* Thời gian */}
                  <td className="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(rf.createdAt)}</span>
                    </div>
                    {rf.processedAt && (
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Xử lý: {formatDate(rf.processedAt)}
                      </div>
                    )}
                  </td>

                  {/* Thao tác */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {canProcess && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-8 px-2.5 text-xs gap-1"
                          onClick={() => onProcess(rf)}
                          title="Xác nhận đã chuyển khoản ngân hàng hoàn tất"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Duyệt & Xử lý</span>
                        </Button>
                      )}

                      {canCancel && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                          title="Từ chối / Hủy phiếu hoàn tiền"
                          onClick={() => onCancel(rf)}
                        >
                          <XCircle className="w-4 h-4" />
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
