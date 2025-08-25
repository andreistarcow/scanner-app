import React, { memo } from 'react';

import type { OrderBy } from '@/shared/api/test-task-types';

const ArrowComponent: React.FC<{ dir?: OrderBy; active?: boolean }> = ({ dir, active }) => {
  return (
    <span
      className={`
        ml-1 text-[10px]
        ${active ? 'inline' : 'hidden group-hover:inline'}
      `}
    >
      {dir === 'asc' ? '▲' : '▼'}
    </span>
  );
};

export const Arrow = memo(ArrowComponent);
