
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
  variant?: 'spinner' | 'pulse' | 'skeleton';
  children?: React.ReactNode;
  fullPage?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  size = 'md',
  message,
  className,
  variant = 'spinner',
  children,
  fullPage = false
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const containerClass = cn(
    'flex flex-col items-center justify-center gap-2', 
    fullPage && 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
    className
  );

  if (variant === 'spinner') {
    return (
      <div className={containerClass}>
        <Loader2 className={cn('animate-spin', sizeClasses[size])} />
        {message && (
          <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
        )}
        {children}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn('rounded-full bg-muted animate-pulse', sizeClasses[size])} />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
        {children}
      </div>
    );
  }

  // Skeleton variant
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
      {children}
    </div>
  );
};
