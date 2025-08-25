import React, { useCallback } from 'react';

import type { OrderBy, SerdeRankBy } from '@shared/api/test-task-types';
import { Arrow } from '@shared/ui';

interface HeaderButtonProps {
  label: string;
  active?: boolean;
  orderBy?: OrderBy;
  sorter?: SerdeRankBy;
  onClick?: (field: SerdeRankBy) => void;
  className?: string;
}

const TableHeaderButtonComponent: React.FC<HeaderButtonProps> = ({
  label,
  active = false,
  orderBy,
  sorter,
  onClick,
  className,
}) => {
  const handleClick = useCallback(() => {
    if (onClick && sorter) {
      onClick(sorter);
    }
  }, [sorter, onClick]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex h-full items-center gap-1 truncate px-3 py-2 text-xs text-slate-400 ${sorter ? `transition hover:text-slate-200` : 'cursor-default'} ${className ?? ''}`}
    >
      <span>{label}</span>
      <Arrow dir={orderBy} active={active} />
    </button>
  );
};

export const TableHeaderButton = React.memo(TableHeaderButtonComponent);
