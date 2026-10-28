export type MovieType = "SINGLE" | "SERIES";
export type VideoStatus =
  | "READY"
  | "PROCESSING"
  | "PENDING"
  | "DRAFT"
  | "FAILED"
  | "ARCHIVED";
export type VideoVisibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

export interface Movie {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  description?: string;
  releaseYear?: number;
  duration?: number;
  director?: string;
  country?: string;
  language?: string;
  trailerUrl?: string;
  posterUrl?: string;
  backdropUrl?: string;
  movieType: MovieType;
  totalEpisodes?: number;
  status: VideoStatus;
  visibility: VideoVisibility;
  isPremium?: boolean;
  isFeatured?: boolean;
  ageRating?: string;
  rating?: number;
  ratingCount?: number;
  commentCount?: number;
  viewCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MovieFilterParams {
  search?: string;
  movieType?: MovieType;
  status?: VideoStatus;
  genreId?: string;
  page?: number;
  limit?: number;
}
