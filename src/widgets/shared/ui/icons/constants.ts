import { Chains } from "@/entities/scanner/model/types";

export const NETWORK_ICONS: Record<Chains, string> = {
  [Chains.SOL]: 'https://app.dexcelerate.com/graphics/raster/solana.jpg',
  [Chains.BASE]: 'https://app.dexcelerate.com/graphics/raster/base.jpg',
  [Chains.ETH]: 'https://app.dexcelerate.com/graphics/raster/ethereum.jpg',
  [Chains.BSC]: 'https://app.dexcelerate.com/graphics/raster/bsc.jpg'
};
