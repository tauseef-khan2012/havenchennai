
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/hooks/useBooking';
import AuthenticationNotice from './AuthenticationNotice';
import PropertyDateGuestStep from './steps/PropertyDateGuestStep';
import GuestInfoStep from './steps/GuestInfoStep';
import BookingSummaryStep from './steps/BookingSummaryStep';
import PaymentStep from './steps/PaymentStep';
import BookingConfirmationStep from './steps/BookingConfirmationStep';
import { UUID, PriceBreakdown, GuestInfo } from '@/types/booking';

interface BookingFormProps {
  type: 'property' | 'experience';
  propertyId?: UUID;
  instanceId?: UUID;
  maxGuests?: number;
  availableCapacity?: number;
}

export const BookingForm = ({ 
  type, 
  propertyId, 
  instanceId,
  maxGuests = 4,
  availableCapacity = 10
}: BookingFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    isLoading, 
    priceBreakdown, 
    checkAvailability, 
    calculatePrice, 
    makeBooking, 
    processPayment 
  } = useBooking();

  // Form state
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [attendeeCount, setAttendeeCount] = useState<number>(1);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [guests, setGuests] = useState<GuestInfo[]>([{ name: '' }]);
  const [formStep, setFormStep] = useState<number>(0);
  const [bookingInfo, setBookingInfo] = useState<{ 
    bookingId: UUID; 
    bookingReference: string; 
    priceBreakdown: PriceBreakdown;
  } | null>(null);

  // Calculate price when dates or guest count changes
  const handleCalculatePrice = async () => {
    if (type === 'property' && propertyId && checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      // Check if dates are valid
      if (checkIn >= checkOut) {
        return;
      }
      
      // Check availability first
      const available = await checkAvailability('property', {
        propertyId,
        checkInDate: checkIn,
        checkOutDate: checkOut
      });
      
      if (available) {
        await calculatePrice('property', {
          propertyId,
          checkInDate: checkIn,
          checkOutDate: checkOut
        });
      }
    } else if (type === 'experience' && instanceId && attendeeCount > 0) {
      // Check availability first
      const available = await checkAvailability('experience', {
        instanceId,
        numberOfAttendees: attendeeCount
      });
      
      if (available) {
        await calculatePrice('experience', {
          instanceId,
          numberOfAttendees: attendeeCount
        });
      }
    }
  };

  // Handle property step 1 completion
  const handlePropertyStep1Complete = (data: {
    checkInDate: Date;
    checkOutDate: Date;
    numberOfGuests: number;
    specialRequests?: string;
  }) => {
    setCheckInDate(data.checkInDate.toISOString());
    setCheckOutDate(data.checkOutDate.toISOString());
    setGuestCount(data.numberOfGuests);
    if (data.specialRequests) {
      setSpecialRequests(data.specialRequests);
    }
    
    // Initialize guest info array
    setGuests(Array(data.numberOfGuests).fill(0).map(() => ({ name: '' })));
    
    // Calculate price and move to next step
    const calculateAndContinue = async () => {
      await handleCalculatePrice();
      setFormStep(1);
    };
    
    calculateAndContinue();
  };

  // Handle guest info update
  const handleGuestInfoUpdate = (updatedGuests: GuestInfo[], updatedCustomerNotes?: string) => {
    setGuests(updatedGuests);
    if (updatedCustomerNotes !== undefined) {
      setSpecialRequests(updatedCustomerNotes);
    }
    setFormStep(2);
  };

  // Submit the booking
  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (type === 'property' && propertyId && checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      const result = await makeBooking('property', {
        propertyId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guestCount,
        specialRequests,
        guests
      });
      
      if (result && priceBreakdown) {
        setBookingInfo({
          bookingId: result.bookingId,
          bookingReference: result.bookingReference,
          priceBreakdown
        });
        setFormStep(3);
      }
    } else if (type === 'experience' && instanceId) {
      const result = await makeBooking('experience', {
        instanceId,
        numberOfAttendees: attendeeCount,
        specialRequests
      });
      
      if (result && priceBreakdown) {
        setBookingInfo({
          bookingId: result.bookingId,
          bookingReference: result.bookingReference,
          priceBreakdown
        });
        setFormStep(3);
      }
    }
  };

  // Process payment
  const handlePayment = async (bookingId: UUID, bookingReference: string) => {
    if (!bookingInfo) return;
    
    const paymentSuccess = await processPayment(
      bookingId,
      type,
      bookingInfo.priceBreakdown.totalAmountDue,
      bookingInfo.priceBreakdown.currency,
      bookingReference
    );
    
    if (paymentSuccess) {
      setFormStep(4);
    }
  };

  // Render the appropriate step based on formStep
  const renderStep = () => {
    switch (formStep) {
      case 0:
        // Step 1: Property Dates & Guests / Experience Attendees
        if (type === 'property' && propertyId) {
          return (
            <PropertyDateGuestStep
              propertyId={propertyId}
              maxGuests={maxGuests}
              onNext={handlePropertyStep1Complete}
            />
          );
        }
        // TODO: Add experience step component
        return null;
        
      case 1:
        // Step 2: Guest Info
        return (
          <GuestInfoStep
            numberOfGuests={guestCount}
            initialGuestInfo={guests}
            initialCustomerNotes={specialRequests}
            onNext={handleGuestInfoUpdate}
            onBack={() => setFormStep(0)}
          />
        );
        
      case 2:
        // Step 3: Booking Summary
        return (
          <BookingSummaryStep
            type={type}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            guestCount={guestCount}
            attendeeCount={attendeeCount}
            guests={guests}
            specialRequests={specialRequests}
            priceBreakdown={priceBreakdown}
            onBack={() => setFormStep(1)}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        );
        
      case 3:
        // Step 4: Payment
        if (!bookingInfo) return null;
        
        return (
          <PaymentStep
            bookingType={type}
            priceBreakdown={bookingInfo.priceBreakdown}
            propertyDetails={type === 'property' && propertyId ? {
              propertyId,
              checkInDate: new Date(checkInDate),
              checkOutDate: new Date(checkOutDate),
              numberOfGuests: guestCount,
              specialRequests
            } : undefined}
            experienceDetails={type === 'experience' && instanceId ? {
              instanceId,
              numberOfAttendees: attendeeCount,
              specialRequests
            } : undefined}
            guests={guests}
            onBack={() => setFormStep(2)}
            onSuccess={handlePayment}
            isLoading={isLoading}
          />
        );
        
      case 4:
        // Step 5: Confirmation
        if (!bookingInfo) return null;
        
        return (
          <BookingConfirmationStep
            bookingReference={bookingInfo.bookingReference}
            onViewBookings={() => navigate('/dashboard')}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {!user && <AuthenticationNotice user={user} />}
      {renderStep()}
    </div>
  );
};

export default BookingForm;
