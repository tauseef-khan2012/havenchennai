
import { useCallback } from 'react';
import { AuthError, AuthSession } from '@/types/auth';
import * as authService from '@/services/authService';
import { useErrorHandler } from '@/hooks/useErrorHandler';

export function useSessionManager(
  updateState: (state: any) => void,
  handleError: (error: AuthError, title: string) => void,
  lastActivity: number
) {
  const { handleAsyncError } = useErrorHandler();

  // Auto logout on inactivity
  const monitorInactivity = useCallback((session: AuthSession | null, inactivityTimeoutMs: number, onLogout: () => void) => {
    if (!session) return () => {};
    
    const checkInactivity = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity > inactivityTimeoutMs) {
        // Auto logout due to inactivity
        clearInterval(checkInactivity);
        onLogout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInactivity);
  }, [lastActivity]);

  // Token refresh logic
  const setupTokenRefresh = useCallback((session: AuthSession | null, autoRefreshThresholdMs: number) => {
    if (!session) return () => {};
    
    // Calculate time until token expiry
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    const timeUntilExpiry = expiresAt - Date.now();
    const timeUntilRefresh = Math.max(1000, timeUntilExpiry - autoRefreshThresholdMs);
    
    // Set single timeout instead of repeated interval
    const refreshTimeout = setTimeout(async () => {
      await handleAsyncError(
        async () => {
          console.log("Refreshing authentication token...");
          const result = await authService.refreshSession();
          
          if (result && result.session) {
            console.log("Token refreshed successfully");
            updateState({ session: result.session, user: result.session.user });
          }
          return result;
        },
        {
          title: 'Token refresh failed',
          fallbackMessage: 'Failed to refresh your session. You may need to log in again.'
        }
      );
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimeout);
  }, [updateState, handleAsyncError]);

  return {
    monitorInactivity,
    setupTokenRefresh
  };
}
