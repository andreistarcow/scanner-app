import { atom } from 'jotai';

import { SortersAtom } from '../types';

export const sortersDefaults: SortersAtom = {
  trending: {
    orderBy: 'asc',
    rankBy: 'age',
    timeFrame: null
  },
  new: {
    orderBy: 'asc',
    rankBy: 'age',
    timeFrame: null
  }
};

export const sortersAtom = atom<SortersAtom>({ ...sortersDefaults });

