
/**
 * Security configuration constants
 */

export const SECURITY_CONFIG = {
  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  MAX_BOOKING_ATTEMPTS_PER_HOUR: 3,
  
  // Input validation
  MAX_TEXT_INPUT_LENGTH: 1000,
  MAX_EMAIL_LENGTH: 254,
  MAX_PHONE_LENGTH: 25,
  MAX_NAME_LENGTH: 100,
  MAX_SPECIAL_REQUESTS_LENGTH: 500,
  
  // Booking limits
  MAX_BOOKING_AMOUNT: 1000000, // 10 lakh INR
  MIN_BOOKING_AMOUNT: 1,
  MAX_GUESTS: 20,
  MAX_ATTENDEES: 50,
  MAX_ADVANCE_BOOKING_YEARS: 2,
  
  // Session
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  TOKEN_REFRESH_THRESHOLD: 10 * 60 * 1000, // 10 minutes
  
  // Validation patterns
  NAME_PATTERN: /^[a-zA-Z\s\-\'\.]+$/,
  PHONE_PATTERN: /^[\+]?[\d\s\-\(\)]{7,25}$/,
  
  // Blocked patterns
  DANGEROUS_PROTOCOLS: /^(javascript|data|vbscript):/i,
  HTML_TAG_REGEX: /<[^>]*>/g,
  SCRIPT_TAG_REGEX: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
} as const;

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
} as const;
