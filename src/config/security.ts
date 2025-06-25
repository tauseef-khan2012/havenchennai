
/**
 * Security configuration constants
 */
export const SECURITY_CONFIG = {
  // Input validation limits
  MAX_EMAIL_LENGTH: 254,
  MAX_PHONE_LENGTH: 25,
  MAX_NAME_LENGTH: 100,
  MAX_TEXT_INPUT_LENGTH: 1000,

  // Booking limits
  MIN_BOOKING_AMOUNT: 100, // Minimum booking amount in INR
  MAX_BOOKING_AMOUNT: 1000000, // Maximum booking amount in INR (10 lakh)
  MAX_GUESTS: 20,
  MAX_BOOKING_ATTEMPTS_PER_HOUR: 3, // Maximum booking attempts per hour per email
  MAX_ADVANCE_BOOKING_YEARS: 2, // Maximum years in advance for booking

  // Validation patterns
  PHONE_PATTERN: /^[\+]?[\d\s\-\(\)]{7,25}$/,
  NAME_PATTERN: /^[a-zA-Z\s\-\'\.]+$/,

  // Security patterns for sanitization
  HTML_TAG_REGEX: /<[^>]*>/g,
  SCRIPT_TAG_REGEX: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  DANGEROUS_PROTOCOLS: /^(javascript:|data:|vbscript:)/gi,
  
  // Rate limiting defaults
  DEFAULT_RATE_LIMITS: {
    GUEST_BOOKING: { maxAttempts: 3, windowHours: 1 },
    LOGIN_ATTEMPT: { maxAttempts: 5, windowHours: 1 },
    PASSWORD_RESET: { maxAttempts: 3, windowHours: 24 },
    OTP_REQUEST: { maxAttempts: 5, windowHours: 1 },
  }
} as const;
