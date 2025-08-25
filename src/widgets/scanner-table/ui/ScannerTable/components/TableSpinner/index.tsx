import React from "react";
import { BarLoader } from "react-spinners";

interface TableSpinnerProps {
  loading: boolean;
  message?: string;
}

export const TableSpinner: React.FC<TableSpinnerProps> = ({ loading }) => {
  if (!loading) return null;
  return (
    <div className="sticky inset-x-0 bottom-0 left-5 justify-center py-0 text-center align-middle text-base text-slate-500">
      {loading && <BarLoader width={'100%'} height={15} color={`rgba(255,255,255,0.1)`} />}
    </div>
  );
};
