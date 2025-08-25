import React, { useCallback } from "react";
import { useAtom } from "jotai";

import { filtersAtom, type TableKey } from "@/widgets/scanner-table/model";
import { FilterField } from '@/widgets/scanner-table';
import { Indicator } from "@/shared/ui";

export const ExcludeHoneypotsFilter: React.FC<{ table: TableKey }> = ({ table }) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const active = filters[table].excludeHoneypot;

  const toggle = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      [table]: { ...prev[table], excludeHoneypot: !prev[table].excludeHoneypot },
    }));
  }, [setFilters, table]);

  return (
    <FilterField>
      <button
        style={{
          alignItems: 'center'
        }}
        type="button"
        onClick={toggle}
        aria-pressed={active}
        className={`
          mt-4
          flex
          flex-row
          justify-center
          rounded-[3px]
          border px-2 py-1.5 align-middle
          text-xs font-medium text-white transition-opacity
          ${active ? "border-white/90 opacity-100" : "border-white/40 opacity-40 hover:opacity-90"}
        `}
      >
        <div className="mr-2"><Indicator enabled={active} /></div>
        Exclude honeypots
      </button>
    </FilterField>
  );
};
