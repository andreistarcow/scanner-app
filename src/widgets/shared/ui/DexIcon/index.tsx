import React, { memo } from "react";

import { ImgIcon } from '@/shared/ui';
import { DEX_REGISTRY } from "@/shared/lib/dexRegistry";

interface ChainIconProps extends React.HTMLAttributes<HTMLDivElement>  {
  dex?: string;
}

const DexIconComponent: React.FC<ChainIconProps> = ({
  dex,
  className
}) => {
  if (!dex) return;
  const item = DEX_REGISTRY[dex as keyof typeof DEX_REGISTRY];

  if (!item) return null;

  return (
    <ImgIcon
      className={className}
      src={item.logo}
      alt={item.name} />
  );
};

export const DexIcon = memo(DexIconComponent);