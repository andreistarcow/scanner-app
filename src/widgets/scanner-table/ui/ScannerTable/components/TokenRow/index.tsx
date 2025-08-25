import React from 'react';

import { GRID } from '../../grid';

import {
  TokenInfoCell,
  PriceChangesCell,
  DexRouterCell,
  ValueCell,
  AgeCell,
  TransactionsCell,
  LiquidityCell,
  AuditCell,
} from './components';
import type { TokenRowProps } from './types';

const TokenRowComponent: React.FC<TokenRowProps> = ({ token, style, className }) => {
  return (
    <div
      style={style}
      className={`
        grid
        ${GRID}
        items-stretch 
        divide-x divide-white/10 border-b border-white/10 px-3 ${className}`}
    >
      <TokenInfoCell token={token} />
      <DexRouterCell router={token.exchange} chain={token.chain} />
      <ValueCell value={token.priceUsd} />
      <ValueCell value={token.mcap} />
      <ValueCell value={token.volumeUsd} />
      <PriceChangesCell period="5m" priceChangePcs={token.priceChangePcs} />
      <PriceChangesCell period="1h" priceChangePcs={token.priceChangePcs} />
      <PriceChangesCell period="6h" priceChangePcs={token.priceChangePcs} />
      <PriceChangesCell period="24h" priceChangePcs={token.priceChangePcs} />
      <AgeCell createdAt={token.tokenCreatedTimestamp} />
      <TransactionsCell transactions={token.transactions} />
      <LiquidityCell liquidity={token.liquidity} />
      <AuditCell audit={token.audit} />
    </div>
  );
};

export const TokenRow = React.memo(TokenRowComponent);
