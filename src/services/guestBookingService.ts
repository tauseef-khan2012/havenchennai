
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
 * Enhanced validation for guest booking data
 */
const validateGuestBookingData = (bookingData: GuestBookingData): void => {
  const errors: string[] = [];

  // Basic required fields
  if (!bookingData.guestName?.trim()) {
    errors.push('Guest name is required');
  }
  
  if (!bookingData.guestEmail?.trim()) {
    errors.push('Guest email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.guestEmail.trim())) {
    errors.push('Invalid email format');
  }
  
  if (!bookingData.guestPhone?.trim()) {
    errors.push('Guest phone is required');
  }

  // Type-specific validation
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
    if (bookingData.checkInDate && bookingData.checkOutDate && bookingData.checkInDate >= bookingData.checkOutDate) {
      errors.push('Check-out date must be after check-in date');
    }
    if (!bookingData.numberOfGuests || bookingData.numberOfGuests < 1) {
      errors.push('Number of guests must be at least 1');
    }
  } else if (bookingData.type === 'experience') {
    if (!bookingData.instanceId) {
      errors.push('Experience instance ID is required for experience bookings');
    }
    if (!bookingData.numberOfAttendees || bookingData.numberOfAttendees < 1) {
      errors.push('Number of attendees must be at least 1');
    }
  }

  // Price validation
  if (!bookingData.priceBreakdown) {
    errors.push('Price breakdown is required');
  } else if (bookingData.priceBreakdown.totalAmountDue <= 0) {
    errors.push('Total amount must be greater than 0');
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
};

/**
 * Creates a booking for a guest user (no authentication required)
 */
export const createGuestBooking = async (
  bookingData: GuestBookingData
): Promise<{ bookingId: UUID, bookingReference: string }> => {
  try {
    console.log('Creating guest booking with data:', bookingData);
    
    // Validate input data
    validateGuestBookingData(bookingData);
    
    const bookingReference = generateBookingReference(bookingData.type);
    
    if (bookingData.type === 'property') {
      console.log('Creating property guest booking');
      // Create property booking for guest
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: null, // Guest booking
          guest_name: bookingData.guestName.trim(),
          guest_email: bookingData.guestEmail.trim().toLowerCase(),
          guest_phone: bookingData.guestPhone.trim(),
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
          special_requests: bookingData.specialRequests || ''
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
      
    } else if (bookingData.type === 'experience') {
      console.log('Creating experience guest booking');
      // Create experience booking for guest
      const { data, error } = await supabase
        .from('experience_bookings')
        .insert({
          user_id: null, // Guest booking
          guest_name: bookingData.guestName.trim(),
          guest_email: bookingData.guestEmail.trim().toLowerCase(),
          guest_phone: bookingData.guestPhone.trim(),
          experience_instance_id: bookingData.instanceId,
          number_of_attendees: bookingData.numberOfAttendees,
          total_amount_due: bookingData.priceBreakdown.totalAmountDue,
          currency: bookingData.priceBreakdown.currency,
          booking_reference: bookingReference,
          booking_status: 'Pending Payment',
          payment_status: 'Unpaid',
          special_requests: bookingData.specialRequests || ''
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
      throw new Error(`Invalid booking type: ${bookingData.type}`);
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
