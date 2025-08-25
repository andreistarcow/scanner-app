import React from 'react';
import clsx from 'clsx';

import { formatValue } from '@shared/lib/formatValue';

import { PercentageProps } from './types';

const PercentageComponent: React.FC<PercentageProps> = ({ value, showPlus = true }) => {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isZero = value === 0;
  const formatted = `${showPlus && isPositive ? '+' : ''}${(formatValue(value * 100))}%`;

  return (
    <span
      className={clsx(
        'whitespace-nowrap',
        isPositive && 'text-up',
        isNegative && 'text-down',
        isZero && 'text-default' 
      )}
    >
      {formatted}
    </span>
  );
};

export const Percentage = React.memo(PercentageComponent);
