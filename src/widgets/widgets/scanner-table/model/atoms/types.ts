
import type { TokenData } from "@widgets/scanner-table/model";
import { TableKey } from "@widgets/scanner-table/model";

export type Data = Record<TableKey, TokenData[]>
export type Page = Record<TableKey, number>
export type Loading = Record<TableKey, boolean>
export type Error = Record<TableKey, string | null>