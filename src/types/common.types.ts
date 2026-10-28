export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  code: string;
  message: string;
  data: T;
  pagination?: PaginationMeta | null;
  errors?: Record<string, string[]> | null;
  timestamp: string;
}

export interface PageResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  size: number;
  totalPages: number;
}
