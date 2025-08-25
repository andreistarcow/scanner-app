import React, { useMemo, useCallback } from "react";

import { TelegramIcon, TwitterIcon, WebsiteIcon } from "../icons/socials";

interface SocialLinkProps {
  type: 'telegram' | 'twitter' | 'website';
  to: string;
}

export const SocialLink: React.FC<SocialLinkProps> = ({
  to, type
}) => {
  const icon = useMemo(() => {
    switch(type) {
      case 'telegram':
        return <TelegramIcon className='w-4' />;
      case 'twitter':
        return <TwitterIcon className='w-4' />;
      case 'website':
        return <WebsiteIcon className='w-4' />;
      default:
        return;
    }
  }, [type]);

  const handleClick = useCallback(() => {
    window.open(to, 'blank')?.focus();
  }, [to]);

  return (
    <button
      onClick={handleClick}
      className="
        cursor-pointer
        rounded-full 
        border-white/20
        bg-gray-800/70 
        p-0.5
        text-white/50
        opacity-50 
        ring-1 
        transition 
        hover:text-white 
        hover:opacity-100
      "
    >
      {icon}
    </button>
  );
};