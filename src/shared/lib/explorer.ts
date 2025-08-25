import { Chains } from "@/shared/model/types";

import { CHAIN_EXPLORERS } from "./dexRegistry";

export const chainExplorerLink = (address: string, chain: Chains) => {
  const explorer = CHAIN_EXPLORERS[chain];
  return `${explorer}${address}`;
}; 