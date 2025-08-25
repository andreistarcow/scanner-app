import { useMemo } from "react";
import { useAtomValue } from "jotai";

import { filtersAtom, tableDataAtom, type TableKey } from "@/widgets/scanner-table/model";

export function useFilters(table: TableKey) {
  const filters = useAtomValue(filtersAtom)[table];
  const data = useAtomValue(tableDataAtom)[table];

  const result = useMemo(() => {
    const filtered = data.filter(t => {
      const passChain = filters.chain === "ALL" || t.chain === filters.chain;
      const passVol = t.volumeUsd >= filters.minVolume;

      const ageMinutes = Math.floor((Date.now() - t.tokenCreatedTimestamp.getTime()) / (1000 * 60));

      let passTime = true;
      switch (filters.timeRange) {
        case '5m':
          passTime = ageMinutes <= 5;
          break;
        case '1h':
          passTime = ageMinutes <= 60;
          break;
        case '6h':
          passTime = ageMinutes <= 360;
          break;
        case '24h':
          passTime = ageMinutes <= 1440;
          break;
        default:
          passTime = true;
      }

      const ageHrs = Math.floor(ageMinutes / 60);
      const passAge = filters.maxAgeHours == null ? true : ageHrs <= filters.maxAgeHours;
      const passMcap = t.mcap >= filters.minMcap;
      const passHP = filters.excludeHoneypot ? !t.audit.honeypot : true;
      const tokenLiquidity = t.liquidity.current ?? 0;
      const passLiquidity = tokenLiquidity >= filters.liquidity;

      return passChain && passVol && passTime && passAge && passMcap && passHP && passLiquidity;
    });

    if (!filters.top) return filtered;

    const sorted = [...filtered];
    if (filters.top === "volume") {
      sorted.sort((a, b) => b.volumeUsd - a.volumeUsd);
    } else if (filters.top === "transactions") {
      const totalTx = (x: typeof filtered[number]) => x.transactions.buys + x.transactions.sells;
      sorted.sort((a, b) => totalTx(b) - totalTx(a));
    }
    return sorted;
  }, [data, filters]);


  return result;
}
