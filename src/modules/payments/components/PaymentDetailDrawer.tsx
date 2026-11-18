import React from 'react';
import {
  CreditCard,
  User,
  Crown,
  Calendar,
  Clock,
  ExternalLink,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { Drawer } from '../../../components/ui/Drawer';
import { Badge, type BadgeVariant } from '../../../components/ui/Badge';
import type {
  AdminPaymentDetail,
  PaymentOrderStatus,
  RefundStatus,
} from '../types/payment.types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface PaymentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  detail: AdminPaymentDetail | null;
  loading?: boolean;
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

const refundStatusConfig: Record<
  RefundStatus,
  { label: string; variant: BadgeVariant }
> = {
  REQUESTED: { label: 'Chờ duyệt', variant: 'warning' },
  PROCESSING: { label: 'Đang xử lý', variant: 'info' },
  COMPLETED: { label: 'Đã hoàn tất', variant: 'success' },
  CANCELLED: { label: 'Đã hủy', variant: 'slate' },
  REJECTED: { label: 'Từ chối', variant: 'danger' },
};

export const PaymentDetailDrawer: React.FC<PaymentDetailDrawerProps> = ({
  isOpen,
  onClose,
  detail,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="lg"
      title="Chi Tiết Đơn Thanh Toán"
    >
      {loading ? (
        <div className="p-8 text-center text-slate-400 dark:text-slate-500 animate-pulse">
          Đang tải chi tiết đơn thanh toán...
        </div>
      ) : !detail ? (
        <div className="p-8 text-center text-slate-400 dark:text-slate-500">
          Không tìm thấy thông tin đơn hàng
        </div>
      ) : (
        <div className="space-y-6 pb-6">
          {/* Header Card với số tiền & trạng thái */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Tổng thanh toán
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(detail.price)}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Mã: #{detail.transactionCode || detail.id}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {detail.gateway || 'PayOS'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <Badge
                variant={
                  statusBadgeConfig[detail.status]?.variant || 'default'
                }
                dot
                size="md"
              >
                {statusBadgeConfig[detail.status]?.label || detail.status}
              </Badge>
              {detail.refundedAmount && detail.refundedAmount > 0 ? (
                <div className="text-xs font-semibold text-rose-500 mt-2">
                  Đã hoàn: {formatCurrency(detail.refundedAmount)}
                </div>
              ) : null}
            </div>
          </div>

          {/* Checkout URL nếu đơn còn PENDING */}
          {detail.status === 'PENDING' && detail.checkoutUrl && (
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Đơn hàng đang chờ thanh toán trên cổng PayOS</span>
              </div>
              <a
                href={detail.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline shrink-0"
              >
                <span>Mở link thanh toán</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Lỗi thất bại nếu có */}
          {detail.failureReason && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs uppercase tracking-wider">
                  Lý do thất bại / hủy
                </p>
                <p className="mt-0.5">{detail.failureReason}</p>
              </div>
            </div>
          )}

          {/* Snapshot Khách Hàng & Gói Dịch Vụ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Snapshot Khách Hàng */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                <User className="w-4 h-4 text-cyan-500" />
                <span>Khách hàng</span>
              </div>
              {detail.user ? (
                <div className="space-y-1.5 text-sm">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {detail.user.name || 'Không có tên'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {detail.user.email}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    UID: {detail.user.id}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  Không có thông tin snapshot khách hàng
                </p>
              )}
            </div>

            {/* Snapshot Gói Cước */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Gói cước VIP</span>
              </div>
              {detail.plan ? (
                <div className="space-y-1.5 text-sm">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {detail.plan.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Thời hạn: {detail.plan.durationDays} ngày
                  </div>
                  <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                    Giá niêm yết: {formatCurrency(detail.plan.price)}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  Không có thông tin snapshot gói
                </p>
              )}
            </div>
          </div>

          {/* Chi tiết kỹ thuật & Cổng thanh toán */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <CreditCard className="w-4 h-4 text-purple-500" />
              <span>Thông số giao dịch cổng</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                Mã giao dịch PayOS:
              </span>
              <span className="font-mono text-xs text-slate-800 dark:text-slate-200">
                {detail.gatewayTransactionId || detail.transactionCode || '—'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                Cổng thanh toán:
              </span>
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {detail.gateway || 'PayOS'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                Thời hạn gói áp dụng:
              </span>
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {detail.durationDays ? `${detail.durationDays} ngày` : '—'}
              </span>
            </div>
          </div>

          {/* Dòng thời gian mốc trạng thái */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Dòng thời gian đơn hàng</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Tạo đơn:
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {formatDate(detail.createdAt)}
                </span>
              </div>
              {detail.requestedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Khách mở thanh toán:
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(detail.requestedAt)}
                  </span>
                </div>
              )}
              {detail.completedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Hoàn tất thanh toán:
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatDate(detail.completedAt)}
                  </span>
                </div>
              )}
              {detail.cancelledAt && (
                <div className="flex items-center justify-between">
                  <span className="text-rose-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Đã hủy:
                  </span>
                  <span className="font-medium text-rose-500">
                    {formatDate(detail.cancelledAt)}
                  </span>
                </div>
              )}
              {detail.refundedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-purple-500 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" /> Hoàn tiền:
                  </span>
                  <span className="font-medium text-purple-500">
                    {formatDate(detail.refundedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Lịch sử hoàn tiền liên quan (Chuẩn 3NF 1 - N) */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span>Lịch sử hoàn tiền ({detail.refundHistory?.length || 0})</span>
              </div>
            </div>

            {detail.refundHistory && detail.refundHistory.length > 0 ? (
              <div className="space-y-3">
                {detail.refundHistory.map((rf) => {
                  const rfCfg = refundStatusConfig[rf.status] || {
                    label: rf.status,
                    variant: 'default',
                  };
                  return (
                    <div
                      key={rf.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                          #{rf.id.slice(0, 8)}
                        </div>
                        <Badge variant={rfCfg.variant} size="sm">
                          {rfCfg.label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400">
                          Số tiền hoàn:
                        </span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">
                          {formatCurrency(rf.amount)}
                        </span>
                      </div>
                      {rf.reason && (
                        <div className="text-slate-600 dark:text-slate-300">
                          <span className="text-slate-400">Lý do:</span> {rf.reason}
                        </div>
                      )}
                      {rf.refundTransactionCode && (
                        <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          Mã GD hoàn: {rf.refundTransactionCode}
                        </div>
                      )}
                      {rf.adminNote && (
                        <div className="text-[11px] text-slate-500 italic">
                          Ghi chú: {rf.adminNote}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400 text-right pt-1">
                        Ngày tạo: {formatDate(rf.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Chưa có yêu cầu hoàn tiền nào cho đơn này.
              </p>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
};
