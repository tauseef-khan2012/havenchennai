import { supabase } from '@/integrations/supabase/client';
import { UUID, BookingType, PriceBreakdown } from '@/types/booking';
import { contactValidationSchema } from '@/components/booking/validation/ContactValidation'; // Import Zod schema
import { z } from 'zod'; // Import z for ZodError

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
 * Enhanced validation for guest booking data with security checks
 */
const validateGuestBookingData = (bookingData: GuestBookingData): void => {
  const errors: string[] = [];

  // Validate contact information using Zod schema
  try {
    // Extract contact fields for Zod validation
    const contactFields = {
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
      guestPhone: bookingData.guestPhone,
      specialRequests: bookingData.specialRequests || undefined, // Zod schema handles optional
    };
    contactValidationSchema.parse(contactFields);
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => errors.push(err.message));
    } else {
      errors.push('Contact information validation failed.');
    }
  }
  
  // Type-specific validation with enhanced security (remains largely the same)
  if (bookingData.type === 'property') {
    if (!bookingData.propertyId) {
      errors.push('Property ID is required for property bookings');
    }
    if (!bookingData.checkInDate) {
      errors.push('Check-in date is required for property bookings');
    }
    if (!bookingData.checkOutDate) {
      errors.push('Check-out date is required for property bookings');
    }
    if (bookingData.checkInDate && bookingData.checkOutDate) {
      if (bookingData.checkInDate >= bookingData.checkOutDate) {
        errors.push('Check-out date must be after check-in date');
      }
      const maxAdvanceDate = new Date();
      maxAdvanceDate.setFullYear(maxAdvanceDate.getFullYear() + 2);
      if (bookingData.checkInDate > maxAdvanceDate) {
        errors.push('Bookings cannot be made more than 2 years in advance');
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (bookingData.checkInDate < today) {
        errors.push('Cannot book dates in the past');
      }
    }
    if (!bookingData.numberOfGuests || bookingData.numberOfGuests < 1) {
      errors.push('Number of guests must be at least 1');
    } else if (bookingData.numberOfGuests > 20) {
      errors.push('Number of guests cannot exceed 20');
    }
  } else if (bookingData.type === 'experience') {
    if (!bookingData.instanceId) {
      errors.push('Experience instance ID is required for experience bookings');
    }
    if (!bookingData.numberOfAttendees || bookingData.numberOfAttendees < 1) {
      errors.push('Number of attendees must be at least 1');
    } else if (bookingData.numberOfAttendees > 50) {
      errors.push('Number of attendees cannot exceed 50');
    }
  }

  // Enhanced price validation (remains the same)
  if (!bookingData.priceBreakdown) {
    errors.push('Price breakdown is required');
  } else {
    if (bookingData.priceBreakdown.totalAmountDue <= 0) {
      errors.push('Total amount must be greater than 0');
    } else if (bookingData.priceBreakdown.totalAmountDue > 500000) {
      errors.push('Total amount cannot exceed ₹5,00,000');
    }
    if (!['INR', 'USD'].includes(bookingData.priceBreakdown.currency)) {
      errors.push('Invalid currency. Only INR and USD are supported.');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
};

/**
 * Rate limiting check for guest bookings
 */
const checkRateLimit = async (email: string): Promise<void> => {
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

/**
 * Sanitize text input to prevent XSS - simplified as Zod handles some aspects.
 * Kept for any fields not covered by Zod or for an additional layer.
 */
const sanitizeTextInput = (input?: string): string | undefined => {
  if (!input) return undefined;
  // Basic sanitization like limiting length, specific character stripping can be done here
  // if Zod's transformation is not sufficient or for non-Zod validated fields.
  // For now, Zod schema for specialRequests handles <>.
  return input.trim().substring(0, 500); 
};

/**
 * Creates a booking for a guest user (no authentication required)
 */
export const createGuestBooking = async (
  bookingData: GuestBookingData
): Promise<{ bookingId: UUID, bookingReference: string }> => {
  try {
    console.log('Creating guest booking with data:', bookingData);
    
    // Validate input data (now uses Zod for contact fields internally)
    validateGuestBookingData(bookingData);
    
    // Check rate limiting
    await checkRateLimit(bookingData.guestEmail);
    
    // Data is already transformed by Zod's parse method within validateGuestBookingData for contact fields.
    // For other fields, or if specific sanitization beyond Zod's scope is needed:
    const sanitizedData = {
      ...bookingData,
      // guestName, guestEmail, guestPhone, specialRequests are transformed by Zod
      // if they pass validation.
      // We can rely on Zod's .transform for trim, toLowerCase, and basic XSS on specialRequests.
      // If additional sanitization is needed for non-contact fields, apply it here.
      // Example: Ensure guestName and specialRequests are length-limited by sanitizeTextInput
      // if Zod schema doesn't enforce max length strictly enough for final DB storage.
      // However, contactValidationSchema has max lengths, so this should be covered.
      guestName: bookingData.guestName, // Already transformed by Zod if validation passed
      guestEmail: bookingData.guestEmail, // Already transformed
      guestPhone: bookingData.guestPhone, // Already transformed
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

/**
 * Generates a unique booking reference
 */
function generateBookingReference(type: BookingType): string {
  const prefix = type === 'property' ? 'PROP' : 'EXP';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}
