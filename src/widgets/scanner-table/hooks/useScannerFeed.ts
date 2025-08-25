/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';

import { httpGet } from '@/shared/api/client';
import { wsBus } from '@/shared/lib/ws';
import {
  tableDataAtom,
  tablePageAtom,
  loadingAtom,
  errorAtom,
  tableDirtyAtom,
} from '@/widgets/scanner-table/model/atoms';
import { filtersAtom, sortersAtom, TableKey, TokenData } from '@/widgets/scanner-table/model';
import { rowToToken } from '@/shared/model/utils';
import { pairKey, mergeUniqueByPair, uniqScannerRows, calcMarketCap } from '@/widgets/scanner-table/model/utils';
import { ScannerResult, TickEventPayload, PairStatsMsgData, ScannerPairsEventPayload, IncomingWebSocketMessage , GetScannerResultParams , ScannerApiResponse } from '@/shared/api/test-task-types';

import { DirtyAtom, DataAtom, LoadingAtom, ErrorAtom, PageAtom } from "../model/atoms/types";

import { useResetFilters } from './useResetFilters';
type LoadOpts = { expectedId?: number; replace?: boolean };

/**
 * Helper: subscribe to per-pair live updates (price + stats) for a list of tokens.
 */
function subscribeForTokens(tokens: TokenData[]) {
  for (const t of tokens) {
    wsBus.send({ event: 'subscribe-pair', data: { pair: t.pairAddress, token: t.tokenAddress, chain: t.chain } });
    wsBus.send({ event: 'subscribe-pair-stats', data: { pair: t.pairAddress, token: t.tokenAddress, chain: t.chain } });
  }
}

/**
 * Helper: unsubscribe from a list of tokens/pairs to stop receiving live events.
 */
function unsubscribeForTokens(tokens: TokenData[]) {
  for (const t of tokens) {
    wsBus.send({ event: 'unsubscribe-pair', data: { pair: t.pairAddress, token: t.tokenAddress, chain: t.chain } });
    wsBus.send({ event: 'unsubscribe-pair-stats', data: { pair: t.pairAddress, token: t.tokenAddress, chain: t.chain } });
  }
}

/**
 * useScannerFeed
 * ---------------
 * Single source of truth for:
 *  - Fetching paginated scanner data over HTTP (/scanner)
 *  - Subscribing to live updates over WebSocket (prices, stats)
 *  - Reconciling incoming data into your Jotai atoms
 *  - Handling filter/sorter changes and pagination
 *
 * All types are intentionally `any` for maximum permissiveness in integration/debug phases.
 */
export function useScannerFeed(table: TableKey) {
  const [dirty, setDirty] = useAtom<DirtyAtom>(tableDirtyAtom);
  const [data, setData] = useAtom<DataAtom>(tableDataAtom);
  const [page, setPage] = useAtom<PageAtom>(tablePageAtom);
  const [loading, setLoading] = useAtom<LoadingAtom>(loadingAtom);
  const setError = useSetAtom(errorAtom);

  const sorters = useAtomValue(sortersAtom)[table];
  const filters = useAtomValue(filtersAtom)[table];
  const error = useAtomValue(errorAtom)[table];

  const { resetAll } = useResetFilters(table);

  const queryIdRef = useRef<number>(0);
  const mountedRef = useRef<boolean>(true);
  const [replaceSeq, setReplaceSeq] = useState<number>(0);

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
    (value: boolean) => setLoading((ls: LoadingAtom) => ({ ...ls, [table]: value })),
    [setLoading, table]
  );
  const setErrorForTable = useCallback(
    (value: string | null) => setError((es: ErrorAtom) => ({ ...es, [table]: value })),
    [setError, table]
  );
  const setDirtyForTable = useCallback(
    (value: boolean) => setDirty((ds: DirtyAtom) => ({ ...ds, [table]: value })),
    [setDirty, table]
  );
  const setPageForTable = useCallback(
    (value: number) => setPage((ps: PageAtom) => ({ ...ps, [table]: value })),
    [setPage, table]
  );
  const setDataForTableReplace = useCallback(
    (tokens: TokenData[]) => setData((state: DataAtom) => ({ ...state, [table]: tokens })),
    [setData, table]
  );
  const setDataForTableMerge = useCallback(
    (tokens: TokenData[]) =>
      setData((state: DataAtom) => ({
        ...state,
        [table]: mergeUniqueByPair(state[table] ?? [], tokens),
      })),
    [setData, table]
  );

  /**
   * Core HTTP loader
   * - Uses queryIdRef to ignore stale responses
   * - Accepts optional opts to force "replace" behavior when page==1 (e.g., new filter/sort context)
   */
  const loadPage = useCallback(
    async (pageNum: number, opts?: LoadOpts): Promise<void> => {
      const expectedId = opts?.expectedId ?? queryIdRef.current;

      setLoadingForTable(true);

      try {
        const res = await httpGet<ScannerApiResponse>('/scanner', { ...baseParams, page: pageNum });

        // Stale guard: if a newer request took over or component unmounted, drop this result.
        if (!mountedRef.current || expectedId !== queryIdRef.current) return;

        if (res.ok) {
          const rows: ScannerResult[] = uniqScannerRows(res.data?.pairs ?? []);
          const tokens: TokenData[] = rows.map(rowToToken);

          setDirtyForTable(false);

          // Replace page 1 (fresh context) vs append/merge subsequent pages
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
          setErrorForTable(res?.error?.message ?? 'Unknown error');
        }
      } catch (e: any) {
        // Network/runtime error
        if (!mountedRef.current || expectedId !== queryIdRef.current) return;
        setErrorForTable(e?.message ?? 'Network error');
      } finally {
        // Only flip loading off if still current
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

  /**
   * Kickoff: whenever baseParams change (filters/sorters), we:
   *  - increment queryIdRef to invalidate prior inflight requests
   *  - mark table as dirty/loading
   *  - load page 1 with replace=true
   */
  useEffect(() => {
    mountedRef.current = true;

    const nextId = queryIdRef.current + 1;
    queryIdRef.current = nextId;

    setLoadingForTable(true);
    setErrorForTable(null);
    setDirtyForTable(true);

    void loadPage(1, { expectedId: nextId, replace: true });

    return () => {
      // mark as unmounted so late promises don’t write into state
      mountedRef.current = false;
    };
  }, [baseParams, loadPage, setDirtyForTable, setErrorForTable, setLoadingForTable]);

  /**
   * WebSocket lifecycle for current filter context (baseParams):
   *  - subscribe to "scanner-filter" room to receive incremental list updates
   *  - subscribe to per-pair channels for price ticks + stats
   *  - reconcile incoming events into the table slice
   *  - on cleanup, unsubscribe only if this effect still matches the current queryIdRef
   */
  useEffect(() => {
    if (!mountedRef.current) return;

    const localId = queryIdRef.current;

    /** Merge/replace the visible set when scanner emits a new list snapshot */
    const handleScannerPairs = (payload: ScannerPairsEventPayload) => {
      const rows: ScannerResult[] = uniqScannerRows(payload?.results?.pairs ?? []);
      const incoming: TokenData[] = rows.map(rowToToken);

      setData((state: DataAtom): DataAtom => {
        const prev: TokenData[] = state[table] ?? [];
        const prevMap = new Map(prev.map((t) => [pairKey(t), t]));

        const reconciled: TokenData[] = incoming.map((n: any) => {
          const k = pairKey(n);
          const p = prevMap.get(k);
          return p ? { ...p, ...n } : n;
        });

        queueMicrotask(() => subscribeForTokens(reconciled));

        return { ...state, [table]: reconciled };
      });
    };

    /** Update price + derived mcap on ticks without recreating the whole list */
    const handleTick = (payload: TickEventPayload) => {
      const pairPayload = payload?.pair;
      const swaps = payload?.swaps ?? [];
      const latestSwap = swaps.filter((s) => !s?.isOutlier).pop();
      if (!latestSwap || !pairPayload) return;

      const newPrice = parseFloat(latestSwap.priceToken1Usd);
      if (!Number.isFinite(newPrice)) return;

      setData((state: DataAtom): DataAtom => {
        const list: TokenData[] = state[table] ?? [];
        let changed = false;

        const updated = list.map((token: TokenData) => {
          const same = token.pairAddress === pairPayload.pair && token.tokenAddress === pairPayload.token;
          if (!same) return token;
          changed = true;
          const newMcap = calcMarketCap(token, newPrice);
          return { ...token, priceUsd: newPrice, mcap: newMcap };
        });

        return changed ? { ...state, [table]: updated } : state;
      });
    };

    /** Patch structural stats (audit flags, socials, liquidity, migration progress) */
    const handlePairStats = (payload: PairStatsMsgData) => {
      const stats = payload;
      const pairAddress = stats?.pair?.pairAddress;
      if (!pairAddress) return;

      setData((state: DataAtom): DataAtom => {
        const list: TokenData[] = state[table] ?? [];
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
      if (localId !== queryIdRef.current) return; // stale context => ignore

      switch (message.event) {
        case 'scanner-pairs':
          handleScannerPairs(message.data);
          break;
        case 'tick':
          handleTick(message.data);
          break;
        case 'pair-stats':
          handlePairStats(message.data);
          break;
        default:
          break;
      }
    });

    wsBus.send({ event: 'scanner-filter', data: { ...baseParams } });

    // Also subscribe to currently visible tokens so we get ticks/stats immediately
    const currentTokens: TokenData[] = data[table] ?? [];
    subscribeForTokens(currentTokens);

    return () => {
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
