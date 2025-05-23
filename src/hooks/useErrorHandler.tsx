
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  fallbackMessage?: string;
  title?: string;
}

export function useErrorHandler() {
  const { toast } = useToast();

  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      fallbackMessage = 'An unexpected error occurred',
      title = 'Error'
    } = options;

    let errorMessage = fallbackMessage;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as any).message;
    }

    if (logError) {
      console.error('Error handled:', error);
    }

    if (showToast) {
      toast({
        title,
        description: errorMessage,
        variant: 'destructive',
      });
    }

    return errorMessage;
  }, [toast]);

  const handleAsyncError = useCallback(async <T,>(
    asyncOperation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      handleError(error, options);
      return null;
    }
  }, [handleError]);

  // Add a retry capability for operations that might fail
  const withRetry = useCallback(async <T,>(
    operation: () => Promise<T>,
    options: {
      maxRetries?: number;
      retryDelay?: number;
      errorOptions?: ErrorHandlerOptions;
    } = {}
  ): Promise<T | null> => {
    const { maxRetries = 3, retryDelay = 1000, errorOptions } = options;
    let retries = 0;

    const attempt = async (): Promise<T | null> => {
      try {
        return await operation();
      } catch (error) {
        if (retries < maxRetries) {
          retries++;
          console.log(`Retry attempt ${retries}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return attempt();
        }
        
        handleError(error, errorOptions);
        return null;
      }
    };

    return attempt();
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    withRetry
  };
}
