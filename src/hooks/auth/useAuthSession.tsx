
import { useCallback } from 'react';
import { AuthError, AuthSession, AuthUser } from '@/types/auth';
import * as authService from '@/services/authService';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export function useAuthSession(
  updateState: (state: any) => void,
  handleError: (error: AuthError, title: string) => void,
  navigate: (path: string) => void,
  toast: any
) {
  const { handleAsyncError } = useErrorHandler();

  const signOut = useCallback(async () => {
    updateState({ isLoading: true, error: null });
    
    const result = await handleAsyncError(
      async () => {
        await authService.signOut();
        
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        
        navigate('/');
        return true; // Return a value to indicate success
      },
      {
        title: "Logout failed",
        fallbackMessage: "Failed to log out. Please try again."
      }
    );

    updateState({ isLoading: false });
    
    if (!result) {
      throw new Error("Logout failed");
    }
  }, [updateState, navigate, toast, handleAsyncError]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    updateState({ isLoading: true, error: null });
    
    const result = await handleAsyncError(
      async () => {
        const { session } = await authService.refreshSession();
        
        if (session) {
          updateState({ session, user: session.user });
          return true;
        }
        return false;
      },
      {
        title: "Session refresh failed",
        fallbackMessage: "Failed to refresh session. Please try again."
      }
    );

    updateState({ isLoading: false });
    return result || false;
  }, [updateState, handleAsyncError]);

  return {
    signOut,
    refreshSession
  };
}
