export interface ActorItem {
  id: string;
  name: string;
  originalName?: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: string;
  nationality?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateActorRequest {
  name: string;
  originalName?: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: string;
  nationality?: string;
}

export interface UpdateActorRequest {
  name?: string;
  originalName?: string;
  avatarUrl?: string;
  bio?: string;
  birthDate?: string;
  nationality?: string;
}

export interface ActorFilterParams {
  search?: string;
  nationality?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ActorAvatarUploadResponse {
  previewUrl: string;
  objectKey: string;
}
