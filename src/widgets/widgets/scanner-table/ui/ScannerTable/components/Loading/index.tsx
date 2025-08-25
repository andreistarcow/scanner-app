import React from "react";

interface LoadingProps {
  loading: boolean;
  message?: string;
}

export const TableLoading: React.FC<LoadingProps> = ({ loading, message = "Loading…" }) => {
  if (!loading) return null;
  return (
    <div className="py-3 text-center text-base text-slate-500">
      {message}
    </div>
  );
};
