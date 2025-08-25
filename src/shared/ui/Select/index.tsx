import React from "react";

import { ImgIcon } from "../ImgIcon";

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
          className="mb-2 block text-xs font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}
      <select
        id="dropdown"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-auto max-w-72 text-nowrap rounded-[3px] border border-white/20
                   bg-white/10 px-2 py-1 text-xs
                   text-white transition
                   hover:border-white/30 hover:bg-white/30">
        {options.map((opt) => (
          <option key={opt.title + opt.value} value={opt.value} className="bg-black text-white">
            {opt.icon && <ImgIcon className='mr-1' src={opt.icon} alt={opt.title} />} {opt.title}
          </option>
        ))}
      </select>
    </div>
  );
};
