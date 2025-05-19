
import { supabase } from '@/integrations/supabase/client';
import { UUID } from '@/types/booking';

/**
 * Checks if a property is available for the specified dates
 */
export const checkPropertyAvailability = async (
  propertyId: UUID, 
  checkInDate: Date, 
  checkOutDate: Date
): Promise<boolean> => {
  try {
    // Format dates for Supabase query
    const formattedCheckIn = checkInDate.toISOString().split('T')[0];
    const formattedCheckOut = checkOutDate.toISOString().split('T')[0];

    // Query bookings that overlap with requested dates
    const { data: overlappingBookings, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('property_id', propertyId)
      .in('booking_status', ['Confirmed', 'Checked-In', 'Pending Payment'])
      .or(`check_in_date,lte.${formattedCheckOut},check_out_date,gte.${formattedCheckIn}`);

    if (error) {
      console.error('Error checking property availability:', error);
      throw new Error(`Error checking availability: ${error.message}`);
    }

    // Property is available if no overlapping bookings exist
    return !overlappingBookings || overlappingBookings.length === 0;
  } catch (error) {
    console.error('Error in checkPropertyAvailability:', error);
    throw error;
  }
};

/**
 * Checks if an experience instance has enough capacity for the requested attendees
 */
export const checkExperienceInstanceAvailability = async (
  instanceId: UUID, 
  numberOfAttendees: number
): Promise<boolean> => {
  try {
    // Query the experience instance
    const { data: instance, error } = await supabase
      .from('experience_instances')
      .select('max_capacity, current_attendees')
      .eq('id', instanceId)
      .single();

    if (error) {
      console.error('Error checking experience instance availability:', error);
      throw new Error('Error checking experience availability: Experience instance not found');
    }

    if (!instance) {
      throw new Error('Experience instance not found');
    }

    // Check if there's enough capacity
    return (instance.current_attendees + numberOfAttendees) <= instance.max_capacity;
  } catch (error) {
    console.error('Error in checkExperienceInstanceAvailability:', error);
    throw error;
  }
};
