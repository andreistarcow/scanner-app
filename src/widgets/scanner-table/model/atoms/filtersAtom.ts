import { atom } from 'jotai';

import type { TableFilters } from '../types';

export const filtersInitialState: TableFilters = {
  trending: {
    liquidity: 0,
    chain: 'ALL',
    minVolume: 0,
    maxAgeHours: null,
    minMcap: 0,
    excludeHoneypot: false,
    top: null,
    timeRange: null
  },
  new: {
    liquidity: 0,
    chain: 'ALL',
    minVolume: 0,
    maxAgeHours: null,
    minMcap: 0,
    excludeHoneypot: false,
    top: null,
    timeRange: null
  }
};

export const filtersAtom = atom<TableFilters>(filtersInitialState);

