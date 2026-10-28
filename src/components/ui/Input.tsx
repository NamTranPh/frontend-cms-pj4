import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>; // React 19 ref trực tiếp
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ref,
  ...props
}) => {
  return (
    <div className="w-full text-left">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          disabled={disabled}
          className={`w-full rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all text-sm py-2.5 outline-none
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${rightIcon ? 'pr-10' : 'pr-3.5'}
            ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'border-slate-300 dark:border-slate-700/80 focus:border-blue-600 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-600 dark:focus:ring-cyan-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''}
            ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 flex items-center justify-center cursor-pointer">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
};
