import React from "react";

interface ImgIconProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
}

export const ImgIcon: React.FC<ImgIconProps> = ({
  src,
  alt,
  className,
}) => {
  return (
    <img
      className={`size-5 shrink-0 rounded-full ${className}`}
      src={src}
      alt={alt}
    />
  );
};
