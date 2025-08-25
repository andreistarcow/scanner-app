import { SerdeRankBy, OrderBy, TimeFrame } from '@/shared/api/test-task-types';
import type { SupportedChainName as Chain } from '@/shared/api/test-task-types';
export type TableKey = 'trending' | 'new'

export type TopFilter = 'volume' | 'transactions' | null;
export type TimeRange = '5m' | '1h' | '6h' | '24h' | null;

export interface Filters {
  chain: 'ETH' | 'SOL' | 'BASE' | 'BSC' | 'ALL';
  minVolume: number;
  maxAgeHours: number | null;
  minMcap: number;
  excludeHoneypot: boolean;
  liquidity: number;
  top: TopFilter;
  timeRange: TimeRange;
}

export enum Tables {
  TRENDING = 'trending',
  NEW = 'new'
}

export type Data = Record<TableKey, TokenData[]>
export type Page = Record<TableKey, number>
export type Loading = Record<TableKey, boolean>
export type Error = Record<TableKey, string | null>
export type TableFilters = Record<TableKey, Filters>;

export type Sorters = {
  orderBy: OrderBy;
  rankBy: SerdeRankBy;
  timeFrame: TimeFrame | null;
};

export type SortersAtom = Record<TableKey, Sorters>;

export type PriceChanges = {
  '5m': number;
  '1h': number;
  '6h': number;
  '24h': number
}

export interface Socials {
  telegram?: string;
  twitter?: string;
  website?: string;
  discord?: string;
}

export interface Audit {
  mintable: boolean;
  freezable: boolean;
  honeypot: boolean;
  contractVerified: boolean;
}

export interface Liquidity {
  current: number;
  changePc: number
}

export interface Transactions { 
  buys: number;
  sells: number;
}

export interface TokenData {
  id: string;
  mcap1?: number;
  tokenName: string;
  token0Symbol: string;
  token1Symbol: string;
  tokenSymbol: string;
  tokenAddress: string;
  pairAddress: string;
  chain: Chain;
  exchange: string;
  priceUsd: number;
  volumeUsd: number;
  mcap: number;
  priceChangePcs: PriceChanges;
  transactions: Transactions;
  audit: Audit;
  tokenCreatedTimestamp: Date;
  liquidity: Liquidity;
  migrationPc?: number
  socials?: Socials;
}


