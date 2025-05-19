import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AuthState,
  SignInCredentials,
  SignUpCredentials,
  AuthError,
} from '@/types/auth';
import * as authService from '@/services/authService';

const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  isInitialized: false
};

const AUTO_REFRESH_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

export function useAuthProvider() {
  const [state, setState] = useState<AuthState>(initialState);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateState = useCallback((newState: Partial<AuthState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  }, []);

  const handleError = useCallback((error: AuthError, title: string) => {
    console.error(`Auth error (${title}):`, error);
    toast({
      title,
      description: error.message || "An error occurred",
      variant: "destructive",
    });
    updateState({ error });
  }, [toast, updateState]);

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    
    try {
      const profile = await authService.fetchUserProfile(state.user.id);
      updateState({ profile });
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [state.user, updateState]);

  // Handle user activity
  useEffect(() => {
    const handleUserActivity = () => {
      setLastActivity(Date.now());
    };

    // Track user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, []);

  // Auto logout on inactivity
  useEffect(() => {
    if (!state.session) return;

    const checkInactivity = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity > INACTIVITY_TIMEOUT_MS) {
        // Auto logout due to inactivity
        clearInterval(checkInactivity);
        authService.signOut()
          .then(() => {
            toast({
              title: "Session expired",
              description: "You've been logged out due to inactivity.",
            });
          })
          .catch((error) => console.error('Auto logout error:', error));
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInactivity);
  }, [state.session, lastActivity, toast]);

  // Token refresh logic
  useEffect(() => {
    if (!state.session) return;

    const checkTokenExpiry = setInterval(async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) return;
        
        // Calculate time until token expiry
        const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
        const timeUntilExpiry = expiresAt - Date.now();
        
        // Refresh token if it will expire soon
        if (timeUntilExpiry < AUTO_REFRESH_THRESHOLD_MS) {
          console.log("Refreshing authentication token...");
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) {
            console.error('Token refresh error:', error);
          } else if (data?.session) {
            console.log("Token refreshed successfully");
            updateState({ session: data.session, user: data.session.user });
          }
        }
      } catch (error) {
        console.error('Token refresh check error:', error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(checkTokenExpiry);
  }, [state.session, updateState]);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        updateState({
          session: currentSession,
          user: currentSession?.user ?? null,
        });
        
        // Fetch profile data if user exists
        if (currentSession?.user) {
          setTimeout(() => {
            authService.fetchUserProfile(currentSession.user.id)
              .then(profile => updateState({ profile }))
              .catch(error => console.error('Error fetching profile:', error));
          }, 0);
        } else {
          updateState({ profile: null });
        }
      }
    );

    // THEN check for existing session
    authService.getCurrentSession()
      .then(({ session }) => {
        updateState({
          session,
          user: session?.user ?? null,
          isLoading: false,
          isInitialized: true
        });
        
        if (session?.user) {
          authService.fetchUserProfile(session.user.id)
            .then(profile => updateState({ profile }))
            .catch(error => console.error('Error fetching profile:', error));
        }
      })
      .catch(error => {
        console.error('Error getting session:', error);
        updateState({ isLoading: false, isInitialized: true });
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [updateState]);

  return {
    state,
    updateState,
    handleError,
    refreshProfile,
    toast,
    navigate,
    lastActivity
  };
}
