
import { supabase } from '@/integrations/supabase/client';

export interface RateLimitConfig {
  maxAttempts: number;
  windowHours: number;
}

export const ENHANCED_RATE_LIMITS = {
  GUEST_BOOKING: { maxAttempts: 3, windowHours: 1 },
  LOGIN_ATTEMPT: { maxAttempts: 5, windowHours: 1 },
  PASSWORD_RESET: { maxAttempts: 3, windowHours: 24 },
  OTP_REQUEST: { maxAttempts: 5, windowHours: 1 },
  PAYMENT_ATTEMPT: { maxAttempts: 5, windowHours: 1 },
  BOOKING_ACCESS: { maxAttempts: 10, windowHours: 1 },
} as const;

/**
 * Enhanced rate limiting service with database persistence and security hardening
 */
export class DatabaseRateLimitService {
  /**
   * Check if an action is within rate limits with database tracking
   */
  static async checkRateLimit(
    identifier: string,
    actionType: keyof typeof ENHANCED_RATE_LIMITS,
    customConfig?: RateLimitConfig
  ): Promise<{ allowed: boolean; remainingAttempts: number; resetTime?: Date }> {
    try {
      const config = customConfig || ENHANCED_RATE_LIMITS[actionType];
      const windowMs = config.windowHours * 60 * 60 * 1000;
      const now = new Date();
      const windowStart = new Date(now.getTime() - windowMs);

      // Try database-based rate limiting first
      const result = await this.databaseRateLimit(identifier, actionType, config, now, windowStart);
      if (result) {
        return result;
      }

      // Fallback to client-side rate limiting
      return this.clientSideRateLimit(identifier, actionType, config);
    } catch (error) {
      console.error('Rate limit service error:', error);
      // Fail open for availability, but log the security event
      const config = customConfig || ENHANCED_RATE_LIMITS[actionType];
      return { allowed: true, remainingAttempts: config.maxAttempts };
    }
  }

  /**
   * Database-based rate limiting with enhanced security
   */
  private static async databaseRateLimit(
    identifier: string,
    actionType: string,
    config: RateLimitConfig,
    now: Date,
    windowStart: Date
  ): Promise<{ allowed: boolean; remainingAttempts: number; resetTime?: Date } | null> {
    try {
      // Clean up expired entries first
      await supabase
        .from('rate_limit_attempts')
        .delete()
        .lt('window_expires_at', now.toISOString());

      // Get current rate limit record
      const { data: existing, error: selectError } = await supabase
        .from('rate_limit_attempts')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', actionType)
        .gte('window_expires_at', now.toISOString())
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      const windowExpiry = new Date(now.getTime() + (config.windowHours * 60 * 60 * 1000));

      if (!existing) {
        // Create new rate limit record
        const { error: insertError } = await supabase
          .from('rate_limit_attempts')
          .insert({
            identifier,
            action_type: actionType,
            attempt_count: 1,
            first_attempt_at: now.toISOString(),
            last_attempt_at: now.toISOString(),
            window_expires_at: windowExpiry.toISOString()
          });

        if (insertError) throw insertError;

        return {
          allowed: true,
          remainingAttempts: config.maxAttempts - 1,
          resetTime: windowExpiry
        };
      }

      // Check if within limits
      if (existing.attempt_count < config.maxAttempts) {
        // Update attempt count
        const { error: updateError } = await supabase
          .from('rate_limit_attempts')
          .update({
            attempt_count: existing.attempt_count + 1,
            last_attempt_at: now.toISOString()
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;

        return {
          allowed: true,
          remainingAttempts: config.maxAttempts - existing.attempt_count - 1,
          resetTime: new Date(existing.window_expires_at)
        };
      }

      // Rate limit exceeded
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: new Date(existing.window_expires_at)
      };
    } catch (error) {
      console.error('Database rate limiting error:', error);
      return null; // Fall back to client-side
    }
  }

  /**
   * Client-side rate limiting fallback with enhanced security
   */
  private static clientSideRateLimit(
    identifier: string,
    actionType: string,
    config: RateLimitConfig
  ): { allowed: boolean; remainingAttempts: number; resetTime?: Date } {
    const key = `rate_limit_${identifier}_${actionType}`;
    const stored = localStorage.getItem(key);
    const now = Date.now();
    const windowMs = config.windowHours * 60 * 60 * 1000;
    
    if (!stored) {
      localStorage.setItem(key, JSON.stringify({ 
        count: 1, 
        firstAttempt: now,
        version: '2.0' // Version for future compatibility
      }));
      return { 
        allowed: true, 
        remainingAttempts: config.maxAttempts - 1,
        resetTime: new Date(now + windowMs)
      };
    }

    try {
      const { count, firstAttempt, version } = JSON.parse(stored);
      
      // Validate data structure
      if (!version || version !== '2.0' || typeof count !== 'number' || typeof firstAttempt !== 'number') {
        // Reset corrupted data
        localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now, version: '2.0' }));
        return { 
          allowed: true, 
          remainingAttempts: config.maxAttempts - 1,
          resetTime: new Date(now + windowMs)
        };
      }
      
      // Check if window has expired
      if (now - firstAttempt > windowMs) {
        localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now, version: '2.0' }));
        return { 
          allowed: true, 
          remainingAttempts: config.maxAttempts - 1,
          resetTime: new Date(now + windowMs)
        };
      }

      // Check if within limits
      if (count < config.maxAttempts) {
        localStorage.setItem(key, JSON.stringify({ count: count + 1, firstAttempt, version: '2.0' }));
        return { 
          allowed: true, 
          remainingAttempts: config.maxAttempts - count - 1,
          resetTime: new Date(firstAttempt + windowMs)
        };
      }

      // Rate limit exceeded
      return { 
        allowed: false, 
        remainingAttempts: 0,
        resetTime: new Date(firstAttempt + windowMs)
      };
    } catch (parseError) {
      // Reset on parse error
      localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now, version: '2.0' }));
      return { 
        allowed: true, 
        remainingAttempts: config.maxAttempts - 1,
        resetTime: new Date(now + windowMs)
      };
    }
  }

  /**
   * Get rate limit status with enhanced security
   */
  static async getRateLimitStatus(
    identifier: string,
    actionType: keyof typeof ENHANCED_RATE_LIMITS
  ): Promise<{ remainingAttempts: number; resetTime?: Date }> {
    try {
      const config = ENHANCED_RATE_LIMITS[actionType];
      const now = new Date();
      
      // Try database lookup first
      const { data: existing } = await supabase
        .from('rate_limit_attempts')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', actionType)
        .gte('window_expires_at', now.toISOString())
        .single();

      if (existing) {
        return {
          remainingAttempts: Math.max(0, config.maxAttempts - existing.attempt_count),
          resetTime: new Date(existing.window_expires_at)
        };
      }

      // Fall back to client-side lookup
      const key = `rate_limit_${identifier}_${actionType}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        return { remainingAttempts: config.maxAttempts };
      }

      const { count, firstAttempt, version } = JSON.parse(stored);
      const windowMs = config.windowHours * 60 * 60 * 1000;

      if (!version || now.getTime() - firstAttempt > windowMs) {
        return { remainingAttempts: config.maxAttempts };
      }

      return { 
        remainingAttempts: Math.max(0, config.maxAttempts - count),
        resetTime: new Date(firstAttempt + windowMs)
      };
    } catch (error) {
      console.error('Rate limit status error:', error);
      return { remainingAttempts: ENHANCED_RATE_LIMITS[actionType].maxAttempts };
    }
  }

  /**
   * Reset rate limit for an identifier (admin function)
   */
  static async resetRateLimit(
    identifier: string,
    actionType: keyof typeof ENHANCED_RATE_LIMITS
  ): Promise<boolean> {
    try {
      // Remove from database
      await supabase
        .from('rate_limit_attempts')
        .delete()
        .eq('identifier', identifier)
        .eq('action_type', actionType);

      // Remove from localStorage
      const key = `rate_limit_${identifier}_${actionType}`;
      localStorage.removeItem(key);

      return true;
    } catch (error) {
      console.error('Rate limit reset error:', error);
      return false;
    }
  }
}
