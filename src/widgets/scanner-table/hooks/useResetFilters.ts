// src/widgets/scanner-table/hooks/useResetFilters.ts
import { useCallback } from "react";
import { useSetAtom } from "jotai";

import { filtersAtom, sortersAtom, tablePageAtom, tableDirtyAtom } from "@/widgets/scanner-table/model/atoms";

import { TableKey, filtersDefaults, sortersDefaults } from "../model";

export function useResetFilters(table: TableKey) {
  const setFilters = useSetAtom(filtersAtom);
  const setSorters = useSetAtom(sortersAtom);
  const setPage = useSetAtom(tablePageAtom);
  const setDirty = useSetAtom(tableDirtyAtom);

  const resetFilters = useCallback(() => {
    setFilters(prev => ({ ...prev, [table]: { ...filtersDefaults[table] } }));
    setSorters(prev => ({ ...prev, [table]: { ...sortersDefaults[table] } }));
    setPage(prev => ({ ...prev, [table]: 1 }));
    setDirty(prev => ({ ...prev, [table]: true }));
  }, [setFilters, setSorters, setPage, setDirty, table]);

  return { resetFilters };
}
