import React from 'react';

import { type TableKey } from "@/widgets/scanner-table/model";
import {
  MaxAgeFilter,
  Last24Filter,
  TopFilter,
  LiquidityFilter,
  ExcludeHoneypotsFilter,
  MinMcapFilter,
  ChainFilter,
  MinVolumeFilter,
  ResetFilters,
  ChainButtonFilter
} from '@/widgets/scanner-table/ui/ScannerTable/components/filters';

interface FiltersBarProps {
  table: TableKey;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({ table }) => {
  return (
    <div className="flex flex-nowrap items-stretch p-2">
      {/* <ChainFilter table={table} /> */}
      <ChainButtonFilter table={table} />
      <MaxAgeFilter table={table} />
      <MinMcapFilter table={table} />
      <MinVolumeFilter table={table} />
      <LiquidityFilter table={table} />
      <TopFilter table={table} />
      <Last24Filter table={table} />
      <ExcludeHoneypotsFilter table={table} />
      <ResetFilters table={table} />
    </div>
  );
};

