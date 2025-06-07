
import { supabase } from '@/integrations/supabase/client';
import { 
  UUID, 
  PriceBreakdown
} from '@/types/booking';
import { calculateNights } from './pricing/basePriceService';
import { calculateGST } from './pricing/gstCalculationService';

/**
 * Simplified pricing service with hardcoded base price and no external dependencies
 */

export interface EnhancedPriceBreakdown extends PriceBreakdown {
  gstBreakdown?: {
    cgst: number;
    sgst: number;
    igst?: number;
  };
}

/**
 * Simplified property booking price calculation
 * Base price: ₹4000 per night
 * Additional guests: ₹500 per guest after 2nd guest
 * GST: 18%
 */
export const calculateEnhancedPropertyBookingPrice = async (
  propertyId: UUID,
  checkInDate: Date,
  checkOutDate: Date,
  guestCount: number = 2
): Promise<EnhancedPriceBreakdown> => {
  try {
    // Calculate number of nights
    const nights = calculateNights(checkInDate, checkOutDate);
    
    // Hardcoded base price: ₹4000 per night
    const basePricePerNight = 4000;
    const basePrice = basePricePerNight * nights;
    
    // Additional guest charges: ₹500 per guest after 2nd
    const additionalGuestCharges = Math.max(0, guestCount - 2) * 500;
    
    // Subtotal before GST (no discounts applied here - handled in UI)
    const subtotalBeforeGST = basePrice + additionalGuestCharges;
    
    // Calculate GST (18%)
    const gstBreakdown = calculateGST(subtotalBeforeGST);
    
    // Calculate total
    const totalAmountDue = subtotalBeforeGST + gstBreakdown.total;

    return {
      basePrice: basePrice,
      discountAmount: 0, // Discounts handled in UI layer
      subtotalAfterDiscount: subtotalBeforeGST,
      taxPercentage: 18,
      taxAmount: gstBreakdown.total,
      totalAmountDue,
      currency: 'INR',
      gstBreakdown: {
        cgst: gstBreakdown.cgst,
        sgst: gstBreakdown.sgst,
        igst: gstBreakdown.igst
      }
    };
  } catch (error) {
    console.error('Error in calculateEnhancedPropertyBookingPrice:', error);
    
    // Simple fallback calculation
    const nights = calculateNights(checkInDate, checkOutDate);
    const basePrice = 4000 * nights;
    const additionalGuestCharges = Math.max(0, guestCount - 2) * 500;
    const subtotal = basePrice + additionalGuestCharges;
    const gstAmount = subtotal * 0.18;
    
    return {
      basePrice,
      discountAmount: 0,
      subtotalAfterDiscount: subtotal,
      taxPercentage: 18,
      taxAmount: gstAmount,
      totalAmountDue: subtotal + gstAmount,
      currency: 'INR',
      gstBreakdown: {
        cgst: gstAmount / 2,
        sgst: gstAmount / 2
      }
    };
  }
};

/**
 * Simple experience booking price calculation (keeping for compatibility)
 */
export const calculateEnhancedExperienceBookingPrice = async (
  instanceId: UUID,
  numberOfAttendees: number
): Promise<EnhancedPriceBreakdown> => {
  try {
    const { data: instance, error } = await supabase
      .from('experience_instances')
      .select(`
        *,
        experience:experiences(*)
      `)
      .eq('id', instanceId)
      .single();

    if (error || !instance) {
      throw new Error('Experience instance not found');
    }

    // Simple pricing logic
    const basePrice = instance.price_per_person_override || instance.experience?.price_per_person || 1000;
    const totalPrice = basePrice * numberOfAttendees;
    
    // Calculate GST
    const gstBreakdown = calculateGST(totalPrice);
    
    return {
      basePrice: totalPrice,
      discountAmount: 0,
      subtotalAfterDiscount: totalPrice,
      taxPercentage: 18,
      taxAmount: gstBreakdown.total,
      totalAmountDue: totalPrice + gstBreakdown.total,
      currency: 'INR',
      gstBreakdown: {
        cgst: gstBreakdown.cgst,
        sgst: gstBreakdown.sgst
      }
    };
  } catch (error) {
    console.error('Error in calculateEnhancedExperienceBookingPrice:', error);
    throw error;
  }
};
