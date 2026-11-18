import React from 'react';
import {
  Play,
  UploadCloud,
  Pencil,
  Trash2,
  Video,
  Clock,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Table } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Tooltip } from '../../../components/ui/Tooltip';
import type { Episode } from '../types/episode.types';

export interface EpisodeTableProps {
  episodes: Episode[];
  isLoading: boolean;
  onUploadVideo: (episode: Episode) => void;
  onPreview: (episode: Episode) => void;
  onEdit: (episode: Episode) => void;
  onDelete: (episode: Episode) => void;
  onPublish: (episode: Episode) => void;
}

export const EpisodeTable: React.FC<EpisodeTableProps> = ({
  episodes,
  isLoading,
  onUploadVideo,
  onPreview,
  onEdit,
  onDelete,
  onPublish,
}) => {
  if (isLoading) {
    return (
      <Table>
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase w-28">Thumbnail</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase w-16">Tập</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Thông tin tập</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Thời lượng</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái Video</th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {Array.from({ length: 4 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="py-3 px-4"><Skeleton className="w-24 h-14 rounded-lg" /></td>
              <td className="py-3 px-4"><Skeleton className="w-8 h-5 rounded-full" /></td>
              <td className="py-3 px-4 space-y-1.5"><Skeleton className="w-40 h-4" /><Skeleton className="w-28 h-3" /></td>
              <td className="py-3 px-4"><Skeleton className="w-16 h-4" /></td>
              <td className="py-3 px-4"><Skeleton className="w-20 h-5 rounded-full" /></td>
              <td className="py-3 px-4 text-right"><Skeleton className="w-24 h-8 ml-auto rounded-lg" /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#131c2e] rounded-2xl border border-slate-200 dark:border-slate-800">
        <Video size={36} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Chưa có tập phim nào</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Bộ phim này chưa có tập nào được tạo. Hãy bấm nút "Thêm tập mới" để bắt đầu đăng các tập phim.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <th className="py-3 px-4 text-left w-28">Thumbnail</th>
          <th className="py-3 px-4 text-center w-16">Tập</th>
          <th className="py-3 px-4 text-left">Thông tin tập</th>
          <th className="py-3 px-4 text-left">Thời lượng</th>
          <th className="py-3 px-4 text-left">Trạng thái Video</th>
          <th className="py-3 px-4 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
        {episodes.map((ep) => {
          const isReady = ep.status === 'READY';
          const isProcessing = ep.status === 'PROCESSING';
          const isFailed = ep.status === 'FAILED';

          return (
            <tr
              key={ep.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              {/* Thumbnail 16:9 */}
              <td className="py-3 px-4">
                <div className="w-24 h-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                  {ep.thumbnailUrl ? (
                    <img src={ep.thumbnailUrl} alt={ep.title} className="w-full h-full object-cover" />
                  ) : (
                    <Video size={18} className="text-slate-400" />
                  )}
                </div>
              </td>

              {/* Số thứ tự tập */}
              <td className="py-3 px-4 text-center">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  {ep.episodeNumber}
                </span>
              </td>

              {/* Thông tin tập */}
              <td className="py-3 px-4">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block">
                    {ep.title}
                  </span>
                  {ep.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {ep.description}
                    </p>
                  )}
                  {ep.airDate && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-0.5">
                      <Calendar size={11} /> Chiếu ngày: {ep.airDate.slice(0, 10)}
                    </div>
                  )}
                </div>
              </td>

              {/* Thời lượng */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <Clock size={12} className="text-slate-400" />
                  <span>{ep.duration || 45} phút</span>
                </div>
              </td>

              {/* Trạng thái Video */}
              <td className="py-3 px-4">
                {isReady && (
                  <Badge variant="success" dot size="sm">
                    Sẵn sàng phát
                  </Badge>
                )}
                {isProcessing && (
                  <Badge variant="warning" size="sm" className="flex items-center gap-1">
                    <Loader2 size={11} className="animate-spin" /> Đang transcode
                  </Badge>
                )}
                {isFailed && (
                  <Badge variant="danger" size="sm" className="flex items-center gap-1">
                    <AlertCircle size={11} /> Lỗi xử lý
                  </Badge>
                )}
                {!isReady && !isProcessing && !isFailed && (
                  <Badge variant="default" size="sm">
                    {ep.status || 'Chưa có video'}
                  </Badge>
                )}
              </td>

              {/* Cụm Thao tác */}
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  {/* Xem trước HLS Player nếu đã READY */}
                  {isReady && (
                    <Tooltip content="Xem trước video tập này">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onPreview(ep)}
                        className="text-cyan-500 hover:text-cyan-600"
                      >
                        <Play size={15} />
                      </Button>
                    </Tooltip>
                  )}

                  {/* Upload Video cho tập */}
                  <Tooltip content="Tải lên hoặc thay thế video cho tập này">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onUploadVideo(ep)}
                      className="text-purple-500 hover:text-purple-600"
                    >
                      <UploadCloud size={15} />
                    </Button>
                  </Tooltip>

                  {/* Xuất bản */}
                  {ep.status === 'DRAFT' && (
                    <Tooltip content="Xuất bản tập phim">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onPublish(ep)}
                        className="text-emerald-500 hover:text-emerald-600"
                      >
                        <CheckCircle2 size={15} />
                      </Button>
                    </Tooltip>
                  )}

                  {/* Sửa tập */}
                  <Tooltip content="Sửa thông tin tập">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(ep)}
                    >
                      <Pencil size={15} />
                    </Button>
                  </Tooltip>

                  {/* Xóa tập */}
                  <Tooltip content="Xóa tập phim">
                    <Button
                      type="button"
                      variant="danger"
                      size="icon-sm"
                      onClick={() => onDelete(ep)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </Tooltip>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};
