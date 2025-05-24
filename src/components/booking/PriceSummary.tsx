
import { PriceBreakdown } from '@/types/booking';
import { EnhancedPriceSummary } from './EnhancedPriceSummary';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';

interface PriceSummaryProps {
  priceBreakdown: PriceBreakdown | EnhancedPriceBreakdown;
  nights?: number;
}

export const PriceSummary = ({ priceBreakdown, nights }: PriceSummaryProps) => {
  // Convert PriceBreakdown to EnhancedPriceBreakdown format if needed
  const enhancedPriceBreakdown: EnhancedPriceBreakdown = {
    ...priceBreakdown,
    originalCurrency: (priceBreakdown as EnhancedPriceBreakdown).originalCurrency || priceBreakdown.currency,
    displayCurrency: (priceBreakdown as EnhancedPriceBreakdown).displayCurrency || priceBreakdown.currency,
    exchangeRate: (priceBreakdown as EnhancedPriceBreakdown).exchangeRate || 1,
    gstBreakdown: (priceBreakdown as EnhancedPriceBreakdown).gstBreakdown,
    competitorRates: (priceBreakdown as EnhancedPriceBreakdown).competitorRates,
    appliedDiscounts: (priceBreakdown as EnhancedPriceBreakdown).appliedDiscounts,
    savingsFromCompetitors: (priceBreakdown as EnhancedPriceBreakdown).savingsFromCompetitors,
  };

  // Use the enhanced price summary component for better functionality
  return (
    <EnhancedPriceSummary 
      priceBreakdown={enhancedPriceBreakdown} 
      nights={nights}
      showCompetitorComparison={true}
    />
  );
};
