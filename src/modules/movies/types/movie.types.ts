import type { GenreItem } from '../../genres/types/genre.types';

export type MovieType = 'SINGLE' | 'SERIES';

export type VideoStatus =
  | 'DRAFT'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'READY'
  | 'FAILED'
  | 'ARCHIVED';

export type VideoVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';

export type AgeRating = 'P' | 'K' | 'T13' | 'T16' | 'T18' | 'C';

export type VideoQuality = 'SD' | 'HD_720P' | 'FHD_1080P' | 'QHD_2K' | 'UHD_4K';

export type AudioTrackType = 'ORIGINAL' | 'DUBBED' | 'SUBTITLED' | 'VOICEOVER';

export interface MovieActorAssignment {
  actorId: string;
  characterName?: string;
  orderIndex?: number;
}

export interface MovieActorResult {
  actorId: string;
  name?: string;
  actorName?: string;
  originalName?: string;
  avatarUrl?: string;
  actorAvatarUrl?: string;
  nationality?: string;
  characterName?: string;
  orderIndex: number;
}

export interface MovieItem {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  description?: string;
  releaseYear?: number;
  duration?: number; // Chỉ có ở phim lẻ SINGLE
  director?: string;
  country?: string;
  language?: string;
  trailerUrl?: string;
  posterUrl?: string;
  backdropUrl?: string;
  movieType: MovieType;
  totalEpisodes?: number; // Chỉ có ở phim bộ SERIES
  status: VideoStatus;
  visibility: VideoVisibility;
  isPremium?: boolean;
  isFeatured?: boolean;
  ageRating?: AgeRating;
  videoQualities?: VideoQuality[];
  audioTracks?: AudioTrackType[];
  rating?: number;
  ratingCount?: number;
  commentCount?: number;
  viewCount?: number;
  genres?: GenreItem[];
  movieActors?: MovieActorResult[];
  deletedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMovieRequest {
  title: string;
  originalTitle?: string;
  description?: string;
  releaseYear?: number;
  duration?: number;
  director?: string;
  movieActors?: MovieActorAssignment[];
  country?: string;
  language?: string;
  trailerUrl?: string;
  posterUrl?: string;
  backdropUrl?: string;
  movieType: MovieType;
  totalEpisodes?: number;
  ageRating?: AgeRating;
  videoQualities?: VideoQuality[];
  audioTracks?: AudioTrackType[];
  genreIds?: string[];
}

export interface UpdateMovieRequest {
  title?: string;
  originalTitle?: string;
  description?: string;
  releaseYear?: number;
  duration?: number;
  director?: string;
  movieActors?: MovieActorAssignment[];
  country?: string;
  language?: string;
  trailerUrl?: string;
  posterUrl?: string;
  backdropUrl?: string;
  movieType?: MovieType;
  totalEpisodes?: number;
  ageRating?: AgeRating;
  videoQualities?: VideoQuality[];
  audioTracks?: AudioTrackType[];
  isFeatured?: boolean;
  isPremium?: boolean;
  status?: VideoStatus;
  visibility?: VideoVisibility;
  genreIds?: string[];
}

export interface MovieFilterParams {
  search?: string;
  type?: MovieType | 'ALL';
  status?: VideoStatus | 'ALL';
  genreId?: string | 'ALL';
  year?: number;
  country?: string;
  ageRating?: AgeRating | 'ALL';
  quality?: VideoQuality | 'ALL';
  audioTrack?: AudioTrackType | 'ALL';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface MediaUploadResponse {
  previewUrl: string;
  objectKey: string;
  mediaType?: string;
  originalFileName?: string;
  url?: string;
  size?: number;
  contentType?: string;
}
