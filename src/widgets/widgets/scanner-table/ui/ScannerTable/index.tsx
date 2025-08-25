import React, { useCallback, useEffect, useRef } from 'react';
import { useVirtualizer, elementScroll } from '@tanstack/react-virtual';
import { useAtom , useAtomValue } from 'jotai';

import { SerdeRankBy } from '@/shared/api/test-task-types';
import { useScannerFeed, useFilters } from '@/widgets/scanner-table/hooks';
import { sortersAtom, errorAtom, TableKey } from '@/widgets/scanner-table/model';
import type { TokenData } from '@/widgets/scanner-table/model';
import { ErrorMessage, NoDataMessage } from '@/shared/ui';

import { TableHeader, TokenRow, TableLoading, TableContainer } from './components';
import { VirtualRows } from './components/VirtualRows';

export interface ScannerTableProps {
  title: string;
  table: TableKey;
  rankBy: 'volume' | 'age';
}

const ROW_ESTIMATE = 81.5;

export const ScannerTable: React.FC<ScannerTableProps> = ({ title, table }) => {
  const list = useFilters(table) as TokenData[];
  const {
    loading,
    isDirty,
    loadMore,
    resetAndRefetch,
    replaceSeq,
  } = useScannerFeed(table);

  const isError = useAtomValue(errorAtom)[table];
  const [sorters, setSorters] = useAtom(sortersAtom);
  const tableSorters = sorters[table];

  const toggleSort = useCallback(
    (key: SerdeRankBy) => {
      const next =
        tableSorters.rankBy === key
          ? { rankBy: key, orderBy: tableSorters.orderBy === 'desc' ? 'asc' : 'desc' }
          : { rankBy: key, orderBy: 'desc' };
      setSorters({ ...sorters, [table]: next });
    },
    [setSorters, sorters, table, tableSorters]
  );

  const scrollParentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (replaceSeq > 0) {
      const el = scrollParentRef.current;
      if (el) el.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [replaceSeq]);

  const rowVirtualizer = useVirtualizer({
    count: list.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => ROW_ESTIMATE,
    overscan: 12,
    scrollToFn: elementScroll,
  });

  useEffect(() => {
    const items = rowVirtualizer.getVirtualItems();
    const last = items[items.length - 1];
    if (!last) return;
    const isCloseToEnd = last.index >= list.length - 5;
    if (isCloseToEnd && !loading) loadMore();
  }, [list.length, loading, loadMore, rowVirtualizer]);

  useEffect(() => {
    if (!loading && list.length > 0) {
      const total = rowVirtualizer.getTotalSize();
      const parent = scrollParentRef.current;
      if (parent && total <= parent.clientHeight) loadMore();
    }
  }, [list.length, loading, rowVirtualizer, loadMore]);

  if (!loading && list.length === 0 && !isDirty) {
    return (
      <TableContainer title={title} table={table}>
        <NoDataMessage message="No data for this parameters" />
      </TableContainer>
    );
  }

  return (
    <TableContainer title={title} table={table}>
      {isError && !loading ? (
        <ErrorMessage
          message="Failed to fetch table data"
          buttonText="Retry"
          onButtonClick={() => resetAndRefetch()}
        />
      ) : (
        <div
          ref={scrollParentRef}
          className="relative min-w-[1400px] flex-1 overflow-y-scroll bg-gray-950"
        >
          <TableHeader table={table} onSort={toggleSort} />
          <VirtualRows<TokenData>
            table={table}
            virtualizer={rowVirtualizer}
            items={list}
            renderRow={(token) => <TokenRow token={token} />}
          />
          <TableLoading loading={loading} />
        </div>
      )}
    </TableContainer>
  );
};
