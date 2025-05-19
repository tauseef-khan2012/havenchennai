
/**
 * Generates a unique booking reference number.
 * Format: HAV-YYYYMMDD-XXXX where XXXX is a random 4-digit number
 */
export const generateBookingReference = (): string => {
  const today = new Date();
  const dateStr = today.getFullYear().toString() +
    (today.getMonth() + 1).toString().padStart(2, '0') +
    today.getDate().toString().padStart(2, '0');
  
  // Generate a random 4-digit number
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  
  return `HAV-${dateStr}-${randomPart}`;
};

/**
 * Calculates the number of nights between two dates
 */
export const calculateNights = (checkInDate: Date, checkOutDate: Date): number => {
  const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};

/**
 * Applies a discount to a price
 */
export const applyDiscount = (price: number, discountPercentage: number): number => {
  return price * (1 - discountPercentage / 100);
};

/**
 * Calculates tax amount based on a price
 */
export const calculateTax = (price: number, taxPercentage: number): number => {
  return price * (taxPercentage / 100);
};

/**
 * Formats a price with currency symbol
 */
export const formatPrice = (amount: number, currency: string): string => {
  const currencySymbols: Record<string, string> = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  };

  const symbol = currencySymbols[currency] || currency;
  
  return `${symbol}${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })}`;
};
