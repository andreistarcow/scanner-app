import React, { useCallback, useMemo } from "react";
import { useAtom } from "jotai";

import { Select } from "@/shared/ui";
import { filtersAtom, type TableKey } from "@/widgets/scanner-table/model";
import { FilterField } from "@/widgets/scanner-table";

type TopMode = "volume" | "transactions" | "any";

interface TopFilterProps {
  table: TableKey;
}

const topOptions = [
  { title: "Any", value: "any" },
  { title: "by volume", value: "volume" },
  { title: "by transactions", value: "transactions" },
];

export const TopFilter: React.FC<TopFilterProps> = ({ table }) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const current = filters[table].top; // null | 'volume' | 'transactions'

  const uiValue = useMemo<TopMode>(() => (current ?? "any") as TopMode, [current]);

  const handleChange = useCallback(
    (v: string | number | null) => {
      const val = (v ?? "any").toString() as TopMode;
      setFilters(prev => ({
        ...prev,
        [table]: {
          ...prev[table],
          top: val === "any" ? null : val,
        },
      }));
    },
    [setFilters, table]
  );

  return (
    <FilterField label="Top">
      <Select options={topOptions} value={uiValue} onChange={handleChange} />
    </FilterField>
  );
};
