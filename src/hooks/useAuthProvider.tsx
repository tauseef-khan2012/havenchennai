
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AuthState,
  AuthError,
} from '@/types/auth';
import { useSessionManager } from '@/hooks/auth/useSessionManager';

const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  isInitialized: false
};

// Constants
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

  // Fetch user profile helper function
  const fetchUserProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    
    try {
      const profile = await fetchUserProfile(state.user.id);
      updateState({ profile });
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  }, [state.user, updateState, fetchUserProfile]);

  // Sign out helper function
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Session expired",
        description: "You've been logged out due to inactivity.",
      });
    } catch (error) {
      console.error('Auto logout error:', error);
    }
  }, [toast]);

  // Use the session manager hook
  const { monitorInactivity, setupTokenRefresh } = useSessionManager(
    updateState,
    handleError,
    lastActivity
  );

  // Handle user activity
  useEffect(() => {
    const handleUserActivity = () => {
      setLastActivity(Date.now());
    };

    // Use event delegation to reduce event handlers
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []);

  // Auto logout on inactivity and setup token refresh
  useEffect(() => {
    const cleanupInactivity = monitorInactivity(state.session, INACTIVITY_TIMEOUT_MS, signOut);
    const cleanupTokenRefresh = setupTokenRefresh(state.session, AUTO_REFRESH_THRESHOLD_MS);
    
    return () => {
      cleanupInactivity();
      cleanupTokenRefresh();
    };
  }, [state.session, monitorInactivity, setupTokenRefresh, signOut]);

  // Initialize auth state
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    // Initialize auth state asynchronously
    const initAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
          (event, currentSession) => {
            console.log("Auth state changed:", event);
            
            updateState({
              session: currentSession,
              user: currentSession?.user ?? null,
            });
            
            // Fetch profile data if user exists - use setTimeout to prevent blocking
            if (currentSession?.user) {
              setTimeout(() => {
                fetchUserProfile(currentSession.user.id)
                  .then(profile => updateState({ profile }))
                  .catch(error => console.error('Error fetching profile:', error));
              }, 0);
            } else {
              updateState({ profile: null });
            }
          }
        );
        
        subscription = authSubscription;

        // THEN check for existing session
        const { data } = await supabase.auth.getSession();
        updateState({
          session: data.session,
          user: data.session?.user ?? null,
          isLoading: false,
          isInitialized: true
        });
        
        if (data.session?.user) {
          const profile = await fetchUserProfile(data.session.user.id);
          updateState({ profile });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        updateState({ isLoading: false, isInitialized: true });
      }
    };

    initAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [updateState, fetchUserProfile]);

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
