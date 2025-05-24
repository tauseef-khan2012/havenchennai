
import { supabase } from '@/integrations/supabase/client';
import { 
  UUID, 
  BookingType, 
  PriceBreakdown
} from '@/types/booking';
import { 
  calculateNights, 
  getPropertyBasePricing, 
  getExperienceInstancePricing
} from './pricing/basePriceService';
import { calculateAddonExperiencesTotal } from './pricing/addonCalculationService';
import { getExternalRates } from './pricing/externalRatesService';
import { getPricingRules } from './pricing/pricingRulesService';
import { calculateGST } from './pricing/gstCalculationService';
import { applyPricingRules } from './pricing/discountApplicationService';

/**
 * Enhanced pricing service with GST compliance and dynamic pricing
 */

export interface EnhancedPriceBreakdown extends PriceBreakdown {
  gstBreakdown?: {
    cgst: number;
    sgst: number;
    igst?: number;
  };
  competitorRates?: any[];
  appliedDiscounts?: {
    name: string;
    percentage: number;
    amount: number;
  }[];
  savingsFromCompetitors?: number;
}

/**
 * Enhanced property booking price calculation
 */
export const calculateEnhancedPropertyBookingPrice = async (
  propertyId: UUID,
  checkInDate: Date,
  checkOutDate: Date,
  selectedAddonExperiences?: {instanceId: UUID, attendees: number}[]
): Promise<EnhancedPriceBreakdown> => {
  try {
    // Calculate number of nights using the new utility
    const nights = calculateNights(checkInDate, checkOutDate);
    
    // Set base price to ₹4000 per night (hardcoded as requested)
    const basePricePerNight = 4000;
    const originalBasePrice = basePricePerNight * nights;
    
    // Get external rates and pricing rules
    const [externalRates, pricingRules] = await Promise.all([
      getExternalRates(propertyId, checkInDate, checkOutDate),
      getPricingRules(propertyId)
    ]);
    
    // Apply pricing rules for discounts
    const { discountedPrice, appliedDiscounts, savingsFromCompetitors } = applyPricingRules(
      originalBasePrice,
      pricingRules,
      externalRates
    );
    
    // Remove cleaning fee (set to 0 as requested)
    const cleaningFee = 0;
    
    // Calculate addon experiences cost using the correct modular service
    const addonExperiencesTotal = await calculateAddonExperiencesTotal(selectedAddonExperiences);
    
    // Calculate subtotal before GST
    const subtotalBeforeGST = discountedPrice + cleaningFee + addonExperiencesTotal;
    
    // Calculate GST (18%)
    const gstBreakdown = calculateGST(subtotalBeforeGST);
    
    // Calculate total
    const totalAmountDue = subtotalBeforeGST + gstBreakdown.total;

    // Calculate total discount amount
    const totalDiscountAmount = appliedDiscounts.reduce((sum, discount) => sum + discount.amount, 0);

    return {
      basePrice: originalBasePrice,
      discountAmount: totalDiscountAmount,
      subtotalAfterDiscount: discountedPrice,
      taxPercentage: 18,
      taxAmount: gstBreakdown.total,
      cleaningFee: cleaningFee > 0 ? cleaningFee : undefined, // Only include if > 0
      addonExperiencesTotal: addonExperiencesTotal > 0 ? addonExperiencesTotal : undefined,
      totalAmountDue,
      currency: 'INR',
      gstBreakdown: {
        cgst: gstBreakdown.cgst,
        sgst: gstBreakdown.sgst,
        igst: gstBreakdown.igst
      },
      competitorRates: externalRates,
      appliedDiscounts,
      savingsFromCompetitors
    };
  } catch (error) {
    console.error('Error in calculateEnhancedPropertyBookingPrice:', error);
    throw error;
  }
};

/**
 * Enhanced experience booking price calculation
 */
export const calculateEnhancedExperienceBookingPrice = async (
  instanceId: UUID,
  numberOfAttendees: number
): Promise<EnhancedPriceBreakdown> => {
  try {
    // Get experience instance details using the new modular service
    const instance = await getExperienceInstancePricing(instanceId);

    // Get pricing rules for experience
    const pricingRules = await getPricingRules(undefined, instance.experience?.id);
    
    // Determine pricing model and base price
    const useFlatFee = instance.flat_fee_price_override !== null || 
                        (instance.experience?.flat_fee_price !== null && instance.price_per_person_override === null);
    
    let basePrice = 0;
    if (useFlatFee) {
      basePrice = instance.flat_fee_price_override ?? instance.experience?.flat_fee_price ?? 0;
    } else {
      const pricePerPerson = instance.price_per_person_override ?? instance.experience?.price_per_person ?? 0;
      basePrice = pricePerPerson * numberOfAttendees;
    }
    
    // Apply pricing rules
    const { discountedPrice, appliedDiscounts } = applyPricingRules(basePrice, pricingRules, []);
    
    // Calculate GST (18%)
    const gstBreakdown = calculateGST(discountedPrice);
    
    // Calculate total
    const totalAmountDue = discountedPrice + gstBreakdown.total;
    const totalDiscountAmount = appliedDiscounts.reduce((sum, discount) => sum + discount.amount, 0);

    return {
      basePrice,
      discountAmount: totalDiscountAmount,
      subtotalAfterDiscount: discountedPrice,
      taxPercentage: 18,
      taxAmount: gstBreakdown.total,
      totalAmountDue,
      currency: instance.experience?.currency || 'INR',
      gstBreakdown: {
        cgst: gstBreakdown.cgst,
        sgst: gstBreakdown.sgst,
        igst: gstBreakdown.igst
      },
      appliedDiscounts
    };
  } catch (error) {
    console.error('Error in calculateEnhancedExperienceBookingPrice:', error);
    throw error;
  }
};
