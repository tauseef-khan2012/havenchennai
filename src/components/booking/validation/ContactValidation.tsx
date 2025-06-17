
import React from 'react';
import { z } from 'zod';
import { secureContactSchema } from '@/services/security/inputSanitization';
import { SECURITY_CONFIG } from '@/config/security';

// Enhanced validation schema using security service
export const contactValidationSchema = secureContactSchema;

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

// Enhanced rate limiting validation
export const validateRateLimit = (email: string, recentBookings: number): { isValid: boolean; error?: string } => {
  if (recentBookings >= SECURITY_CONFIG.MAX_BOOKING_ATTEMPTS_PER_HOUR) {
    return {
      isValid: false,
      error: `Rate limit exceeded. Maximum ${SECURITY_CONFIG.MAX_BOOKING_ATTEMPTS_PER_HOUR} bookings per hour per email address.`
    };
  }
  return { isValid: true };
};

// Enhanced security validation for booking amounts
export const validateBookingAmount = (amount: number): { isValid: boolean; error?: string } => {
  if (!Number.isFinite(amount) || amount < SECURITY_CONFIG.MIN_BOOKING_AMOUNT) {
    return { isValid: false, error: 'Invalid booking amount' };
  }
  if (amount > SECURITY_CONFIG.MAX_BOOKING_AMOUNT) {
    return { isValid: false, error: `Booking amount cannot exceed ₹${SECURITY_CONFIG.MAX_BOOKING_AMOUNT.toLocaleString()}` };
  }
  return { isValid: true };
};

// Enhanced date validation for bookings
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
  maxAdvanceDate.setFullYear(maxAdvanceDate.getFullYear() + SECURITY_CONFIG.MAX_ADVANCE_BOOKING_YEARS);
  
  if (checkIn > maxAdvanceDate) {
    return { isValid: false, error: `Bookings cannot be made more than ${SECURITY_CONFIG.MAX_ADVANCE_BOOKING_YEARS} years in advance` };
  }
  
  // Check for reasonable stay duration (max 30 days for security)
  const daysDiff = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > 30) {
    return { isValid: false, error: 'Maximum stay duration is 30 days' };
  }
  
  return { isValid: true };
};

// Input sanitization for forms
export const sanitizeFormInput = (input: string, maxLength: number = SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags and dangerous content
  let sanitized = input.replace(SECURITY_CONFIG.HTML_TAG_REGEX, '');
  sanitized = sanitized.replace(SECURITY_CONFIG.SCRIPT_TAG_REGEX, '');
  sanitized = sanitized.replace(SECURITY_CONFIG.DANGEROUS_PROTOCOLS, '');
  
  return sanitized.trim().substring(0, maxLength);
};

export default {};
