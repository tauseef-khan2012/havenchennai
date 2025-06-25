
// Enhanced security services export
export { DatabaseAuditService } from './databaseAuditService';
export { DatabaseRateLimitService, ENHANCED_RATE_LIMITS } from './databaseRateLimitService';
export { EnhancedInputValidator } from './enhancedInputValidation';
export { SecureBookingService } from './secureBookingService';

// Legacy compatibility exports
export { RateLimitService, DEFAULT_RATE_LIMITS } from './rateLimitService';
export { AuditService } from './auditService';
export { InputValidator } from './inputValidation';
export { EnhancedGuestBookingService } from '../booking/security/enhancedGuestBookingService';

// Security types
export type { SecurityEventType, SecuritySeverity } from './databaseAuditService';
export type { ValidationResult, AmountValidationResult } from './enhancedInputValidation';
