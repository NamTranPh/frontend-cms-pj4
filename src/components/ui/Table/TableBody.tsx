import React from 'react';

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody: React.FC<TableBodyProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <tbody
      className={`divide-y divide-slate-100 dark:divide-slate-800/60 ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
};
