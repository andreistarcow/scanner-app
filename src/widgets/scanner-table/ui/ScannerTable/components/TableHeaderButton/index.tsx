import React, { useCallback } from 'react';

import type { OrderBy, SerdeRankBy } from '@/shared/api/test-task-types';
import { Arrow } from '@/shared/ui';

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
      className={`group flex h-full items-center gap-1 truncate border-t border-white/10 px-3 py-2 text-xs text-slate-400
        ${active ? 'bg-white/10 text-white' : ''}
        ${sorter ? 'transition hover:bg-white/10 hover:text-slate-200' : 'cursor-default'}
        ${className ?? ''}`}
    >
      <span>{label}</span>
      {sorter && <Arrow dir={orderBy} active={active} />}
    </button>
  );
};

export const TableHeaderButton = React.memo(TableHeaderButtonComponent);
