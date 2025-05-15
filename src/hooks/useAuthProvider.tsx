
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AuthState,
  SignInCredentials,
  PhoneSignInCredentials,
  SignUpCredentials,
  AuthError,
} from '@/types/auth';
import * as authService from '@/services/authService';

const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  error: null
};

export function useAuthProvider() {
  const [state, setState] = useState<AuthState>(initialState);
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
          isLoading: false
        });
        
        if (session?.user) {
          authService.fetchUserProfile(session.user.id)
            .then(profile => updateState({ profile }))
            .catch(error => console.error('Error fetching profile:', error));
        }
      })
      .catch(error => {
        console.error('Error getting session:', error);
        updateState({ isLoading: false });
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
    navigate
  };
}
