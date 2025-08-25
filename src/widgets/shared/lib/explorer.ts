import { Chains } from "@/entities/scanner/model/types";

import { CHAIN_EXPLORERS } from "./dexRegistry";

export const chainExplorerLink = (address: string, chain: Chains) => {
  const explorer = CHAIN_EXPLORERS[chain];
  console.log({ address, chain, explorer });
  return `${explorer}${address}`;
}; 