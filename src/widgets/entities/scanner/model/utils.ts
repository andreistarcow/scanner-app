import type { ScannerResult } from '@shared/api/test-task-types';
import { chainIdToName } from '@shared/api/test-task-types';
import type { TokenData } from '@widgets/scanner-table/model';

function pickNumber(x: unknown, def = 0): number {
  const n = typeof x === 'string' ? parseFloat(x) : typeof x === 'number' ? x : def;
  return Number.isFinite(n) ? n : def;
}

export function mcapFromRow(r: ScannerResult): number {
  const candidates = [r.currentMcap, r.initialMcap, r.pairMcapUsd, r.pairMcapUsdInitial];
  for (const c of candidates) {
    const v = pickNumber(c, -1);
    if (v > 0) return v;
  }
  if (r.token1TotalSupplyFormatted && r.price) {
    return pickNumber(r.token1TotalSupplyFormatted, 0) * pickNumber(r.price, 0);
  }
  return 0;
}

export function rowToToken(r: ScannerResult): TokenData {
  return {
    id: r.pairAddress,
    tokenName: r.token1Name || r.token0Symbol,
    tokenSymbol: r.token1Symbol,
    token0Symbol: r.token0Symbol,
    token1Symbol: r.token1Symbol,
    tokenAddress: r.token1Address,
    pairAddress: r.pairAddress,
    chain: chainIdToName(r.chainId),
    exchange: r.routerAddress || r.virtualRouterType || 'Unknown',
    priceUsd: pickNumber(r.price, 0),
    volumeUsd: pickNumber(r.volume, 0),
    mcap: mcapFromRow(r),
    priceChangePcs: {
      '5m': pickNumber(r.diff5M, 0),
      '1h': pickNumber(r.diff1H, 0),
      '6h': pickNumber(r.diff6H, 0),
      '24h': pickNumber(r.diff24H, 0),
    },
    transactions: {
      buys: r.buys ?? 0,
      sells: r.sells ?? 0,
    },
    audit: {
      mintable: !r.isMintAuthDisabled,
      freezable: !r.isFreezeAuthDisabled,
      honeypot: r.honeyPot === true,
      contractVerified: r.contractVerified,
    },
    tokenCreatedTimestamp: new Date(r.age),
    liquidity: {
      current: pickNumber(r.liquidity, 0),
      changePc: pickNumber(r.percentChangeInLiquidity, 0),
    },
    socials: {
      telegram: r.telegramLink ?? undefined,
      twitter: r.twitterLink ?? undefined,
      website: r.webLink ?? undefined,
      discord: r.discordLink ?? undefined,
    },
  };
}
