import React from "react";

import { TableCell } from "@/widgets/scanner-table";

interface AgeCellProps {
  createdAt?: Date;
}

const AgeCellComponent: React.FC<AgeCellProps> = ({ createdAt }) => {
  if (!createdAt) return;
  const now = Date.now();
  const mins = Math.max(1, Math.floor((now - createdAt.getTime()) / 60000));

  const formatted =
    mins < 60
      ? `${mins}m`
      : mins < 48 * 60
      ? `${Math.floor(mins / 60)}h`
      : mins < 365 * 24 * 60
      ? `${Math.floor(mins / (60 * 24))}d`
      : `${Math.floor(mins / (60 * 24 * 365))}y`;

  return (
    <TableCell>
      <span className="font-xs font-mono">{formatted}</span>
    </TableCell>
  );
};

export const AgeCell = React.memo(AgeCellComponent);
