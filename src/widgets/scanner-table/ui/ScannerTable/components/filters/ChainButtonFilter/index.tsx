import React, { useCallback, useMemo } from "react";
import { useAtom } from "jotai";

import { Chains } from "@/shared/model/types";
import { filtersAtom, type TableKey } from "@/widgets/scanner-table/model";
import { ChainIcon } from "@/shared/ui";
import { FilterField } from "@/widgets/scanner-table";
interface TokenInfoCellProps {
  table: TableKey;
}

export const ChainButtonFilter: React.FC<TokenInfoCellProps> = ({ table }) => {
  const [filters, setFilters] = useAtom(filtersAtom);
  const active = filters[table].chain;

  const CHAINS = useMemo(() => Object.values(Chains) as Chains[], []);

  const selectChain = useCallback(
    (chain: Chains) => {
      setFilters(prev => ({
        ...prev,
        [table]: { ...prev[table], chain },
      }));
    },
    [setFilters, table]
  );

  return (
    <FilterField label="Network" className='px-1'>
      <div className="mt-1 flex flex-row items-center gap-0.5">
        {CHAINS.map((chain) => {
          const isActive = active === chain;
          return (
            <button
              key={chain}
              type="button"
              onClick={() => selectChain(chain)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 rounded-md px-2 py-1 transition
                ${isActive ? "bg-white/10 ring-1 ring-white/40" : "opacity-95 hover:bg-white/5 hover:opacity-100"}`}
              title={chain}
            >
              {/* icon wrapper to ensure vertical centering and consistent size */}
              <span className="inline-flex size-5 shrink-0 items-center justify-center">
                <ChainIcon chain={chain} />
              </span>
              <span className="text-xs font-medium leading-none">{chain}</span>
            </button>
          );
        })}
      </div>
    </FilterField>
  );
};
