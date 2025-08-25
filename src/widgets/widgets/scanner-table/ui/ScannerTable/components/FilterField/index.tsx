import React from "react";

interface FilterFieldProps {
  label?: string;
  children: React.ReactNode;
}

export const FilterField: React.FC<FilterFieldProps> = ({ label, children }) => {
  return (
    <label
      className="
        flex flex-col
        justify-center
        border-r
        border-white/10 bg-gray-950
        px-3
        py-2
        align-middle
        last:border-r-0
      "
    >
      {label && <span className="text-xs text-slate-400">{label}</span>}
      <div className="flex-1">{children}</div>
    </label>
  );
};
