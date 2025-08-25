import React, { useCallback, useMemo } from "react";
import { useAtom } from "jotai";

import { Select } from "@/shared/ui";
import { filtersAtom, type TableKey } from "@/widgets/scanner-table/model";
import { FilterField } from '@/widgets/scanner-table';

interface MinVolumeFilterProps {
  table: TableKey;
}

const minVolumeOptions = [
  { title: "Any", value: "any" },
  { title: ">$1K", value: "1000" },
  { title: ">$5K", value: "5000" },
  { title: ">$10K", value: "10000" },
  { title: ">$100K", value: "100000" },
  { title: ">$250K", value: "250000" },
  { title: ">$500K", value: "500000" },
  { title: ">$1M", value: "1000000" },
];

export const MinVolumeFilter: React.FC<MinVolumeFilterProps> = ({ table }) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const current = filters[table].minVolume;

  const uiValue = useMemo(() => (current ? String(current) : "any"), [current]);

  const handleChange = useCallback((v: string | number | null) => {
    const str = String(v);
    const next = str === "any" ? 0 : Number(str);
    setFilters(prev => ({
      ...prev,
      [table]: {
        ...prev[table],
        minVolume: Number.isFinite(next) && next >= 0 ? next : 0,
      },
    }));
  }, [setFilters, table]);

  return (
    <FilterField label="Min Volume">
      <Select options={minVolumeOptions} value={uiValue} onChange={handleChange} />
    </FilterField>
  );
};
