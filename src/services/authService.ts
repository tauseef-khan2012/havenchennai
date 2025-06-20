
import { supabase } from '@/integrations/supabase/client';
import { 
  AuthProvider, 
  SignInCredentials, 
  PhoneSignInCredentials, 
  SignUpCredentials,
  AuthError
} from '@/types/auth';
import { authSecurity } from '@/services/security/authSecurity';
import { sanitizeEmailInput } from '@/services/security/inputSanitization';

// Cache user profiles to reduce database queries
const profileCache = new Map<string, any>();
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export async function signInWithEmail({ email, password, rememberMe = false }: SignInCredentials) {
  try {
    const sanitizedEmail = sanitizeEmailInput(email);
    
    // Check if email is locked out
    if (authSecurity.isEmailLockedOut(sanitizedEmail)) {
      const remaining = authSecurity.getRemainingAttempts(sanitizedEmail);
      throw new Error(`Account temporarily locked. ${remaining} attempts remaining. Please try again later.`);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password,
    });

    if (error) {
      authSecurity.recordLoginAttempt(sanitizedEmail, false);
      throw createAuthError(error.message, error);
    }

    // Record successful login
    authSecurity.recordLoginAttempt(sanitizedEmail, true);
    authSecurity.clearLoginAttempts(sanitizedEmail);
    
    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw createAuthError(error.message, error);
  }
}

export async function signInWithPhone({ phone, password, rememberMe = false }: PhoneSignInCredentials) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      phone,
      password,
    });

    if (error) throw createAuthError(error.message, error);
    return data;
  } catch (error: any) {
    console.error('Phone login error:', error);
    throw createAuthError(error.message, error);
  }
}

export async function signInWithProvider(provider: AuthProvider) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw createAuthError(error.message, error);
    return data;
  } catch (error: any) {
    console.error(`${provider} login error:`, error);
    throw createAuthError(error.message, error);
  }
}

export async function signUp({ email, password, fullName, phone, countryCode, acceptTerms }: SignUpCredentials) {
  try {
    const sanitizedEmail = sanitizeEmailInput(email);
    
    // Validate password strength
    const passwordValidation = authSecurity.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new Error(`Password requirements not met: ${passwordValidation.errors.join(', ')}`);
    }
    
    // Format phone number with country code if both are provided
    const phoneNumber = phone && countryCode ? `${countryCode}${phone}` : undefined;
    
    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      phone: phoneNumber,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
          registration_source: 'website',
        },
      },
    });

    if (error) throw createAuthError(error.message, error);
    return data;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw createAuthError(error.message, error);
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw createAuthError(error.message, error);
    // Clear the profile cache when signing out
    profileCache.clear();
  } catch (error: any) {
    console.error('Logout error:', error);
    throw createAuthError(error.message, error);
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw createAuthError(error.message, error);
    return true;
  } catch (error: any) {
    console.error('Reset password error:', error);
    throw createAuthError(error.message, error);
    return false;
  }
}

export async function resendConfirmationEmail(email: string) {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) throw createAuthError(error.message, error);
  } catch (error: any) {
    console.error('Resend confirmation error:', error);
    throw createAuthError(error.message, error);
  }
}

export async function sendOtpToPhone(phone: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) throw createAuthError(error.message, error);
    return true;
  } catch (error: any) {
    console.error('Send OTP error:', error);
    throw createAuthError(error.message, error);
    return false;
  }
}

export async function verifyOtp(phone: string, otp: string) {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) throw createAuthError(error.message, error);
    return true;
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    throw createAuthError(error.message, error);
    return false;
  }
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw createAuthError(error.message, error);
  return data;
}

export async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw createAuthError(error.message, error);
    return data;
  } catch (error: any) {
    console.error('Session refresh error:', error);
    throw createAuthError(error.message, error);
  }
}

export async function fetchUserProfile(userId: string) {
  try {
    // Check cache first
    const cachedProfile = profileCache.get(userId);
    if (cachedProfile && cachedProfile.timestamp > Date.now() - CACHE_EXPIRY_MS) {
      return cachedProfile.data;
    }

    // If not in cache, fetch from database
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw createAuthError(error.message, error);
    
    // Store in cache
    profileCache.set(userId, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error: any) {
    console.error('Fetch profile error:', error);
    throw createAuthError(error.message, error);
  }
}

function createAuthError(message: string, originalError?: any): AuthError {
  const authError: AuthError = new Error(message);
  if (originalError) {
    authError.status = originalError.status;
    authError.code = originalError.code;
  }
  return authError;
}
