
import { useCallback } from 'react';
import { AuthError, AuthSession, AuthUser } from '@/types/auth';
import * as authService from '@/services/authService';

export function useAuthSession(
  updateState: (state: any) => void,
  handleError: (error: AuthError, title: string) => void,
  navigate: (path: string) => void,
  toast: any
) {
  const signOut = useCallback(async () => {
    try {
      updateState({ isLoading: true, error: null });
      await authService.signOut();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      navigate('/');
    } catch (error: any) {
      handleError(error, "Logout failed");
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError, navigate, toast]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      updateState({ isLoading: true, error: null });
      const { session } = await authService.refreshSession();
      
      if (session) {
        updateState({ session, user: session.user });
        return true;
      }
      return false;
    } catch (error: any) {
      handleError(error, "Session refresh failed");
      return false;
    } finally {
      updateState({ isLoading: false });
    }
  }, [updateState, handleError]);

  return {
    signOut,
    refreshSession
  };
}
