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

export function useScannerFeed(table: TableKey) {
  const [dirty, setDirty] = useAtom(tableDirtyAtom);
  const { resetAll } = useResetFilters(table);
  const [data, setData] = useAtom(tableDataAtom);
  const [page, setPage] = useAtom(tablePageAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const sorters = useAtomValue(sortersAtom)[table];
  const filters = useAtomValue(filtersAtom)[table];
  const error = useAtomValue(errorAtom)[table];
  const setError = useSetAtom(errorAtom);

  const isDirty = dirty[table];
  const chain = filters.chain === 'ALL' ? null : filters.chain;
  const isNotHP = filters.excludeHoneypot;
  const timeFrame = sorters.timeFrame;

  const baseParams: GetScannerResultParams = useMemo(
    () => ({
      ...sorters,
      isNotHP,
      chain,
      timeFrame: timeFrame || undefined,
    }),
    [isNotHP, chain, sorters, timeFrame]
  );

  const queryIdRef = useRef(0);

  const [replaceSeq, setReplaceSeq] = useState(0);

  const loadPage = useCallback(
    async (pageNum: number, opts?: LoadOpts): Promise<void> => {
      const localId = opts?.expectedId ?? queryIdRef.current;

      setLoading((ls: Loading): Loading => ({ ...ls, [table]: true }));

      const response = await httpGet<ScannerApiResponse>('/scanner', { ...baseParams, page: pageNum });

      if (localId !== queryIdRef.current) {
        setLoading((ls: Loading): Loading => ({ ...ls, [table]: false }));
        return;
      }

      if (response.ok) {
        const rows: ScannerResult[] = uniqScannerRows(response.data.pairs ?? []);
        const tokens: TokenData[] = rows.map(rowToToken);

        setDirty((prev) => ({ ...prev, [table]: false }));

        setData((dataState: Data): Data => {
          if (pageNum === 1 && opts?.replace) {
            return { ...dataState, [table]: tokens };
          }
          return {
            ...dataState,
            [table]: pageNum === 1 ? tokens : mergeUniqueByPair(dataState[table] ?? [], tokens),
          };
        });

        setLoading((ls: Loading): Loading => ({ ...ls, [table]: false }));
        setError((errorState: Error): Error => ({ ...errorState, [table]: false }));

        if (pageNum === 1 && opts?.replace) {
          setPage((pageState: Page): Page => ({ ...pageState, [table]: 1 }));
          setReplaceSeq((n) => n + 1);
        } else {
          setPage((pageState: Page): Page => ({ ...pageState, [table]: pageNum }));
        }
      } else {
        setError((errorState: Error): Error => ({ ...errorState, [table]: response.error.message }));
      }

    },
    [baseParams, setData, setError, setLoading, setPage, table, setDirty]
  );

  useEffect(() => {
    const nextId = queryIdRef.current + 1;
    queryIdRef.current = nextId;

    setLoading((ls: Loading): Loading => ({ ...ls, [table]: true }));
    setError((prev: Error): Error => ({ ...prev, [table]: null }));
    setDirty((prev) => ({ ...prev, [table]: true }));

    loadPage(1, { expectedId: nextId, replace: true });
  }, [baseParams, loadPage, setDirty, setError, setLoading, table]);

  useEffect(() => {
    const localId = queryIdRef.current;

    const unsubscribe = wsBus.subscribe((message: IncomingWebSocketMessage) => {
      if (!message || typeof message !== 'object' || !('event' in message)) return;
      if (localId !== queryIdRef.current) return;

      if (message.event === 'scanner-pairs') {
        const rows: ScannerResult[] = uniqScannerRows(message.data?.results?.pairs ?? []);
        const incoming: TokenData[] = rows.map(rowToToken);

        setData((dataState: Data): Data => {
          const previous: TokenData[] = dataState[table] ?? [];
          const previousMap = new Map(previous.map((token) => [pairKey(token), token]));
          const reconciled: TokenData[] = incoming.map((nextToken) => {
            const key = pairKey(nextToken);
            const prevToken = previousMap.get(key);
            return prevToken ? { ...prevToken, ...nextToken } : nextToken;
          });

          queueMicrotask(() => {
            for (const token of reconciled) {
              wsBus.send({
                event: 'subscribe-pair',
                data: { pair: token.pairAddress, token: token.tokenAddress, chain: token.chain },
              });
              wsBus.send({
                event: 'subscribe-pair-stats',
                data: { pair: token.pairAddress, token: token.tokenAddress, chain: token.chain },
              });
            }
          });

          return { ...dataState, [table]: reconciled };
        });
      }

      if (message.event === 'tick') {
        const pairPayload = message.data?.pair;
        const swaps = message.data?.swaps ?? [];
        const latestSwap = swaps.filter((swap) => !swap.isOutlier).pop();
        if (!latestSwap || !pairPayload) return;

        const newPrice = parseFloat(latestSwap.priceToken1Usd);

        setData((dataState: Data): Data => {
          const list = dataState[table] ?? [];
          let changed = false;

          const updated = list.map((token) => {
            const isSamePair =
              token.pairAddress === pairPayload.pair && token.tokenAddress === pairPayload.token;
            if (!isSamePair) return token;
            changed = true;
            const newMcap = calcMarketCap(token, newPrice);
            return { ...token, priceUsd: newPrice, mcap: newMcap };
          });

          return changed ? { ...dataState, [table]: updated } : dataState;
        });
      }

      if (message.event === 'pair-stats') {
        const stats = message.data;
        const pairAddress = stats?.pair?.pairAddress;
        if (!pairAddress) return;

        setData((dataState: Data): Data => {
          const list = dataState[table] ?? [];
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

          return changed ? { ...dataState, [table]: updated } : dataState;
        });
      }
    });

    wsBus.send({ event: 'scanner-filter', data: { ...baseParams } });

    const currentTokens: TokenData[] = data[table] ?? [];
    for (const token of currentTokens) {
      wsBus.send({
        event: 'subscribe-pair',
        data: { pair: token.pairAddress, token: token.tokenAddress, chain: token.chain },
      });
      wsBus.send({
        event: 'subscribe-pair-stats',
        data: { pair: token.pairAddress, token: token.tokenAddress, chain: token.chain },
      });
    }

    return () => {
      wsBus.send({ event: 'unsubscribe-scanner-filter', data: { ...baseParams } });
      for (const token of data[table] ?? []) {
        wsBus.send({
          event: 'unsubscribe-pair',
          data: { pair: token.pairAddress, token: token.tokenAddress, chain: token.chain },
        });
        wsBus.send({
          event: 'unsubscribe-pair-stats',
          data: { pair: token.pairAddress, token: token.tokenAddress, chain: token.chain },
        });
      }
      unsubscribe();
    };
  }, [baseParams, data, setData, table]);

  const resetAndRefetch = useCallback(async (): Promise<void> => {
    const nextId = queryIdRef.current + 1;
    queryIdRef.current = nextId;

    setLoading((ls: Loading): Loading => ({ ...ls, [table]: true }));
    setError((prev: Error): Error => ({ ...prev, [table]: null }));
    setDirty((prev) => ({ ...prev, [table]: true }));

    await loadPage(1, { expectedId: nextId, replace: true });
  }, [setError, table, loadPage, setDirty, setLoading]);


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