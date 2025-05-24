
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyConfig, detectUserCurrency, getCurrencyConfig } from '@/services/currencyService';

interface CurrencyContextType {
  currentCurrency: CurrencyConfig;
  setCurrency: (currency: CurrencyConfig) => void;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyConfig>(getCurrencyConfig('INR'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        // Check if user has a saved currency preference
        const savedCurrency = localStorage.getItem('preferredCurrency');
        if (savedCurrency) {
          setCurrentCurrency(getCurrencyConfig(savedCurrency));
        } else {
          // Detect currency based on location
          const detectedCurrency = await detectUserCurrency();
          setCurrentCurrency(detectedCurrency);
          localStorage.setItem('preferredCurrency', detectedCurrency.code);
        }
      } catch (error) {
        console.error('Error initializing currency:', error);
        // Fallback to INR
        setCurrentCurrency(getCurrencyConfig('INR'));
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();
  }, []);

  const setCurrency = (currency: CurrencyConfig) => {
    setCurrentCurrency(currency);
    localStorage.setItem('preferredCurrency', currency.code);
  };

  return (
    <CurrencyContext.Provider value={{ currentCurrency, setCurrency, isLoading }}>
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
