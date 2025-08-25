import React from 'react';

import { type TableKey } from "@widgets/scanner-table/model";
import {
  MaxAgeFilter,
  Last24Filter,
  TopFilter,
  LiquidityFilter,
  ExcludeHoneypotsFilter,
  MinMcapFilter,
  ChainFilter,
  MinVolumeFilter,
  // ResetFilters,
} from '@widgets/scanner-table/ui/ScannerTable/components/filters';

interface FiltersBarProps {
  table: TableKey;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({ table }) => {
  return (
    <div className="flex w-full flex-nowrap items-center gap-3 overflow-x-auto">
      <div className="min-w-[100px]"><ChainFilter table={table} /></div>
      <div className="min-w-[130px]"><MaxAgeFilter table={table} /></div>
      <div className="min-w-[130px]"><MinMcapFilter table={table} /></div>
      <div className="min-w-[130px]"><MinVolumeFilter table={table} /></div>
      <div className="min-w-[130px]"><LiquidityFilter table={table} /></div>
      <div className="min-w-[130px]"><TopFilter table={table} /></div>
      <div className="min-w-[120px]"><Last24Filter table={table} /></div>
      <div className="min-w-[180px]"><ExcludeHoneypotsFilter table={table} /></div>
      {/* <div className="min-w-[100px]"><ResetFilters table={table} /></div> */}
    </div>
  );
};
