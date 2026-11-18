import React, { useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Search,
  RefreshCw,
  X,
} from 'lucide-react';
import { adminPaymentService } from '../services/adminPaymentService';
import type {
  PaymentRefund,
  RefundStatus,
  ProcessRefundRequest,
} from '../types/payment.types';
import {
  RefundTable,
  ProcessRefundModal,
} from '../components';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Pagination } from '../../../components/ui/Pagination';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useToast } from '../../../components/feedback/useToast';

export const AdminRefundPage: React.FC = () => {
  const toast = useToast();

  const [refunds, setRefunds] = useState<PaymentRefund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<RefundStatus | 'ALL'>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Process Refund Modal
  const [refundToProcess, setRefundToProcess] = useState<PaymentRefund | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cancel Refund Dialog
  const [refundToCancel, setRefundToCancel] = useState<PaymentRefund | null>(null);
  const [cancelNote, setCancelNote] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const loadRefunds = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await adminPaymentService.getRefunds({
        page,
        limit,
        search: search.trim() || undefined,
        status,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      });
      setRefunds(res.items || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải danh sách phiếu hoàn tiền');
      setRefunds([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, status, fromDate, toDate, toast]);

  useEffect(() => {
    loadRefunds();
  }, [loadRefunds]);

  const handleProcessRefundSubmit = async (refundId: string, data: ProcessRefundRequest) => {
    setIsProcessing(true);
    try {
      await adminPaymentService.processRefund(refundId, data);
      toast.success('Đã xác nhận hoàn tiền thành công và tự động trừ lùi VIP của khách hàng!');
      setRefundToProcess(null);
      loadRefunds();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmCancelRefund = async () => {
    if (!refundToCancel) return;
    setIsCancelling(true);
    try {
      await adminPaymentService.cancelRefund(
        refundToCancel.id,
        cancelNote.trim() ? cancelNote.trim() : undefined
      );
      toast.success(`Đã từ chối phiếu hoàn tiền #${refundToCancel.id.slice(0, 8)}`);
      setRefundToCancel(null);
      loadRefunds();
    } catch (err: any) {
      toast.error(err?.message || 'Từ chối phiếu hoàn tiền thất bại');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('ALL');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <RotateCcw className="text-[#002b80] dark:text-cyan-400 w-7 h-7" />
            <span>Lịch Sử Hoàn Tiền (Refunds)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quản lý và xét duyệt các phiếu hoàn tiền chuẩn 3NF, tự động thu hồi ngày VIP khi xác nhận chuyển khoản.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadRefunds}
            className="gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* Thanh Tìm Kiếm & Bộ Lọc Tiêu Chí */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            placeholder="Tìm theo mã phiếu, mã đơn, lý do..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="w-48">
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as RefundStatus | 'ALL');
              setPage(1);
            }}
            options={[
              { value: 'ALL', label: 'Tất cả trạng thái' },
              { value: 'REQUESTED', label: 'Chờ xử lý (REQUESTED)' },
              { value: 'PROCESSING', label: 'Đang xử lý (PROCESSING)' },
              { value: 'COMPLETED', label: 'Đã hoàn tất (COMPLETED)' },
              { value: 'CANCELLED', label: 'Đã hủy (CANCELLED)' },
              { value: 'REJECTED', label: 'Bị từ chối (REJECTED)' },
            ]}
          />
        </div>

        <div className="w-40">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
            title="Từ ngày"
          />
        </div>

        <div className="w-40">
          <Input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
            title="Đến ngày"
          />
        </div>

        {(search || status !== 'ALL' || fromDate || toDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-4 h-4 mr-1" />
            <span>Đặt lại</span>
          </Button>
        )}
      </div>

      {/* Bảng Dữ Liệu Phiếu Hoàn Tiền */}
      <div className="space-y-4">
        <RefundTable
          refunds={refunds}
          loading={isLoading}
          onProcess={(rf) => setRefundToProcess(rf)}
          onCancel={(rf) => {
            setRefundToCancel(rf);
            setCancelNote('');
          }}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>

      {/* Modal Xác Nhận Đã Chuyển Khoản Hoàn Tiền */}
      <ProcessRefundModal
        isOpen={Boolean(refundToProcess)}
        onClose={() => setRefundToProcess(null)}
        refund={refundToProcess}
        onSubmit={handleProcessRefundSubmit}
        isLoading={isProcessing}
      />

      {/* Dialog Từ Chối Phiếu Hoàn Tiền */}
      <ConfirmDialog
        isOpen={Boolean(refundToCancel)}
        onClose={() => setRefundToCancel(null)}
        onConfirm={handleConfirmCancelRefund}
        title="Từ chối / Hủy phiếu hoàn tiền"
        description={
          <div className="space-y-3">
            <p>
              Bạn có chắc chắn muốn từ chối phiếu yêu cầu hoàn tiền{' '}
              <b>#{refundToCancel?.id.slice(0, 8)}</b> không?
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Ghi chú từ chối (Tùy chọn):
              </label>
              <Input
                type="text"
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
                placeholder="Lý do từ chối phiếu..."
              />
            </div>
          </div>
        }
        confirmText="Từ chối phiếu"
        cancelText="Đóng"
        variant="danger"
        isLoading={isCancelling}
      />
    </div>
  );
};
