import React from 'react';

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow: React.FC<TableRowProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <tr
      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
};
