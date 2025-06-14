import { supabase } from '@/integrations/supabase/client';
import { UUID, BookingType, PriceBreakdown } from '@/types/booking';
import { validateGuestBookingData } from './booking/validation/guestBookingValidationService';
import { checkRateLimit } from './booking/rateLimit/guestBookingRateLimitService';
import { sanitizeTextInput } from './booking/utils/guestBookingSanitizationService';
import { generateBookingReference } from './booking/utils/bookingReferenceService';

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
    
    // Validate input data (now uses Zod for contact fields internally via the imported service)
    validateGuestBookingData(bookingData);
    
    // Check rate limiting
    await checkRateLimit(bookingData.guestEmail);
    
    // Data is already transformed by Zod's parse method within validateGuestBookingData for contact fields.
    // For other fields, or if specific sanitization beyond Zod's scope is needed:
    const sanitizedData = {
      ...bookingData,
      // guestName, guestEmail, guestPhone, specialRequests are transformed by Zod if they pass validation.
      // We can rely on Zod's .transform for trim, toLowerCase, and basic XSS on specialRequests.
      guestName: bookingData.guestName, 
      guestEmail: bookingData.guestEmail, 
      guestPhone: bookingData.guestPhone, 
      specialRequests: bookingData.specialRequests ? sanitizeTextInput(bookingData.specialRequests) : undefined,
    };
    
    const bookingReference = generateBookingReference(sanitizedData.type);
    
    if (sanitizedData.type === 'property') {
      console.log('Creating property guest booking');
      // Create property booking for guest
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
      // Create experience booking for guest
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
    
    // Re-throw with more context if it's not already a user-friendly error
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred while creating the booking');
    }
  }
};

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
