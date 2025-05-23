
import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from 'lucide-react';

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'circle' | 'loader';
  label?: string;
  labelPosition?: 'top' | 'right' | 'bottom' | 'left';
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className, 
  variant = 'circle',
  label,
  labelPosition = 'right',
  ...props 
}) => {
  const sizeClass = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }[size];

  const labelPositionClass = {
    top: 'flex-col-reverse',
    right: 'flex-row',
    bottom: 'flex-col',
    left: 'flex-row-reverse'
  }[labelPosition];

  const containerClass = cn(
    'flex items-center gap-2',
    label && labelPositionClass,
    className
  );

  return (
    <div className={containerClass} {...props}>
      {variant === 'loader' ? (
        <Loader2 className={cn("animate-spin", sizeClass)} />
      ) : (
        <div className={cn("animate-spin rounded-full border-2 border-t-transparent", sizeClass)} />
      )}
      
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
};
