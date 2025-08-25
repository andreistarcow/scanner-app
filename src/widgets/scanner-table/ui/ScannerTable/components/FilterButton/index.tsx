import React from 'react';
import clsx from 'clsx';

interface FilterButtonProps {
  label: string
  active: boolean
  onClick: () => void
}

export const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'border-slate-600 bg-slate-700 text-white'
          : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white'
      )}
    >
      {label}
    </button>
  );
};
