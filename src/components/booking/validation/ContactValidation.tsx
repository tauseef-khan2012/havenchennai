
import React from 'react';
import { z } from 'zod';

// Enhanced validation schema for contact information
export const contactValidationSchema = z.object({
  guestName: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .transform(val => val.trim()),
  
  guestEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(254, 'Email address is too long')
    .transform(val => val.trim().toLowerCase()),
  
  guestPhone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[\d\s\-\(\)]{7,15}$/, 'Invalid phone number format')
    .transform(val => val.trim()),
  
  specialRequests: z
    .string()
    .max(500, 'Special requests must be less than 500 characters')
    .optional()
    .transform(val => val ? val.trim().replace(/[<>]/g, '') : undefined)
});

export type ContactFormData = z.infer<typeof contactValidationSchema>;

// Validation helper functions
export const validateContactForm = (data: any): { isValid: boolean; errors: string[] } => {
  try {
    contactValidationSchema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        errors: error.errors.map(err => err.message) 
      };
    }
    return { isValid: false, errors: ['Validation failed'] };
  }
};

// Rate limiting validation
export const validateRateLimit = (email: string, recentBookings: number): { isValid: boolean; error?: string } => {
  if (recentBookings >= 3) {
    return {
      isValid: false,
      error: 'Rate limit exceeded. Maximum 3 bookings per hour per email address.'
    };
  }
  return { isValid: true };
};

// Security validation for booking amounts
export const validateBookingAmount = (amount: number): { isValid: boolean; error?: string } => {
  if (amount <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }
  if (amount > 500000) {
    return { isValid: false, error: 'Amount cannot exceed ₹5,00,000' };
  }
  return { isValid: true };
};

// Date validation for bookings
export const validateBookingDates = (checkIn: Date, checkOut: Date): { isValid: boolean; error?: string } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (checkIn < today) {
    return { isValid: false, error: 'Cannot book dates in the past' };
  }
  
  if (checkIn >= checkOut) {
    return { isValid: false, error: 'Check-out date must be after check-in date' };
  }
  
  const maxAdvanceDate = new Date();
  maxAdvanceDate.setFullYear(maxAdvanceDate.getFullYear() + 2);
  
  if (checkIn > maxAdvanceDate) {
    return { isValid: false, error: 'Bookings cannot be made more than 2 years in advance' };
  }
  
  return { isValid: true };
};

export default {};
