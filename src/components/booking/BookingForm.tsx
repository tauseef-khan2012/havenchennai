
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/hooks/useBooking';
import BookingStepRenderer from './BookingStepRenderer';
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

  // Continue to next step of the booking process
  const handleContinue = async () => {
    if (formStep === 0) {
      // Validate first step
      if (type === 'property' && (!checkInDate || !checkOutDate || guestCount < 1)) {
        return;
      } else if (type === 'experience' && attendeeCount < 1) {
        return;
      }
      
      await handleCalculatePrice();
      
      if (priceBreakdown) {
        setFormStep(1);
      }
    } else if (formStep === 1) {
      // Validate second step (guest info)
      let valid = true;
      
      if (type === 'property') {
        valid = guests.every(guest => guest.name.trim() !== '');
      }
      
      if (valid) {
        setFormStep(2);
      }
    }
  };

  // Handle property step 1 completion
  const handlePropertyStep1Complete = (checkIn: string, checkOut: string, guests: number) => {
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
    setGuestCount(guests);
    handleCalculatePrice();
  };

  // Handle guest info update
  const handleGuestInfoUpdate = (updatedGuests: GuestInfo[], updatedSpecialRequests?: string) => {
    setGuests(updatedGuests);
    if (updatedSpecialRequests !== undefined) {
      setSpecialRequests(updatedSpecialRequests);
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
  const handlePayment = async () => {
    if (!bookingInfo) return;
    
    const paymentSuccess = await processPayment(
      bookingInfo.bookingId,
      type,
      bookingInfo.priceBreakdown.totalAmountDue,
      bookingInfo.priceBreakdown.currency,
      bookingInfo.bookingReference
    );
    
    if (paymentSuccess) {
      setFormStep(4);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <BookingStepRenderer 
        type={type}
        formStep={formStep}
        propertyId={propertyId}
        instanceId={instanceId}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        guestCount={guestCount}
        attendeeCount={attendeeCount}
        specialRequests={specialRequests}
        guests={guests}
        maxGuests={maxGuests}
        availableCapacity={availableCapacity}
        isLoading={isLoading}
        priceBreakdown={priceBreakdown}
        bookingInfo={bookingInfo}
        onPropertyStep1Complete={handlePropertyStep1Complete}
        onAttendeeChange={setAttendeeCount}
        onSpecialRequestsChange={setSpecialRequests}
        onGuestInfoUpdate={handleGuestInfoUpdate}
        onCalculatePrice={handleCalculatePrice}
        onContinue={handleContinue}
        onBack={setFormStep}
        onSubmit={handleSubmit}
        onPayment={handlePayment}
      />
    </div>
  );
};
