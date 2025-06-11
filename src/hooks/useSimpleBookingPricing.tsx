
import { useState, useCallback, useRef } from 'react';
import { calculateSimplePropertyPrice, SimplePriceBreakdown } from '@/services/simplePricingService';
import { UUID } from '@/types/booking';

export const useSimpleBookingPricing = () => {
  const [priceBreakdown, setPriceBreakdown] = useState<SimplePriceBreakdown | null>(null);
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);
  const calculationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePricing = useCallback((
    propertyId: UUID,
    checkIn: Date,
    checkOut: Date,
    guestCount: number = 2
  ) => {
    // Clear any pending calculation
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current);
    }

    setIsCalculatingPrice(true);
    
    // Small delay to prevent rapid calculations, but much faster than before
    calculationTimeoutRef.current = setTimeout(() => {
      try {
        console.log('Calculating simple pricing:', { checkIn, checkOut, guestCount });
        
        const pricing = calculateSimplePropertyPrice(checkIn, checkOut, guestCount);
        
        console.log('Simple pricing calculated:', pricing);
        setPriceBreakdown(pricing);
      } catch (error) {
        console.error('Error calculating simple pricing:', error);
        // Fallback pricing
        setPriceBreakdown({
          basePrice: 4000,
          additionalGuestCharges: 0,
          subtotal: 4000,
          gstAmount: 720,
          totalAmount: 4720,
          currency: 'INR',
          nights: 1,
          guestCount: 2
        });
      } finally {
        setIsCalculatingPrice(false);
      }
    }, 100); // Much faster - only 100ms delay
  }, []);

  const resetPricing = useCallback(() => {
    if (calculationTimeoutRef.current) {
      clearTimeout(calculationTimeoutRef.current);
    }
    setPriceBreakdown(null);
    setIsCalculatingPrice(false);
  }, []);

  return {
    priceBreakdown,
    isCalculatingPrice,
    calculatePricing,
    resetPricing
  };
};
