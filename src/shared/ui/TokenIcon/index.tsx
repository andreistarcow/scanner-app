import React from 'react';
import { TokenIcon as Web3TokenIcon } from '@web3icons/react';

interface SocialsLinksProps {
  token?: string;
}

export const TokenIcon: React.FC<SocialsLinksProps> = ({ token }) => {
  return (
    <div className='min-w-5 rounded-full bg-gray-800 ring-white'>
      {token && <Web3TokenIcon size={23} symbol={token.toLowerCase()} variant='branded' />}
    </div>
  );
};

