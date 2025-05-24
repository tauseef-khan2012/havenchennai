import { supabase } from '@/integrations/supabase/client';
import { 
  UUID, 
  BookingType, 
  PriceBreakdown
} from '@/types/booking';
import { 
  calculateNights, 
  getPropertyBasePricing, 
  getExperienceInstancePricing,
  calculateAddonExperiencesTotal
} from './pricing/basePriceService';
import { calculateAddonExperiencesTotal as getAddonTotal } from './pricing/addonCalculationService';

/**
 * Enhanced pricing service with GST compliance and dynamic pricing
 */

interface ExternalRate {
  platform: string;
  rate_per_night: number;
  is_available: boolean;
}

interface PricingRule {
  rule_type: string;
  discount_percentage?: number;
  markup_percentage?: number;
  conditions: any;
  priority: number;
}

interface EnhancedPriceBreakdown extends PriceBreakdown {
  gstBreakdown?: {
    cgst: number;
    sgst: number;
    igst?: number;
  };
  competitorRates?: ExternalRate[];
  appliedDiscounts?: {
    name: string;
    percentage: number;
    amount: number;
  }[];
  savingsFromCompetitors?: number;
}

/**
 * Fetches external rates for a property on given dates
 */
const getExternalRates = async (
  propertyId: UUID, 
  checkInDate: Date, 
  checkOutDate: Date
): Promise<ExternalRate[]> => {
  try {
    const startDate = checkInDate.toISOString().split('T')[0];
    const endDate = checkOutDate.toISOString().split('T')[0];

    const { data: rates, error } = await supabase
      .from('external_rates')
      .select('platform, rate_per_night, is_available')
      .eq('property_id', propertyId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error('Error fetching external rates:', error);
      return [];
    }

    // Group by platform and calculate average rate
    const platformRates = rates?.reduce((acc: any, rate) => {
      if (!acc[rate.platform]) {
        acc[rate.platform] = { total: 0, count: 0, available: rate.is_available };
      }
      acc[rate.platform].total += rate.rate_per_night;
      acc[rate.platform].count += 1;
      return acc;
    }, {}) || {};

    return Object.entries(platformRates).map(([platform, data]: [string, any]) => ({
      platform,
      rate_per_night: data.total / data.count,
      is_available: data.available
    }));
  } catch (error) {
    console.error('Error in getExternalRates:', error);
    return [];
  }
};

/**
 * Fetches applicable pricing rules
 */
const getPricingRules = async (
  propertyId?: UUID,
  experienceId?: UUID
): Promise<PricingRule[]> => {
  try {
    let query = supabase
      .from('pricing_rules')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (propertyId) {
      query = query.or(`property_id.eq.${propertyId},property_id.is.null`);
    }
    if (experienceId) {
      query = query.or(`experience_id.eq.${experienceId},experience_id.is.null`);
    }

    const { data: rules, error } = await query;

    if (error) {
      console.error('Error fetching pricing rules:', error);
      return [];
    }

    return rules || [];
  } catch (error) {
    console.error('Error in getPricingRules:', error);
    return [];
  }
};

/**
 * Calculates GST breakdown (18% total)
 */
const calculateGST = (amount: number, isInterstate: boolean = false) => {
  const gstRate = 0.18;
  const totalGst = amount * gstRate;

  if (isInterstate) {
    return {
      igst: totalGst,
      cgst: 0,
      sgst: 0,
      total: totalGst
    };
  } else {
    return {
      cgst: totalGst / 2,
      sgst: totalGst / 2,
      igst: 0,
      total: totalGst
    };
  }
};

/**
 * Applies pricing rules to calculate discounts
 */
const applyPricingRules = (
  basePrice: number,
  rules: PricingRule[],
  externalRates: ExternalRate[]
) => {
  let discountedPrice = basePrice;
  const appliedDiscounts: { name: string; percentage: number; amount: number }[] = [];

  // Apply discount rules
  const discountRules = rules.filter(rule => rule.rule_type === 'discount');
  
  for (const rule of discountRules) {
    if (rule.discount_percentage) {
      const discountAmount = (discountedPrice * rule.discount_percentage) / 100;
      discountedPrice -= discountAmount;
      
      appliedDiscounts.push({
        name: rule.conditions?.platform ? `${rule.conditions.platform} Discount` : 'Base Discount',
        percentage: rule.discount_percentage,
        amount: discountAmount
      });
    }
  }

  // Calculate savings from competitors
  let savingsFromCompetitors = 0;
  if (externalRates.length > 0) {
    const airbnbRate = externalRates.find(rate => rate.platform === 'airbnb');
    if (airbnbRate && airbnbRate.rate_per_night > discountedPrice) {
      savingsFromCompetitors = airbnbRate.rate_per_night - discountedPrice;
    }
  }

  return {
    discountedPrice,
    appliedDiscounts,
    savingsFromCompetitors
  };
};

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
    // Get property details using the new modular service
    const property = await getPropertyBasePricing(propertyId);

    // Calculate number of nights using the new utility
    const nights = calculateNights(checkInDate, checkOutDate);
    
    // Get external rates and pricing rules
    const [externalRates, pricingRules] = await Promise.all([
      getExternalRates(propertyId, checkInDate, checkOutDate),
      getPricingRules(propertyId)
    ]);

    // Original base price
    const originalBasePrice = property.base_price_per_night * nights;
    
    // Apply pricing rules for discounts
    const { discountedPrice, appliedDiscounts, savingsFromCompetitors } = applyPricingRules(
      originalBasePrice,
      pricingRules,
      externalRates
    );
    
    // Add cleaning fee
    const cleaningFee = property.cleaning_fee || 0;
    
    // Calculate addon experiences cost using the new modular service
    const addonExperiencesTotal = await getAddonTotal(selectedAddonExperiences);
    
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
      cleaningFee,
      addonExperiencesTotal: addonExperiencesTotal > 0 ? addonExperiencesTotal : undefined,
      totalAmountDue,
      currency: property.currency,
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
