
import { UUID, PriceBreakdown } from '@/types/booking';
import { calculateEnhancedExperienceBookingPrice } from '../enhancedPriceService';

/**
 * Experience-specific price calculation service
 */

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
