import { fetchClient } from "../../../api/fetchClient";
import type {
  PaymentTransaction,
  PaymentFilterParams,
} from "../types/payment.types";
import type { PageResult } from "../../../types/common.types";

export const adminPaymentService = {
  // Lấy lịch sử giao dịch (dự kiến backend sẽ bổ sung endpoint admin hoặc dùng tạm query my-orders)
  getTransactions: (params?: PaymentFilterParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);
    const queryString = query.toString();
    return fetchClient<PageResult<PaymentTransaction>>(
      `/payments/my-orders${queryString ? `?${queryString}` : ""}`,
    );
  },

  // Chi tiết giao dịch theo mã giao dịch
  getTransactionByCode: (transactionCode: string) =>
    fetchClient<PaymentTransaction>(`/payments/${transactionCode}/status`),
};
