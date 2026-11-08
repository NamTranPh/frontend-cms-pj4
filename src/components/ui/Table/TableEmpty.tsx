import React from 'react';
import { Inbox } from 'lucide-react';

export interface TableEmptyProps {
  colSpan: number;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const TableEmpty: React.FC<TableEmptyProps> = ({
  colSpan,
  icon,
  title = 'Không tìm thấy dữ liệu',
  description = 'Không có kết quả nào phù hợp với điều kiện tìm kiếm hoặc dữ liệu đang trống.',
  action,
  className = '',
}) => {
  return (
    <tr>
      <td colSpan={colSpan} className={`px-4 py-16 text-center ${className}`}>
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500 shadow-inner">
            {icon || <Inbox size={28} />}
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
          {action && <div className="pt-1">{action}</div>}
        </div>
      </td>
    </tr>
  );
};
