import { db } from "@/lib/db";
import { PropertyBookingSchema } from "@/schemas/propertyBooking";
import { PaymentStatus } from "@/types";
import { z } from "zod";

export const createPropertyBooking = async (values: z.infer<typeof PropertyBookingSchema>) => {
  const validatedFields = PropertyBookingSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { 
    propertyId, 
    userId, 
    checkInDate, 
    checkOutDate, 
    numberOfGuests, 
    totalPrice, 
    specialRequests 
  } = validatedFields.data;

  try {
    const booking = await db.propertyBooking.create({
      data: {
        propertyId,
        userId,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        totalPrice,
        specialRequests,
        status: "Pending Payment",
      }
    });

    return { success: "Booking created!", bookingId: booking.id };
  } catch (error) {
    return { error: "Failed to create booking!" };
  }
};

export const getPropertyBooking = async (bookingId: string) => {
  try {
    const booking = await db.propertyBooking.findUnique({
      where: {
        id: bookingId
      },
      include: {
        property: true,
        user: true,
        payment: true
      }
    });

    return booking;
  } catch (error) {
    return null;
  }
};

export const updatePropertyBookingStatus = async (bookingId: string, status: string) => {
  try {
    const booking = await db.propertyBooking.update({
      where: {
        id: bookingId
      },
      data: {
        status: status
      }
    });

    return booking;
  } catch (error) {
    return null;
  }
};

export const createPaymentRecord = async (bookingId: string, amount: number, paymentMethod: string) => {
  try {
    const payment = await db.payment.create({
      data: {
        bookingId,
        amount,
        paymentMethod,
        status: "Unpaid" as PaymentStatus
      }
    });

    return payment;
  } catch (error) {
    return null;
  }
};

export const updatePaymentStatus = async (paymentId: string, status: PaymentStatus) => {
  try {
    const payment = await db.payment.update({
      where: {
        id: paymentId
      },
      data: {
        status
      }
    });

    return payment;
  } catch (error) {
    return null;
  }
};
