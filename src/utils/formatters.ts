
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

/**
 * Format a date range in a human-readable format
 * @param startDate The start date
 * @param endDate The end date
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${format(startDate, 'dd MMM')} - ${format(endDate, 'dd MMM yyyy')}`;
};

/**
 * Get the number of nights between two dates
 * @param startDate Check-in date
 * @param endDate Check-out date
 * @returns Number of nights
 */
export const getNights = (startDate: Date, endDate: Date): number => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Choose appropriate image based on network connection
 * @param highResUrl High resolution image URL
 * @param lowResUrl Low resolution image URL
 * @returns The appropriate image URL based on connection speed
 */
export const getNetworkAwareImageUrl = (highResUrl: string, lowResUrl: string): string => {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection && connection.downlink < 1) {
      return lowResUrl;
    }
  }
  return highResUrl;
};
