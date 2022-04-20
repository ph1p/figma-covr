import React from 'react';

export const EmptyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="138"
    height="88"
    viewBox="0 0 138 88"
    fill="none"
    xmlns="https://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="0.5"
      y="18.5"
      width="50"
      height="51"
      rx="3.32352"
      fill="white"
      stroke="#C1C1C1"
    />
    <rect
      x="86.5"
      y="18.5"
      width="51"
      height="51"
      rx="3.32352"
      fill="white"
      stroke="#C1C1C1"
    />
    <rect
      x="25"
      y="1"
      width="86"
      height="86"
      rx="2.82352"
      fill="white"
      stroke="black"
      stroke-width="2"
    />
    <path
      opacity="0.1"
      d="M43 20L67.5 44.5M67.5 44.5L92 20M67.5 44.5L92 69M67.5 44.5L43 69"
      stroke="black"
      stroke-width="2"
    />
  </svg>
);
