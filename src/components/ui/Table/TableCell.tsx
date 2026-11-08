import React from 'react';

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell: React.FC<TableCellProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <td
      className={`px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300 align-middle ${className}`}
      {...props}
    >
      {children}
    </td>
  );
};
