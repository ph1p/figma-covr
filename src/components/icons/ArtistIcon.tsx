import React from 'react';

export const ArtistIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="25"
    height="25"
    viewBox="0 -7 25 25"
    fill="none"
    xmlns="https://www.w3.org/2000/svg"
    {...props}
  >
    <g opacity="0.3">
      <rect
        x="-0.6"
        y="0.6"
        width="6.8"
        height="6.8"
        rx="3.4"
        transform="matrix(-1 0 0 1 14.8 0)"
        stroke="white"
        strokeWidth="1.2"
      />
      <circle
        cx="0"
        cy="0"
        r="30%"
        transform="matrix(-1 0 0 1 12 18)"
        fill="transparent"
        strokeWidth="1.2"
        stroke="white"
      />
    </g>
  </svg>
);
