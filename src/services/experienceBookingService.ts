
import { supabase } from '@/integrations/supabase/client';
import { 
  UUID, 
  ExperienceBookingDetails,
  PriceBreakdown,
  ChannelType
} from '@/types/booking';
import { generateBookingReference } from '@/utils/bookingUtils';

/**
 * Creates an experience booking in the database
 */
export const createExperienceBooking = async (
  userId: UUID,
  experienceDetails: ExperienceBookingDetails,
  priceBreakdown: PriceBreakdown,
  sourcePlatform?: ChannelType,
  sourceBookingId?: string
): Promise<{ bookingId: UUID, bookingReference: string }> => {
  // Generate booking reference
  const bookingReference = generateBookingReference();
  
  try {
    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('experience_bookings')
      .insert({
        user_id: userId,
        experience_instance_id: experienceDetails.instanceId,
        number_of_attendees: experienceDetails.numberOfAttendees,
        total_amount_due: priceBreakdown.totalAmountDue,
        booking_reference: bookingReference,
        special_requests: experienceDetails.specialRequests,
        currency: priceBreakdown.currency,
        booking_status: 'Pending Payment',
        payment_status: 'Unpaid',
        source_platform: sourcePlatform,
        source_booking_id: sourceBookingId
      })
      .select('id')
      .single();

    if (bookingError) {
      console.error('Error creating experience booking:', bookingError);
      throw new Error(`Failed to create experience booking: ${bookingError.message}`);
    }

    if (!booking) {
      throw new Error('Failed to create experience booking - no data returned');
    }

    // Update the current_attendees in the experience_instance
    const { error: updateError } = await supabase.rpc(
      'increment_experience_attendees', 
      {
        instance_id: experienceDetails.instanceId,
        attendees_count: experienceDetails.numberOfAttendees
      } as { instance_id: string; attendees_count: number }
    );

    if (updateError) {
      console.error('Error updating experience instance attendees:', updateError);
      // Consider rolling back the booking here if capacity update fails
      throw new Error(`Failed to update experience capacity: ${updateError.message}`);
    }

    return {
      bookingId: booking.id,
      bookingReference
    };
  } catch (error) {
    console.error('Error in createExperienceBooking:', error);
    throw error;
  }
};
