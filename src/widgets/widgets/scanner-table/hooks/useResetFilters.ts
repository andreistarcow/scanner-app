import { useCallback } from "react";
import { useAtom } from "jotai";

import { filtersAtom, sortersAtom, type TableKey } from "@/widgets/scanner-table/model";
import { sortersInitialState, filtersInitialState } from "@/widgets/scanner-table/model";

export function useResetFilters(table: TableKey) {
  const [, setFilters] = useAtom(filtersAtom);
  const [, setSorters] = useAtom(sortersAtom);

  const resetFilters = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      [table]: { ...filtersInitialState },
    }));
  }, [setFilters, table]);

  const resetSorters = useCallback(() => {
    setSorters(prev => ({
      ...prev,
      [table]: { ...sortersInitialState },
    }));
  }, [setSorters, table]);

  const resetAll = useCallback(() => {
    resetFilters();
    resetSorters();
  }, [resetFilters, resetSorters]);

  return { resetFilters, resetSorters, resetAll };
}
