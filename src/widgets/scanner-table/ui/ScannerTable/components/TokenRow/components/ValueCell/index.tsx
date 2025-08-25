import React from "react";

import { formatValue } from "@/shared/lib/formatValue";

interface ValueCellProps {
  value: number;
}

const ValueCellComponent: React.FC<ValueCellProps> = ({ value }) => {
  return (
    <div className="flex h-full items-center justify-end truncate px-3 py-5 pr-2.5">
      <span className="font-mono text-xs text-white">
        ${formatValue(value)}
      </span>
    </div>
  );
};

export const ValueCell = React.memo(ValueCellComponent);
