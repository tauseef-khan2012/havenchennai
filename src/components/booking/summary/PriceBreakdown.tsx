
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PriceBreakdownProps {
  priceBreakdown: EnhancedPriceBreakdown;
  nights: number;
  guestCount: number;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  priceBreakdown,
  nights,
  guestCount
}) => {
  const { formatPrice } = useCurrency();
  
  // Calculate additional guest charges (₹500 per guest after 2nd)
  const additionalGuestCharges = Math.max(0, guestCount - 2) * 500;

  return (
    <div className="space-y-4 bg-gray-50 rounded-lg p-4">
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>₹4,000 × {nights} nights</span>
          <span>₹{formatPrice(4000 * nights, 'INR')}</span>
        </div>
        
        {additionalGuestCharges > 0 && (
          <div className="flex justify-between text-sm">
            <span>Additional guests ({guestCount - 2} × ₹500)</span>
            <span>₹{formatPrice(additionalGuestCharges, 'INR')}</span>
          </div>
        )}
        
        {priceBreakdown.discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-₹{formatPrice(priceBreakdown.discountAmount, 'INR')}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span>GST (18%)</span>
          <span>₹{formatPrice(priceBreakdown.taxAmount, 'INR')}</span>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>₹{formatPrice(priceBreakdown.totalAmountDue + additionalGuestCharges, 'INR')}</span>
      </div>
    </div>
  );
};
