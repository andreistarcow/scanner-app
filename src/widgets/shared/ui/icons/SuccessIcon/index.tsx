import React from "react";

export const SuccessIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    className="size-4 text-green-500"
    fill="currentColor"
    {...props}
  >
    <circle cx="8" cy="8" r="8" fill='#104641' className='opacity-75'/>
    <path fill='#26a69a' d="M6.173 10.854a.5.5 0 0 1-.354-.146l-2-2a.5.5 0 1 1 .707-.707L6.173 9.293l5.304-5.304a.5.5 0 0 1 .707.707l-5.657 5.657a.5.5 0 0 1-.354.146z" />
  </svg>
);
