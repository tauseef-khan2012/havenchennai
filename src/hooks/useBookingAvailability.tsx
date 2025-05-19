
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  UUID, 
  BookingType
} from '@/types/booking';
import {
  checkPropertyAvailability,
  checkExperienceInstanceAvailability
} from '@/services/bookingService';

/**
 * Hook for checking availability of properties and experience instances
 */
export const useBookingAvailability = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { toast } = useToast();

  /**
   * Check availability for a property or experience
   */
  const checkAvailability = async (
    type: BookingType,
    details: {
      propertyId?: UUID;
      checkInDate?: Date;
      checkOutDate?: Date;
      instanceId?: UUID;
      numberOfAttendees?: number;
    }
  ): Promise<boolean> => {
    setIsLoading(true);
    setIsAvailable(null);
    
    try {
      let available = false;
      
      if (type === 'property' && details.propertyId && details.checkInDate && details.checkOutDate) {
        available = await checkPropertyAvailability(
          details.propertyId,
          details.checkInDate,
          details.checkOutDate
        );
      } else if (type === 'experience' && details.instanceId && details.numberOfAttendees) {
        available = await checkExperienceInstanceAvailability(
          details.instanceId,
          details.numberOfAttendees
        );
      } else {
        throw new Error('Invalid booking details');
      }
      
      setIsAvailable(available);
      
      if (!available) {
        toast({
          title: type === 'property' ? 'Property not available' : 'Experience not available',
          description: type === 'property' 
            ? 'The property is not available for the selected dates.' 
            : 'Not enough capacity for the selected experience.',
          variant: 'destructive'
        });
      }
      
      return available;
    } catch (error) {
      console.error('Error checking availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to check availability. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isAvailable,
    checkAvailability
  };
};
