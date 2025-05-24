
import { useState, useEffect } from 'react';
import { UUID } from '@/types/booking';
import { calculateEnhancedPropertyBookingPrice } from '@/services/enhancedPriceService';
import { getChannelBookingOptions } from '@/services/channelService';

interface EnhancedPriceBreakdown {
  basePrice: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  taxAmount: number;
  totalAmountDue: number;
  currency: string;
  gstBreakdown?: {
    cgst: number;
    sgst: number;
    igst?: number;
  };
  competitorRates?: any[];
  appliedDiscounts?: any[];
  savingsFromCompetitors?: number;
}

interface ChannelOption {
  platform: string;
  price: number;
  savings?: number;
  bookingUrl?: string;
  available: boolean;
}

export const useEnhancedPricing = (
  propertyId?: UUID,
  checkInDate?: Date,
  checkOutDate?: Date,
  guests?: number
) => {
  const [priceBreakdown, setPriceBreakdown] = useState<EnhancedPriceBreakdown | null>(null);
  const [channelOptions, setChannelOptions] = useState<ChannelOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPricing = async () => {
      if (!propertyId || !checkInDate || !checkOutDate) return;

      setIsLoading(true);
      setError(null);

      try {
        // Calculate enhanced pricing
        const pricing = await calculateEnhancedPropertyBookingPrice(
          propertyId,
          checkInDate,
          checkOutDate
        );
        
        setPriceBreakdown(pricing);

        // Get channel booking options for comparison
        if (guests) {
          const options = await getChannelBookingOptions(
            propertyId,
            checkInDate,
            checkOutDate,
            guests,
            pricing.totalAmountDue
          );
          setChannelOptions(options);
        }
      } catch (err) {
        console.error('Error fetching enhanced pricing:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch pricing');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, [propertyId, checkInDate, checkOutDate, guests]);

  return {
    priceBreakdown,
    channelOptions,
    isLoading,
    error,
    refetch: () => {
      if (propertyId && checkInDate && checkOutDate) {
        // Trigger refetch by updating a dependency
      }
    }
  };
};
