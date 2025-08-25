import React, { useCallback, useMemo } from "react";
import { useAtom } from "jotai";

import { Select } from "@/shared/ui";
import { filtersAtom, type TableKey } from "@/widgets/scanner-table/model";
import { FilterField } from '@/widgets/scanner-table';

interface MaxAgeFilterProps {
  table: TableKey;
}

const maxAgeOptions = [
  { title: "Any", value: "any" },
  { title: "1h", value: "1" },
  { title: "6h", value: "6" },
  { title: "12h", value: "12" },
  { title: "24h", value: "24" },
  { title: "7d", value: "168" },
  { title: "14d", value: "336" },
  { title: "1m", value: "720" },
  { title: "1y", value: "8760" }, 
  { title: "3y", value: "26280" },
  { title: "5y", value: "43800" },
];

export const MaxAgeFilter: React.FC<MaxAgeFilterProps> = ({ table }) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const current = filters[table].maxAgeHours;
  const uiValue = useMemo(
    () => (current == null ? "any" : String(current)),
    [current]
  );

  const handleChange = useCallback(
    (v: string | number | null) => {
      const str = String(v);
      const next = str === "any" ? null : Number(str);
      setFilters((prev) => ({
        ...prev,
        [table]: {
          ...prev[table],
          maxAgeh: next,
        },
      }));
    },
    [setFilters, table]
  );

  return (
    <FilterField label="Max Age">
      <Select options={maxAgeOptions} value={uiValue} onChange={handleChange} />
    </FilterField>
  );
};
