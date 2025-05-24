
import { supabase } from '@/integrations/supabase/client';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Rate to INR
  locale: string;
  decimalPlaces: number;
}

export interface LocationCurrency {
  country: string;
  currency: CurrencyConfig;
}

// Default currency configurations
const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    exchangeRate: 1,
    locale: 'en-IN',
    decimalPlaces: 0
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRate: 0.012, // 1 INR = 0.012 USD (approximate)
    locale: 'en-US',
    decimalPlaces: 2
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    exchangeRate: 0.011, // 1 INR = 0.011 EUR (approximate)
    locale: 'en-EU',
    decimalPlaces: 2
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    exchangeRate: 0.0095, // 1 INR = 0.0095 GBP (approximate)
    locale: 'en-GB',
    decimalPlaces: 2
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    exchangeRate: 0.018, // 1 INR = 0.018 AUD (approximate)
    locale: 'en-AU',
    decimalPlaces: 2
  }
};

// Country to currency mapping
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  'IN': 'INR',
  'US': 'USD',
  'GB': 'GBP',
  'AU': 'AUD',
  'DE': 'EUR',
  'FR': 'EUR',
  'IT': 'EUR',
  'ES': 'EUR',
  'NL': 'EUR',
  'CA': 'USD', // Could be CAD but USD is widely accepted
  'SG': 'USD', // Singapore often uses USD for tourism
  'AE': 'USD', // UAE often uses USD for tourism
};

/**
 * Detects user's location and returns appropriate currency
 */
export const detectUserCurrency = async (): Promise<CurrencyConfig> => {
  try {
    // Try to get location from browser API
    if ('geolocation' in navigator) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          enableHighAccuracy: false
        });
      });

      // Use a geolocation API to get country code
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
      );
      
      if (response.ok) {
        const data = await response.json();
        const countryCode = data.countryCode;
        const currencyCode = COUNTRY_CURRENCY_MAP[countryCode] || 'INR';
        return CURRENCY_CONFIGS[currencyCode];
      }
    }
  } catch (error) {
    console.log('Could not detect location, using IP-based detection');
  }

  try {
    // Fallback to IP-based detection
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      const countryCode = data.country_code;
      const currencyCode = COUNTRY_CURRENCY_MAP[countryCode] || 'INR';
      return CURRENCY_CONFIGS[currencyCode];
    }
  } catch (error) {
    console.log('Could not detect currency from IP, defaulting to INR');
  }

  // Default to INR
  return CURRENCY_CONFIGS.INR;
};

/**
 * Converts amount from INR to target currency
 */
export const convertFromINR = (amountINR: number, targetCurrency: CurrencyConfig): number => {
  return amountINR * targetCurrency.exchangeRate;
};

/**
 * Converts amount from any currency to INR
 */
export const convertToINR = (amount: number, fromCurrency: CurrencyConfig): number => {
  return amount / fromCurrency.exchangeRate;
};

/**
 * Formats currency amount according to locale and currency rules
 */
export const formatCurrency = (amount: number, currency: CurrencyConfig): string => {
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  }).format(amount);
};

/**
 * Get currency configuration by code
 */
export const getCurrencyConfig = (currencyCode: string): CurrencyConfig => {
  return CURRENCY_CONFIGS[currencyCode] || CURRENCY_CONFIGS.INR;
};

/**
 * Get all available currencies
 */
export const getAvailableCurrencies = (): CurrencyConfig[] => {
  return Object.values(CURRENCY_CONFIGS);
};

/**
 * Updates exchange rates from external API (for real-time rates)
 */
export const updateExchangeRates = async (): Promise<void> => {
  try {
    // In production, you'd use a real exchange rate API
    // For now, we'll use static rates
    console.log('Exchange rates updated (static rates for demo)');
  } catch (error) {
    console.error('Failed to update exchange rates:', error);
  }
};
