import React, { useCallback, useMemo } from "react";
import { useAtom } from "jotai";

import { Select } from "@shared/ui";
import { filtersAtom, type TableKey } from "@widgets/scanner-table/model";
import { FilterField } from "@widgets/scanner-table";

interface LiquidityFilterProps {
  table: TableKey;
}

const liquidityOptions = [
  { title: "Any", value: "any" },
  { title: ">$1K", value: "1000" },
  { title: ">$5K", value: "5000" },
  { title: ">$10K", value: "10000" },
  { title: ">$50K", value: "50000" },
  { title: ">$100K", value: "100000" },
  { title: ">$250K", value: "250000" },
  { title: ">$500K", value: "500000" },
  { title: ">$1M", value: "1000000" },
  { title: ">$10M", value: "10000000" },
  { title: ">$50M", value: "50000000" },
  { title: ">$100M", value: "100000000" },
];

export const LiquidityFilter: React.FC<LiquidityFilterProps> = ({ table }) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const current = filters[table].liquidity;

  const uiValue = useMemo(() => (current ? String(current) : "any"), [current]);

  const handleChange = useCallback(
    (v: string | number | null) => {
      const str = String(v);
      const next = str === "any" ? 0 : Number(str);

      setFilters(prev => ({
        ...prev,
        [table]: {
          ...prev[table],
          liquidity: Number.isFinite(next) && next >= 0 ? next : 0,
        },
      }));
    },
    [setFilters, table]
  );

  return (
    <FilterField label="Liquidity">
      <Select options={liquidityOptions} value={uiValue} onChange={handleChange} />
    </FilterField>
  );
};
