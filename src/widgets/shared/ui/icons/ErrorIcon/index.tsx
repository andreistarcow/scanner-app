import React from "react";

export const ErrorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    className="size-4 text-red-500"
    fill="currentColor"
    {...props}
  >
    <circle fill='#710c0a' cx="8" cy="8" r="8"  className='fill-red-950'/>
    <path fill='#ef5350' d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
    <path fill='#ef5350' d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 
             .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 
             8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 
             4.646 5.354a.5.5 0 0 1 0-.708" />
  </svg>
);
