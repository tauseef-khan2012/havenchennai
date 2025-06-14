
import { supabase } from '@/integrations/supabase/client';
import { UUID, BookingType, PriceBreakdown } from '@/types/booking';
import { validateGuestBookingData } from '../validation/guestBookingValidationService';
import { checkRateLimit } from '../rateLimit/guestBookingRateLimitService';
import { sanitizeTextInput } from '../utils/guestBookingSanitizationService';
import { generateBookingReference } from '../utils/bookingReferenceService';

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
    console.log('Creating guest booking with data:', bookingData);
    
    validateGuestBookingData(bookingData);
    
    await checkRateLimit(bookingData.guestEmail);
    
    const sanitizedData = {
      ...bookingData,
      guestName: bookingData.guestName, 
      guestEmail: bookingData.guestEmail, 
      guestPhone: bookingData.guestPhone, 
      specialRequests: bookingData.specialRequests ? sanitizeTextInput(bookingData.specialRequests) : undefined,
    };
    
    const bookingReference = generateBookingReference(sanitizedData.type);
    
    if (sanitizedData.type === 'property') {
      console.log('Creating property guest booking');
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: null, // Guest booking
          guest_name: sanitizedData.guestName,
          guest_email: sanitizedData.guestEmail,
          guest_phone: sanitizedData.guestPhone,
          property_id: sanitizedData.propertyId,
          check_in_date: sanitizedData.checkInDate?.toISOString().split('T')[0],
          check_out_date: sanitizedData.checkOutDate?.toISOString().split('T')[0],
          number_of_guests: sanitizedData.numberOfGuests,
          base_price_total: sanitizedData.priceBreakdown.basePrice,
          cleaning_fee_total: sanitizedData.priceBreakdown.cleaningFee || 0,
          taxes_total: sanitizedData.priceBreakdown.taxAmount,
          discounts_total: sanitizedData.priceBreakdown.discountAmount,
          total_amount_due: sanitizedData.priceBreakdown.totalAmountDue,
          currency: sanitizedData.priceBreakdown.currency,
          booking_reference: bookingReference,
          booking_status: 'Pending Payment',
          payment_status: 'Unpaid',
          special_requests: sanitizedData.specialRequests || ''
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating property booking:', error);
        throw new Error(`Failed to create property booking: ${error.message}`);
      }
      
      console.log('Property booking created successfully:', data);
      
      return {
        bookingId: data.id,
        bookingReference: bookingReference
      };
      
    } else if (sanitizedData.type === 'experience') {
      console.log('Creating experience guest booking');
      const { data, error } = await supabase
        .from('experience_bookings')
        .insert({
          user_id: null, // Guest booking
          guest_name: sanitizedData.guestName,
          guest_email: sanitizedData.guestEmail,
          guest_phone: sanitizedData.guestPhone,
          experience_instance_id: sanitizedData.instanceId,
          number_of_attendees: sanitizedData.numberOfAttendees,
          total_amount_due: sanitizedData.priceBreakdown.totalAmountDue,
          currency: sanitizedData.priceBreakdown.currency,
          booking_reference: bookingReference,
          booking_status: 'Pending Payment',
          payment_status: 'Unpaid',
          special_requests: sanitizedData.specialRequests || ''
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating experience booking:', error);
        throw new Error(`Failed to create experience booking: ${error.message}`);
      }
      
      console.log('Experience booking created successfully:', data);
      
      return {
        bookingId: data.id,
        bookingReference: bookingReference
      };
    } else {
      throw new Error(`Invalid booking type: ${sanitizedData.type}`);
    }
  } catch (error) {
    console.error('Error creating guest booking:', error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred while creating the booking');
    }
  }
};
