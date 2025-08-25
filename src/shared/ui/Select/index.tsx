import React from "react";

import { ArrowDownIcon } from "../icons";

interface Option {
  title: string;
  value: string;
  icon?: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
}) => {
  return (
    <div className="mx-auto max-w-sm">
      {label && (
        <label
          htmlFor="dropdown"
          className="mb-2 block text-xs font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
      )}

      <div className="relative w-max">
        <select
          id="dropdown"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-auto max-w-72 appearance-none text-nowrap rounded-[3px] border border-white/20
                     bg-white/5 px-2 py-1.5 pr-8 text-xs
                     text-white transition
                     hover:border-white/30 hover:bg-white/30"
        >
          {options.map((opt) => (
            <option
              key={opt.title + opt.value}
              value={opt.value}
              className="bg-black text-white"
            >
              {opt.title}
            </option>
          ))}
        </select>
        <ArrowDownIcon className="pointer-events-none absolute right-2 top-1/2 mt-0.5 -translate-y-1/2 text-white/70" />
      </div>
    </div>
  );
};
