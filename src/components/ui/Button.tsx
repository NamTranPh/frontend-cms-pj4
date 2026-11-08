import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'admin-blue';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ref,
  ...props
}) => {
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5',
    icon: 'p-2 rounded-xl shrink-0',
    'icon-sm': 'p-1.5 rounded-lg shrink-0',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    // 1. Nút Hành Động Nổi Bật (Primary):
    primary:
      'bg-[#002b80] hover:bg-[#00246b] text-white shadow-md hover:shadow-lg ' +
      'dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 dark:hover:from-cyan-400 dark:hover:to-blue-500 ' +
      'dark:text-slate-950 font-bold dark:shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-[0.98]',

    // 2. Nút Quản Trị Công Nghệ (Admin Blue):
    'admin-blue':
      'bg-[#002b80] hover:bg-[#00246b] text-white font-semibold shadow-md hover:shadow-lg ' +
      'dark:bg-[#002b80] dark:hover:bg-[#00246b] dark:text-white dark:border dark:border-cyan-500/30 ' +
      'dark:shadow-[0_0_12px_rgba(6,182,212,0.25)] active:scale-[0.98]',

    // 3. Nút Thứ Cấp / Hủy Bỏ (Secondary - Thay thế hoàn toàn màu đen đặc cũ):
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-sm ' +
      'dark:bg-slate-800/80 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700/80 active:scale-[0.98]',

    // 4. Nút Viền (Outline):
    outline:
      'bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-300 ' +
      'dark:hover:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/40 dark:hover:border-cyan-400',

    // 5. Nút Trong Suốt (Ghost):
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 ' +
      'dark:hover:bg-slate-800/60 dark:text-slate-300 dark:hover:text-white',

    // 6. Nút Nguy Hiểm / Xóa / Khóa (Danger):
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 shadow-sm ' +
      'dark:bg-rose-500/15 dark:hover:bg-rose-500/25 dark:text-rose-400 dark:border-rose-500/40 ' +
      'dark:shadow-[0_0_12px_rgba(244,63,94,0.2)] active:scale-[0.98]',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
