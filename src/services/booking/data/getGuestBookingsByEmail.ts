
import { supabase } from '@/integrations/supabase/client';

/**
 * Retrieves guest bookings by email
 */
export const getGuestBookingsByEmail = async (email: string) => {
  try {
    if (!email?.trim()) {
      throw new Error('Email is required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    const [propertyBookings, experienceBookings] = await Promise.all([
      supabase
        .from('bookings')
        .select(`
          *,
          property:property_id (name, type, image_urls)
        `)
        .eq('guest_email', normalizedEmail)
        .is('user_id', null),
      
      supabase
        .from('experience_bookings')
        .select(`
          *,
          instance:experience_instance_id (
            date, 
            time,
            experience:experience_id (name, type, image_urls)
          )
        `)
        .eq('guest_email', normalizedEmail)
        .is('user_id', null)
    ]);

    return {
      propertyBookings: propertyBookings.data || [],
      experienceBookings: experienceBookings.data || []
    };
  } catch (error) {
    console.error('Error fetching guest bookings:', error);
    throw error;
  }
};
