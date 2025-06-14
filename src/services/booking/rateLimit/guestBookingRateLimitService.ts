
import { supabase } from '@/integrations/supabase/client';

/**
 * Rate limiting check for guest bookings
 */
export const checkRateLimit = async (email: string): Promise<void> => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  // Check recent bookings from this email
  const { data: recentBookings, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('guest_email', email.trim().toLowerCase())
    .gte('created_at', oneHourAgo);

  if (error) {
    console.error('Error checking rate limit:', error);
    throw new Error('Unable to verify booking rate limit');
  }

  if (recentBookings && recentBookings.length >= 3) {
    throw new Error('Rate limit exceeded. Maximum 3 bookings per hour per email address.');
  }
};
