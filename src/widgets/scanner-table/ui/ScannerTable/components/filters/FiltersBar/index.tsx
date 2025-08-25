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
  // ResetFilters,
} from '@/widgets/scanner-table/ui/ScannerTable/components/filters';

interface FiltersBarProps {
  table: TableKey;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({ table }) => {
  return (
    <div className="flex flex-nowrap items-center gap-3 border-y border-white/10">
      <div className="min-w-[100px] border-white/10"><ChainFilter table={table} /></div>
      <div className="min-w-[120px] border-white/10"><MaxAgeFilter table={table} /></div>
      <div className="min-w-[125px] border-white/10"><MinMcapFilter table={table} /></div>
      <div className="min-w-[120px] border-white/10"><MinVolumeFilter table={table} /></div>
      <div className="min-w-[120px] border-white/10"><LiquidityFilter table={table} /></div>
      <div className="min-w-[160px] border-white/10"><TopFilter table={table} /></div>
      <div className="min-w-[120px] border-white/10"><Last24Filter table={table} /></div>
      <div className="min-w-[190px] border-white/10"><ExcludeHoneypotsFilter table={table} /></div>
      {/* <div className="min-w-[100px]"><ResetFilters table={table} /></div> */}
    </div>
  );
};
