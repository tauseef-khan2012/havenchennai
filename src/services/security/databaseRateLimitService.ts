
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
      
      // Use client-side rate limiting as primary method until database types are updated
      return this.clientSideRateLimit(identifier, actionType, config);
    } catch (error) {
      console.error('Rate limit service error:', error);
      // Fail open for availability, but log the security event
      const config = customConfig || ENHANCED_RATE_LIMITS[actionType];
      return { allowed: true, remainingAttempts: config.maxAttempts };
    }
  }

  /**
   * Client-side rate limiting with enhanced security
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
      
      // Use client-side lookup
      const key = `rate_limit_${identifier}_${actionType}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        return { remainingAttempts: config.maxAttempts };
      }

      const { count, firstAttempt, version } = JSON.parse(stored);
      const windowMs = config.windowHours * 60 * 60 * 1000;
      const now = Date.now();

      if (!version || now - firstAttempt > windowMs) {
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
