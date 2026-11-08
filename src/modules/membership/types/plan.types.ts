export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  durationDays: number;
  maxDevices?: number | null;
  canDownload?: boolean | null;
  videoQuality?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanRequest {
  name: string;
  price: number;
  durationDays: number;
  maxDevices?: number;
  canDownload?: boolean;
  videoQuality?: string;
  description?: string;
}

export interface UpdatePlanRequest extends Partial<CreatePlanRequest> {
  isActive?: boolean;
}

export interface PlanFilterParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
