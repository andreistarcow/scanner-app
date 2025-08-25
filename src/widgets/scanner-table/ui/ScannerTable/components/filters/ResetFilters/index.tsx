import React, { useCallback } from "react";

import { type TableKey } from "@/widgets/scanner-table/model";
import { FilterField , useScannerFeed } from '@/widgets/scanner-table';
import { Button } from "@/shared/ui/Button";

export const ResetFilters: React.FC<{ table: TableKey }> = ({ table }) => {
  const { resetFiltersAndRefetch } = useScannerFeed(table);
  const reset = useCallback(() => {
    resetFiltersAndRefetch();
  }, [resetFiltersAndRefetch]);

  return (
    <FilterField>
      <Button className='mt-5' onClick={reset}>Reset</Button>
    </FilterField>
  );
};
