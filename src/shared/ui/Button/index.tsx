import React from "react";

import { Indicator } from "../Indicator";

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement>{
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  indicator?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ className, active = false, onClick, children, indicator }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`
        inline-flex flex-row items-center justify-center
        whitespace-nowrap rounded-[2px] border px-2 py-1.5 text-xs text-white
        transition-opacity
        ${active 
          ? "border-white/50 bg-white/10" 
          : "border-white/20 bg-white/5 hover:bg-white/10"}
        ${className}
      `}
    >
      {indicator && <div className="mr-1.5 shrink-0">
        <Indicator enabled={active} />
      </div>}
      {children}
    </button>
  );
};
