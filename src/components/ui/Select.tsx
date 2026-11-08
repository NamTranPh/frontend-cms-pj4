import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  ref?: React.Ref<HTMLSelectElement>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  id,
  disabled,
  ref,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={`w-full appearance-none rounded-xl border px-3.5 py-2 text-sm transition-all focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 pr-9 cursor-pointer
            ${
              error
                ? 'border-rose-500 bg-rose-50/20 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-500 dark:bg-rose-500/5 dark:text-rose-200'
                : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-[#002b80] focus:ring-[#002b80]/15 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:border-slate-700 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20'
            } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <ChevronDown size={15} />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-rose-500 dark:text-rose-400">{error}</p>}
    </div>
  );
};
