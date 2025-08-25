import React, { memo } from 'react';

import type { OrderBy } from '@/shared/api/test-task-types';

const ArrowComponent: React.FC<{ dir?: OrderBy; active?: boolean }> = ({ dir, active }) => {
  if (!active) return null;
  return (
    <span className="ml-1 text-[10px]">
      {dir === 'asc' ? '▲' : '▼'}
    </span>
  );
};

export const Arrow = memo(ArrowComponent);
