import { fetchClient } from '../../../api/fetchClient';
import type { MembershipPlan, CreatePlanRequest, UpdatePlanRequest, PlanFilterParams } from '../types/plan.types';
import type { PageResult } from '../../../types/common.types';

/**
 * Module Membership - Service quản trị Gói VIP
 * Khớp nối với Spring Boot AdminMembershipPlanController (/api/v1/admin/membership-plans)
 */
export const adminPlanService = {
  // Lấy danh sách gói VIP
  getPlans: (params?: PlanFilterParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);
    if (params?.isActive !== undefined) query.append('isActive', String(params.isActive));
    const queryString = query.toString();
    return fetchClient<PageResult<MembershipPlan>>(`/admin/membership-plans${queryString ? `?${queryString}` : ''}`);
  },

  // Chi tiết gói VIP
  getPlanById: (id: string) => fetchClient<MembershipPlan>(`/admin/membership-plans/${id}`),

  // Tạo mới gói VIP
  createPlan: (data: CreatePlanRequest) =>
    fetchClient<MembershipPlan>('/admin/membership-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Cập nhật gói VIP
  updatePlan: (id: string, data: UpdatePlanRequest) =>
    fetchClient<MembershipPlan>(`/admin/membership-plans/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Xóa gói VIP
  deletePlan: (id: string) =>
    fetchClient<{ message: string }>(`/admin/membership-plans/${id}`, {
      method: 'DELETE',
    }),
};
