
import { useState, useCallback } from 'react';
import { useBookingAvailability } from './useBookingAvailability';
import { useBookingPrice } from './useBookingPrice';
import { useBookingCreation } from './useBookingCreation';
import { useBookingPayment } from './useBookingPayment';
import { UUID, BookingType, GuestInfo, PriceBreakdown } from '@/types/booking';

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
  
  // Define memoized wrapper functions to ensure consistent API
  const checkAvailability = useCallback(
    (type: BookingType, details: {
      propertyId?: UUID;
      checkInDate?: Date;
      checkOutDate?: Date;
      instanceId?: UUID;
      numberOfAttendees?: number;
    }) => availability.checkAvailability(type, details),
    [availability]
  );
  
  const calculatePrice = useCallback(
    (type: BookingType, details: {
      propertyId?: UUID;
      checkInDate?: Date;
      checkOutDate?: Date;
      instanceId?: UUID;
      numberOfAttendees?: number;
      selectedAddonExperiences?: {instanceId: UUID, attendees: number}[];
    }) => price.calculatePrice(type, details),
    [price]
  );
  
  const makeBooking = useCallback(
    (type: BookingType, details: {
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
    }) => creation.makeBooking(type, details),
    [creation]
  );
  
  const processPayment = useCallback(
    (bookingId: UUID,
    bookingType: BookingType,
    amount: number,
    currency: string,
    bookingReference: string) => 
      payment.processPayment(bookingId, bookingType, amount, currency, bookingReference),
    [payment]
  );

  // Return a unified API that exposes all functionality while hiding implementation details
  return {
    // Loading state
    isLoading,
    
    // Availability checking
    isAvailable: availability.isAvailable,
    checkAvailability,
    
    // Price calculation
    priceBreakdown: price.priceBreakdown,
    calculatePrice,
    
    // Booking creation
    makeBooking,
    
    // Payment processing
    processPayment
  };
};
