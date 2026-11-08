import React from 'react';
import { Skeleton } from '../Skeleton';

export interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  cols = 5,
  className = '',
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={`skeleton-row-${rowIndex}`}
          className={`border-b border-slate-100 dark:border-slate-800/40 ${className}`}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={`skeleton-cell-${rowIndex}-${colIndex}`} className="px-4 py-3.5">
              <Skeleton
                className={`h-4 ${
                  colIndex === 0
                    ? 'w-36'
                    : colIndex === cols - 1
                    ? 'w-16 ml-auto'
                    : 'w-24'
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};
