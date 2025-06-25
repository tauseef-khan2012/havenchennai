
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
 * Enhanced rate limiting service with database-backed enforcement
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
      
      // Call the database function to check rate limit
      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_identifier: identifier.toLowerCase().trim(),
        p_action_type: actionType,
        p_max_attempts: config.maxAttempts,
        p_window_hours: config.windowHours
      });

      if (error) {
        console.error('Rate limit check error:', error);
        // Fail open - allow the action if we can't check the rate limit
        return { allowed: true, remainingAttempts: config.maxAttempts };
      }

      // Get current attempt count for remaining calculation
      const { data: currentCount } = await supabase
        .from('rate_limits')
        .select('attempt_count, reset_at')
        .eq('identifier', identifier.toLowerCase().trim())
        .eq('action_type', actionType)
        .single();

      const remainingAttempts = Math.max(0, config.maxAttempts - (currentCount?.attempt_count || 0));
      const resetTime = currentCount?.reset_at ? new Date(currentCount.reset_at) : undefined;

      return {
        allowed: data,
        remainingAttempts,
        resetTime
      };
    } catch (error) {
      console.error('Rate limit service error:', error);
      // Fail open for availability
      return { allowed: true, remainingAttempts: DEFAULT_RATE_LIMITS[actionType].maxAttempts };
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
      
      const { data } = await supabase
        .from('rate_limits')
        .select('attempt_count, reset_at')
        .eq('identifier', identifier.toLowerCase().trim())
        .eq('action_type', actionType)
        .single();

      const remainingAttempts = Math.max(0, config.maxAttempts - (data?.attempt_count || 0));
      const resetTime = data?.reset_at ? new Date(data.reset_at) : undefined;

      return { remainingAttempts, resetTime };
    } catch (error) {
      console.error('Rate limit status error:', error);
      return { remainingAttempts: DEFAULT_RATE_LIMITS[actionType].maxAttempts };
    }
  }
}
