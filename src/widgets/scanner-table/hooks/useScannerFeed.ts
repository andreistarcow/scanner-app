import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';

import { httpGet } from '@/shared/api/client';
import {
  type GetScannerResultParams,
  type ScannerApiResponse,
  type IncomingWebSocketMessage,
  type ScannerResult,
} from '@/shared/api/test-task-types';
import { wsBus } from '@/shared/lib/ws';
import {
  tableDataAtom,
  tablePageAtom,
  loadingAtom,
  errorAtom,
  tableDirtyAtom,
} from '@/widgets/scanner-table/model/atoms';
import { filtersAtom, sortersAtom, TableKey } from '@/widgets/scanner-table/model';
import { rowToToken } from '@/shared/model/utils';
import type { TokenData } from '@/widgets/scanner-table/model';
import { Data, Page, Loading, Error } from '@/widgets/scanner-table/model/types';
import { pairKey, mergeUniqueByPair, uniqScannerRows, calcMarketCap } from '@/widgets/scanner-table/model/utils';

import { useResetFilters } from './useResetFilters';

type LoadOpts = { expectedId?: number; replace?: boolean };


function subscribeForTokens(tokens: TokenData[]) {
  for (const t of tokens) {
    wsBus.send({ event: 'subscribe-pair', data: { pair: t.pairAddress, token: t.tokenAddress, chain: t.chain } });
    wsBus.send({ event: 'subscribe-pair-stats', data: { pair: t.pairAddress, token: t.tokenAddress, chain: t.chain } });
  }
}
function unsubscribeForTokens(tokens: TokenData[]) {
  for (const t of tokens) {
    wsBus.send({ event: 'unsubscribe-pair', data: { pair: t.pairAddress, token: t.tokenAddress, chain: t.chain } });
    wsBus.send({ event: 'unsubscribe-pair-stats', data: { pair: t.pairAddress, token: t.tokenAddress, chain: t.chain } });
  }
}

export function useScannerFeed(table: TableKey) {
  const [dirty, setDirty] = useAtom(tableDirtyAtom);
  const [data, setData] = useAtom(tableDataAtom);
  const [page, setPage] = useAtom(tablePageAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const setError = useSetAtom(errorAtom);

  const sorters = useAtomValue(sortersAtom)[table];
  const filters = useAtomValue(filtersAtom)[table];
  const error = useAtomValue(errorAtom)[table];

  const { resetAll } = useResetFilters(table);

  const queryIdRef = useRef(0);
  const mountedRef = useRef(true);
  const [replaceSeq, setReplaceSeq] = useState(0);

  const isDirty = dirty[table];

  const baseParams: GetScannerResultParams = useMemo(() => {
    const chain = filters.chain === 'ALL' ? null : filters.chain;
    const isNotHP = filters.excludeHoneypot;
    const timeFrame = sorters.timeFrame || undefined;

    return {
      ...sorters,
      isNotHP,
      chain,
      timeFrame,
    };
  }, [filters.chain, filters.excludeHoneypot, sorters]);


  const setLoadingForTable = useCallback(
    (value: boolean) => setLoading((ls: Loading) => ({ ...ls, [table]: value })),
    [setLoading, table]
  );
  const setErrorForTable = useCallback(
    (value: Error[TableKey]) => setError((es: Error) => ({ ...es, [table]: value })),
    [setError, table]
  );
  const setDirtyForTable = useCallback(
    (value: boolean) => setDirty((ds) => ({ ...ds, [table]: value })),
    [setDirty, table]
  );
  const setPageForTable = useCallback(
    (value: number) => setPage((ps: Page) => ({ ...ps, [table]: value })),
    [setPage, table]
  );
  const setDataForTableReplace = useCallback(
    (tokens: TokenData[]) =>
      setData((state: Data) => ({ ...state, [table]: tokens })),
    [setData, table]
  );
  const setDataForTableMerge = useCallback(
    (tokens: TokenData[]) =>
      setData((state: Data) => ({
        ...state,
        [table]: mergeUniqueByPair(state[table] ?? [], tokens),
      })),
    [setData, table]
  );

  const loadPage = useCallback(
    async (pageNum: number, opts?: LoadOpts): Promise<void> => {
      const expectedId = opts?.expectedId ?? queryIdRef.current;

      setLoadingForTable(true);

      try {
        const res = await httpGet<ScannerApiResponse>('/scanner', { ...baseParams, page: pageNum });

        // ignore stale
        if (!mountedRef.current || expectedId !== queryIdRef.current) return;

        if (res.ok) {
          const rows: ScannerResult[] = uniqScannerRows(res.data.pairs ?? []);
          const tokens: TokenData[] = rows.map(rowToToken);

          setDirtyForTable(false);
          if (pageNum === 1 && opts?.replace) {
            setDataForTableReplace(tokens);
            setPageForTable(1);
            setReplaceSeq((n) => n + 1);
          } else {
            if (pageNum === 1) {
              setDataForTableReplace(tokens);
            } else {
              setDataForTableMerge(tokens);
            }
            setPageForTable(pageNum);
          }

          setErrorForTable(null);
        } else {
          setErrorForTable(res.error.message ?? 'Unknown error');
        }
      } catch (e: any) {
        if (!mountedRef.current || expectedId !== queryIdRef.current) return;
        setErrorForTable(e?.message ?? 'Network error');
      } finally {
        const isStale = !mountedRef.current || expectedId !== queryIdRef.current;
        if (!isStale) setLoadingForTable(false);
      }
    },
    [
      baseParams,
      setDirtyForTable,
      setErrorForTable,
      setLoadingForTable,
      setPageForTable,
      setDataForTableReplace,
      setDataForTableMerge,
    ]
  );

  useEffect(() => {
    mountedRef.current = true;

    const nextId = queryIdRef.current + 1;
    queryIdRef.current = nextId;

    setLoadingForTable(true);
    setErrorForTable(null);
    setDirtyForTable(true);

    void loadPage(1, { expectedId: nextId, replace: true });

    return () => {
      mountedRef.current = false;
    };
  }, [baseParams, loadPage, setDirtyForTable, setErrorForTable, setLoadingForTable]);

  useEffect(() => {
    if (!mountedRef.current) return;

    const localId = queryIdRef.current;

    const handleScannerPairs = (payload: any) => {
      const rows: ScannerResult[] = uniqScannerRows(payload?.data?.results?.pairs ?? []);
      const incoming: TokenData[] = rows.map(rowToToken);

      setData((state: Data): Data => {
        const prev: TokenData[] = state[table] ?? [];
        const prevMap = new Map(prev.map((t) => [pairKey(t), t]));

        const reconciled: TokenData[] = incoming.map((n) => {
          const k = pairKey(n);
          const p = prevMap.get(k);
          return p ? { ...p, ...n } : n;
        });

        // subscribe to all pairs we have after reconciliation
        queueMicrotask(() => subscribeForTokens(reconciled));

        return { ...state, [table]: reconciled };
      });
    };

    const handleTick = (payload: any) => {
      const pairPayload = payload?.data?.pair;
      const swaps = payload?.data?.swaps ?? [];
      const latestSwap = swaps.filter((s: any) => !s?.isOutlier).pop();
      if (!latestSwap || !pairPayload) return;

      const newPrice = parseFloat(latestSwap.priceToken1Usd);
      if (!Number.isFinite(newPrice)) return;

      setData((state: Data): Data => {
        const list = state[table] ?? [];
        let changed = false;

        const updated = list.map((token) => {
          const same =
            token.pairAddress === pairPayload.pair && token.tokenAddress === pairPayload.token;
          if (!same) return token;
          changed = true;
          const newMcap = calcMarketCap(token, newPrice);
          return { ...token, priceUsd: newPrice, mcap: newMcap };
        });

        return changed ? { ...state, [table]: updated } : state;
      });
    };

    const handlePairStats = (payload: any) => {
      const stats = payload?.data;
      const pairAddress = stats?.pair?.pairAddress;
      if (!pairAddress) return;

      setData((state: Data): Data => {
        const list = state[table] ?? [];
        let changed = false;

        const updated = list.map((token) => {
          if (token.pairAddress !== pairAddress) return token;
          changed = true;
          return {
            ...token,
            migrationPc: stats.migrationProgress ? Number(stats.migrationProgress) : token.migrationPc,
            audit: {
              ...token.audit,
              mintable: stats.pair?.mintAuthorityRenounced ?? token.audit.mintable,
              freezable: stats.pair?.freezeAuthorityRenounced ?? token.audit.freezable,
              honeypot: stats.pair?.token1IsHoneypot === true,
              contractVerified: stats.pair?.isVerified ?? token.audit.contractVerified,
            },
            socials: {
              ...token.socials,
              discord: stats.pair?.linkDiscord ?? token.socials?.discord,
              telegram: stats.pair?.linkTelegram ?? token.socials?.telegram,
              twitter: stats.pair?.linkTwitter ?? token.socials?.twitter,
              website: stats.pair?.linkWebsite ?? token.socials?.website,
            },
            liquidity: {
              ...token.liquidity,
              current:
                stats.pair?.pairReserves0Usd && stats.pair?.pairReserves1Usd
                  ? parseFloat(stats.pair.pairReserves0Usd) + parseFloat(stats.pair.pairReserves1Usd)
                  : token.liquidity.current,
            },
          };
        });

        return changed ? { ...state, [table]: updated } : state;
      });
    };

    const unsubscribe = wsBus.subscribe((message: IncomingWebSocketMessage) => {
      if (!message || typeof message !== 'object' || !('event' in message)) return;
      if (localId !== queryIdRef.current) return;

      switch (message.event) {
        case 'scanner-pairs':
          handleScannerPairs(message);
          break;
        case 'tick':
          handleTick(message);
          break;
        case 'pair-stats':
          handlePairStats(message);
          break;
        default:
          break;
      }
    });

    // announce current filter to backend
    wsBus.send({ event: 'scanner-filter', data: { ...baseParams } });

    // subscribe existing visible tokens
    const currentTokens: TokenData[] = (data[table] ?? []);
    subscribeForTokens(currentTokens);

    return () => {
      // guard: only clean up if we’re still on the same request context
      if (localId === queryIdRef.current) {
        wsBus.send({ event: 'unsubscribe-scanner-filter', data: { ...baseParams } });
        unsubscribeForTokens(data[table] ?? []);
      }
      unsubscribe();
    };
  }, [baseParams, data, setData, table]);


  const resetAndRefetch = useCallback(async (): Promise<void> => {
    const nextId = queryIdRef.current + 1;
    queryIdRef.current = nextId;

    setLoadingForTable(true);
    setErrorForTable(null);
    setDirtyForTable(true);

    await loadPage(1, { expectedId: nextId, replace: true });
  }, [loadPage, setDirtyForTable, setErrorForTable, setLoadingForTable]);

  const resetFiltersAndRefetch = useCallback(() => {
    resetAll();
  }, [resetAll]);

  const moreRef = useRef<{ loading: boolean }>({ loading: false });
  const loadMore = useCallback(async (): Promise<void> => {
    if (moreRef.current.loading) return;
    moreRef.current.loading = true;
    try {
      await loadPage((page[table] ?? 1) + 1);
    } finally {
      moreRef.current.loading = false;
    }
  }, [loadPage, page, table]);

  return {
    error,
    loading: loading[table],
    errorKey: table,
    loadMore,
    loadPage,
    resetAndRefetch,
    resetFiltersAndRefetch,
    isDirty,
    replaceSeq,
  };
}
