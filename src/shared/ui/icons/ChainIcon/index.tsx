import React from "react";

import { ImgIcon } from '@/shared/ui';
import { Chains } from "@/shared/model/types";

import { NETWORK_ICONS } from "../constants";

interface ChainIconProps {
  chain: Chains;
}

export const ChainIcon: React.FC<ChainIconProps> = ({
  chain,
}) => {
  const src = NETWORK_ICONS[chain];

  if (!src) return null;

  return (
    <ImgIcon src={src} alt={chain} />
  );
};
