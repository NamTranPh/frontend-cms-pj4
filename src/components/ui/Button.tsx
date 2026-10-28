import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'admin-blue';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  ref?: React.Ref<HTMLButtonElement>; // React 19 ref trực tiếp, không dùng forwardRef
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
  // Kích thước chuẩn
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5',
  }[size];

  // Các biến thể giao diện
  const variantStyles = {
    // Cyberpunk Cyan Gradient
    primary:
      'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-[0.98]',
    // Nút xanh đậm công nghệ quản trị
    'admin-blue':
      'bg-[#002b80] hover:bg-[#00246b] text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.98]',
    // Nền tối viền mờ
    secondary:
      'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600',
    // Viền phát sáng
    outline:
      'bg-transparent hover:bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 hover:border-cyan-400',
    // Nút trong suốt
    ghost:
      'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white',
    // Nút nguy hiểm
    danger:
      'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/40 hover:border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
  }[variant];

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
