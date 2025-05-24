
import { 
  UUID, 
  BookingType, 
  PriceBreakdown
} from '@/types/booking';
import { 
  calculatePropertyBookingPrice,
  calculateExperienceBookingPrice
} from './pricing';

/**
 * Main price service that orchestrates all pricing calculations
 */

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

// Re-export specific functions for backward compatibility
export { calculatePropertyBookingPrice, calculateExperienceBookingPrice } from './pricing';
