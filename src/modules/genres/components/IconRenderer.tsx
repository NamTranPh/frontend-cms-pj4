import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconRendererProps {
  icon?: string | null;
  className?: string;
  size?: number | string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  className = 'w-5 h-5',
  size = 20,
}) => {
  if (!icon || !icon.trim()) {
    const Fallback = LucideIcons.Film;
    return <Fallback className={className} size={size} />;
  }

  const trimmed = icon.trim();

  // Kiểm tra nếu là class FontAwesome
  if (
    trimmed.startsWith('fa-') ||
    trimmed.startsWith('fas ') ||
    trimmed.startsWith('far ') ||
    trimmed.startsWith('fab ') ||
    trimmed.startsWith('fa-solid') ||
    trimmed.startsWith('fa-regular')
  ) {
    return (
      <i
        className={`${trimmed} ${className} inline-flex items-center justify-center`}
        style={typeof size === 'number' ? { fontSize: `${size}px` } : undefined}
      />
    );
  }

  // Tra cứu theo Lucide Icons
  const iconsRecord = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string; size?: number | string }>
  >;

  // Tìm icon theo tên gốc hoặc PascalCase
  const IconComponent = iconsRecord[trimmed];

  if (IconComponent && typeof IconComponent === 'object') {
    const Component = IconComponent as React.ComponentType<{
      className?: string;
      size?: number | string;
    }>;
    return <Component className={className} size={size} />;
  }

  // Fallback mặc định nếu tên icon không hợp lệ
  const Fallback = LucideIcons.Film;
  return <Fallback className={className} size={size} />;
};
