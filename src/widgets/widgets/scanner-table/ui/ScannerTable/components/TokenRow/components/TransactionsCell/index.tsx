import React from "react";

import { formatCount } from "@widgets/scanner-table/model/utils";
import { Transactions } from "@widgets/scanner-table/model";
import { TableCell } from "@widgets/scanner-table";

interface TransactionsCellProps {
  transactions: Transactions;
}

const TransactionsCellComponent: React.FC<TransactionsCellProps> = ({ transactions }) => {
  const total = transactions.buys + transactions.sells;

  return (
    <TableCell>
      <div className=" flex flex-col items-start justify-center text-center font-mono text-xs leading-tight">
        <span style={{ fontSize: '11px' }} className="text-xs text-white">{formatCount(total)}</span>
        <div className="flex items-start justify-center gap-1 text-center text-xs">
          <span style={{ fontSize: '11px' }} className="font-mono text-xs text-green-500">{formatCount(transactions.buys)}</span>
          <span style={{ fontSize: '11px' }} className="font-mono text-xs text-white/30">/</span>
          <span style={{ fontSize: '11px' }} className="font-mono text-xs text-red-600">{formatCount(transactions.sells)}</span>
        </div>
      </div>
    </TableCell>
  );
};

export const TransactionsCell = React.memo(TransactionsCellComponent);
