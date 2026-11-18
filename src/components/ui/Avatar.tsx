import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarShape = 'circle' | 'rounded' | 'square';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  alt?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

const sizeClasses: Record<AvatarSize, { container: string; iconSize: number; text: string }> = {
  xs: { container: 'w-6 h-6', iconSize: 12, text: 'text-[10px]' },
  sm: { container: 'w-8 h-8', iconSize: 14, text: 'text-xs' },
  md: { container: 'w-10 h-10', iconSize: 18, text: 'text-sm' },
  lg: { container: 'w-12 h-12', iconSize: 20, text: 'text-base' },
  xl: { container: 'w-16 h-16', iconSize: 26, text: 'text-lg' },
  '2xl': { container: 'w-20 h-20', iconSize: 32, text: 'text-xl' },
};

const shapeClasses: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-xl',
  square: 'rounded-lg',
};

/**
 * Lấy ký tự đại diện (Initials) từ tên người dùng hoặc diễn viên
 * Ví dụ: "Nguyễn Văn A" -> "A", "Tom Holland" -> "T"
 */
function getInitials(name?: string): string {
  if (!name || !name.trim()) return '';
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  // Lấy chữ cái đầu của từ đầu và từ cuối
  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${first}${last}`;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  alt,
  size = 'md',
  shape = 'circle',
  className = '',
  fallbackIcon,
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset lỗi khi src thay đổi
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const { container, iconSize, text } = sizeClasses[size];
  const shapeClass = shapeClasses[shape];
  const initials = getInitials(name);

  // Có URL hợp lệ và chưa bị lỗi tải ảnh
  const shouldShowImage = Boolean(src && src.trim() && !hasError);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none border border-slate-200 dark:border-slate-800 ${container} ${shapeClass} ${className}`}
      title={name || alt}
    >
      {shouldShowImage ? (
        <img
          src={src!}
          alt={alt || name || 'Avatar'}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-bold tracking-tight bg-gradient-to-tr from-cyan-500/15 to-blue-500/20 text-[#002b80] dark:text-cyan-400 ${text}`}
        >
          {initials ? (
            <span>{initials}</span>
          ) : fallbackIcon ? (
            fallbackIcon
          ) : (
            <User size={iconSize} className="text-slate-400 dark:text-slate-500" />
          )}
        </div>
      )}
    </div>
  );
};
