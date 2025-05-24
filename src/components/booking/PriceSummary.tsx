
import { PriceBreakdown } from '@/types/booking';
import { EnhancedPriceSummary } from './EnhancedPriceSummary';

interface PriceSummaryProps {
  priceBreakdown: PriceBreakdown;
  nights?: number;
}

export const PriceSummary = ({ priceBreakdown, nights }: PriceSummaryProps) => {
  // Convert PriceBreakdown to EnhancedPriceBreakdown format
  const enhancedPriceBreakdown = {
    ...priceBreakdown,
    gstBreakdown: {
      cgst: priceBreakdown.taxAmount / 2,
      sgst: priceBreakdown.taxAmount / 2,
    },
  };

  return (
    <EnhancedPriceSummary 
      priceBreakdown={enhancedPriceBreakdown} 
      nights={nights}
      showCompetitorComparison={true}
    />
  );
};
