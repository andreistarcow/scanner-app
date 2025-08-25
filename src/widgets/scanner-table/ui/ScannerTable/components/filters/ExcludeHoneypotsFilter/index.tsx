import React, { useCallback } from "react";
import { useAtom } from "jotai";

import { filtersAtom, type TableKey } from "@/widgets/scanner-table/model";
import { FilterField } from '@/widgets/scanner-table';
import { Button } from "@/shared/ui/Button";

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
      <Button indicator className='mt-5' active={active} onClick={toggle}>Exclude honeypots</Button>
    </FilterField>
  );
};
