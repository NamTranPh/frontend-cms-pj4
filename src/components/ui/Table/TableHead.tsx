import React from 'react';

export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>;

export const TableHead: React.FC<TableHeadProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <th
      className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};
