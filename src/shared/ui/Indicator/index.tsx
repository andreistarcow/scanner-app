import React from "react";

interface IndicatorProps {
  enabled: boolean;
  className?: string;
}

export const Indicator: React.FC<IndicatorProps> = ({ enabled, className }) => {
  return (
    <div
      className={`
        size-1.5 rounded-full 
        ${enabled ? "bg-green-500" : "bg-white/40"} 
        ${className ?? ""}
      `}
    />
  );
};
