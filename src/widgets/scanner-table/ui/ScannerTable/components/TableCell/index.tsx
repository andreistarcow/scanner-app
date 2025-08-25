import React, { ReactNode } from "react";

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

const TableCellComponent: React.FC<TableCellProps> = ({ children, className }) => {
  return (
    <div className={`flex h-full items-center gap-1 truncate px-3 py-5 text-xs ${className}`}>
      {children}
    </div>
  );
};

export const TableCell = React.memo(TableCellComponent);
