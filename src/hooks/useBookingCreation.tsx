
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UUID, 
  BookingType,
  GuestInfo
} from '@/types/booking';
import { createBooking } from '@/services/bookingService';
import { useBookingAvailability } from './useBookingAvailability';
import { useBookingPrice } from './useBookingPrice';

/**
 * Hook for creating bookings with improved error handling
 */
export const useBookingCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { checkAvailability } = useBookingAvailability();
  const { calculatePrice } = useBookingPrice();

  /**
   * Create a booking with comprehensive validation
   */
  const makeBooking = useCallback(async (
    type: BookingType,
    details: {
      propertyId?: UUID;
      checkInDate?: Date;
      checkOutDate?: Date;
      numberOfGuests?: number;
      specialRequests?: string;
      customerNotes?: string;
      instanceId?: UUID;
      numberOfAttendees?: number;
      guests?: GuestInfo[];
      selectedAddonExperiences?: {instanceId: UUID, attendees: number}[];
    }
  ): Promise<{ bookingId: UUID, bookingReference: string } | null> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to make a booking.',
        variant: 'destructive'
      });
      return null;
    }
    
    setIsLoading(true);
    
    try {
      // Validate input parameters based on booking type
      if (type === 'property' && (!details.propertyId || !details.checkInDate || !details.checkOutDate)) {
        throw new Error('Missing required property booking details');
      } else if (type === 'experience' && (!details.instanceId || !details.numberOfAttendees)) {
        throw new Error('Missing required experience booking details');
      }

      // Check availability first
      let isAvailable = false;
      
      if (type === 'property') {
        isAvailable = await checkAvailability('property', {
          propertyId: details.propertyId,
          checkInDate: details.checkInDate,
          checkOutDate: details.checkOutDate
        });
      } else {
        isAvailable = await checkAvailability('experience', {
          instanceId: details.instanceId,
          numberOfAttendees: details.numberOfAttendees
        });
      }
      
      if (!isAvailable) {
        toast({
          title: type === 'property' ? 'Property Unavailable' : 'Experience Unavailable',
          description: type === 'property' 
            ? 'The property is not available for the selected dates.'
            : 'Not enough capacity for the selected experience.',
          variant: 'destructive'
        });
        return null;
      }
      
      // Calculate price
      const breakdown = await calculatePrice(
        type,
        {
          propertyId: details.propertyId,
          checkInDate: details.checkInDate,
          checkOutDate: details.checkOutDate,
          instanceId: details.instanceId,
          numberOfAttendees: details.numberOfAttendees,
          selectedAddonExperiences: details.selectedAddonExperiences
        }
      );
      
      if (!breakdown) {
        throw new Error('Failed to calculate price');
      }
      
      // Prepare booking data
      const bookingData: Parameters<typeof createBooking>[0] = {
        type,
        userId: user.id,
        priceBreakdown: breakdown,
        guests: details.guests,
        selectedAddonExperiences: details.selectedAddonExperiences
      };
      
      if (type === 'property' && details.propertyId && details.checkInDate && details.checkOutDate && details.numberOfGuests) {
        bookingData.property = {
          propertyId: details.propertyId,
          checkInDate: details.checkInDate,
          checkOutDate: details.checkOutDate,
          numberOfGuests: details.numberOfGuests,
          specialRequests: details.specialRequests,
          customerNotes: details.customerNotes
        };
      } else if (type === 'experience' && details.instanceId && details.numberOfAttendees) {
        bookingData.experience = {
          instanceId: details.instanceId,
          numberOfAttendees: details.numberOfAttendees,
          specialRequests: details.specialRequests
        };
      }
      
      // Create booking
      const bookingResult = await createBooking(bookingData);
      
      toast({
        title: 'Booking created',
        description: `Your booking reference is ${bookingResult.bookingReference}.`,
      });
      
      return bookingResult;
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: 'Error',
        description: `Failed to create booking: ${errorMessage}`,
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, checkAvailability, calculatePrice, toast]);

  return {
    isLoading,
    makeBooking
  };
};
