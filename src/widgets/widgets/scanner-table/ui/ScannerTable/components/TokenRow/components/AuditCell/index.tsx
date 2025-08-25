import React from "react";

import { StatusIcon } from "@shared/ui";
import { TableCell } from "@widgets/scanner-table";
import { Audit } from "@widgets/scanner-table/model";

interface LiquidityCellProps {
  audit?: Audit;
}

const AuditCellComponent: React.FC<LiquidityCellProps> = ({ audit }) => {
  if (!audit) return;
  return (
    <TableCell className='flex flex-row justify-center gap-2 align-middle'>
      <StatusIcon label='Mintable' ok={audit.mintable} />
      <StatusIcon label='Freezeable' ok={audit.freezable} />
      <StatusIcon label='Honeypot' ok={audit.honeypot} />
      <StatusIcon label='Verified' ok={audit.contractVerified} />
    </TableCell>
  );
};

export const AuditCell = React.memo(AuditCellComponent);
