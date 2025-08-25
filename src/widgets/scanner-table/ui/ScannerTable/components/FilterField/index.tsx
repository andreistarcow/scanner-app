import React from "react";

interface FilterFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export const FilterField: React.FC<FilterFieldProps> = ({ label, children, className }) => {
  return (
    <label
      className={`
        inline-flex w-auto
        flex-col
        justify-center
        bg-gray-950 p-2
        last:border-r-0
        ${className}
      `}
    >
      {label && <span className="whitespace-nowrap text-xs text-slate-400">{label}</span>}
      <div className="w-auto">{children}</div>
    </label>
  );
};
