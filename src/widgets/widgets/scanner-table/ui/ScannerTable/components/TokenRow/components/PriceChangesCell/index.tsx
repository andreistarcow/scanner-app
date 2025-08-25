import React from "react";

import { Percentage } from "@/shared/ui";
import { TableCell } from "@/widgets/scanner-table";

interface PriceChangesProps {
  period: '5m' | '1h' | '6h' | '24h'
  priceChangePcs: {
    [key: string]: number;
  };
}

const PriceChangesCellComponent: React.FC<PriceChangesProps> = ({ period, priceChangePcs }) => {
  return (
    <TableCell>
      <span className="flex items-center gap-0.5">
        <Percentage value={priceChangePcs[period]} />
      </span>
    </TableCell>
  );
};

export const PriceChangesCell = React.memo(PriceChangesCellComponent);
