
import { PriceBreakdown } from '@/types/booking';
import { formatPrice } from '@/utils/bookingUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingDown } from 'lucide-react';

interface EnhancedPriceBreakdown extends PriceBreakdown {
  gstBreakdown?: {
    cgst: number;
    sgst: number;
    igst?: number;
  };
  competitorRates?: {
    platform: string;
    rate_per_night: number;
    is_available: boolean;
  }[];
  appliedDiscounts?: {
    name: string;
    percentage: number;
    amount: number;
  }[];
  savingsFromCompetitors?: number;
}

interface EnhancedPriceSummaryProps {
  priceBreakdown: EnhancedPriceBreakdown;
  nights?: number;
  showCompetitorComparison?: boolean;
}

export const EnhancedPriceSummary = ({ 
  priceBreakdown, 
  nights,
  showCompetitorComparison = true 
}: EnhancedPriceSummaryProps) => {
  const {
    basePrice,
    discountAmount,
    subtotalAfterDiscount,
    taxAmount,
    cleaningFee,
    totalAmountDue,
    currency,
    gstBreakdown,
    competitorRates,
    appliedDiscounts,
    savingsFromCompetitors
  } = priceBreakdown;

  const airbnbRate = competitorRates?.find(rate => rate.platform === 'airbnb');

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-md border-haven-green/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-serif">Price Summary</CardTitle>
          {appliedDiscounts && appliedDiscounts.length > 0 && (
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-haven-green" />
              <span className="text-sm text-haven-green font-medium">
                {appliedDiscounts.length} discount{appliedDiscounts.length > 1 ? 's' : ''} applied
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {nights && (
              <div className="flex justify-between">
                <span>Base price</span>
                <div className="text-right">
                  <span className={discountAmount > 0 ? "line-through text-gray-500" : ""}>
                    {formatPrice(basePrice / nights, currency)}
                  </span>
                  <span className="text-sm text-gray-600"> × {nights} nights</span>
                </div>
              </div>
            )}
            
            {!nights && (
              <div className="flex justify-between">
                <span>Base price</span>
                <span className={discountAmount > 0 ? "line-through text-gray-500" : ""}>
                  {formatPrice(basePrice, currency)}
                </span>
              </div>
            )}

            {appliedDiscounts && appliedDiscounts.map((discount, index) => (
              <div key={index} className="flex justify-between text-haven-green">
                <span>{discount.name} ({discount.percentage}%)</span>
                <span>-{formatPrice(discount.amount, currency)}</span>
              </div>
            ))}

            {cleaningFee && cleaningFee > 0 && (
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>{formatPrice(cleaningFee, currency)}</span>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-medium">
            <span>Subtotal</span>
            <span>{formatPrice(subtotalAfterDiscount + (cleaningFee || 0), currency)}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>{formatPrice(taxAmount, currency)}</span>
            </div>
            {gstBreakdown && (
              <div className="ml-4 text-sm text-gray-600">
                {gstBreakdown.igst > 0 ? (
                  <div>IGST: {formatPrice(gstBreakdown.igst, currency)}</div>
                ) : (
                  <>
                    <div>CGST: {formatPrice(gstBreakdown.cgst, currency)}</div>
                    <div>SGST: {formatPrice(gstBreakdown.sgst, currency)}</div>
                  </>
                )}
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(totalAmountDue, currency)}</span>
          </div>

          {savingsFromCompetitors && savingsFromCompetitors > 0 && (
            <div className="bg-haven-green/10 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-haven-green font-medium">
                <TrendingDown className="h-4 w-4" />
                <span>You save {formatPrice(savingsFromCompetitors, currency)} vs Airbnb</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competitor Comparison */}
      {showCompetitorComparison && airbnbRate && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Compare with Airbnb
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Airbnb Price</div>
                <div className="text-sm text-gray-600">
                  {nights ? `${formatPrice(airbnbRate.rate_per_night, currency)} × ${nights} nights` : 'Per booking'}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {formatPrice(nights ? airbnbRate.rate_per_night * nights : airbnbRate.rate_per_night, currency)}
                </div>
                {savingsFromCompetitors && savingsFromCompetitors > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Save {formatPrice(savingsFromCompetitors, currency)}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-blue-200">
              <a 
                href={`https://www.airbnb.com/`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                View on Airbnb <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
