import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

export const Table: React.FC<TableProps> = ({
  className = '',
  wrapperClassName = '',
  children,
  ...props
}) => {
  return (
    <div
      className={`w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131c2e] shadow-sm transition-colors ${wrapperClassName}`}
    >
      <table className={`w-full text-left border-collapse text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};
