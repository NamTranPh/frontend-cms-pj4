export interface VideoPreviewTarget {
  contentId: string;
  contentType: "movie" | "episode";
  title: string;
  episodeNumber?: number;
  playbackUrl: string;
  playbackToken?: string;
  resumePositionSeconds?: number;
}

export interface VideoPreviewState {
  isOpen: boolean;
  target: VideoPreviewTarget | null;
  isPlaying: boolean;
}
