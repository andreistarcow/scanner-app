import React from "react";

import { ErrorIcon, SuccessIcon } from "../icons";

interface StatusIconProps {
  ok: boolean;
  label: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ ok, label }) => {
  const Icon = ok ? SuccessIcon : ErrorIcon;

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div
        className={[
          "flex h-6 w-6 items-center justify-center rounded-full"
        ].join(" ")}
      >
        <Icon className="size-5" />
      </div>
      <span className="text-[10px] leading-tight text-slate-300">{label}</span>
    </div>
  );
};
