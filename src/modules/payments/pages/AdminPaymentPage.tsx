import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Search,
  RefreshCw,
  X,
} from 'lucide-react';
import { adminPaymentService } from '../services/adminPaymentService';
import type {
  PaymentOrder,
  AdminPaymentDetail,
  AdminPaymentStatistics,
  PaymentOrderStatus,
  CreateRefundRequest,
} from '../types/payment.types';
import {
  PaymentStatisticsCards,
  PaymentOrderTable,
  PaymentDetailDrawer,
  CreateRefundModal,
} from '../components';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Pagination } from '../../../components/ui/Pagination';
import { ConfirmDialog } from '../../../components/feedback/ConfirmDialog';
import { useToast } from '../../../components/feedback/useToast';

export const AdminPaymentPage: React.FC = () => {
  const toast = useToast();

  // Statistics State
  const [stats, setStats] = useState<AdminPaymentStatistics | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Orders State
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit, setOrderLimit] = useState(10);
  const [totalOrderItems, setTotalOrderItems] = useState(0);
  const [totalOrderPages, setTotalOrderPages] = useState(1);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState<PaymentOrderStatus | 'ALL'>('ALL');
  const [orderFromDate, setOrderFromDate] = useState('');
  const [orderToDate, setOrderToDate] = useState('');
  const [syncingOrderId, setSyncingOrderId] = useState<string | null>(null);

  // Detail Drawer State
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState<AdminPaymentDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Create Refund Modal
  const [orderToRefund, setOrderToRefund] = useState<PaymentOrder | null>(null);
  const [isCreatingRefund, setIsCreatingRefund] = useState(false);

  // Cancel Pending Order Dialog
  const [orderToCancel, setOrderToCancel] = useState<PaymentOrder | null>(null);
  const [cancelOrderReason, setCancelOrderReason] = useState('Khách hàng yêu cầu hủy đơn');
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  // 1. Fetch Statistics
  const loadStatistics = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const res = await adminPaymentService.getStatistics(
        orderFromDate || undefined,
        orderToDate || undefined
      );
      setStats(res);
    } catch {
      setStats(null);
    } finally {
      setIsStatsLoading(false);
    }
  }, [orderFromDate, orderToDate]);

  // 2. Fetch Orders
  const loadOrders = useCallback(async () => {
    setIsOrdersLoading(true);
    try {
      const res = await adminPaymentService.getPayments({
        page: orderPage,
        limit: orderLimit,
        search: orderSearch.trim() || undefined,
        status: orderStatus,
        fromDate: orderFromDate || undefined,
        toDate: orderToDate || undefined,
      });
      setOrders(res.items || []);
      setTotalOrderItems(res.totalItems || 0);
      setTotalOrderPages(res.totalPages || 1);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải danh sách đơn thanh toán');
      setOrders([]);
    } finally {
      setIsOrdersLoading(false);
    }
  }, [orderPage, orderLimit, orderSearch, orderStatus, orderFromDate, orderToDate, toast]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleViewDetail = async (order: PaymentOrder) => {
    setIsDetailDrawerOpen(true);
    setIsDetailLoading(true);
    setPaymentDetail(null);
    try {
      const detail = await adminPaymentService.getPaymentDetail(order.id);
      setPaymentDetail(detail);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải chi tiết đơn hàng');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleSyncOrder = async (order: PaymentOrder) => {
    setSyncingOrderId(order.id);
    try {
      const updated = await adminPaymentService.syncPaymentStatus(order.id);
      toast.success(
        `Đã đồng bộ đơn #${order.transactionCode || order.id.slice(0, 8)}: Trạng thái hiện tại [${updated.status}]`
      );
      loadOrders();
      loadStatistics();
    } catch (err: any) {
      toast.error(err?.message || 'Đồng bộ đơn hàng thất bại');
    } finally {
      setSyncingOrderId(null);
    }
  };

  const handleConfirmCancelOrder = async () => {
    if (!orderToCancel) return;
    setIsCancellingOrder(true);
    try {
      await adminPaymentService.cancelPendingPayment(
        orderToCancel.id,
        cancelOrderReason.trim() || 'Hủy bởi Admin'
      );
      toast.success(`Đã hủy thành công đơn hàng #${orderToCancel.transactionCode || orderToCancel.id.slice(0, 8)}`);
      setOrderToCancel(null);
      loadOrders();
      loadStatistics();
    } catch (err: any) {
      toast.error(err?.message || 'Hủy đơn hàng thất bại');
    } finally {
      setIsCancellingOrder(false);
    }
  };

  const handleCreateRefundSubmit = async (data: CreateRefundRequest) => {
    setIsCreatingRefund(true);
    try {
      await adminPaymentService.createRefundRequest(data);
      toast.success('Đã tạo thành công phiếu yêu cầu hoàn tiền!');
      setOrderToRefund(null);
      loadOrders();
      loadStatistics();
    } finally {
      setIsCreatingRefund(false);
    }
  };

  const handleResetFilters = () => {
    setOrderSearch('');
    setOrderStatus('ALL');
    setOrderFromDate('');
    setOrderToDate('');
    setOrderPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Trang */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <CreditCard className="text-[#002b80] dark:text-cyan-400 w-7 h-7" />
            <span>Lịch Sử Mua Gói VIP (PayOS)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi dòng tiền nạp VIP PayOS, đối soát đơn hàng và thông số giao dịch của khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              loadStatistics();
              loadOrders();
            }}
            className="gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* Thẻ Thống Kê Tài Chính Tổng Quan */}
      <PaymentStatisticsCards stats={stats} loading={isStatsLoading} />

      {/* Thanh Tìm Kiếm & Bộ Lọc Tiêu Chí */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            type="text"
            placeholder="Tìm theo mã đơn, mã GD hoặc UID..."
            value={orderSearch}
            onChange={(e) => {
              setOrderSearch(e.target.value);
              setOrderPage(1);
            }}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="w-48">
          <Select
            value={orderStatus}
            onChange={(e) => {
              setOrderStatus(e.target.value as PaymentOrderStatus | 'ALL');
              setOrderPage(1);
            }}
            options={[
              { value: 'ALL', label: 'Tất cả trạng thái' },
              { value: 'COMPLETED', label: 'Thành công (COMPLETED)' },
              { value: 'PENDING', label: 'Đang chờ (PENDING)' },
              { value: 'FAILED', label: 'Thất bại (FAILED)' },
              { value: 'CANCELLED', label: 'Đã hủy (CANCELLED)' },
              { value: 'REFUNDED', label: 'Đã hoàn tiền (REFUNDED)' },
            ]}
          />
        </div>

        <div className="w-40">
          <Input
            type="date"
            value={orderFromDate}
            onChange={(e) => {
              setOrderFromDate(e.target.value);
              setOrderPage(1);
            }}
            title="Từ ngày"
          />
        </div>

        <div className="w-40">
          <Input
            type="date"
            value={orderToDate}
            onChange={(e) => {
              setOrderToDate(e.target.value);
              setOrderPage(1);
            }}
            title="Đến ngày"
          />
        </div>

        {(orderSearch || orderStatus !== 'ALL' || orderFromDate || orderToDate) && (
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

      {/* Bảng Dữ Liệu Đơn Hàng */}
      <div className="space-y-4">
        <PaymentOrderTable
          orders={orders}
          loading={isOrdersLoading}
          onViewDetail={handleViewDetail}
          onSync={handleSyncOrder}
          onCancel={(order) => {
            setOrderToCancel(order);
            setCancelOrderReason('Khách hàng yêu cầu hủy đơn');
          }}
          onCreateRefund={(order) => setOrderToRefund(order)}
          syncingId={syncingOrderId}
        />

        <Pagination
          page={orderPage}
          totalPages={totalOrderPages}
          totalItems={totalOrderItems}
          limit={orderLimit}
          onPageChange={setOrderPage}
          onLimitChange={(l) => {
            setOrderLimit(l);
            setOrderPage(1);
          }}
        />
      </div>

      {/* Drawer Xem Chi Tiết Đơn Hàng */}
      <PaymentDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        detail={paymentDetail}
        loading={isDetailLoading}
      />

      {/* Modal Tạo Yêu Cầu Hoàn Tiền */}
      <CreateRefundModal
        isOpen={Boolean(orderToRefund)}
        onClose={() => setOrderToRefund(null)}
        order={orderToRefund}
        onSubmit={handleCreateRefundSubmit}
        isLoading={isCreatingRefund}
      />

      {/* Dialog Hủy Đơn PENDING */}
      <ConfirmDialog
        isOpen={Boolean(orderToCancel)}
        onClose={() => setOrderToCancel(null)}
        onConfirm={handleConfirmCancelOrder}
        title="Xác nhận hủy đơn hàng"
        description={
          <div className="space-y-3">
            <p>
              Bạn có chắc chắn muốn hủy đơn hàng{' '}
              <b>#{orderToCancel?.transactionCode || orderToCancel?.id.slice(0, 8)}</b> không?
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Lý do hủy đơn:
              </label>
              <Input
                type="text"
                value={cancelOrderReason}
                onChange={(e) => setCancelOrderReason(e.target.value)}
                placeholder="Nhập lý do hủy đơn..."
              />
            </div>
          </div>
        }
        confirmText="Hủy đơn hàng"
        cancelText="Đóng"
        variant="danger"
        isLoading={isCancellingOrder}
      />
    </div>
  );
};
