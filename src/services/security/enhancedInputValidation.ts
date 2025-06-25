
import { SECURITY_CONFIG } from '@/config/security';

export interface ValidationResult {
  isValid: boolean;
  sanitized?: string;
  error?: string;
}

export interface AmountValidationResult {
  isValid: boolean;
  sanitized?: number;
  error?: string;
}

/**
 * Enhanced input validation service with comprehensive security checks
 */
export class EnhancedInputValidator {
  /**
   * Enhanced email validation with additional security checks
   */
  static validateEmail(email: string): ValidationResult {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }

    // Length validation
    if (email.length > SECURITY_CONFIG.MAX_EMAIL_LENGTH) {
      return { isValid: false, error: `Email must be less than ${SECURITY_CONFIG.MAX_EMAIL_LENGTH} characters` };
    }

    // Basic format validation with enhanced regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    // Security checks
    const sanitized = this.sanitizeText(email.toLowerCase().trim(), SECURITY_CONFIG.MAX_EMAIL_LENGTH);
    
    // Check for suspicious patterns
    if (sanitized.includes('..') || sanitized.includes('@@')) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // Check for dangerous protocols in email (additional security)
    if (SECURITY_CONFIG.DANGEROUS_PROTOCOLS.test(sanitized)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Enhanced phone validation with international support
   */
  static validatePhone(phone: string): ValidationResult {
    if (!phone || typeof phone !== 'string') {
      return { isValid: false, error: 'Phone number is required' };
    }

    const cleanPhone = phone.replace(/\s+/g, ' ').trim();

    // Length validation
    if (cleanPhone.length > SECURITY_CONFIG.MAX_PHONE_LENGTH) {
      return { isValid: false, error: `Phone number must be less than ${SECURITY_CONFIG.MAX_PHONE_LENGTH} characters` };
    }

    // Enhanced pattern validation
    if (!SECURITY_CONFIG.PHONE_PATTERN.test(cleanPhone)) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }

    // Additional security checks
    const sanitized = this.sanitizeText(cleanPhone, SECURITY_CONFIG.MAX_PHONE_LENGTH);
    
    // Check for suspicious patterns
    if (sanitized.includes('javascript:') || sanitized.includes('data:')) {
      return { isValid: false, error: 'Invalid phone number format' };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Enhanced name validation with security checks
   */
  static validateName(name: string, fieldName: string = 'Name'): ValidationResult {
    if (!name || typeof name !== 'string') {
      return { isValid: false, error: `${fieldName} is required` };
    }

    const trimmedName = name.trim();

    // Length validation
    if (trimmedName.length === 0) {
      return { isValid: false, error: `${fieldName} cannot be empty` };
    }

    if (trimmedName.length > SECURITY_CONFIG.MAX_NAME_LENGTH) {
      return { isValid: false, error: `${fieldName} must be less than ${SECURITY_CONFIG.MAX_NAME_LENGTH} characters` };
    }

    // Enhanced pattern validation
    if (!SECURITY_CONFIG.NAME_PATTERN.test(trimmedName)) {
      return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, apostrophes, and periods` };
    }

    // Security sanitization
    const sanitized = this.sanitizeText(trimmedName, SECURITY_CONFIG.MAX_NAME_LENGTH);

    // Additional security checks
    if (sanitized !== trimmedName) {
      return { isValid: false, error: `${fieldName} contains invalid characters` };
    }

    // Check for suspicious patterns
    if (this.containsSuspiciousContent(sanitized)) {
      return { isValid: false, error: `${fieldName} contains invalid content` };
    }

    return { isValid: true, sanitized };
  }

  /**
   * Enhanced amount validation with business rule checks
   */
  static validateAmount(amount: any): AmountValidationResult {
    if (amount === null || amount === undefined || amount === '') {
      return { isValid: false, error: 'Amount is required' };
    }

    const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);

    if (isNaN(numAmount) || !isFinite(numAmount)) {
      return { isValid: false, error: 'Please enter a valid amount' };
    }

    if (numAmount < 0) {
      return { isValid: false, error: 'Amount cannot be negative' };
    }

    if (numAmount < SECURITY_CONFIG.MIN_BOOKING_AMOUNT) {
      return { isValid: false, error: `Minimum booking amount is ₹${SECURITY_CONFIG.MIN_BOOKING_AMOUNT}` };
    }

    if (numAmount > SECURITY_CONFIG.MAX_BOOKING_AMOUNT) {
      return { isValid: false, error: `Maximum booking amount is ₹${SECURITY_CONFIG.MAX_BOOKING_AMOUNT}` };
    }

    // Round to 2 decimal places for currency
    const sanitized = Math.round(numAmount * 100) / 100;

    return { isValid: true, sanitized };
  }

  /**
   * Enhanced guest count validation
   */
  static validateGuestCount(count: any): ValidationResult {
    if (count === null || count === undefined || count === '') {
      return { isValid: false, error: 'Number of guests is required' };
    }

    const numCount = typeof count === 'string' ? parseInt(count, 10) : Number(count);

    if (isNaN(numCount) || !Number.isInteger(numCount)) {
      return { isValid: false, error: 'Please enter a valid number of guests' };
    }

    if (numCount < 1) {
      return { isValid: false, error: 'At least 1 guest is required' };
    }

    if (numCount > SECURITY_CONFIG.MAX_GUESTS) {
      return { isValid: false, error: `Maximum ${SECURITY_CONFIG.MAX_GUESTS} guests allowed` };
    }

    return { isValid: true, sanitized: numCount.toString() };
  }

  /**
   * Enhanced text sanitization with comprehensive security
   */
  static sanitizeText(input: string, maxLength?: number): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    let sanitized = input
      // Remove HTML tags
      .replace(SECURITY_CONFIG.HTML_TAG_REGEX, '')
      // Remove script tags specifically
      .replace(SECURITY_CONFIG.SCRIPT_TAG_REGEX, '')
      // Remove dangerous protocols
      .replace(SECURITY_CONFIG.DANGEROUS_PROTOCOLS, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();

    // Apply length limit
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength).trim();
    }

    return sanitized;
  }

  /**
   * Enhanced date validation for bookings
   */
  static validateBookingDates(checkIn: Date, checkOut: Date): ValidationResult {
    const now = new Date();
    const maxAdvanceDate = new Date();
    maxAdvanceDate.setFullYear(now.getFullYear() + SECURITY_CONFIG.MAX_ADVANCE_BOOKING_YEARS);

    // Check if dates are valid
    if (!checkIn || !checkOut || isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return { isValid: false, error: 'Please select valid check-in and check-out dates' };
    }

    // Check if check-in is in the past
    if (checkIn < now) {
      return { isValid: false, error: 'Check-in date cannot be in the past' };
    }

    // Check if check-out is after check-in
    if (checkOut <= checkIn) {
      return { isValid: false, error: 'Check-out date must be after check-in date' };
    }

    // Check maximum advance booking
    if (checkIn > maxAdvanceDate) {
      return { isValid: false, error: `Bookings can only be made up to ${SECURITY_CONFIG.MAX_ADVANCE_BOOKING_YEARS} years in advance` };
    }

    return { isValid: true };
  }

  /**
   * Check for suspicious content patterns
   */
  private static containsSuspiciousContent(text: string): boolean {
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /<script/i,
      /onload=/i,
      /onerror=/i,
      /onclick=/i,
      /eval\(/i,
      /expression\(/i,
      /url\(/i,
      /import\(/i
    ];

    return suspiciousPatterns.some(pattern => pattern.test(text));
  }

  /**
   * Validate booking reference format
   */
  static validateBookingReference(reference: string): ValidationResult {
    if (!reference || typeof reference !== 'string') {
      return { isValid: false, error: 'Booking reference is required' };
    }

    const trimmed = reference.trim();
    
    // Basic format validation (alphanumeric with hyphens)
    if (!/^[A-Z0-9-]{6,20}$/.test(trimmed)) {
      return { isValid: false, error: 'Invalid booking reference format' };
    }

    return { isValid: true, sanitized: trimmed };
  }
}
