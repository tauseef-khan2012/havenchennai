
import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced authentication security service
 */

interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
}

class AuthSecurityService {
  private static instance: AuthSecurityService;
  private loginAttempts: Map<string, LoginAttempt[]> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly ATTEMPT_WINDOW = 60 * 60 * 1000; // 1 hour

  static getInstance(): AuthSecurityService {
    if (!AuthSecurityService.instance) {
      AuthSecurityService.instance = new AuthSecurityService();
    }
    return AuthSecurityService.instance;
  }

  /**
   * Check if email is currently locked out
   */
  isEmailLockedOut(email: string): boolean {
    const attempts = this.loginAttempts.get(email.toLowerCase()) || [];
    const recentFailedAttempts = attempts.filter(
      attempt => 
        !attempt.success && 
        Date.now() - attempt.timestamp < this.LOCKOUT_DURATION
    );
    
    return recentFailedAttempts.length >= this.MAX_ATTEMPTS;
  }

  /**
   * Record a login attempt
   */
  recordLoginAttempt(email: string, success: boolean): void {
    const normalizedEmail = email.toLowerCase();
    const attempts = this.loginAttempts.get(normalizedEmail) || [];
    
    // Clean old attempts (older than attempt window)
    const cleanedAttempts = attempts.filter(
      attempt => Date.now() - attempt.timestamp < this.ATTEMPT_WINDOW
    );
    
    // Add new attempt
    cleanedAttempts.push({
      email: normalizedEmail,
      timestamp: Date.now(),
      success
    });
    
    this.loginAttempts.set(normalizedEmail, cleanedAttempts);
  }

  /**
   * Get remaining attempts before lockout
   */
  getRemainingAttempts(email: string): number {
    const attempts = this.loginAttempts.get(email.toLowerCase()) || [];
    const recentFailedAttempts = attempts.filter(
      attempt => 
        !attempt.success && 
        Date.now() - attempt.timestamp < this.LOCKOUT_DURATION
    );
    
    return Math.max(0, this.MAX_ATTEMPTS - recentFailedAttempts.length);
  }

  /**
   * Enhanced password validation
   */
  validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain repeated characters');
    }
    if (/123|abc|qwe/i.test(password)) {
      errors.push('Password cannot contain common sequences');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate session integrity
   */
  async validateSession(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) return false;
      
      // Check if session is expired
      const expiresAt = data.session.expires_at || 0;
      return expiresAt * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Clear login attempts for email (on successful login)
   */
  clearLoginAttempts(email: string): void {
    this.loginAttempts.delete(email.toLowerCase());
  }
}

export const authSecurity = AuthSecurityService.getInstance();
