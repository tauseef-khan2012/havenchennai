
import { supabase } from '@/integrations/supabase/client';
import { UUID, BookingType, PriceBreakdown } from '@/types/booking';

export interface GuestBookingData {
  type: BookingType;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  priceBreakdown: PriceBreakdown;
  propertyId?: UUID;
  checkInDate?: Date;
  checkOutDate?: Date;
  numberOfGuests?: number;
  specialRequests?: string;
  instanceId?: UUID;
  numberOfAttendees?: number;
}

/**
 * Creates a booking for a guest user (no authentication required)
 */
export const createGuestBooking = async (
  bookingData: GuestBookingData
): Promise<{ bookingId: UUID, bookingReference: string }> => {
  try {
    const bookingReference = generateBookingReference(bookingData.type);
    
    if (bookingData.type === 'property') {
      // Create property booking for guest
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: null, // Guest booking
          guest_name: bookingData.guestName,
          guest_email: bookingData.guestEmail,
          guest_phone: bookingData.guestPhone,
          property_id: bookingData.propertyId,
          check_in_date: bookingData.checkInDate?.toISOString().split('T')[0],
          check_out_date: bookingData.checkOutDate?.toISOString().split('T')[0],
          number_of_guests: bookingData.numberOfGuests,
          base_price_total: bookingData.priceBreakdown.basePrice,
          cleaning_fee_total: bookingData.priceBreakdown.cleaningFee || 0,
          taxes_total: bookingData.priceBreakdown.taxAmount,
          discounts_total: bookingData.priceBreakdown.discountAmount,
          total_amount_due: bookingData.priceBreakdown.totalAmountDue,
          currency: bookingData.priceBreakdown.currency,
          booking_reference: bookingReference,
          booking_status: 'Pending Payment',
          payment_status: 'Unpaid',
          special_requests: bookingData.specialRequests
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        bookingId: data.id,
        bookingReference: bookingReference
      };
      
    } else if (bookingData.type === 'experience') {
      // Create experience booking for guest
      const { data, error } = await supabase
        .from('experience_bookings')
        .insert({
          user_id: null, // Guest booking
          guest_name: bookingData.guestName,
          guest_email: bookingData.guestEmail,
          guest_phone: bookingData.guestPhone,
          experience_instance_id: bookingData.instanceId,
          number_of_attendees: bookingData.numberOfAttendees,
          total_amount_due: bookingData.priceBreakdown.totalAmountDue,
          currency: bookingData.priceBreakdown.currency,
          booking_reference: bookingReference,
          booking_status: 'Pending Payment',
          payment_status: 'Unpaid',
          special_requests: bookingData.specialRequests
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        bookingId: data.id,
        bookingReference: bookingReference
      };
    } else {
      throw new Error('Invalid booking type');
    }
  } catch (error) {
    console.error('Error creating guest booking:', error);
    throw error;
  }
};

/**
 * Retrieves guest bookings by email
 */
export const getGuestBookingsByEmail = async (email: string) => {
  try {
    const [propertyBookings, experienceBookings] = await Promise.all([
      supabase
        .from('bookings')
        .select(`
          *,
          property:property_id (name, type, image_urls)
        `)
        .eq('guest_email', email)
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
        .eq('guest_email', email)
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

/**
 * Links guest bookings to a user account when they sign up
 */
export const linkGuestBookingsToUser = async (userId: UUID, email: string) => {
  try {
    // Update property bookings
    const { error: propertyError } = await supabase
      .from('bookings')
      .update({ user_id: userId })
      .eq('guest_email', email)
      .is('user_id', null);

    if (propertyError) throw propertyError;

    // Update experience bookings
    const { error: experienceError } = await supabase
      .from('experience_bookings')
      .update({ user_id: userId })
      .eq('guest_email', email)
      .is('user_id', null);

    if (experienceError) throw experienceError;

    return true;
  } catch (error) {
    console.error('Error linking guest bookings to user:', error);
    throw error;
  }
};

/**
 * Generates a unique booking reference
 */
function generateBookingReference(type: BookingType): string {
  const prefix = type === 'property' ? 'PROP' : 'EXP';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}
