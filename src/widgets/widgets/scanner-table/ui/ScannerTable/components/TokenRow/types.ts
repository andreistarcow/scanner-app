import type React from 'react';

import type { TokenData } from "@widgets/scanner-table/model";

export interface TokenRowProps {
  token: TokenData;
  style?: React.CSSProperties;
  className?: string;
}
