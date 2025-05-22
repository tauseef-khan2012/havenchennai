
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { BookingStatus, PaymentStatus } from '@/types/booking';

export const createExperienceBooking = async (
  userId: string,
  experienceId: string,
  date: Date,
  numberOfGuests: number,
  specialRequests?: string
) => {
  try {
    // In a real implementation, this would query the Supabase database
    // for experience details and calculate the price
    
    // Mock implementation for now
    const totalPrice = 100 * numberOfGuests; // Placeholder price calculation
    
    // Create a booking reference
    const bookingReference = `EXP-${Date.now().toString().slice(-6)}`;
    
    // Return mock booking data
    return {
      id: uuidv4(),
      userId,
      experienceId,
      date,
      numberOfGuests,
      totalPrice,
      specialRequests,
      status: 'Pending Payment' as BookingStatus,
      payment: {
        id: uuidv4(),
        amount: totalPrice,
        status: 'Unpaid' as PaymentStatus
      },
      bookingReference
    };
  } catch (error) {
    console.error('Error creating experience booking:', error);
    throw error;
  }
};

export const getExperienceBookingById = async (bookingId: string) => {
  try {
    // In a real implementation, this would query the Supabase database
    
    // Mock implementation for now
    return {
      id: bookingId,
      userId: 'user-123',
      experienceId: 'exp-123',
      date: new Date(),
      numberOfGuests: 2,
      totalPrice: 200,
      status: 'Pending Payment' as BookingStatus,
      payment: {
        id: 'payment-123',
        amount: 200,
        status: 'Unpaid' as PaymentStatus
      }
    };
  } catch (error) {
    console.error('Error fetching experience booking:', error);
    throw error;
  }
};

export const updateExperienceBookingStatus = async (
  bookingId: string,
  status: BookingStatus
) => {
  try {
    // In a real implementation, this would update the Supabase database
    
    // Mock implementation for now
    return {
      id: bookingId,
      status
    };
  } catch (error) {
    console.error('Error updating experience booking status:', error);
    throw error;
  }
};

export const initiateExperienceBookingPayment = async (bookingId: string) => {
  try {
    // In a real implementation, this would update the Supabase database
    
    // Mock implementation for now
    return {
      id: bookingId,
      status: 'Pending Payment' as BookingStatus
    };
  } catch (error) {
    console.error('Error initiating experience booking payment:', error);
    throw error;
  }
};

export const getUserExperienceBookings = async (userId: string) => {
  try {
    // In a real implementation, this would query the Supabase database
    
    // Mock implementation for now
    return [
      {
        id: 'booking-1',
        userId,
        experienceId: 'exp-1',
        date: new Date(),
        numberOfGuests: 2,
        totalPrice: 200,
        status: 'Pending Payment' as BookingStatus
      }
    ];
  } catch (error) {
    console.error('Error fetching user experience bookings:', error);
    throw error;
  }
};

export const cancelExperienceBooking = async (bookingId: string) => {
  try {
    // In a real implementation, this would update the Supabase database
    
    // Mock implementation for now
    return {
      id: bookingId,
      status: 'Cancelled' as BookingStatus
    };
  } catch (error) {
    console.error('Error cancelling experience booking:', error);
    throw error;
  }
};
