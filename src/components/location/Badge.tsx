
import React from 'react';

interface BadgeProps {
  label: string;
}

const Badge = ({ label }: BadgeProps) => (
  <span className="inline-block bg-haven-green/10 text-haven-green text-sm px-3 py-1 rounded-full">
    {label}
  </span>
);

export default Badge;
