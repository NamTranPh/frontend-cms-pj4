import { fetchClient } from '../../../api/fetchClient';
import type { PageResult } from '../../../types/common.types';
import type { AdminCommentItem, CommentFilterParams } from '../types/comment.types';

/**
 * Service kết nối API Quản trị Bình luận (AdminCommentController)
 *
 * Endpoints thực tế:
 * 1. Danh sách bình luận: GET /api/v1/admin/comments?movieId=&isApproved=&search=&page=&limit=
 * 2. Ẩn / Hiện bình luận: PATCH /api/v1/admin/comments/{commentId}/approval
 */
export const adminCommentService = {
  // Lấy danh sách bình luận (có thể lọc theo movieId, trạng thái duyệt, từ khóa)
  getComments: (params?: CommentFilterParams) => {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.movieId) query.append('movieId', params.movieId);
    if (params?.isApproved !== undefined) query.append('isApproved', String(params.isApproved));
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString();
    return fetchClient<PageResult<AdminCommentItem>>(
      `/admin/comments${queryString ? `?${queryString}` : ''}`
    );
  },

  // Ẩn hoặc Hiện bình luận (ẩn bình luận sẽ ẩn luôn cả nhánh trả lời bên dưới)
  setApproval: (commentId: string, isApproved: boolean) =>
    fetchClient<void>(`/admin/comments/${commentId}/approval`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved }),
    }),
};
