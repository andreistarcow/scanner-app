import React from "react";
import { BarLoader } from "react-spinners";

interface LoadingProps {
  loading: boolean;
  message?: string;
}

export const TableLoading: React.FC<LoadingProps> = ({ loading }) => {
  if (!loading) return null;
  return (
    <div className="absolute inset-x-0 bottom-0 justify-center py-3 text-center align-middle text-base text-slate-500">
      <BarLoader width={'90%'} height={10} color={`rgba(255,255,255,0.1)`} />
    </div>
  );
};
