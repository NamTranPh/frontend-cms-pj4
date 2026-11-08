import React from 'react';
import { AlertTriangle, AlertCircle, Info, Loader2 } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'primary';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
}

const variantStyles: Record<
  ConfirmVariant,
  { iconBg: string; iconColor: string; buttonClass: string }
> = {
  danger: {
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-600 dark:text-rose-400',
    buttonClass:
      'bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-500 dark:hover:bg-rose-600 dark:text-white shadow-md shadow-rose-500/20',
  },
  warning: {
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-600 dark:text-amber-400',
    buttonClass:
      'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20',
  },
  primary: {
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-[#002b80] dark:text-cyan-400',
    buttonClass:
      'bg-[#002b80] hover:bg-[#00246b] text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 font-bold shadow-md shadow-cyan-500/20',
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  variant = 'danger',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden flex flex-col space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          {/* Icon Circle */}
          <div
            className={`p-3 rounded-2xl shrink-0 ${styles.iconBg} ${styles.iconColor}`}
          >
            {variant === 'danger' ? (
              <AlertCircle size={24} />
            ) : variant === 'warning' ? (
              <AlertTriangle size={24} />
            ) : (
              <Info size={24} />
            )}
          </div>

          {/* Nội dung Text */}
          <div className="space-y-1.5 flex-1 pt-0.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${styles.buttonClass}`}
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            <span>{isLoading ? 'Đang xử lý...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
