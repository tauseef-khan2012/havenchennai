import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { ExperienceBooking, BookingStatus, PaymentStatus } from '@/types/booking';

export const createExperienceBooking = async (
  userId: string,
  experienceId: string,
  date: Date,
  numberOfGuests: number,
  specialRequests?: string
): Promise<ExperienceBooking> => {
  try {
    // Calculate total price based on experience price and number of guests
    const experience = await db.experience.findUnique({
      where: { id: experienceId },
    });

    if (!experience) {
      throw new Error('Experience not found');
    }

    const totalPrice = experience.pricePerPerson * numberOfGuests;

    // Create booking
    const booking = await db.experienceBooking.create({
      data: {
        id: uuidv4(),
        userId,
        experienceId,
        date,
        numberOfGuests,
        totalPrice,
        specialRequests,
        status: 'Pending' as BookingStatus,
        payment: {
          create: {
            id: uuidv4(),
            amount: totalPrice,
            status: 'Unpaid' as PaymentStatus,
          },
        },
      },
      include: {
        experience: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return booking;
  } catch (error) {
    console.error('Error creating experience booking:', error);
    throw error;
  }
};

export const getExperienceBookingById = async (bookingId: string): Promise<ExperienceBooking | null> => {
  try {
    const booking = await db.experienceBooking.findUnique({
      where: { id: bookingId },
      include: {
        experience: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return booking;
  } catch (error) {
    console.error('Error fetching experience booking:', error);
    throw error;
  }
};

export const updateExperienceBookingStatus = async (
  bookingId: string,
  status: BookingStatus
): Promise<ExperienceBooking> => {
  try {
    const booking = await db.experienceBooking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        experience: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return booking;
  } catch (error) {
    console.error('Error updating experience booking status:', error);
    throw error;
  }
};

export const initiateExperienceBookingPayment = async (bookingId: string): Promise<ExperienceBooking> => {
  try {
    // In a real application, this would integrate with a payment gateway
    // For now, we'll just update the booking status
    const booking = await db.experienceBooking.update({
      where: { id: bookingId },
      data: { 
        status: "Pending Payment" as BookingStatus,
      },
      include: {
        experience: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return booking;
  } catch (error) {
    console.error('Error initiating experience booking payment:', error);
    throw error;
  }
};

export const getUserExperienceBookings = async (userId: string): Promise<ExperienceBooking[]> => {
  try {
    const bookings = await db.experienceBooking.findMany({
      where: { userId },
      include: {
        experience: true,
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return bookings;
  } catch (error) {
    console.error('Error fetching user experience bookings:', error);
    throw error;
  }
};

export const cancelExperienceBooking = async (bookingId: string): Promise<ExperienceBooking> => {
  try {
    const booking = await db.experienceBooking.update({
      where: { id: bookingId },
      data: { 
        status: 'Cancelled' as BookingStatus,
      },
      include: {
        experience: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return booking;
  } catch (error) {
    console.error('Error cancelling experience booking:', error);
    throw error;
  }
};
