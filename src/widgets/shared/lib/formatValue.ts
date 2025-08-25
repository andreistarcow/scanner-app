export const formatValue = (n: number) =>
  Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(n);
