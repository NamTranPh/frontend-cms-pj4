export interface PaymentTransaction {
  id: string;
  planName: string;
  price: number;
  status: string;
  transactionCode: string;
  checkoutUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentFilterParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
