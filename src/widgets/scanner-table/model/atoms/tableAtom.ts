import { atom } from "jotai";

import { DirtyAtom, DataAtom, LoadingAtom, ErrorAtom, PageAtom } from "./types";

export const tableDataAtom = atom<DataAtom>({
  trending: [],
  new: [],
});

export const tableDirtyAtom = atom<DirtyAtom>({
  trending: true,
  new: true,
});

export const tablePageAtom = atom<PageAtom>({
  trending: 1,
  new: 1
});

export const loadingAtom = atom<LoadingAtom>({
  trending: false,
  new: false
});

export const errorAtom = atom<ErrorAtom>({
  trending: null,
  new: null
});