export type GenreStatus = 'ACTIVE' | 'INACTIVE';

export interface GenreItem {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  status: GenreStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGenreRequest {
  name: string;
  icon?: string;
  description?: string;
}

export interface UpdateGenreRequest {
  name?: string;
  icon?: string;
  description?: string;
  status?: GenreStatus;
}

export interface GenreFilterParams {
  search?: string;
  status?: GenreStatus | 'ALL';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
