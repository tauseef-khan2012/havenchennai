
import { supabase } from '@/integrations/supabase/client';
import { 
  UUID, 
  BookingType, 
  PriceBreakdown
} from '@/types/booking';
import { 
  calculateEnhancedPropertyBookingPrice, 
  calculateEnhancedExperienceBookingPrice 
} from './enhancedPriceService';

/**
 * Calculates the price breakdown for a property booking (updated for GST compliance)
 */
export const calculatePropertyBookingPrice = async (
  propertyId: UUID,
  checkInDate: Date,
  checkOutDate: Date,
  selectedAddonExperiences?: {instanceId: UUID, attendees: number}[]
): Promise<PriceBreakdown> => {
  // Use enhanced pricing service which includes GST and dynamic discounts
  return await calculateEnhancedPropertyBookingPrice(
    propertyId, 
    checkInDate, 
    checkOutDate, 
    selectedAddonExperiences
  );
};

/**
 * Calculates the price breakdown for an experience booking (updated for GST compliance)
 */
export const calculateExperienceBookingPrice = async (
  instanceId: UUID,
  numberOfAttendees: number
): Promise<PriceBreakdown> => {
  // Use enhanced pricing service which includes GST and dynamic discounts
  return await calculateEnhancedExperienceBookingPrice(instanceId, numberOfAttendees);
};

/**
 * Calculates the price for a booking based on type
 */
export const calculateBookingPrice = async (
  bookingDetails: {
    type: BookingType;
    propertyId?: UUID;
    instanceId?: UUID;
    checkInDate?: Date;
    checkOutDate?: Date;
    numberOfAttendees?: number;
    selectedAddonExperiences?: {instanceId: UUID, attendees: number}[];
  }
): Promise<PriceBreakdown> => {
  try {
    if (bookingDetails.type === 'property') {
      if (!bookingDetails.propertyId || !bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
        throw new Error('Missing required details for property booking price calculation');
      }
      
      return calculatePropertyBookingPrice(
        bookingDetails.propertyId,
        bookingDetails.checkInDate,
        bookingDetails.checkOutDate,
        bookingDetails.selectedAddonExperiences
      );
    } else if (bookingDetails.type === 'experience') {
      if (!bookingDetails.instanceId || !bookingDetails.numberOfAttendees) {
        throw new Error('Missing required details for experience booking price calculation');
      }
      
      return calculateExperienceBookingPrice(
        bookingDetails.instanceId,
        bookingDetails.numberOfAttendees
      );
    } else {
      throw new Error('Invalid booking type');
    }
  } catch (error) {
    console.error('Error in calculateBookingPrice:', error);
    throw error;
  }
};

/**
 * Calculates the number of nights between two dates
 */
const calculateNights = (checkInDate: Date, checkOutDate: Date): number => {
  const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};
