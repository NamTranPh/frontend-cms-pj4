import React from 'react';

// Định nghĩa kiểu props chung cho input
type BaseInputProps = {
  label?: React.ReactNode;
  required?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
  className?: string;
  resizable?: boolean; // ẩn góc kéo trong textarea
  showCharCount?: boolean;
  rows?: number;
};

type AsTextareaProps = BaseInputProps & {
  as: 'textarea';
  ref?: React.Ref<HTMLTextAreaElement>;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseInputProps | 'as'>;

// Khi là input thông thường
type AsInputProps = BaseInputProps & {
  as?: 'input';
  ref?: React.Ref<HTMLInputElement>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof BaseInputProps | 'as'>;

export type InputProps = AsTextareaProps | AsInputProps;

export const Input: React.FC<InputProps> = (props) => {
  const {
    label,
    required = false,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    wrapperClassName = '',
    disabled,
    as = 'input',
    ...restProps
  } = props;

  // 1. TRƯỜNG HỢP: RENDER DẠNG TEXTAREA NHIỀU DÒNG (as="textarea")
  if (as === 'textarea' || (props as AsInputProps).type === 'textarea') {
    const textareaProps = restProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    const {
      resizable = false,
      showCharCount = false,
      rows = 3,
      maxLength,
      value,
      ref,
      ...nativeTextareaProps
    } = textareaProps as typeof textareaProps & {
      resizable?: boolean;
      showCharCount?: boolean;
      ref?: React.Ref<HTMLTextAreaElement>;
    };

    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={`w-full text-left ${wrapperClassName}`}>
        {label && (
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 select-none">
            {label}
            {required && (
              <span className="text-rose-500 font-bold ml-1 text-sm" title="Bắt buộc">*</span>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          maxLength={maxLength}
          value={value}
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all outline-none
            ${resizable ? 'resize-y' : 'resize-none'}
            ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'border-slate-300 dark:border-slate-700/80 focus:border-[#002b80] dark:focus:border-cyan-400 focus:ring-1 focus:ring-[#002b80] dark:focus:ring-cyan-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''}
            ${className}`}
          {...nativeTextareaProps}
        />

        <div className="flex items-center justify-between mt-1 text-[11px]">
          {error ? (
            <p className="text-rose-500 font-medium">{error}</p>
          ) : helperText ? (
            <p className="text-slate-400">{helperText}</p>
          ) : (
            <span />
          )}

          {showCharCount && maxLength && (
            <span className="text-slate-400 font-mono ml-auto">
              {currentLength}/{maxLength} ký tự
            </span>
          )}
        </div>
      </div>
    );
  }

  // 2. TRƯỜNG HỢP: RENDER DẠNG INPUT THÔNG THƯỜNG (text, number, password, email...)
  const inputProps = restProps as React.InputHTMLAttributes<HTMLInputElement>;
  const { type = 'text', ref, ...nativeInputProps } = inputProps as typeof inputProps & {
    ref?: React.Ref<HTMLInputElement>;
  };

  // Ẩn spinner tăng giảm số khi type="number"
  const numberNoSpinClass =
    type === 'number'
      ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
      : '';

  return (
    <div className={`w-full text-left ${wrapperClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 select-none">
          {label}
          {required && (
            <span className="text-rose-500 font-bold ml-1 text-sm" title="Bắt buộc">*</span>
          )}
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
          type={type}
          disabled={disabled}
          className={`w-full rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all text-sm py-2.5 outline-none
            ${leftIcon ? 'pl-10' : 'pl-3.5'}
            ${rightIcon ? 'pr-10' : 'pr-3.5'}
            ${numberNoSpinClass}
            ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : 'border-slate-300 dark:border-slate-700/80 focus:border-[#002b80] dark:focus:border-cyan-400 focus:ring-1 focus:ring-[#002b80] dark:focus:ring-cyan-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''}
            ${className}`}
          {...nativeInputProps}
        />

        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-[11px] text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};

export const Textarea: React.FC<Omit<AsTextareaProps, 'as'>> = (props) => (
  <Input as="textarea" {...props} />
);
