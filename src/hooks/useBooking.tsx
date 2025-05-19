
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
  // Initialize all specialized booking hooks
  const availability = useBookingAvailability();
  const price = useBookingPrice();
  const creation = useBookingCreation();
  const payment = useBookingPayment();
  
  // Compute combined loading state
  const isLoading = availability.isLoading || 
                    price.isLoading || 
                    creation.isLoading || 
                    payment.isLoading;

  // Return a unified API that exposes all functionality while hiding implementation details
  return {
    // Loading state
    isLoading,
    
    // Availability checking
    isAvailable: availability.isAvailable,
    checkAvailability: availability.checkAvailability,
    
    // Price calculation
    priceBreakdown: price.priceBreakdown,
    calculatePrice: price.calculatePrice,
    
    // Booking creation
    makeBooking: creation.makeBooking,
    
    // Payment processing
    processPayment: payment.processPayment
  };
};
