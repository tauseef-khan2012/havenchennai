
import { useState } from 'react';
import { UUID, BookingType, PriceBreakdown, GuestInfo } from '@/types/booking';
import { calculateBookingPrice } from '@/services/priceService';

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
      const bookingDetails = type === 'property'
        ? {
            type,
            propertyId: propertyId as UUID,
            checkInDate: new Date(bookingState.checkInDate),
            checkOutDate: new Date(bookingState.checkOutDate),
            numberOfAttendees: bookingState.guestCount,
          }
        : {
            type,
            instanceId: instanceId as UUID,
            numberOfAttendees: bookingState.attendeeCount,
          };
      
      const breakdown = await calculateBookingPrice(bookingDetails);
      setBookingState(prevState => ({ ...prevState, priceBreakdown: breakdown }));
    } catch (error) {
      console.error('Failed to calculate price:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setBookingState(prevState => ({ ...prevState, formStep: prevState.formStep + 1 }));
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
