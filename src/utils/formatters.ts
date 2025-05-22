
import { format } from 'date-fns';

/**
 * Format a currency value
 * @param amount The amount to format
 * @param currency The currency code (default: INR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a date in a human-readable format
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return format(date, 'dd MMM yyyy');
};

/**
 * Format a date with time in a human-readable format
 * @param date The date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date): string => {
  return format(date, 'dd MMM yyyy, h:mm a');
};
