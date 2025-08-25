import React from "react";

import { Indicator } from "../Indicator";

interface ButtonProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ active = false, onClick, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        mt-4
        flex flex-row items-center justify-center
        rounded-[3px] border px-2 py-1 text-xs font-medium text-white
        transition-opacity
        ${active 
          ? "border-white/90 opacity-100" 
          : "border-white/40 opacity-40 hover:opacity-90"}
      `}
    >
      <div className="mr-1.5">
        <Indicator enabled={active} />
      </div>
      {children}
    </button>
  );
};
