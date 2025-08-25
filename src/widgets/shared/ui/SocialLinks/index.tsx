import React from 'react';

import { SocialLink } from '@/shared/ui';
import { Socials } from '@/widgets/scanner-table/model';

interface SocialsLinksProps {
  socials: Socials;
}

const SocialsLinksComponent: React.FC<SocialsLinksProps> = ({ socials }) => {
  return (
    <div className='flex gap-1.5 pt-0.5'>
      {socials.telegram && <SocialLink type="telegram" to={socials.telegram} />}
      {socials.twitter && <SocialLink type="twitter" to={socials.twitter} />}
      {socials.website && <SocialLink type="website" to={socials.website} />}
    </div>
  );
};

export const SocialsLinks = React.memo(SocialsLinksComponent);
