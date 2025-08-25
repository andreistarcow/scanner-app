import { atom } from 'jotai';

import { SortersAtom } from '../types';

export const sortersInitialState: SortersAtom = {
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

export const sortersAtom = atom<SortersAtom>(sortersInitialState);

