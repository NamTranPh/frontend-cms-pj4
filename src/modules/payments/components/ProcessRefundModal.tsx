import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { PaymentRefund, ProcessRefundRequest } from '../types/payment.types';
import { formatCurrency } from '../../../utils/formatters';

interface ProcessRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  refund: PaymentRefund | null;
  onSubmit: (refundId: string, data: ProcessRefundRequest) => Promise<void>;
  isLoading?: boolean;
}

export const ProcessRefundModal: React.FC<ProcessRefundModalProps> = ({
  isOpen,
  onClose,
  refund,
  onSubmit,
  isLoading = false,
}) => {
  const [transactionCode, setTransactionCode] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (refund) {
      setTransactionCode('');
      setAdminNote('');
      setError(null);
    }
  }, [refund, isOpen]);

  if (!refund) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!transactionCode.trim()) {
      setError('Vui lòng nhập mã giao dịch ngân hàng / cổng hoàn tiền.');
      return;
    }

    try {
      await onSubmit(refund.id, {
        refundTransactionCode: transactionCode.trim(),
        adminNote: adminNote.trim() ? adminNote.trim() : undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi xác nhận hoàn tiền.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>Xác Nhận Đã Chuyển Tiền Hoàn</span>
        </div>
      }
      description={`Xử lý phiếu hoàn tiền #${refund.id.slice(0, 8)}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tóm tắt phiếu hoàn tiền */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Số tiền hoàn:</span>
            <span className="text-base font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(refund.amount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Mã đơn thanh toán:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200">
              #{refund.paymentOrderId}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Lý do yêu cầu:</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium line-clamp-1">
              {refund.reason || '—'}
            </span>
          </div>
        </div>

        {/* Cảnh báo trừ lùi ngày VIP tự động */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Lưu ý nghiệp vụ quan trọng:</p>
            <p className="leading-relaxed">
              Khi bấm xác nhận, hệ thống sẽ chuyển phiếu sang <b>COMPLETED</b> và{' '}
              <b>tự động thu hồi / trừ lùi số ngày VIP</b> tương ứng trong tài khoản khách hàng. Hãy chắc chắn bạn đã chuyển tiền thành công qua ngân hàng!
            </p>
          </div>
        </div>

        {/* Thông báo lỗi nếu có */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mã giao dịch ngân hàng */}
        <div>
          <Input
            type="text"
            label="Mã giao dịch ngân hàng / Cổng hoàn tiền"
            required
            value={transactionCode}
            onChange={(e) => setTransactionCode(e.target.value)}
            placeholder="Ví dụ: FT24111293821, VCB-9821389, v.v..."
            helperText="Mã biên nhận hoặc mã tham chiếu chuyển khoản ngân hàng thực tế."
          />
        </div>

        {/* Ghi chú Admin */}
        <div>
          <Input
            as="textarea"
            label="Ghi chú xử lý (Tùy chọn)"
            rows={2}
            maxLength={300}
            showCharCount
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Nhập ghi chú đối soát nội bộ nếu có..."
          />
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
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Xác nhận hoàn tất
          </Button>
        </div>
      </form>
    </Modal>
  );
};
