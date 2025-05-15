
import React from 'react';

export const MicrosoftIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 23 23"
    width={size}
    height={size}
    className={className}
    fill="none"
  >
    <path fill="#f1511b" d="M11.4 1H1v10.4h10.4V1z" />
    <path fill="#80cc28" d="M22.8 1H12.4v10.4h10.4V1z" />
    <path fill="#00adef" d="M11.4 12.4H1v10.4h10.4V12.4z" />
    <path fill="#fbbc09" d="M22.8 12.4H12.4v10.4h10.4V12.4z" />
  </svg>
);
