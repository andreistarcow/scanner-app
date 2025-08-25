import React, { useCallback, useMemo } from "react";
import { useAtom } from "jotai";

import { NETWORK_ICONS, Select } from "@/shared/ui";
import { Chains } from "@/shared/model/types";
import { SupportedChainName } from "@/shared/api/test-task-types";
import { filtersAtom, type TableKey } from "@/widgets/scanner-table/model";

import { FilterField } from "../../FilterField";

interface ChainFilterProps {
  table: TableKey;
}

export const ChainFilter: React.FC<ChainFilterProps> = ({ table }) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const value = filters[table].chain;

  const options = useMemo(
    () => [
      { title: "ALL", value: "ALL" },
      ...Object.values(Chains).map(chain => ({
        title: chain,
        value: chain,
        icon: NETWORK_ICONS[chain as SupportedChainName],
      })),
    ],
    []
  );

  const handleChange = useCallback((chain: string) => {
    setFilters(prev => ({
      ...prev,
      [table]: {
        ...prev[table],
        chain: chain as SupportedChainName | "ALL",
      },
    }));
  }, [setFilters, table]);

  return (
    <FilterField label="Chain">
      <Select options={options} value={value} onChange={handleChange} />
    </FilterField>
  );
};
