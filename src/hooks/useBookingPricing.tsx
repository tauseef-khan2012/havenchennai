
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { calculateEnhancedPropertyBookingPrice, EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { getPlatformRatesForProperty, comparePlatformPricing } from '@/services/platformRatesService';
import { DiscountApplication } from '@/services/discountService';
import { calculateNights } from '@/utils/bookingUtils';
import { UUID } from '@/types/booking';

export const useBookingPricing = () => {
  const { toast } = useToast();
  const [priceBreakdown, setPriceBreakdown] = useState<EnhancedPriceBreakdown | null>(null);
  const [platformComparisons, setPlatformComparisons] = useState<any[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountApplication | undefined>();
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  const calculatePricing = async (propertyId: UUID, checkIn: Date, checkOut: Date) => {
    setIsCalculatingPrice(true);
    try {
      const pricing = await calculateEnhancedPropertyBookingPrice(
        propertyId,
        checkIn,
        checkOut
      );
      
      // Apply discount if one exists
      let finalPricing = pricing;
      if (appliedDiscount?.isValid && appliedDiscount.discountAmount > 0) {
        const subtotalAfterDiscount = pricing.subtotalAfterDiscount - appliedDiscount.discountAmount;
        const gstAmount = subtotalAfterDiscount * 0.18;
        
        finalPricing = {
          ...pricing,
          discountAmount: pricing.discountAmount + appliedDiscount.discountAmount,
          subtotalAfterDiscount,
          taxAmount: gstAmount,
          totalAmountDue: subtotalAfterDiscount + gstAmount
        };
      }
      
      setPriceBreakdown(finalPricing);
    } catch (error) {
      console.error('Error calculating pricing:', error);
      toast({
        title: "Error",
        description: "Failed to calculate pricing.",
        variant: "destructive"
      });
    } finally {
      setIsCalculatingPrice(false);
    }
  };

  const fetchPlatformComparisons = async (propertyId: UUID, checkIn: Date, checkOut: Date) => {
    try {
      const platformRates = await getPlatformRatesForProperty(propertyId, checkIn, checkOut);
      const nights = calculateNights(checkIn, checkOut);
      const directPrice = priceBreakdown?.totalAmountDue || 0;
      
      const comparisons = comparePlatformPricing(directPrice, platformRates, nights);
      setPlatformComparisons(comparisons);
    } catch (error) {
      console.error('Error fetching platform comparisons:', error);
    }
  };

  const handleDiscountApplied = (discount: DiscountApplication) => {
    setAppliedDiscount(discount);
  };

  return {
    priceBreakdown,
    platformComparisons,
    appliedDiscount,
    isCalculatingPrice,
    calculatePricing,
    fetchPlatformComparisons,
    handleDiscountApplied
  };
};
