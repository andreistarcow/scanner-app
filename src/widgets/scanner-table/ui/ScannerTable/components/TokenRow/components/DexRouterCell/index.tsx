import React, { useCallback } from "react";

import { DEX_REGISTRY } from "@shared/lib/dexRegistry";
import { DexIcon , UnknownAssetIcon } from "@shared/ui";
import { TableCell } from "@widgets/scanner-table";
import { Chains } from "@entities/scanner/model/types";
import { chainExplorerLink } from "@shared/lib/explorer";
import { SupportedChainName } from "@shared/api/test-task-types";

interface DexRouterProps {
  router?: string;
  chain: SupportedChainName;
}

const DexRouterCellComponent: React.FC<DexRouterProps> = ({ router, chain }) => {
  const dex = DEX_REGISTRY[router as keyof typeof DEX_REGISTRY];

  const label = dex ? dex.name : router;

  const handleOpenExplorer = useCallback(() => {
    if (router && chain) window.open(chainExplorerLink(router, chain as Chains), 'blank')?.focus();
  }, [router, chain]);

  return (
    <TableCell>
      <button onClick={handleOpenExplorer} className={`flex flex-row gap-1 ${router && chain && 'cursor-pointer'}`}>
        {!dex ? <div className="size-5"><UnknownAssetIcon /></div> : <DexIcon dex={router} />}
        <span className='ml-0.5 mt-0.5'>{label}</span>
      </button>
    </TableCell>
  );
};

export const DexRouterCell = React.memo(DexRouterCellComponent);
