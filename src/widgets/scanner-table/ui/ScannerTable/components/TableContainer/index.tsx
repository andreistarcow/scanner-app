import React from "react";

import { TableKey } from "@/widgets/scanner-table/model";

import { FiltersBar } from "../filters";

export interface ScannerTableProps {
  title: string;
  table: TableKey;
  children: React.ReactNode;
}

export const TableContainer: React.FC<ScannerTableProps> = ({ title, table, children }) => {
  return (
    <div className="flex min-h-[94vh] w-full flex-col overflow-y-scroll border border-white/10 bg-gray-950">
      <div className="flex items-center justify-between p-1 px-2">
        <span className="text-xs font-semibold">{title}</span>
      </div>
      <FiltersBar table={table} />
      {children}
    </div>
  );
};
