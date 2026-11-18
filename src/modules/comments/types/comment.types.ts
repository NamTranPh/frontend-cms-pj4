export interface CommentAuthor {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface AdminCommentItem {
  id: string;
  content: string;
  movieId: string;
  episodeId?: string;
  parentId?: string;
  author: CommentAuthor;
  isApproved: boolean;
  likeCount: number;
  createdAt: string;
}

export interface CommentFilterParams {
  movieId?: string;
  isApproved?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
