
import { supabase } from '@/integrations/supabase/client';
import { 
  UUID, 
  PropertyBookingDetails, 
  GuestInfo, 
  PriceBreakdown,
  ChannelType,
  PaymentStatus,
  BookingStatus
} from '@/types/booking';
import { generateBookingReference } from '@/utils/bookingUtils';

/**
 * Creates a property booking in the database
 */
export const createPropertyBooking = async (
  userId: UUID,
  propertyDetails: PropertyBookingDetails,
  priceBreakdown: PriceBreakdown,
  guests?: GuestInfo[],
  sourcePlatform?: ChannelType,
  sourceBookingId?: string,
  selectedAddonExperiences?: {instanceId: UUID, attendees: number}[]
): Promise<{ bookingId: UUID, bookingReference: string }> => {
  // Generate booking reference
  const bookingReference = generateBookingReference();
  
  try {
    // Start a transaction
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        property_id: propertyDetails.propertyId,
        check_in_date: propertyDetails.checkInDate.toISOString(),
        check_out_date: propertyDetails.checkOutDate.toISOString(),
        number_of_guests: propertyDetails.numberOfGuests,
        base_price_total: priceBreakdown.basePrice,
        cleaning_fee_total: priceBreakdown.cleaningFee || 0,
        taxes_total: priceBreakdown.taxAmount,
        discounts_total: priceBreakdown.discountAmount,
        total_amount_due: priceBreakdown.totalAmountDue,
        booking_reference: bookingReference,
        special_requests: propertyDetails.specialRequests,
        customer_notes: propertyDetails.customerNotes,
        currency: priceBreakdown.currency,
        booking_status: 'Pending Payment' as BookingStatus,
        payment_status: 'Unpaid' as PaymentStatus,
        source_platform: sourcePlatform || null,
        source_booking_id: sourceBookingId || null
      })
      .select('id')
      .single();

    if (bookingError) {
      console.error('Error creating property booking:', bookingError);
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    // If guests information is provided, add it to the booking_guests table
    if (guests && guests.length > 0 && booking) {
      const guestsToInsert = guests.map(guest => ({
        booking_id: booking.id,
        guest_name: guest.name,
        guest_age: guest.age
      }));

      const { error: guestsError } = await supabase
        .from('booking_guests')
        .insert(guestsToInsert);

      if (guestsError) {
        console.error('Error adding guest information:', guestsError);
        // Continue despite guest info error, as the main booking was created
      }
    }
    
    // If addon experiences are selected, create experience bookings for each
    if (selectedAddonExperiences && selectedAddonExperiences.length > 0 && booking) {
      for (const addon of selectedAddonExperiences) {
        // Create experience booking linked to the property booking
        const { error: addonError } = await supabase
          .from('experience_bookings')
          .insert({
            user_id: userId,
            experience_instance_id: addon.instanceId,
            number_of_attendees: addon.attendees,
            total_amount_due: 0, // This will be updated with the actual amount later
            booking_reference: `${bookingReference}-EXP${addon.instanceId.substring(0, 4)}`,
            booking_status: 'Pending Payment' as BookingStatus,
            payment_status: 'Unpaid' as PaymentStatus,
            special_requests: `Add-on for property booking: ${booking.id}`,
            currency: priceBreakdown.currency
          });

        if (addonError) {
          console.error('Error adding addon experience booking:', addonError);
          // Continue despite addon error, as the main booking was created
        } else {
          // Update the current_attendees in the experience_instance
          const { error: updateError } = await supabase.rpc(
            'increment_experience_attendees',
            {
              instance_id: addon.instanceId,
              attendees_count: addon.attendees
            }
          );

          if (updateError) {
            console.error('Error updating experience instance attendees:', updateError);
            // Continue despite update error, as the bookings were created
          }
        }
      }
    }

    if (!booking) {
      throw new Error('Failed to create booking - no data returned');
    }

    return {
      bookingId: booking.id,
      bookingReference
    };
  } catch (error) {
    console.error('Error in createPropertyBooking:', error);
    throw error;
  }
};
