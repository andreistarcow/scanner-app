import React, { useCallback, useMemo } from "react";
import { useAtom } from "jotai";

import { Select } from "@shared/ui";
import { filtersAtom, type TableKey } from "@widgets/scanner-table/model";
import { FilterField } from '@widgets/scanner-table';

interface MaxAgeFilterProps {
  table: TableKey;
}

const maxAgeOptions = [
  { title: "Any", value: "any" },
  { title: "1hour", value: "1" },
  { title: "6hours", value: "6" },
  { title: "12hours", value: "12" },
  { title: "24hours", value: "24" },
  { title: "7days", value: "168" },
  { title: "14days", value: "336" },
  { title: "1month", value: "720" },
  { title: "1year", value: "8760" }, 
  { title: "3years", value: "26280" },
  { title: "5years", value: "43800" },
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
          maxAgeHours: next,
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
