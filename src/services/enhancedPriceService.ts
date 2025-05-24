
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
import { CurrencyConfig, convertFromINR } from './currencyService';

/**
 * Enhanced pricing service with GST compliance, dynamic pricing, and international currency support
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
  originalCurrency: string; // Original currency (INR)
  displayCurrency: string; // Currency being displayed to user
  exchangeRate: number; // Rate used for conversion
}

/**
 * Enhanced property booking price calculation with currency support
 */
export const calculateEnhancedPropertyBookingPrice = async (
  propertyId: UUID,
  checkInDate: Date,
  checkOutDate: Date,
  selectedAddonExperiences?: {instanceId: UUID, attendees: number}[],
  targetCurrency?: CurrencyConfig
): Promise<EnhancedPriceBreakdown> => {
  try {
    // Get property details using the new modular service
    const property = await getPropertyBasePricing(propertyId);

    // Calculate number of nights using the new utility
    const nights = calculateNights(checkInDate, checkOutDate);
    
    // Get external rates and pricing rules
    const [externalRates, pricingRules] = await Promise.all([
      getExternalRates(propertyId, checkInDate, checkOutDate),
      getPricingRules(propertyId)
    ]);

    // Original base price in INR
    const originalBasePrice = property.base_price_per_night * nights;
    
    // Apply pricing rules for discounts
    const { discountedPrice, appliedDiscounts, savingsFromCompetitors } = applyPricingRules(
      originalBasePrice,
      pricingRules,
      externalRates
    );
    
    // Add cleaning fee
    const cleaningFee = property.cleaning_fee || 0;
    
    // Calculate addon experiences cost using the correct modular service
    const addonExperiencesTotal = await calculateAddonExperiencesTotal(selectedAddonExperiences);
    
    // Calculate subtotal before GST (in INR)
    const subtotalBeforeGST = discountedPrice + cleaningFee + addonExperiencesTotal;
    
    // Calculate GST (18%) - always in INR for Indian business
    const gstBreakdown = calculateGST(subtotalBeforeGST);
    
    // Calculate total in INR
    const totalAmountDueINR = subtotalBeforeGST + gstBreakdown.total;
    const totalDiscountAmount = appliedDiscounts.reduce((sum, discount) => sum + discount.amount, 0);

    // Base breakdown in INR
    let breakdown: EnhancedPriceBreakdown = {
      basePrice: originalBasePrice,
      discountAmount: totalDiscountAmount,
      subtotalAfterDiscount: discountedPrice,
      taxPercentage: 18,
      taxAmount: gstBreakdown.total,
      cleaningFee,
      addonExperiencesTotal: addonExperiencesTotal > 0 ? addonExperiencesTotal : undefined,
      totalAmountDue: totalAmountDueINR,
      currency: 'INR',
      originalCurrency: 'INR',
      displayCurrency: 'INR',
      exchangeRate: 1,
      gstBreakdown: {
        cgst: gstBreakdown.cgst,
        sgst: gstBreakdown.sgst,
        igst: gstBreakdown.igst
      },
      competitorRates: externalRates,
      appliedDiscounts,
      savingsFromCompetitors
    };

    // Convert to target currency if specified and different from INR
    if (targetCurrency && targetCurrency.code !== 'INR') {
      breakdown = {
        ...breakdown,
        basePrice: convertFromINR(breakdown.basePrice, targetCurrency),
        discountAmount: convertFromINR(breakdown.discountAmount, targetCurrency),
        subtotalAfterDiscount: convertFromINR(breakdown.subtotalAfterDiscount, targetCurrency),
        taxAmount: convertFromINR(breakdown.taxAmount, targetCurrency),
        cleaningFee: breakdown.cleaningFee ? convertFromINR(breakdown.cleaningFee, targetCurrency) : undefined,
        addonExperiencesTotal: breakdown.addonExperiencesTotal ? convertFromINR(breakdown.addonExperiencesTotal, targetCurrency) : undefined,
        totalAmountDue: convertFromINR(totalAmountDueINR, targetCurrency),
        currency: targetCurrency.code,
        displayCurrency: targetCurrency.code,
        exchangeRate: targetCurrency.exchangeRate,
        savingsFromCompetitors: breakdown.savingsFromCompetitors ? convertFromINR(breakdown.savingsFromCompetitors, targetCurrency) : undefined,
        gstBreakdown: breakdown.gstBreakdown ? {
          cgst: convertFromINR(breakdown.gstBreakdown.cgst, targetCurrency),
          sgst: convertFromINR(breakdown.gstBreakdown.sgst, targetCurrency),
          igst: breakdown.gstBreakdown.igst ? convertFromINR(breakdown.gstBreakdown.igst, targetCurrency) : undefined
        } : undefined,
        appliedDiscounts: breakdown.appliedDiscounts?.map(discount => ({
          ...discount,
          amount: convertFromINR(discount.amount, targetCurrency)
        }))
      };
    }

    return breakdown;
  } catch (error) {
    console.error('Error in calculateEnhancedPropertyBookingPrice:', error);
    throw error;
  }
};

/**
 * Enhanced experience booking price calculation with currency support
 */
export const calculateEnhancedExperienceBookingPrice = async (
  instanceId: UUID,
  numberOfAttendees: number,
  targetCurrency?: CurrencyConfig
): Promise<EnhancedPriceBreakdown> => {
  try {
    // Get experience instance details using the new modular service
    const instance = await getExperienceInstancePricing(instanceId);

    // Get pricing rules for experience
    const pricingRules = await getPricingRules(undefined, instance.experience?.id);
    
    // Determine pricing model and base price (in INR)
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
    
    // Calculate GST (18%) - always in INR for Indian business
    const gstBreakdown = calculateGST(discountedPrice);
    
    // Calculate total in INR
    const totalAmountDueINR = discountedPrice + gstBreakdown.total;
    const totalDiscountAmount = appliedDiscounts.reduce((sum, discount) => sum + discount.amount, 0);

    // Base breakdown in INR
    let breakdown: EnhancedPriceBreakdown = {
      basePrice,
      discountAmount: totalDiscountAmount,
      subtotalAfterDiscount: discountedPrice,
      taxPercentage: 18,
      taxAmount: gstBreakdown.total,
      totalAmountDue: totalAmountDueINR,
      currency: 'INR',
      originalCurrency: 'INR',
      displayCurrency: 'INR',
      exchangeRate: 1,
      gstBreakdown: {
        cgst: gstBreakdown.cgst,
        sgst: gstBreakdown.sgst,
        igst: gstBreakdown.igst
      },
      appliedDiscounts
    };

    // Convert to target currency if specified and different from INR
    if (targetCurrency && targetCurrency.code !== 'INR') {
      breakdown = {
        ...breakdown,
        basePrice: convertFromINR(breakdown.basePrice, targetCurrency),
        discountAmount: convertFromINR(breakdown.discountAmount, targetCurrency),
        subtotalAfterDiscount: convertFromINR(breakdown.subtotalAfterDiscount, targetCurrency),
        taxAmount: convertFromINR(breakdown.taxAmount, targetCurrency),
        totalAmountDue: convertFromINR(totalAmountDueINR, targetCurrency),
        currency: targetCurrency.code,
        displayCurrency: targetCurrency.code,
        exchangeRate: targetCurrency.exchangeRate,
        gstBreakdown: breakdown.gstBreakdown ? {
          cgst: convertFromINR(breakdown.gstBreakdown.cgst, targetCurrency),
          sgst: convertFromINR(breakdown.gstBreakdown.sgst, targetCurrency),
          igst: breakdown.gstBreakdown.igst ? convertFromINR(breakdown.gstBreakdown.igst, targetCurrency) : undefined
        } : undefined,
        appliedDiscounts: breakdown.appliedDiscounts?.map(discount => ({
          ...discount,
          amount: convertFromINR(discount.amount, targetCurrency)
        }))
      };
    }

    return breakdown;
  } catch (error) {
    console.error('Error in calculateEnhancedExperienceBookingPrice:', error);
    throw error;
  }
};
