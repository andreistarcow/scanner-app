import { atom } from "jotai";

import { type TableKey } from "@/widgets/scanner-table/model";

import { TokenData } from "../types";

export const tableDataAtom = atom<Record<TableKey, TokenData[]>>({
  trending: [],
  new: [],
});

export const tableDirtyAtom = atom<Record<TableKey, boolean>>({
  trending: true,
  new: true,
});

export const tablePageAtom = atom<Record<TableKey, number>>({
  trending: 1,
  new: 1
});

export const loadingAtom = atom<Record<TableKey, boolean>>({
  trending: false,
  new: false
});

export const errorAtom = atom<Record<TableKey, string | null>>({
  trending: null,
  new: null
});