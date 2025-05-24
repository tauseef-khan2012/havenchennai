
import { PriceBreakdown } from '@/types/booking';
import { EnhancedPriceSummary } from './EnhancedPriceSummary';

interface PriceSummaryProps {
  priceBreakdown: PriceBreakdown;
  nights?: number;
}

export const PriceSummary = ({ priceBreakdown, nights }: PriceSummaryProps) => {
  // Use the enhanced price summary component for better functionality
  return (
    <EnhancedPriceSummary 
      priceBreakdown={priceBreakdown} 
      nights={nights}
      showCompetitorComparison={true}
    />
  );
};
