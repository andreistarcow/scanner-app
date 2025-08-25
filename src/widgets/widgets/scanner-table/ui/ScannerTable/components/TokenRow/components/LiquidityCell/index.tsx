import React from "react";

import { formatValue as fmt } from "@/shared/lib/formatValue";
import { Liquidity } from "@/widgets/scanner-table/model";
import { Percentage } from "@/shared/ui";
import { TableCell } from "@/widgets/scanner-table";

interface LiquidityCellProps {
  liquidity?: Liquidity;
}

const LiquidityCellComponent: React.FC<LiquidityCellProps> = ({ liquidity }) => {
  if (!liquidity) return;
  return (
    <TableCell>
      <span className='font-mono text-white'>
        ${fmt(liquidity.current)}
      </span>
      <span className="text-white/20">/</span>
      <span className="font-mono text-white/30">
        <Percentage value={liquidity.changePc} />
      </span>
    </TableCell>
  );
};

export const LiquidityCell = React.memo(LiquidityCellComponent);
