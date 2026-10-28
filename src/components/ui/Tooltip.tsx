import React, { useState } from 'react';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'right' | 'top' | 'bottom' | 'left';
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'right',
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled) {
    return <>{children}</>;
  }

  const positionStyles = {
    right: 'left-full top-1/2 -translate-y-1/2 ml-3',
    left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  }[position];

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 whitespace-nowrap rounded-lg bg-slate-900 text-slate-100 border border-slate-700/80 px-2.5 py-1 text-xs font-medium shadow-xl pointer-events-none transition-opacity duration-150 animate-in fade-in zoom-in-95 ${positionStyles}`}
        >
          {content}
          {/* Mũi tên nhỏ chỉ vào icon */}
          {position === 'right' && (
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
          )}
        </div>
      )}
    </div>
  );
};
