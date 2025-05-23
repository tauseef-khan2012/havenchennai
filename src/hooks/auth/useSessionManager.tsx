
import { useCallback } from 'react';
import { AuthError, AuthSession } from '@/types/auth';
import * as authService from '@/services/authService';

export function useSessionManager(
  updateState: (state: any) => void,
  handleError: (error: AuthError, title: string) => void,
  lastActivity: number
) {
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
      try {
        console.log("Refreshing authentication token...");
        const { data, error } = await authService.refreshSession();
        
        if (error) {
          console.error('Token refresh error:', error);
        } else if (data?.session) {
          console.log("Token refreshed successfully");
          updateState({ session: data.session, user: data.session.user });
        }
      } catch (error) {
        console.error('Token refresh error:', error);
      }
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimeout);
  }, [updateState]);

  return {
    monitorInactivity,
    setupTokenRefresh
  };
}
