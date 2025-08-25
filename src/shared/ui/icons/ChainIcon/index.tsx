import React from "react";

import { ImgIcon } from '@/shared/ui';
import { Chains } from "@/shared/model/types";

import { NETWORK_ICONS } from "../constants";

interface ChainIconProps {
  chain: Chains;
  className?: string;
}

export const ChainIcon: React.FC<ChainIconProps> = ({
  chain, className
}) => {
  const src = NETWORK_ICONS[chain];

  if (!src) return null;

  return (
    <ImgIcon className={className} src={src} alt={chain} />
  );
};
