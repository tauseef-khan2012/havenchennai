
export const getDetailedErrorMessage = (error: any): string => {
  console.error('Booking creation error details:', {
    error,
    message: error?.message,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    stack: error?.stack
  });

  // Handle Supabase specific errors
  if (error?.message?.includes('row-level security policy')) {
    return 'Security policy violation. Please contact support if this persists.';
  }
  
  if (error?.message?.includes('violates foreign key constraint')) {
    return 'Invalid property or booking data. Please refresh the page and try again.';
  }
  
  if (error?.message?.includes('duplicate key value violates unique constraint')) {
    return 'A booking with this reference already exists. Please try again.';
  }
  
  if (error?.message?.includes('invalid input syntax')) {
    return 'Invalid booking data format. Please check your information and try again.';
  }
  
  if (error?.message?.includes('connection') || error?.message?.includes('network')) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  
  if (error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again in a few moments.';
  }
  
  // Handle validation errors
  if (error?.message?.includes('validation')) {
    return `Validation error: ${error.message}`;
  }
  
  // Return the original error message if it's user-friendly, otherwise a generic message
  const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
  
  // If error message seems technical, provide a user-friendly version
  if (errorMessage.includes('function') || errorMessage.includes('undefined') || errorMessage.includes('null')) {
    return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
  }
  
  return errorMessage;
};
