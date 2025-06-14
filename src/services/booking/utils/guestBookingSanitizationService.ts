
/**
 * Sanitize text input to prevent XSS - simplified as Zod handles some aspects.
 * Kept for any fields not covered by Zod or for an additional layer.
 */
export const sanitizeTextInput = (input?: string): string | undefined => {
  if (!input) return undefined;
  // Basic sanitization like limiting length, specific character stripping can be done here
  // if Zod's transformation is not sufficient or for non-Zod validated fields.
  // For now, Zod schema for specialRequests handles <>.
  return input.trim().substring(0, 500); 
};
