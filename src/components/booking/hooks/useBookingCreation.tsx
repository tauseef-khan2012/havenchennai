import { useState } from 'react';
import { createBooking } from '@/services/bookingService';
import { createGuestBooking } from '@/services/booking/data/createGuestBooking';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UUID } from '@/types/booking';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { validateContactForm } from '../validation/ContactValidation';
import { validateBookingData } from '../validation/BookingValidation';
import { getDetailedErrorMessage } from '../utils/ErrorMessageHandler';

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
}

interface GuestInfo {
  name: string;
  age?: number;
}

export const useBookingCreation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const createBookingWithValidation = async (
    propertyId: UUID,
    selectedCheckIn: Date | undefined,
    selectedCheckOut: Date | undefined,
    guestCount: number,
    priceBreakdown: EnhancedPriceBreakdown | null,
    contact: ContactInfo,
    requests: string,
    guests: GuestInfo[]
  ): Promise<{ bookingId: UUID; bookingReference: string } | null> => {
    setIsProcessing(true);
    
    try {
      // Enhanced validation - map ContactInfo to the expected format
      const contactData = {
        guestName: contact.fullName,
        guestEmail: contact.email,
        guestPhone: contact.phone,
        specialRequests: requests
      };
      
      const contactValidation = validateContactForm(contactData);
      const bookingErrors = validateBookingData(selectedCheckIn, selectedCheckOut, priceBreakdown, guestCount);
      
      const allErrors = contactValidation.isValid ? bookingErrors : [...contactValidation.errors, ...bookingErrors];
      
      if (allErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: allErrors.join('. '),
          variant: "destructive"
        });
        return null;
      }

      console.log('Starting booking creation process', {
        user: user ? { id: user.id, email: user.email } : 'guest',
        propertyId,
        checkIn: selectedCheckIn,
        checkOut: selectedCheckOut,
        guestCount,
        contact,
        priceBreakdown
      });

      // Calculate additional guest charges
      const additionalGuestCharges = Math.max(0, guestCount - 2) * 500;
      const finalTotal = priceBreakdown!.totalAmountDue + additionalGuestCharges;

      let result;

      if (user) {
        console.log('Creating authenticated user booking');
        // Authenticated user booking
        const bookingData = {
          type: 'property' as const,
          userId: user.id,
          priceBreakdown: {
            ...priceBreakdown!,
            totalAmountDue: finalTotal
          },
          guests: guests.map(guest => ({
            name: guest.name,
            age: guest.age
          })),
          property: {
            propertyId,
            checkInDate: selectedCheckIn!,
            checkOutDate: selectedCheckOut!,
            numberOfGuests: guestCount,
            specialRequests: requests,
            customerNotes: `Contact: ${contact.fullName} (${contact.email}, ${contact.phone})`
          }
        };
        
        result = await createBooking(bookingData);
      } else {
        console.log('Creating guest booking');
        // Guest booking - no authentication required
        const guestBookingData = {
          type: 'property' as const,
          guestName: contact.fullName.trim(),
          guestEmail: contact.email.trim().toLowerCase(),
          guestPhone: contact.phone.trim(),
          priceBreakdown: {
            ...priceBreakdown!,
            totalAmountDue: finalTotal
          },
          propertyId,
          checkInDate: selectedCheckIn!,
          checkOutDate: selectedCheckOut!,
          numberOfGuests: guestCount,
          specialRequests: requests
        };
        
        result = await createGuestBooking(guestBookingData);
      }
      
      console.log('Booking created successfully', result);
      
      toast({
        title: "Booking created successfully",
        description: `Your booking reference is ${result.bookingReference}`,
      });

      return result;
    } catch (error: any) {
      const detailedMessage = getDetailedErrorMessage(error);
      
      console.error('Booking creation failed:', {
        error,
        message: error?.message,
        user: user ? 'authenticated' : 'guest',
        propertyId,
        contact
      });
      
      toast({
        title: "Booking creation failed",
        description: detailedMessage,
        variant: "destructive"
      });

      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    createBookingWithValidation,
    isProcessing
  };
};
