
/**
 * Formats a currency amount with the given currency code
 * @param amount The amount to format
 * @param currencyCode The currency code (e.g. 'USD', 'INR')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formats a date to a readable string
 * @param date Date to format
 * @param format Format style ('short', 'medium', 'long', 'full')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string, 
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric'
  };
  
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Formats a date range to a readable string
 * @param startDate Start date
 * @param endDate End date
 * @param format Format style ('short', 'medium', 'long', 'full')
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startDate: Date | string, 
  endDate: Date | string,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string => {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  
  // If same year, don't repeat the year
  if (start.getFullYear() === end.getFullYear()) {
    const startOptions: Intl.DateTimeFormatOptions = {
      month: format === 'short' ? 'short' : 'long',
      day: 'numeric'
    };
    
    const endOptions: Intl.DateTimeFormatOptions = {
      month: format === 'short' ? 'short' : 'long',
      day: 'numeric',
      year: 'numeric'
    };
    
    return `${start.toLocaleDateString('en-US', startOptions)} - ${end.toLocaleDateString('en-US', endOptions)}`;
  }
  
  // Different years, show full dates
  return `${formatDate(start, format)} - ${formatDate(end, format)}`;
};
