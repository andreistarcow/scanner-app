import React, { useCallback, useMemo } from 'react';
import { useAtom } from 'jotai';

import { Select } from '@shared/ui';
import { sortersAtom, type TableKey } from '@widgets/scanner-table/model';
import { FilterField , useScannerFeed } from '@widgets/scanner-table';
import { TimeFrame } from '@shared/api/test-task-types';

const timeOptions = [
  { title: 'Any', value: 'any' },
  { title: 'Last 5m', value: '5M' },
  { title: 'Last 1h', value: '1H' },
  { title: 'Last 6h', value: '6H' },
  { title: 'Last 24h', value: '24H' },
]; 

interface TimeRangeFilterProps {
  table: TableKey;
}

export const Last24Filter: React.FC<TimeRangeFilterProps> = ({ table }) => {
  const { resetAndRefetch } = useScannerFeed(table);
  const [sorters, setSorters] = useAtom(sortersAtom);
  const current = sorters[table].timeFrame;

  const uiValue = useMemo(() => current, [current]);

  const handleChange = useCallback((v: string | number | null) => {
    const val = String(v);
    setSorters(prev => ({
      ...prev,
      [table]: { 
        ...prev[table], 
        timeFrame: val === 'any' ? null : val as TimeFrame,
      },
    }));
    resetAndRefetch();
  }, [setSorters, table, resetAndRefetch]);
  

  return (
    <FilterField label="Last">
      <Select options={timeOptions} value={uiValue as string} onChange={handleChange} />
    </FilterField>
  );
};
