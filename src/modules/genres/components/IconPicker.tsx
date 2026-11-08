import React, { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { Search, Sparkles, Code2, Check } from 'lucide-react';
import { IconRenderer } from './IconRenderer';

// Danh sách các icon Lucide chọn lọc cho điện ảnh & giải trí
export const POPULAR_MOVIE_ICONS: { name: string; label: string; category: string }[] = [
  // Điện ảnh & Chiếu rạp
  { name: 'Film', label: 'Phim ảnh', category: 'Điện ảnh' },
  { name: 'Clapperboard', label: 'Bảng quay phim', category: 'Điện ảnh' },
  { name: 'Tv', label: 'Truyền hình', category: 'Điện ảnh' },
  { name: 'Video', label: 'Video', category: 'Điện ảnh' },
  { name: 'Ticket', label: 'Vé xem phim', category: 'Điện ảnh' },
  { name: 'Popcorn', label: 'Bắp rang bơ', category: 'Điện ảnh' },
  { name: 'Camera', label: 'Máy quay', category: 'Điện ảnh' },

  // Hành động & Phiêu lưu
  { name: 'Swords', label: 'Hành động / Kiếm hiệp', category: 'Hành động' },
  { name: 'Flame', label: 'Kịch tính / Cháy nổ', category: 'Hành động' },
  { name: 'Zap', label: 'Siêu anh hùng / Sấm sét', category: 'Hành động' },
  { name: 'Shield', label: 'Chiến tranh / Bảo vệ', category: 'Hành động' },
  { name: 'Crosshair', label: 'Bắn súng / Điệp viên', category: 'Hành động' },
  { name: 'Compass', label: 'Phiêu lưu / Thám hiểm', category: 'Hành động' },
  { name: 'Target', label: 'Mục tiêu', category: 'Hành động' },

  // Kinh dị & Giật gân
  { name: 'Ghost', label: 'Kinh dị / Ma quái', category: 'Kinh dị' },
  { name: 'Skull', label: 'Tử thần / Zombie', category: 'Kinh dị' },
  { name: 'Eye', label: 'Giật gân / Bí ẩn', category: 'Kinh dị' },
  { name: 'Moon', label: 'Đêm đen / Huyền bí', category: 'Kinh dị' },
  { name: 'AlertTriangle', label: 'Cảnh báo thảm họa', category: 'Kinh dị' },

  // Tình cảm & Gia đình & Hài
  { name: 'Heart', label: 'Lãng mạn / Tình cảm', category: 'Tình cảm' },
  { name: 'Smile', label: 'Hài hước / Vui nhộn', category: 'Hài kịch' },
  { name: 'Laugh', label: 'Hài hước sảng khoái', category: 'Hài kịch' },
  { name: 'Users', label: 'Gia đình / Học đường', category: 'Tình cảm' },
  { name: 'Sparkles', label: 'Phép thuật / Kỳ ảo', category: 'Viễn tưởng' },

  // Viễn tưởng & Hoạt hình
  { name: 'Rocket', label: 'Khoa học viễn tưởng', category: 'Viễn tưởng' },
  { name: 'Bot', label: 'Robot / AI công nghệ', category: 'Viễn tưởng' },
  { name: 'Crown', label: 'Cổ trang / Hoàng gia', category: 'Viễn tưởng' },
  { name: 'Wand2', label: 'Phù thủy / Ma thuật', category: 'Viễn tưởng' },
  { name: 'Gamepad2', label: 'Hoạt hình / Anime / Game', category: 'Hoạt hình' },
  { name: 'Cat', label: 'Hoạt hình thiếu nhi', category: 'Hoạt hình' },

  // Trinh thám & Âm nhạc & Lịch sử
  { name: 'Fingerprint', label: 'Trinh thám / Phá án', category: 'Trinh thám' },
  { name: 'Search', label: 'Tìm kiếm bí mật', category: 'Trinh thám' },
  { name: 'Music', label: 'Ca nhạc / Nhạc kịch', category: 'Nghệ thuật' },
  { name: 'Headphones', label: 'Âm thanh', category: 'Nghệ thuật' },
  { name: 'BookOpen', label: 'Tài liệu / Lịch sử', category: 'Tài liệu' },
  { name: 'Hourglass', label: 'Du hành thời gian', category: 'Tài liệu' },
  { name: 'Trophy', label: 'Thể thao / Vinh quang', category: 'Khác' },
];

// Danh sách FontAwesome class mẫu phổ biến cho phim
const POPULAR_FONTAWESOME_ICONS = [
  { className: 'fa-solid fa-film', label: 'fa-film' },
  { className: 'fa-solid fa-video', label: 'fa-video' },
  { className: 'fa-solid fa-masks-theater', label: 'fa-masks-theater' },
  { className: 'fa-solid fa-ghost', label: 'fa-ghost' },
  { className: 'fa-solid fa-heart', label: 'fa-heart' },
  { className: 'fa-solid fa-fire', label: 'fa-fire' },
  { className: 'fa-solid fa-gun', label: 'fa-gun' },
  { className: 'fa-solid fa-rocket', label: 'fa-rocket' },
  { className: 'fa-solid fa-hat-wizard', label: 'fa-hat-wizard' },
  { className: 'fa-solid fa-skull-crossbones', label: 'fa-skull-crossbones' },
  { className: 'fa-solid fa-music', label: 'fa-music' },
  { className: 'fa-solid fa-trophy', label: 'fa-trophy' },
];

interface IconPickerProps {
  value?: string | null;
  onChange: (iconName: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState<'lucide' | 'fontawesome'>(
    value && (value.startsWith('fa-') || value.startsWith('fas ') || value.startsWith('fa-solid'))
      ? 'fontawesome'
      : 'lucide',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [customFaClass, setCustomFaClass] = useState(
    value && (value.startsWith('fa-') || value.startsWith('fa-solid')) ? value : '',
  );

  // Lọc icon Lucide theo từ khóa
  const filteredLucideIcons = useMemo(() => {
    if (!searchTerm.trim()) return POPULAR_MOVIE_ICONS;
    const term = searchTerm.toLowerCase();
    return POPULAR_MOVIE_ICONS.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.label.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const handleSelectLucide = (name: string) => {
    onChange(name);
  };

  const handleSelectFontAwesome = (className: string) => {
    setCustomFaClass(className);
    onChange(className);
  };

  const handleCustomFaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomFaClass(val);
    onChange(val);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c2e] p-4 space-y-4">
      {/* Xem trước icon đã chọn */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#002b80]/10 dark:bg-cyan-500/15 border border-[#002b80]/20 dark:border-cyan-500/30 flex items-center justify-center text-[#002b80] dark:text-cyan-400">
            <IconRenderer icon={value} size={22} />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Icon đang chọn:
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-mono">
              {value || '(Chưa chọn icon)'}
            </div>
          </div>
        </div>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium px-2.5 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            Xóa icon
          </button>
        )}
      </div>

      {/* Tab chuyển đổi thư viện */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('lucide')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'lucide'
              ? 'bg-[#002b80] dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles size={14} />
          Thư viện Lucide Icon (Khuyên dùng)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fontawesome')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'fontawesome'
              ? 'bg-[#002b80] dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Code2 size={14} />
          FontAwesome / Class tùy chỉnh
        </button>
      </div>

      {/* Nội dung Tab Lucide */}
      {activeTab === 'lucide' && (
        <div className="space-y-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Tìm theo tên icon hoặc thể loại (vd: Kinh dị, Hài, Swords, Film)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#002b80] dark:focus:border-cyan-400 transition-colors"
            />
          </div>

          <div className="max-h-56 overflow-y-auto pr-1 grid grid-cols-4 sm:grid-cols-6 gap-2">
            {filteredLucideIcons.map((item) => {
              const isSelected = value === item.name;
              const iconsRecord = LucideIcons as unknown as Record<
                string,
                React.ComponentType<{ className?: string; size?: number | string }>
              >;
              const IconComp = iconsRecord[item.name] || LucideIcons.Film;

              return (
                <button
                  key={item.name}
                  type="button"
                  title={`${item.name} (${item.label})`}
                  onClick={() => handleSelectLucide(item.name)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                    isSelected
                      ? 'border-[#002b80] dark:border-cyan-400 bg-[#002b80]/10 dark:bg-cyan-500/15 text-[#002b80] dark:text-cyan-400 shadow-sm ring-1 ring-[#002b80] dark:ring-cyan-400'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <IconComp size={20} className="mb-1" />
                  <span className="text-[10px] font-medium truncate w-full">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredLucideIcons.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-400">
              Không tìm thấy icon nào khớp với "{searchTerm}".
            </div>
          )}
        </div>
      )}

      {/* Nội dung Tab FontAwesome */}
      {activeTab === 'fontawesome' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Nhập mã class FontAwesome (ví dụ: <code className="text-cyan-500">fa-solid fa-ghost</code>)
            </label>
            <input
              type="text"
              placeholder="fa-solid fa-..."
              value={customFaClass}
              onChange={handleCustomFaChange}
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#002b80] dark:focus:border-cyan-400 transition-colors"
            />
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              Hoặc chọn nhanh các class mẫu:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_FONTAWESOME_ICONS.map((fa) => {
                const isSelected = value === fa.className;
                return (
                  <button
                    key={fa.className}
                    type="button"
                    onClick={() => handleSelectFontAwesome(fa.className)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition-all text-xs font-mono ${
                      isSelected
                        ? 'border-[#002b80] dark:border-cyan-400 bg-[#002b80]/10 dark:bg-cyan-500/15 text-[#002b80] dark:text-cyan-400 ring-1 ring-[#002b80] dark:ring-cyan-400'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <IconRenderer icon={fa.className} size={16} />
                    <span className="truncate flex-1">{fa.label}</span>
                    {isSelected && <Check size={14} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
