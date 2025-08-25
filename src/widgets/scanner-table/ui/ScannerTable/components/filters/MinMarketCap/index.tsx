import React, { useCallback, useMemo } from "react";
import { useAtom } from "jotai";

import { Select } from "@/shared/ui";
import { filtersAtom, type TableKey } from "@/widgets/scanner-table/model";
import { FilterField } from "@/widgets/scanner-table";

interface MinMcapFilterProps {
  table: TableKey;
}

const minMcapOptions = [
  { title: "Any", value: "any" },
  { title: ">$10k", value: "10000" },
  { title: ">$50k", value: "50000" },
  { title: ">$100k", value: "100000" },
  { title: ">$500k", value: "500000" },
  { title: ">$1m", value: "1000000" },
  { title: ">$50m", value: "50000000" },
  { title: ">$300m", value: "300000000" },
  { title: ">$500m", value: "500000000" },
  { title: ">$1b", value: "1000000000" },
  { title: ">$30b", value: "30000000000" },
];

export const MinMcapFilter: React.FC<MinMcapFilterProps> = ({ table }) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const current = filters[table].minMcap;

  const uiValue = useMemo(() => (current ? String(current) : "any"), [current]);

  const handleChange = useCallback((v: string | number | null) => {
    const str = String(v);
    const next = str === "any" ? 0 : Number(str);
    setFilters(prev => ({
      ...prev,
      [table]: {
        ...prev[table],
        minMcap: Number.isFinite(next) && next >= 0 ? next : 0,
      },
    }));
  }, [setFilters, table]);

  return (
    <FilterField label="Min Market Cap">
      <Select options={minMcapOptions} value={uiValue} onChange={handleChange} />
    </FilterField>
  );
};
