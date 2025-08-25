import React, { useCallback } from "react";

import { useResetFilters } from "@/widgets/scanner-table/hooks/useResetFilters";
import { type TableKey } from "@/widgets/scanner-table/model";
import { FilterField , useScannerFeed } from '@/widgets/scanner-table';
import { Button } from "@/shared/ui/Button";

export const ResetFilters: React.FC<{ table: TableKey }> = ({ table }) => {
  const { resetFilters } = useResetFilters(table);
  const { resetAndRefetch } = useScannerFeed(table);
  const reset = useCallback(() => {
    resetFilters();
    resetAndRefetch();
  }, [resetFilters, resetAndRefetch]);

  return (
    <FilterField>
      <Button onClick={reset}>Reset</Button>
    </FilterField>
  );
};
