import { useAtomValue } from 'jotai';

import type { TableKey } from '@/widgets/scanner-table/model';
import { errorAtom, tablePageAtom, loadingAtom } from '@/widgets/scanner-table/model';

export function useTableState(table: TableKey) {
  const pageMap = useAtomValue(tablePageAtom);
  const loadingMap = useAtomValue(loadingAtom);
  const errorMap = useAtomValue(errorAtom);

  return {
    page: pageMap[table],
    loading: loadingMap[table],
    error: errorMap[table],
  };
}
