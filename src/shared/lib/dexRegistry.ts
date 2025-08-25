import { Chains } from "@entities/scanner/model/types";

export const CHAIN_EXPLORERS = {
  [Chains.SOL]: 'https://explorer.solana.com/address/',
  [Chains.ETH]: 'https://etherscan.io/address/',
  [Chains.BASE]: 'https://basescan.org/address/',
  [Chains.BSC]: 'https://bscscan.com/address/'
};

export const DEX_REGISTRY = {
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': {
    name: 'Raydium Pool V4',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/raydium.png',
    chain: Chains.SOL
  },
  '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43': {
    name: 'Aerodrome',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/aerodrome.png',
    chain: Chains.ETH,
  },
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': {
    name: 'Uniswap V2',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/uniswap.png',
    chain: Chains.ETH
  },
  '0xCeB90E4C17d626BE0fACd78b79c9c87d7ca181b3': {
    name: 'DeFi Swap Router 2',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/defiswap.png',
    chain: Chains.ETH
  },
  '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506': {
    name: 'SushiSwap',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/sushiswap.png',
    chain: Chains.BSC
  },
  '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F': {
    name: 'SushiSwap',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/sushiswap.png',
    chain: Chains.ETH,
  },
  '0x10ED43C718714eb63d5aA57B78B54704E256024E': {
    name: 'Pankake Swap V3',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png',
    chains: Chains.BSC
  },
  '0x1b81D678ffb9C0263b24A97847620C99d213eB14': {
    name: 'Pankake Swap V3',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png',
    chains: Chains.ETH
  },
  '0x2626664c2603336E57B271c5C0b26F421741e481': {
    name: 'Uniswap V2',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/uniswap.png',
    chain: Chains.BASE
  },
  '0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24': {
    name: 'Uniswap V2',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/uniswap.png',
    chain: Chains.BASE
  },
  '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P': {
    name: 'Pump.fun',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/pumpfun.png',
    chain: Chains.SOL
  },
  'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA': {
    name: 'Pump.fun',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/pumpfun.png',
    chain: Chains.SOL
  },
  'cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG': {
    name: 'Meteora DAMM v2',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/meteora.png',
    chain: Chains.SOL
  },
  'dbcij3LWUppWqq96dh6gJWwBifmcGfLSB5D4DuSMaqN': {
    name: 'Meteora',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/meteora.png',
    chain: Chains.SOL
  },
  'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo': {
    name: 'Meteora',
    logo: 'https://dd.dexscreener.com/ds-data/dexes/meteora.png',
    chain: Chains.SOL
  }
};
