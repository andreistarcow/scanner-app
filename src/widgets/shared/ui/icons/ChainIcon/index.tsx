import React from "react";

import { Chains } from "@/entities/scanner/model/types";
import { ImgIcon } from '@/shared/ui';

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
