import React, { useState } from 'react';
import { BookingContent } from './BookingContent';
import { CheckoutStep } from './CheckoutStep';
import { EnhancedPaymentStep } from './EnhancedPaymentStep';
import { BookingConfirmationStep } from './BookingConfirmationStep';
import { EnhancedPriceBreakdown } from '@/services/enhancedPriceService';
import { DiscountApplication } from '@/services/discountService';
import { createBooking, createGuestBooking } from '@/services/bookingService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UUID } from '@/types/booking';

interface BookingPageContentProps {
  property: any;
  propertyId: UUID;
  selectedCheckIn?: Date;
  selectedCheckOut?: Date;
  priceBreakdown: EnhancedPriceBreakdown | null;
  platformComparisons: any[];
  appliedDiscount?: DiscountApplication;
  isCalculatingPrice: boolean;
  onDateRangeSelect: (checkIn: Date, checkOut: Date) => void;
  onPlatformBooking: (platform: string, url?: string) => void;
  onDiscountApplied: (discount: DiscountApplication) => void;
  onProceedToPayment: () => void;
}

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
}

interface GuestInfo {
  name: string;
  age?: number;
}

// Enhanced validation functions
const validateContactInfo = (contact: ContactInfo): string[] => {
  const errors: string[] = [];
  
  if (!contact.fullName?.trim()) {
    errors.push('Full name is required');
  } else if (contact.fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long');
  }
  
  if (!contact.email?.trim()) {
    errors.push('Email address is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
    errors.push('Please enter a valid email address');
  }
  
  if (!contact.phone?.trim()) {
    errors.push('Phone number is required');
  } else if (!/^[\+]?[\d\s\-\(\)]{8,}$/.test(contact.phone.trim())) {
    errors.push('Please enter a valid phone number');
  }
  
  return errors;
};

const validateBookingData = (
  selectedCheckIn?: Date,
  selectedCheckOut?: Date,
  priceBreakdown?: EnhancedPriceBreakdown | null,
  guestCount?: number
): string[] => {
  const errors: string[] = [];
  
  if (!selectedCheckIn) {
    errors.push('Check-in date is required');
  }
  
  if (!selectedCheckOut) {
    errors.push('Check-out date is required');
  }
  
  if (selectedCheckIn && selectedCheckOut && selectedCheckIn >= selectedCheckOut) {
    errors.push('Check-out date must be after check-in date');
  }
  
  if (!priceBreakdown) {
    errors.push('Price calculation is missing. Please refresh and try again');
  } else if (priceBreakdown.totalAmountDue <= 0) {
    errors.push('Invalid booking amount. Please refresh and try again');
  }
  
  if (!guestCount || guestCount < 1) {
    errors.push('At least 1 guest is required');
  } else if (guestCount > 20) {
    errors.push('Maximum 20 guests allowed per booking');
  }
  
  return errors;
};

const getDetailedErrorMessage = (error: any): string => {
  console.error('Booking creation error details:', {
    error,
    message: error?.message,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    stack: error?.stack
  });

  // Handle Supabase specific errors
  if (error?.message?.includes('row-level security policy')) {
    return 'Security policy violation. Please contact support if this persists.';
  }
  
  if (error?.message?.includes('violates foreign key constraint')) {
    return 'Invalid property or booking data. Please refresh the page and try again.';
  }
  
  if (error?.message?.includes('duplicate key value violates unique constraint')) {
    return 'A booking with this reference already exists. Please try again.';
  }
  
  if (error?.message?.includes('invalid input syntax')) {
    return 'Invalid booking data format. Please check your information and try again.';
  }
  
  if (error?.message?.includes('connection') || error?.message?.includes('network')) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  
  if (error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again in a few moments.';
  }
  
  // Handle validation errors
  if (error?.message?.includes('validation')) {
    return `Validation error: ${error.message}`;
  }
  
  // Return the original error message if it's user-friendly, otherwise a generic message
  const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
  
  // If error message seems technical, provide a user-friendly version
  if (errorMessage.includes('function') || errorMessage.includes('undefined') || errorMessage.includes('null')) {
    return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
  }
  
  return errorMessage;
};

export const BookingPageContent: React.FC<BookingPageContentProps> = ({
  property,
  propertyId,
  selectedCheckIn,
  selectedCheckOut,
  priceBreakdown,
  platformComparisons,
  appliedDiscount,
  isCalculatingPrice,
  onDateRangeSelect,
  onPlatformBooking,
  onDiscountApplied,
  onProceedToPayment
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<'booking' | 'checkout' | 'payment' | 'confirmation'>('booking');
  const [guestCount, setGuestCount] = useState(2);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    fullName: '',
    email: '',
    phone: ''
  });
  const [guestDetails, setGuestDetails] = useState<GuestInfo[]>([]);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingId, setBookingId] = useState<UUID | null>(null);
  const [bookingReference, setBookingReference] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const nights = selectedCheckIn && selectedCheckOut ? 
    Math.ceil((selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const handleProceedToCheckout = () => {
    setCurrentStep('checkout');
  };

  const handleProceedToPayment = async (contact: ContactInfo, requests: string, guests: GuestInfo[]) => {
    setIsProcessing(true);
    
    try {
      // Enhanced validation
      const contactErrors = validateContactInfo(contact);
      const bookingErrors = validateBookingData(selectedCheckIn, selectedCheckOut, priceBreakdown, guestCount);
      
      const allErrors = [...contactErrors, ...bookingErrors];
      
      if (allErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: allErrors.join('. '),
          variant: "destructive"
        });
        return;
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

      setContactInfo(contact);
      setGuestDetails(guests);
      setSpecialRequests(requests);
      
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
      
      setBookingId(result.bookingId);
      setBookingReference(result.bookingReference);
      setCurrentStep('payment');
      
      toast({
        title: "Booking created successfully",
        description: `Your booking reference is ${result.bookingReference}`,
      });
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('confirmation');
  };

  const handlePaymentFailure = (error: string) => {
    console.error('Payment failed:', error);
    toast({
      title: "Payment failed",
      description: error,
      variant: "destructive"
    });
    // Stay on payment step to allow retry
  };

  const canProceedToCheckout = selectedCheckIn && selectedCheckOut && priceBreakdown && !isCalculatingPrice;

  if (currentStep === 'checkout' && canProceedToCheckout) {
    return (
      <CheckoutStep
        property={property}
        propertyId={propertyId}
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
        guestCount={guestCount}
        nights={nights}
        priceBreakdown={priceBreakdown}
        appliedDiscount={appliedDiscount}
        onDiscountApplied={onDiscountApplied}
        onProceedToPayment={handleProceedToPayment}
        isProcessing={isProcessing}
      />
    );
  }

  if (currentStep === 'payment' && bookingId && bookingReference && canProceedToCheckout) {
    // Calculate final total with additional guest charges
    const additionalGuestCharges = Math.max(0, guestCount - 2) * 500;
    const finalPriceBreakdown = {
      ...priceBreakdown,
      totalAmountDue: priceBreakdown.totalAmountDue + additionalGuestCharges
    };

    return (
      <EnhancedPaymentStep
        bookingId={bookingId}
        bookingReference={bookingReference}
        property={property}
        selectedCheckIn={selectedCheckIn}
        selectedCheckOut={selectedCheckOut}
        guestCount={guestCount}
        nights={nights}
        priceBreakdown={finalPriceBreakdown}
        contactInfo={contactInfo}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />
    );
  }

  if (currentStep === 'confirmation' && bookingReference) {
    return (
      <BookingConfirmationStep
        bookingReference={bookingReference}
        onViewBookings={() => window.location.href = '/dashboard'}
      />
    );
  }

  // Default booking step
  return (
    <BookingContent
      propertyId={propertyId}
      property={property}
      selectedCheckIn={selectedCheckIn}
      selectedCheckOut={selectedCheckOut}
      priceBreakdown={priceBreakdown}
      platformComparisons={platformComparisons}
      onDateRangeSelect={onDateRangeSelect}
      onPlatformBooking={onPlatformBooking}
      guestCount={guestCount}
      setGuestCount={setGuestCount}
      isCalculatingPrice={isCalculatingPrice}
      onProceedToPayment={handleProceedToCheckout}
    />
  );
};
