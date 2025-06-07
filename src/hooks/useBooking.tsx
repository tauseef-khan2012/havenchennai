import { useState } from 'react';
import { UUID, BookingType, PriceBreakdown, GuestInfo } from '@/types/booking';
import { calculatePrice } from '@/services/priceService';

interface BookingState {
  formStep: number;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  attendeeCount: number;
  specialRequests: string;
  guests: GuestInfo[];
  priceBreakdown: PriceBreakdown | null;
  bookingInfo: { bookingId: UUID; bookingReference: string; priceBreakdown: PriceBreakdown } | null;
}

export const useBooking = (
  type: BookingType,
  propertyId?: UUID,
  instanceId?: UUID
) => {
  const [bookingState, setBookingState] = useState<BookingState>({
    formStep: 0,
    checkInDate: '',
    checkOutDate: '',
    guestCount: 1,
    attendeeCount: 1,
    specialRequests: '',
    guests: [],
    priceBreakdown: null,
    bookingInfo: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const setFormStep = (step: number) => {
    setBookingState(prevState => ({ ...prevState, formStep: step }));
  };

  const handlePropertyStep1Complete = (checkIn: string, checkOut: string, guests: number) => {
    setBookingState(prevState => ({
      ...prevState,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guestCount: guests,
    }));
    setFormStep(1);
  };

  const handleAttendeeChange = (count: number) => {
    setBookingState(prevState => ({ ...prevState, attendeeCount: count }));
  };

  const handleSpecialRequestsChange = (requests: string) => {
    setBookingState(prevState => ({ ...prevState, specialRequests: requests }));
  };

  const handleGuestInfoUpdate = (guests: GuestInfo[], specialRequests?: string) => {
    setBookingState(prevState => ({
      ...prevState,
      guests: guests,
      specialRequests: specialRequests || '',
    }));
  };

  const handleCalculatePrice = async () => {
    setIsLoading(true);
    try {
      const priceData =
        type === 'property'
          ? {
              propertyId: propertyId as UUID,
              checkInDate: bookingState.checkInDate,
              checkOutDate: bookingState.checkOutDate,
              numberOfGuests: bookingState.guestCount,
            }
          : {
              instanceId: instanceId as UUID,
              numberOfAttendees: bookingState.attendeeCount,
            };
      const breakdown = await calculatePrice(type, priceData);
      setBookingState(prevState => ({ ...prevState, priceBreakdown: breakdown }));
    } catch (error) {
      console.error('Failed to calculate price:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setFormStep(prevState => prevState.formStep + 1);
  };

  const handleBack = (step: number) => {
    setFormStep(step);
  };

  const handleSubmit = () => {
    setFormStep(3);
  };

  const handlePayment = () => {
    setFormStep(4);
  };
  
  const handleContactInfoChange = (info: { fullName: string; email: string; phone: string }) => {
    setContactInfo(info);
  };

  return {
    ...bookingState,
    isLoading,
    setFormStep,
    handlePropertyStep1Complete,
    handleAttendeeChange,
    handleSpecialRequestsChange,
    handleGuestInfoUpdate,
    handleCalculatePrice,
    handleContinue,
    handleBack,
    handleSubmit,
    handlePayment,
    contactInfo,
    handleContactInfoChange,
  };
};
