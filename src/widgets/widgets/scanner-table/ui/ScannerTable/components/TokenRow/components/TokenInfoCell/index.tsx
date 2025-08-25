import React from "react";

import { Chains } from "@/entities/scanner/model/types";
import { TokenData } from "@/widgets/scanner-table/model";
import { ChainIcon, TokenIcon, SocialsLinks } from "@/shared/ui";

interface TokenInfoCellProps {
  token: TokenData;
}

const TokenInfoCellComponent: React.FC<TokenInfoCellProps> = ({ token }) => {
  return (
    <div className="flex h-full flex-col items-start gap-1 truncate p-2 text-xs">
      <div className="mt-1 truncate text-xs font-medium text-white">
        <div className="ml-0.5 flex">
          <TokenIcon token={token.tokenSymbol} />
          <div className="ml-2 mt-1">
            <span className="text-white">
              {token.token0Symbol} / {token.token1Symbol}
            </span>{" "}
            (<span className="text-slate-400">{token.chain}</span>)
          </div>
        </div>
      </div>

      <div className="ml-0.5 mt-0 flex items-start space-x-1.5 align-middle">
        <div className="pt-0.5">
          {token.chain && <ChainIcon chain={token.chain as Chains} />}
        </div>
        {token.socials && <SocialsLinks socials={token.socials} />}
      </div>
    </div>
  );
};

export const TokenInfoCell = React.memo(TokenInfoCellComponent);
