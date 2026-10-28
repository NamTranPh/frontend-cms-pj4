export interface MembershipPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  durationDays: number;
  maxDevices?: number;
  canDownload?: boolean;
  videoQuality?: string;
  description?: string;
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

export type UpdatePlanRequest = Partial<CreatePlanRequest>;

export interface PlanFilterParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
