
import { 
  UUID, 
  BookingType,
  BookingData,
  GuestInfo
} from '@/types/booking';
import { createPropertyBooking } from './propertyBookingService';
import { createExperienceBooking } from './experienceBookingService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a booking based on the booking type
 */
export const createBooking = async (
  bookingData: BookingData & {
    selectedAddonExperiences?: {instanceId: UUID, attendees: number}[]
  }
): Promise<{ bookingId: UUID, bookingReference: string }> => {
  try {
    if (bookingData.type === 'property') {
      if (!bookingData.property) {
        throw new Error('Missing property booking details');
      }
      
      return await createPropertyBooking(
        bookingData.userId,
        bookingData.property,
        bookingData.priceBreakdown,
        bookingData.guests,
        bookingData.sourcePlatform,
        bookingData.sourceBookingId,
        bookingData.selectedAddonExperiences
      );
    } else if (bookingData.type === 'experience') {
      if (!bookingData.experience) {
        throw new Error('Missing experience booking details');
      }
      
      return await createExperienceBooking(
        bookingData.userId,
        bookingData.experience,
        bookingData.priceBreakdown,
        bookingData.sourcePlatform,
        bookingData.sourceBookingId
      );
    } else {
      throw new Error('Invalid booking type');
    }
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
};

/**
 * Gets a booking by ID
 */
export const getBookingById = async (
  bookingId: UUID, 
  bookingType: BookingType
): Promise<any> => {
  try {
    let table, query;
    
    if (bookingType === 'property') {
      table = 'bookings';
      query = supabase
        .from(table)
        .select(`
          *,
          property:property_id (name, type, image_urls),
          user:user_id (email, full_name, phone_number),
          guests:booking_guests (guest_name, guest_age)
        `)
        .eq('id', bookingId)
        .single();
    } else {
      table = 'experience_bookings';
      query = supabase
        .from(table)
        .select(`
          *,
          instance:experience_instance_id (
            date, 
            time,
            experience:experience_id (name, type, image_urls)
          ),
          user:user_id (email, full_name, phone_number)
        `)
        .eq('id', bookingId)
        .single();
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${bookingType} booking:`, error);
      throw new Error(`Failed to get booking: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in getBookingById:', error);
    throw error;
  }
};

/**
 * Updates a booking status
 */
export const updateBookingStatus = async (
  bookingId: UUID,
  bookingType: BookingType,
  status: string
): Promise<void> => {
  try {
    const table = bookingType === 'property' ? 'bookings' : 'experience_bookings';
    
    const { error } = await supabase
      .from(table)
      .update({ booking_status: status })
      .eq('id', bookingId);
    
    if (error) {
      console.error(`Error updating ${bookingType} booking status:`, error);
      throw new Error(`Failed to update booking status: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    throw error;
  }
};

/**
 * Updates a booking payment status
 */
export const updateBookingPaymentStatus = async (
  bookingId: UUID,
  bookingType: BookingType,
  paymentStatus: string
): Promise<void> => {
  try {
    const table = bookingType === 'property' ? 'bookings' : 'experience_bookings';
    
    const { error } = await supabase
      .from(table)
      .update({ payment_status: paymentStatus })
      .eq('id', bookingId);
    
    if (error) {
      console.error(`Error updating ${bookingType} payment status:`, error);
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateBookingPaymentStatus:', error);
    throw error;
  }
};

// Re-export functions from other services for backward compatibility
export { checkPropertyAvailability, checkExperienceInstanceAvailability } from './availabilityService';
export { calculateBookingPrice, calculatePropertyBookingPrice, calculateExperienceBookingPrice } from './priceService';
