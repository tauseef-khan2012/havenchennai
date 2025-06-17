
import { z } from 'zod';

/**
 * Comprehensive input sanitization service
 */

// HTML tag removal regex
const HTML_TAG_REGEX = /<[^>]*>/g;
const SCRIPT_TAG_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const DANGEROUS_PROTOCOLS = /^(javascript|data|vbscript):/i;

/**
 * Sanitize text input to remove potentially dangerous content
 */
export const sanitizeTextInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove script tags first
  let sanitized = input.replace(SCRIPT_TAG_REGEX, '');
  
  // Remove all HTML tags
  sanitized = sanitized.replace(HTML_TAG_REGEX, '');
  
  // Remove dangerous protocols
  sanitized = sanitized.replace(DANGEROUS_PROTOCOLS, '');
  
  // Trim and limit length
  return sanitized.trim().substring(0, 1000);
};

/**
 * Sanitize email input
 */
export const sanitizeEmailInput = (email: string): string => {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase().substring(0, 254);
};

/**
 * Sanitize phone input
 */
export const sanitizePhoneInput = (phone: string): string => {
  if (!phone || typeof phone !== 'string') return '';
  // Remove all non-digit characters except + and spaces/hyphens
  return phone.replace(/[^\d\+\s\-\(\)]/g, '').trim().substring(0, 25);
};

/**
 * Enhanced validation schemas with sanitization
 */
export const secureContactSchema = z.object({
  guestName: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s\-\'\.]+$/, 'Name contains invalid characters')
    .transform(sanitizeTextInput),
  
  guestEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(254, 'Email address is too long')
    .transform(sanitizeEmailInput),
  
  guestPhone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[\d\s\-\(\)]{7,25}$/, 'Invalid phone number format')
    .transform(sanitizePhoneInput),
  
  specialRequests: z
    .string()
    .max(500, 'Special requests must be less than 500 characters')
    .optional()
    .transform(val => val ? sanitizeTextInput(val) : undefined)
});

/**
 * Rate limiting check
 */
export const checkRateLimit = (attempts: number, maxAttempts: number = 5): boolean => {
  return attempts < maxAttempts;
};

/**
 * Validate booking amount for security
 */
export const validateBookingAmount = (amount: number): { isValid: boolean; error?: string } => {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { isValid: false, error: 'Invalid booking amount' };
  }
  if (amount > 1000000) { // 10 lakh INR max
    return { isValid: false, error: 'Booking amount exceeds maximum limit' };
  }
  return { isValid: true };
};
