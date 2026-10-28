export type VideoStatus =
  | "READY"
  | "PROCESSING"
  | "PENDING"
  | "DRAFT"
  | "FAILED"
  | "ARCHIVED";

export interface Episode {
  id: string;
  movieId: string;
  episodeNumber: number;
  title: string;
  description?: string;
  duration?: number;
  status: VideoStatus;
  thumbnailUrl?: string;
  rawFileKey?: string;
  masterPlaylistKey?: string;
  airDate?: string;
  viewCount?: number;
  createdAt: string;
}

export interface EpisodeFilterParams {
  movieId: string;
  search?: string;
  page?: number;
  limit?: number;
}
