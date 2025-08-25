import React, { memo, CSSProperties } from 'react';
import { useAtom } from 'jotai';

import { sortersAtom, TableKey } from '@widgets/scanner-table/model';
import { SerdeRankBy } from '@shared/api/test-task-types';
import { TableHeaderButton as HeaderButton } from '@widgets/scanner-table';

import { GRID } from '../../grid';

interface ScannerTableHeaderProps {
  table: TableKey;
  onSort: (key: SerdeRankBy) => void;
  style?: CSSProperties;
}

const TableHeaderComponent: React.FC<ScannerTableHeaderProps> = ({ table, onSort, style }) => {
  const [sorters] = useAtom(sortersAtom);

  const tableSorters = sorters[table];

  return (
    <div
      style={style}
      className={`
        grid
        ${GRID}
        items-stretch 
        divide-x
        divide-gray-700 border-y border-white/10 px-3`}
    >
      <HeaderButton
        sorter="trending"
        onClick={onSort}
        active={tableSorters.rankBy === 'trending'}
        orderBy={tableSorters.orderBy}
        label="Token"
      />
      <HeaderButton label="Router" />
      <HeaderButton
        onClick={onSort}
        active={tableSorters.rankBy === 'price24H'}
        orderBy={tableSorters.orderBy}
        label="Price"
      />
      <HeaderButton
        sorter="mcap"
        onClick={onSort}  
        active={tableSorters.rankBy === 'mcap'}
        orderBy={tableSorters.orderBy}
        label="Market Cap"
      />
      <HeaderButton
        sorter="volume"
        onClick={onSort}
        active={tableSorters.rankBy === 'volume'}
        orderBy={tableSorters.orderBy}
        label="Volume"
      />
      <HeaderButton
        sorter="price5M"
        onClick={onSort}
        active={tableSorters.rankBy === 'price5M'}
        orderBy={tableSorters.orderBy}
        label="5m" />
      <HeaderButton
        sorter="price1H"
        onClick={onSort}
        active={tableSorters.rankBy === 'price1H'}
        orderBy={tableSorters.orderBy}
        label="1h" />
      <HeaderButton
        sorter="price6H"
        onClick={onSort}
        active={tableSorters.rankBy === 'price6H'}
        orderBy={tableSorters.orderBy}
        label="6h" />
      <HeaderButton
        label="24h"
        onClick={onSort}
        sorter="price24H"
        active={tableSorters.rankBy === 'price24H'}
        orderBy={tableSorters.orderBy}
      />
      <HeaderButton
        label="Age"
        sorter="age"
        active={tableSorters.rankBy === 'age'}
        onClick={onSort}
      />
      <HeaderButton label="Buys/Sells" />
      <HeaderButton label="Liquidity" />
      <HeaderButton label="Audit" /> {/* ✅ new column */}
    </div>
  );
};

export const TableHeader = memo(TableHeaderComponent);
