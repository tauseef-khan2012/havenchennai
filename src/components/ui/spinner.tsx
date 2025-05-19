
import React from 'react';
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className, 
  ...props 
}) => {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }[size];

  return (
    <div 
      className={cn("animate-spin rounded-full border-2 border-t-transparent", sizeClass, className)} 
      {...props}
    />
  );
};
