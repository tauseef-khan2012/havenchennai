
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

/**
 * Links guest bookings to a user account when they sign up
 */
export const linkGuestBookingsToUser = async (userId: UUID, email: string) => {
  try {
    if (!userId || !email?.trim()) {
      throw new Error('User ID and email are required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    // Update property bookings
    const { error: propertyError } = await supabase
      .from('bookings')
      .update({ user_id: userId })
      .eq('guest_email', normalizedEmail)
      .is('user_id', null);

    if (propertyError) {
      console.error('Error linking property bookings:', propertyError);
      throw new Error(`Failed to link property bookings: ${propertyError.message}`);
    }

    // Update experience bookings
    const { error: experienceError } = await supabase
      .from('experience_bookings')
      .update({ user_id: userId })
      .eq('guest_email', normalizedEmail)
      .is('user_id', null);

    if (experienceError) {
      console.error('Error linking experience bookings:', experienceError);
      throw new Error(`Failed to link experience bookings: ${experienceError.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error linking guest bookings to user:', error);
    throw error;
  }
};
