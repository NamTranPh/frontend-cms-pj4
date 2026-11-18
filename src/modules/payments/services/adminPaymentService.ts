import { fetchClient } from '../../../api/fetchClient';
import type {
  PaymentOrder,
  AdminPaymentDetail,
  AdminPaymentStatistics,
  PaymentRefund,
  PaymentFilterParams,
  RefundFilterParams,
  CreateRefundRequest,
  ProcessRefundRequest,
} from '../types/payment.types';
import type { PageResult } from '../../../types/common.types';

export const adminPaymentService = {
  // Lấy danh sách đơn thanh toán (Phân trang + Lọc đa tiêu chí)
  getPayments: (params?: PaymentFilterParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.gateway) query.append('gateway', params.gateway);
    if (params?.planId) query.append('planId', params.planId);
    if (params?.userId) query.append('userId', params.userId);
    if (params?.fromDate) query.append('fromDate', params.fromDate);
    if (params?.toDate) query.append('toDate', params.toDate);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortDir) query.append('sortDir', params.sortDir);

    const queryString = query.toString();
    return fetchClient<PageResult<PaymentOrder>>(
      `/admin/payments${queryString ? `?${queryString}` : ''}`
    );
  },

  // Xem chi tiết đơn thanh toán (gồm User snapshot, Plan snapshot, Refund history 3NF)
  getPaymentDetail: (id: string) =>
    fetchClient<AdminPaymentDetail>(`/admin/payments/${id}`),

  // Đồng bộ thủ công trực tiếp từ PayOS (giải quyết trường hợp webhook chậm/lỡ)
  syncPaymentStatus: (id: string) =>
    fetchClient<PaymentOrder>(`/admin/payments/${id}/sync`, {
      method: 'POST',
    }),

  // Admin hủy đơn thanh toán PENDING treo kèm lý do
  cancelPendingPayment: (id: string, reason: string) =>
    fetchClient<PaymentOrder>(`/admin/payments/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Thống kê báo cáo doanh thu & tỷ lệ giao dịch
  getStatistics: (fromDate?: string, toDate?: string) => {
    const query = new URLSearchParams();
    if (fromDate) query.append('fromDate', fromDate);
    if (toDate) query.append('toDate', toDate);
    const queryString = query.toString();
    return fetchClient<AdminPaymentStatistics>(
      `/admin/payments/statistics${queryString ? `?${queryString}` : ''}`
    );
  },

  // Lấy danh sách phiếu hoàn tiền (Phân trang + Lọc đa tiêu chí)
  getRefunds: (params?: RefundFilterParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'ALL') query.append('status', params.status);
    if (params?.paymentOrderId) query.append('paymentOrderId', params.paymentOrderId);
    if (params?.userId) query.append('userId', params.userId);
    if (params?.fromDate) query.append('fromDate', params.fromDate);
    if (params?.toDate) query.append('toDate', params.toDate);
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortDir) query.append('sortDir', params.sortDir);

    const queryString = query.toString();
    return fetchClient<PageResult<PaymentRefund>>(
      `/admin/refunds${queryString ? `?${queryString}` : ''}`
    );
  },

  // Tạo phiếu yêu cầu hoàn tiền cho đơn thanh toán COMPLETED
  createRefundRequest: (data: CreateRefundRequest) =>
    fetchClient<PaymentRefund>('/admin/refunds/request', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Xác nhận xử lý hoàn tiền thành công (đã chuyển khoản, tự động trừ lùi ngày VIP)
  processRefund: (id: string, data: ProcessRefundRequest) =>
    fetchClient<PaymentRefund>(`/admin/refunds/${id}/process`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Hủy/từ chối phiếu hoàn tiền
  cancelRefund: (id: string, adminNote?: string) =>
    fetchClient<PaymentRefund>(`/admin/refunds/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ adminNote }),
    }),
};
