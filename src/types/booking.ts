
export type UUID = string;

export type BookingType = 'property' | 'experience';

export type BookingStatus = 
  | 'Pending Payment' 
  | 'Confirmed' 
  | 'Cancelled' 
  | 'Checked-In' 
  | 'Checked-Out';

export type PaymentStatus = 
  | 'Unpaid' 
  | 'Paid' 
  | 'Partially Paid' 
  | 'Refunded' 
  | 'Failed';

export type ChannelType = 'airbnb' | 'booking.com' | 'agoda' | 'direct';

export interface PriceBreakdown {
  basePrice: number;
  discountPercentage?: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  taxPercentage: number;
  taxAmount: number;
  cleaningFee?: number;
  addonExperiencesTotal?: number;
  totalAmountDue: number;
  currency: string;
}

export interface PropertyBookingDetails {
  propertyId: UUID;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  specialRequests?: string;
  customerNotes?: string;
}

export interface ExperienceBookingDetails {
  instanceId: UUID;
  numberOfAttendees: number;
  specialRequests?: string;
}

export interface GuestInfo {
  name: string;
  age?: number;
}

export interface BookingData {
  type: BookingType;
  userId: UUID;
  sourceBookingId?: string;
  sourcePlatform?: ChannelType;
  guests?: GuestInfo[];
  priceBreakdown: PriceBreakdown;
  property?: PropertyBookingDetails;
  experience?: ExperienceBookingDetails;
}

export interface PaymentInitiationData {
  bookingId: UUID;
  bookingType: BookingType;
  amount: number;
  currency: string;
  userEmail: string;
  userName: string;
  bookingReference: string;
}

export interface PaymentConfirmationData {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  bookingId: UUID;
  bookingType: BookingType;
}

export interface PaymentFailureData {
  razorpayOrderId: string;
  errorCode?: string;
  errorDescription?: string;
  bookingId: UUID;
  bookingType: BookingType;
}
