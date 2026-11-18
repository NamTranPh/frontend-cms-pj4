import React, { useState, useRef, useEffect } from 'react';
import { Tag, Search, Check, X, ChevronDown } from 'lucide-react';
import type { GenreItem } from '../../genres/types/genre.types';
import { IconRenderer } from '../../genres/components/IconRenderer';

interface GenreMultiSelectProps {
  genres: GenreItem[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  error?: string;
}

export const GenreMultiSelect: React.FC<GenreMultiSelectProps> = ({
  genres,
  selectedIds,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredGenres = genres.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  const toggleGenre = (genreId: string) => {
    if (selectedIds.includes(genreId)) {
      onChange(selectedIds.filter((id) => id !== genreId));
    } else {
      onChange([...selectedIds, genreId]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedGenreItems = genres.filter((g) => selectedIds.includes(g.id));

  return (
    <div ref={containerRef} className="relative w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          Thể loại phim <span className="text-rose-500">*</span>
        </label>
        {selectedIds.length > 0 && (
          <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400">
            Đã chọn: {selectedIds.length} thể loại
          </span>
        )}
      </div>

      {/* Nút bấm kích hoạt mở Dropdown */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[42px] px-3 py-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
          error
            ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-500/5'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <Tag className="w-4 h-4 text-slate-400 shrink-0" />
          {selectedGenreItems.length === 0 ? (
            <span className="text-sm text-slate-400">
              Nhấn để chọn thể loại phim...
            </span>
          ) : (
            <div className="flex flex-wrap gap-1.5 py-0.5">
              {selectedGenreItems.map((g) => (
                <span
                  key={g.id}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#002b80]/10 dark:bg-cyan-500/15 text-[#002b80] dark:text-cyan-300 border border-[#002b80]/20 dark:border-cyan-500/30"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGenre(g.id);
                  }}
                >
                  <IconRenderer
                    icon={g.icon}
                    size={12}
                    className="w-3 h-3 shrink-0"
                  />
                  <span>{g.name}</span>
                  <X className="w-3 h-3 hover:text-rose-500 transition-colors ml-0.5" />
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {error && (
        <p className="text-xs text-rose-500 mt-1">{error}</p>
      )}

      {/* Popover Dropdown tìm kiếm & cuộn chọn */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 rounded-xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Ô Tìm Kiếm Nhanh */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                placeholder="Tìm kiếm thể loại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Danh sách cuộn thể loại */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
            {filteredGenres.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                Không tìm thấy thể loại phù hợp
              </div>
            ) : (
              filteredGenres.map((genre) => {
                const isSelected = selectedIds.includes(genre.id);
                return (
                  <div
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/10 dark:bg-cyan-500/20 text-[#002b80] dark:text-cyan-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#002b80] dark:bg-cyan-500 border-[#002b80] dark:border-cyan-500 text-white dark:text-slate-950'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <IconRenderer
                        icon={genre.icon}
                        size={14}
                        className="w-3.5 h-3.5 text-slate-400 shrink-0"
                      />
                      <span>{genre.name}</span>
                    </div>

                    {genre.slug && (
                      <span className="text-[11px] font-mono text-slate-400">
                        {genre.slug}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Popover: Bỏ chọn & Đóng */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs bg-slate-50/50 dark:bg-slate-900/50">
            <button
              type="button"
              onClick={handleClearAll}
              disabled={selectedIds.length === 0}
              className="text-slate-500 hover:text-rose-500 disabled:opacity-40 disabled:hover:text-slate-500 transition-colors font-medium px-2 py-1"
            >
              Bỏ chọn tất cả
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 font-medium transition-colors"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
