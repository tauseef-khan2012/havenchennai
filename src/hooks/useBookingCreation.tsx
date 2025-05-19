
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UUID, 
  BookingType,
  GuestInfo,
  PriceBreakdown
} from '@/types/booking';
import { createBooking } from '@/services/bookingService';
import { useBookingAvailability } from './useBookingAvailability';
import { useBookingPrice } from './useBookingPrice';

/**
 * Hook for creating bookings
 */
export const useBookingCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { checkAvailability } = useBookingAvailability();
  const { calculatePrice } = useBookingPrice();

  /**
   * Create a booking
   */
  const makeBooking = async (
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
      // Check availability first
      let isAvailable = false;
      
      if (type === 'property' && details.propertyId && details.checkInDate && details.checkOutDate) {
        isAvailable = await checkAvailability(
          'property',
          {
            propertyId: details.propertyId,
            checkInDate: details.checkInDate,
            checkOutDate: details.checkOutDate
          }
        );
      } else if (type === 'experience' && details.instanceId && details.numberOfAttendees) {
        isAvailable = await checkAvailability(
          'experience',
          {
            instanceId: details.instanceId,
            numberOfAttendees: details.numberOfAttendees
          }
        );
      } else {
        throw new Error('Invalid booking details');
      }
      
      if (!isAvailable) {
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
      toast({
        title: 'Error',
        description: 'Failed to create booking. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    makeBooking
  };
};
