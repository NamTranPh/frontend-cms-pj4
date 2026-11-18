import React, { useState, useEffect } from 'react';
import { RotateCcw, AlertCircle, Info } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { PaymentOrder, CreateRefundRequest } from '../types/payment.types';
import { formatCurrency } from '../../../utils/formatters';

interface CreateRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PaymentOrder | null;
  onSubmit: (data: CreateRefundRequest) => Promise<void>;
  isLoading?: boolean;
}

export const CreateRefundModal: React.FC<CreateRefundModalProps> = ({
  isOpen,
  onClose,
  order,
  onSubmit,
  isLoading = false,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const maxRefundable = order
    ? Math.max(0, order.price - (order.refundedAmount || 0))
    : 0;

  useEffect(() => {
    if (order) {
      setAmount(maxRefundable);
      setReason('');
      setError(null);
    }
  }, [order, isOpen, maxRefundable]);

  if (!order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amount <= 0) {
      setError('Số tiền hoàn phải lớn hơn 0 ₫.');
      return;
    }

    if (amount > maxRefundable) {
      setError(
        `Số tiền hoàn không được vượt quá số tiền tối đa có thể hoàn (${formatCurrency(
          maxRefundable
        )}).`
      );
      return;
    }

    if (!reason.trim()) {
      setError('Vui lòng nhập lý do hoàn tiền.');
      return;
    }

    try {
      await onSubmit({
        paymentOrderId: order.id,
        amount,
        reason: reason.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi tạo yêu cầu hoàn tiền.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-lg">
          <RotateCcw className="w-5 h-5 text-rose-500" />
          <span>Tạo Yêu Cầu Hoàn Tiền</span>
        </div>
      }
      description={`Khởi tạo phiếu hoàn tiền cho đơn #${order.transactionCode || order.id.slice(0, 8)}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Thẻ tóm tắt thông số đơn hàng */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Gói VIP thanh toán:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {order.planName}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Giá gốc đơn hàng:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatCurrency(order.price)}
            </span>
          </div>
          {(order.refundedAmount || 0) > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Số tiền đã hoàn trước đó:</span>
              <span className="font-semibold text-rose-500">
                - {formatCurrency(order.refundedAmount)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-800 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Tối đa có thể hoàn:
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(maxRefundable)}
            </span>
          </div>
        </div>

        {/* Thông báo lỗi nếu có */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Nhập số tiền hoàn */}
        <div>
          <Input
            type="number"
            label="Số tiền hoàn (VNĐ)"
            required
            min={1000}
            max={maxRefundable}
            value={amount === 0 ? '' : amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            placeholder={`Nhập số tiền (tối đa ${maxRefundable})`}
            helperText={`Số tiền thực tế sẽ hoàn cho khách, tối đa ${formatCurrency(maxRefundable)}.`}
          />
        </div>

        {/* Nhập lý do hoàn tiền */}
        <div>
          <Input
            as="textarea"
            label="Lý do hoàn tiền"
            required
            rows={3}
            maxLength={500}
            showCharCount
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ví dụ: Khách hàng khiếu nại dịch vụ gián đoạn, hoàn tiền theo chính sách đối soát..."
          />
        </div>

        {/* Ghi chú quy trình */}
        <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs flex items-start gap-2">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Sau khi tạo yêu cầu, phiếu hoàn tiền sẽ ở trạng thái <b>Chờ xử lý (REQUESTED)</b>.
            Admin sau khi thực hiện chuyển tiền qua ngân hàng sẽ bấm <b>Xác nhận & Duyệt</b> để hệ thống tự động trừ lùi ngày VIP.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="danger"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Tạo phiếu hoàn tiền
          </Button>
        </div>
      </form>
    </Modal>
  );
};
