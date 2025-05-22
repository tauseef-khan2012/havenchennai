
import { useCallback } from 'react';
import { AuthError } from '@/types/auth';
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

  const refreshSession = useCallback(async () => {
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

  // Mock user data for now - this would come from the actual auth context in a real app
  const user = { id: '1', email: 'user@example.com' };

  return {
    signOut,
    refreshSession,
    user
  };
}
