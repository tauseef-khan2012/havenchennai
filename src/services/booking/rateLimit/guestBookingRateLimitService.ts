
import { RateLimitService } from '@/services/security/rateLimitService';

/**
 * Enhanced rate limiting check for guest bookings using the new security service
 */
export const checkRateLimit = async (email: string): Promise<void> => {
  const result = await RateLimitService.checkRateLimit(email, 'GUEST_BOOKING');
  
  if (!result.allowed) {
    const resetTime = result.resetTime ? 
      ` Try again after ${result.resetTime.toLocaleTimeString()}.` : 
      ' Please try again later.';
    
    throw new Error(`Rate limit exceeded. Maximum 3 bookings per hour per email address.${resetTime}`);
  }
};
