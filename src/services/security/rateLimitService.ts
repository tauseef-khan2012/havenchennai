
import { supabase } from '@/integrations/supabase/client';

export interface RateLimitConfig {
  maxAttempts: number;
  windowHours: number;
}

export const DEFAULT_RATE_LIMITS = {
  GUEST_BOOKING: { maxAttempts: 3, windowHours: 1 },
  LOGIN_ATTEMPT: { maxAttempts: 5, windowHours: 1 },
  PASSWORD_RESET: { maxAttempts: 3, windowHours: 24 },
  OTP_REQUEST: { maxAttempts: 5, windowHours: 1 },
} as const;

/**
 * Enhanced rate limiting service with client-side enforcement
 * Note: Currently uses localStorage fallback until database migration is complete
 */
export class RateLimitService {
  /**
   * Check if an action is within rate limits
   */
  static async checkRateLimit(
    identifier: string,
    actionType: keyof typeof DEFAULT_RATE_LIMITS,
    customConfig?: RateLimitConfig
  ): Promise<{ allowed: boolean; remainingAttempts: number; resetTime?: Date }> {
    try {
      const config = customConfig || DEFAULT_RATE_LIMITS[actionType];
      
      // Use client-side rate limiting (fallback mode)
      return this.clientSideRateLimit(identifier, actionType, config);
    } catch (error) {
      console.error('Rate limit service error:', error);
      // Fail open for availability
      const config = customConfig || DEFAULT_RATE_LIMITS[actionType];
      return { allowed: true, remainingAttempts: config.maxAttempts };
    }
  }

  /**
   * Client-side rate limiting fallback
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
      localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now }));
      return { 
        allowed: true, 
        remainingAttempts: config.maxAttempts - 1,
        resetTime: new Date(now + windowMs)
      };
    }

    try {
      const { count, firstAttempt } = JSON.parse(stored);
      
      // Check if window has expired
      if (now - firstAttempt > windowMs) {
        localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now }));
        return { 
          allowed: true, 
          remainingAttempts: config.maxAttempts - 1,
          resetTime: new Date(now + windowMs)
        };
      }

      // Check if within limits
      if (count < config.maxAttempts) {
        localStorage.setItem(key, JSON.stringify({ count: count + 1, firstAttempt }));
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
      localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now }));
      return { 
        allowed: true, 
        remainingAttempts: config.maxAttempts - 1,
        resetTime: new Date(now + windowMs)
      };
    }
  }

  /**
   * Get rate limit status without incrementing counter
   */
  static async getRateLimitStatus(
    identifier: string,
    actionType: keyof typeof DEFAULT_RATE_LIMITS
  ): Promise<{ remainingAttempts: number; resetTime?: Date }> {
    try {
      const config = DEFAULT_RATE_LIMITS[actionType];
      
      // Try client-side lookup first
      const key = `rate_limit_${identifier}_${actionType}`;
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        return { remainingAttempts: config.maxAttempts };
      }

      const { count, firstAttempt } = JSON.parse(stored);
      const windowMs = config.windowHours * 60 * 60 * 1000;
      const now = Date.now();

      if (now - firstAttempt > windowMs) {
        return { remainingAttempts: config.maxAttempts };
      }

      return { 
        remainingAttempts: Math.max(0, config.maxAttempts - count),
        resetTime: new Date(firstAttempt + windowMs)
      };
    } catch (error) {
      console.error('Rate limit status error:', error);
      return { remainingAttempts: DEFAULT_RATE_LIMITS[actionType].maxAttempts };
    }
  }
}
