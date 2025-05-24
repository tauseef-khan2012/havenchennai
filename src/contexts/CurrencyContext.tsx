
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (amount: number, fromCurrency?: string) => number;
  formatPrice: (amount: number, fromCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates (INR as base)
const EXCHANGE_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.012, // 1 INR = 0.012 USD
  EUR: 0.011, // 1 INR = 0.011 EUR
  GBP: 0.0095, // 1 INR = 0.0095 GBP
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(SUPPORTED_CURRENCIES[0]);

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      const currency = SUPPORTED_CURRENCIES.find(c => c.code === savedCurrency);
      if (currency) {
        setCurrentCurrency(currency);
      }
    }
  }, []);

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    localStorage.setItem('selectedCurrency', currency.code);
  };

  const convertPrice = (amount: number, fromCurrency: string = 'INR'): number => {
    // Convert from source currency to INR, then to target currency
    const inrAmount = amount / EXCHANGE_RATES[fromCurrency];
    return inrAmount * EXCHANGE_RATES[currentCurrency.code];
  };

  const formatPrice = (amount: number, fromCurrency: string = 'INR'): string => {
    const convertedAmount = convertPrice(amount, fromCurrency);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(convertedAmount);
  };

  return (
    <CurrencyContext.Provider value={{
      currentCurrency,
      setCurrency,
      convertPrice,
      formatPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
