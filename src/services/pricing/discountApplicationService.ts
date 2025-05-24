
import { PricingRule } from './pricingRulesService';
import { ExternalRate } from './externalRatesService';

export interface AppliedDiscount {
  name: string;
  percentage: number;
  amount: number;
}

export interface DiscountResult {
  discountedPrice: number;
  appliedDiscounts: AppliedDiscount[];
  savingsFromCompetitors: number;
}

/**
 * Applies pricing rules to calculate discounts
 */
export const applyPricingRules = (
  basePrice: number,
  rules: PricingRule[],
  externalRates: ExternalRate[]
): DiscountResult => {
  let discountedPrice = basePrice;
  const appliedDiscounts: AppliedDiscount[] = [];

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
