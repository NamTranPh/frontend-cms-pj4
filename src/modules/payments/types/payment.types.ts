export type PaymentOrderStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export type RefundStatus =
  | 'REQUESTED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export interface PaymentOrder {
  id: string;
  planName: string;
  price: number;
  status: PaymentOrderStatus;
  transactionCode: string;
  checkoutUrl?: string;
  gateway?: string;
  durationDays?: number;
  failureReason?: string;
  requestedAt?: string;
  completedAt?: string;
  failedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  refundedAmount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface UserSnapshot {
  id: string;
  email: string;
  name: string;
  profileUrl?: string;
}

export interface PlanSnapshot {
  id: string;
  name: string;
  durationDays: number;
  price: number;
}

export interface PaymentRefund {
  id: string;
  paymentOrderId: string;
  userId: string;
  amount: number;
  status: RefundStatus;
  reason?: string;
  adminNote?: string;
  refundTransactionCode?: string;
  processedBy?: string;
  requestedAt?: string;
  processedAt?: string;
  createdAt: string;
}

export interface AdminPaymentDetail {
  id: string;
  user?: UserSnapshot;
  plan?: PlanSnapshot;
  price: number;
  durationDays?: number;
  gateway?: string;
  status: PaymentOrderStatus;
  transactionCode: string;
  gatewayTransactionId?: string;
  checkoutUrl?: string;
  failureReason?: string;
  metadata?: string;
  requestedAt?: string;
  completedAt?: string;
  failedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  refundedAmount?: number;
  createdAt: string;
  updatedAt?: string;
  refundHistory?: PaymentRefund[];
}

export interface PlanRevenueItem {
  planId: string;
  planName: string;
  revenue: number;
  orderCount: number;
}

export interface AdminPaymentStatistics {
  grossRevenue: number;
  totalRefunded: number;
  netRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  failedOrders: number;
  refundedOrders: number;
  successRate: number;
  revenueByPlan: PlanRevenueItem[];
}

export interface PaymentFilterParams {
  search?: string;
  status?: PaymentOrderStatus | 'ALL';
  gateway?: string;
  planId?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface RefundFilterParams {
  search?: string;
  status?: RefundStatus | 'ALL';
  paymentOrderId?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface CreateRefundRequest {
  paymentOrderId: string;
  amount: number;
  reason: string;
}

export interface ProcessRefundRequest {
  refundTransactionCode: string;
  adminNote?: string;
}

export interface AdminCancelPaymentRequest {
  reason: string;
}

export interface AdminCancelRefundRequest {
  adminNote?: string;
}
