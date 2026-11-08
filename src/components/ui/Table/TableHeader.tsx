import React from 'react';

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader: React.FC<TableHeaderProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <thead
      className={`border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
};
