
import { UUID, PriceBreakdown } from '@/types/booking';
import { calculateEnhancedPropertyBookingPrice } from '../enhancedPriceService';

/**
 * Property-specific price calculation service
 */

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
