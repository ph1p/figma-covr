import React from 'react';

export const PlaylistsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="23"
    height="23"
    viewBox="0 0 23 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x="3" y="3" width="1.5" height="17" fill="white" />
    <rect x="7" y="3" width="1.5" height="17" fill="white" />
    <rect
      x="11.75"
      y="3.75"
      width="7.5"
      height="15.5"
      stroke="white"
      stroke-width="1.5"
    />
  </svg>
);
