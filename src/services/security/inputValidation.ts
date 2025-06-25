
import { SECURITY_CONFIG } from '@/config/security';

/**
 * Enhanced input validation and sanitization
 */
export class InputValidator {
  /**
   * Validate and sanitize email input
   */
  static validateEmail(email: string): { isValid: boolean; sanitized: string; error?: string } {
    if (!email || typeof email !== 'string') {
      return { isValid: false, sanitized: '', error: 'Email is required' };
    }

    const sanitized = email.trim().toLowerCase();
    
    if (sanitized.length > SECURITY_CONFIG.MAX_EMAIL_LENGTH) {
      return { isValid: false, sanitized, error: 'Email is too long' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
      return { isValid: false, sanitized, error: 'Invalid email format' };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Validate and sanitize phone number
   */
  static validatePhone(phone: string): { isValid: boolean; sanitized: string; error?: string } {
    if (!phone || typeof phone !== 'string') {
      return { isValid: false, sanitized: '', error: 'Phone number is required' };
    }

    const sanitized = phone.trim().replace(/\s+/g, ' ');
    
    if (sanitized.length > SECURITY_CONFIG.MAX_PHONE_LENGTH) {
      return { isValid: false, sanitized, error: 'Phone number is too long' };
    }

    if (!SECURITY_CONFIG.PHONE_PATTERN.test(sanitized)) {
      return { isValid: false, sanitized, error: 'Invalid phone number format' };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Validate and sanitize name input
   */
  static validateName(name: string, fieldName: string = 'Name'): { isValid: boolean; sanitized: string; error?: string } {
    if (!name || typeof name !== 'string') {
      return { isValid: false, sanitized: '', error: `${fieldName} is required` };
    }

    const sanitized = name.trim().replace(/\s+/g, ' ');
    
    if (sanitized.length > SECURITY_CONFIG.MAX_NAME_LENGTH) {
      return { isValid: false, sanitized, error: `${fieldName} is too long` };
    }

    if (!SECURITY_CONFIG.NAME_PATTERN.test(sanitized)) {
      return { isValid: false, sanitized, error: `${fieldName} contains invalid characters` };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Sanitize text input to prevent XSS
   */
  static sanitizeText(input: string, maxLength: number = SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input
      .replace(SECURITY_CONFIG.HTML_TAG_REGEX, '') // Remove HTML tags
      .replace(SECURITY_CONFIG.SCRIPT_TAG_REGEX, '') // Remove script tags
      .trim()
      .substring(0, maxLength);

    return sanitized;
  }

  /**
   * Validate booking amount
   */
  static validateAmount(amount: number): { isValid: boolean; error?: string } {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return { isValid: false, error: 'Invalid amount' };
    }

    if (amount < SECURITY_CONFIG.MIN_BOOKING_AMOUNT) {
      return { isValid: false, error: 'Amount too low' };
    }

    if (amount > SECURITY_CONFIG.MAX_BOOKING_AMOUNT) {
      return { isValid: false, error: 'Amount exceeds maximum limit' };
    }

    return { isValid: true };
  }

  /**
   * Validate guest count
   */
  static validateGuestCount(count: number): { isValid: boolean; error?: string } {
    if (typeof count !== 'number' || isNaN(count) || count < 1) {
      return { isValid: false, error: 'Invalid guest count' };
    }

    if (count > SECURITY_CONFIG.MAX_GUESTS) {
      return { isValid: false, error: `Maximum ${SECURITY_CONFIG.MAX_GUESTS} guests allowed` };
    }

    return { isValid: true };
  }
}
