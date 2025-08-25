import React from 'react';
import type { Virtualizer } from '@tanstack/react-virtual';

import { TableKey } from '@/widgets/scanner-table/model';

type ElementType = HTMLElement | Element;

export interface VirtualRowsProps<T> {
  virtualizer: Virtualizer<HTMLDivElement, ElementType>;
  items: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  rowClassName?: string;
  table: TableKey;
}

export function VirtualRowsComponent<T>({
  virtualizer,
  items,
  renderRow,
  rowClassName = '',
}: VirtualRowsProps<T>) {
  const totalSize = virtualizer.getTotalSize();
  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div style={{ height: totalSize, position: 'relative', width: '100%' }}>
      {virtualItems.map((vi) => {
        const item = items[vi.index];
        if (!item) return null;
        return (
          <div
            key={vi.key}
            ref={virtualizer.measureElement}
            className={`absolute inset-x-0 ${vi.index % 2 === 1 ? 'bg-white/5' : ''} ${rowClassName}`}
            style={{ transform: `translateY(${vi.start}px)` }}
          >
            {renderRow(item, vi.index)}
          </div>
        );
      })}
    </div>
  );
}

export const VirtualRows = VirtualRowsComponent;
