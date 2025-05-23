
import { useCallback } from 'react';

interface AuthStateUpdate {
  isLoading?: boolean;
  error?: any;
  session?: any;
  user?: any;
  profile?: any;
  isInitialized?: boolean;
}

export function useAuthStateManager(updateState: (state: any) => void) {
  const setLoading = useCallback((isLoading: boolean) => {
    updateState({ isLoading, error: null });
  }, [updateState]);

  const setError = useCallback((error: any) => {
    updateState({ error, isLoading: false });
  }, [updateState]);

  const setSuccess = useCallback((updates: Omit<AuthStateUpdate, 'isLoading' | 'error'> = {}) => {
    updateState({ ...updates, isLoading: false, error: null });
  }, [updateState]);

  const resetState = useCallback(() => {
    updateState({ isLoading: false, error: null });
  }, [updateState]);

  return {
    setLoading,
    setError,
    setSuccess,
    resetState
  };
}
