
import { PriceBreakdown } from '@/types/booking';
import { formatPrice } from '@/utils/bookingUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PriceSummaryProps {
  priceBreakdown: PriceBreakdown;
  nights?: number;
}

export const PriceSummary = ({ priceBreakdown, nights }: PriceSummaryProps) => {
  const {
    basePrice,
    discountPercentage,
    discountAmount,
    subtotalAfterDiscount,
    taxPercentage,
    taxAmount,
    cleaningFee,
    totalAmountDue,
    currency
  } = priceBreakdown;

  return (
    <Card className="bg-white shadow-md border-haven-green/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-serif">Price Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {nights && (
            <div className="flex justify-between">
              <span>Base price</span>
              <div className="text-right">
                <span className={discountPercentage ? "line-through text-gray-500" : ""}>
                  {formatPrice(basePrice / nights, currency)}
                </span>
                <span className="text-sm text-gray-600"> × {nights} nights</span>
              </div>
            </div>
          )}
          
          {!nights && (
            <div className="flex justify-between">
              <span>Base price</span>
              <span className={discountPercentage ? "line-through text-gray-500" : ""}>
                {formatPrice(basePrice, currency)}
              </span>
            </div>
          )}

          {discountPercentage && discountAmount > 0 && (
            <div className="flex justify-between text-haven-green">
              <span>Discount ({discountPercentage}%)</span>
              <span>-{formatPrice(discountAmount, currency)}</span>
            </div>
          )}

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
        
        <div className="flex justify-between">
          <span>Tax ({taxPercentage}%)</span>
          <span>{formatPrice(taxAmount, currency)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(totalAmountDue, currency)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
