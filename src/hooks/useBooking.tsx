
import { useState } from 'react';
import { useBookingAvailability } from './useBookingAvailability';
import { useBookingPrice } from './useBookingPrice';
import { useBookingCreation } from './useBookingCreation';
import { useBookingPayment } from './useBookingPayment';

/**
 * Combined hook for booking functionality
 * This serves as a facade for all the specialized booking hooks
 */
export const useBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    isAvailable,
    checkAvailability 
  } = useBookingAvailability();
  
  const {
    priceBreakdown,
    calculatePrice
  } = useBookingPrice();
  
  const { 
    makeBooking 
  } = useBookingCreation();
  
  const { 
    processPayment 
  } = useBookingPayment();

  return {
    isLoading: isLoading || useBookingAvailability().isLoading || 
               useBookingPrice().isLoading || 
               useBookingCreation().isLoading || 
               useBookingPayment().isLoading,
    priceBreakdown,
    isAvailable,
    checkAvailability,
    calculatePrice,
    makeBooking,
    processPayment
  };
};
