
import React from 'react';
import { AlertTriangle, RefreshCw, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  severity?: 'warning' | 'error' | 'critical';
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  severity = 'error',
  onRetry,
  className,
  compact = false
}) => {
  const severityConfig = {
    warning: {
      icon: <AlertCircle className="h-4 w-4" />,
      variant: 'default',
      bgClass: 'bg-yellow-50',
      textClass: 'text-yellow-800',
    },
    error: {
      icon: <AlertTriangle className="h-4 w-4" />,
      variant: 'destructive' as const,
      bgClass: 'bg-red-50',
      textClass: 'text-red-800',
    },
    critical: {
      icon: <XCircle className="h-4 w-4" />,
      variant: 'destructive' as const,
      bgClass: 'bg-red-100',
      textClass: 'text-red-900',
    }
  };

  const { icon, variant, bgClass, textClass } = severityConfig[severity];

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 text-sm py-2 px-3 rounded', bgClass, textClass, className)}>
        {icon}
        <span>{message}</span>
        {onRetry && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto p-1 h-auto"
            onClick={onRetry}
          >
            <RefreshCw className="h-3 w-3" />
            <span className="sr-only">Retry</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <Alert variant={variant} className={cn('my-4', className)}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">{message}</p>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="h-3 w-3" />
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};
