
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  UUID, 
  BookingType,
  PriceBreakdown
} from '@/types/booking';
import { calculateBookingPrice } from '@/services/bookingService';

/**
 * Hook for calculating booking prices
 */
export const useBookingPrice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const { toast } = useToast();

  /**
   * Calculate price for a booking
   */
  const calculatePrice = async (
    type: BookingType,
    details: {
      propertyId?: UUID;
      checkInDate?: Date;
      checkOutDate?: Date;
      instanceId?: UUID;
      numberOfAttendees?: number;
      selectedAddonExperiences?: {instanceId: UUID, attendees: number}[];
    }
  ): Promise<PriceBreakdown | null> => {
    setIsLoading(true);
    
    try {
      const breakdown = await calculateBookingPrice({
        type,
        propertyId: details.propertyId,
        instanceId: details.instanceId,
        checkInDate: details.checkInDate,
        checkOutDate: details.checkOutDate,
        numberOfAttendees: details.numberOfAttendees,
        selectedAddonExperiences: details.selectedAddonExperiences
      });
      
      setPriceBreakdown(breakdown);
      return breakdown;
    } catch (error) {
      console.error('Error calculating price:', error);
      toast({
        title: 'Error',
        description: 'Failed to calculate price. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    priceBreakdown,
    calculatePrice
  };
};
