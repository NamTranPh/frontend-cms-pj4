import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  FastForward,
  Rewind,
  Settings,
  Sparkles,
} from 'lucide-react';
import type { VideoPreviewTarget } from '../types/preview.types';
import { Button } from '../../../components/ui/Button';

export interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: VideoPreviewTarget | null;
  onPublishToggle?: () => void;
  isPublished?: boolean;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  isOpen,
  onClose,
  target,
  onPublishToggle,
  isPublished,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [qualities, setQualities] = useState<string[]>([]);
  const [currentQualityIndex, setCurrentQualityIndex] = useState<number>(-1); // -1 là Auto
  const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Khởi tạo luồng phát HLS khi mở Modal
  useEffect(() => {
    if (!isOpen || !target || !videoRef.current) return;

    setVideoError(null);
    const video = videoRef.current;
    let url = target.playbackUrl;

    // Đính kèm playbackToken nếu có
    if (target.playbackToken) {
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}token=${encodeURIComponent(target.playbackToken)}`;
    }

    if (Hls.isSupported() && url.includes('.m3u8')) {
      const hls = new Hls({
        capLevelToPlayerSize: true,
        autoStartLoad: true,
      });
      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const qualityLabels = data.levels.map((level) => `${level.height}p`);
        setQualities(qualityLabels);
        video.play().catch(() => {
          // Trình duyệt có thể chặn autoplay
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setVideoError('Lỗi mạng khi tải luồng HLS m3u8');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setVideoError('Lỗi giải mã luồng video HLS');
              hls.recoverMediaError();
              break;
            default:
              setVideoError('Không thể phát video này');
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari Native HLS
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => setIsPlaying(false));
      });
    } else {
      // Fallback MP4 bình thường
      video.src = url;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.src = '';
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setQualities([]);
    };
  }, [isOpen, target]);

  // Điều khiển Play / Pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Tua nhanh / lùi 10 giây
  const handleSeekOffset = (offset: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + offset, duration));
  };

  // Thay đổi vị trí tua trên timeline
  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Thay đổi âm lượng
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  // Đổi chất lượng video (Quality Level)
  const handleChangeQuality = (index: number) => {
    if (!hlsRef.current) return;
    hlsRef.current.currentLevel = index;
    setCurrentQualityIndex(index);
    setIsQualityMenuOpen(false);
  };

  // Toàn màn hình
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (!isFinite(secs) || secs < 0) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#090d16] border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-[#131c2e]">
          <div className="min-w-0 pr-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2 truncate">
              <Play size={16} className="text-cyan-400 shrink-0 fill-cyan-400" />
              <span>{target.title}</span>
              {target.episodeNumber && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Tập {target.episodeNumber}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
              {target.playbackUrl}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Khung Video Player 16:9 */}
        <div ref={containerRef} className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={() => {
              if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) setDuration(videoRef.current.duration);
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Lỗi phát video nếu có */}
          {videoError && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4">
              <p className="text-sm font-semibold text-rose-400">{videoError}</p>
              <p className="text-xs text-slate-400 mt-1">
                Video có thể đang trong quá trình FFmpeg transcode hoặc chưa sẵn sàng phát.
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.load();
                    setVideoError(null);
                  }
                }}
                className="mt-3 flex items-center gap-1.5 text-xs text-cyan-400"
              >
                <RotateCcw size={13} /> Thử tải lại
              </Button>
            </div>
          )}

          {/* Nút Play lớn giữa màn hình khi tạm dừng */}
          {!isPlaying && !videoError && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute w-16 h-16 rounded-full bg-cyan-500/80 hover:bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
            >
              <Play size={28} className="ml-1 fill-current" />
            </button>
          )}

          {/* Thanh điều khiển Video (Controls Bar) */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-6 flex flex-col gap-2 transition-opacity duration-200">
            {/* Timeline tua video */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleTimelineChange}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2 transition-all"
            />

            {/* Hàng nút bấm */}
            <div className="flex items-center justify-between text-slate-200 text-xs">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Play / Pause */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1 hover:text-cyan-400 transition-colors"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                {/* Tua lùi 10s */}
                <button
                  type="button"
                  onClick={() => handleSeekOffset(-10)}
                  className="p-1 hover:text-cyan-400 transition-colors"
                  title="Lùi 10 giây"
                >
                  <Rewind size={16} />
                </button>

                {/* Tua tới 10s */}
                <button
                  type="button"
                  onClick={() => handleSeekOffset(10)}
                  className="p-1 hover:text-cyan-400 transition-colors"
                  title="Tua 10 giây"
                >
                  <FastForward size={16} />
                </button>

                {/* Âm lượng */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1 hover:text-cyan-400 transition-colors"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-14 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Thời lượng */}
                <span className="font-mono text-[11px] text-slate-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 relative">
                {/* Menu chọn độ phân giải HLS */}
                {qualities.length > 0 && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsQualityMenuOpen(!isQualityMenuOpen)}
                      className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-400 font-mono text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Settings size={12} />
                      {currentQualityIndex === -1 ? 'Auto' : qualities[currentQualityIndex]}
                    </button>

                    {isQualityMenuOpen && (
                      <div className="absolute bottom-8 right-0 bg-[#131c2e] border border-slate-700 rounded-lg shadow-xl py-1 w-24 text-xs z-20">
                        <button
                          type="button"
                          onClick={() => handleChangeQuality(-1)}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 ${
                            currentQualityIndex === -1 ? 'text-cyan-400 font-bold' : 'text-slate-300'
                          }`}
                        >
                          Auto
                        </button>
                        {qualities.map((q, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleChangeQuality(idx)}
                            className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 ${
                              currentQualityIndex === idx ? 'text-cyan-400 font-bold' : 'text-slate-300'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Toàn màn hình */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1 hover:text-cyan-400 transition-colors"
                  title="Toàn màn hình"
                >
                  <Maximize size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Modal: Thông tin kiểm tra chất lượng & Xuất bản nhanh */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-[#131c2e] flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles size={14} className="text-cyan-400" />
            <span>Kiểm tra: Đồng bộ âm thanh, giật khung hình và các mức phân giải HLS</span>
          </div>

          <div className="flex items-center gap-2">
            {onPublishToggle && (
              <Button
                type="button"
                variant={isPublished ? 'ghost' : 'primary'}
                size="sm"
                onClick={onPublishToggle}
              >
                {isPublished ? 'Đang xuất bản' : 'Xuất bản phim'}
              </Button>
            )}
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
