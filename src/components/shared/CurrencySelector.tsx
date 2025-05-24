
import React from 'react';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrency, SUPPORTED_CURRENCIES } from '@/contexts/CurrencyContext';

export const CurrencySelector: React.FC = () => {
  const { currentCurrency, setCurrency } = useCurrency();

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
    if (currency) {
      setCurrency(currency);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-400" />
      <Select value={currentCurrency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-20 h-8 border-0 bg-transparent text-sm">
          <SelectValue>
            <span className="font-medium">{currentCurrency.code}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_CURRENCIES.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{currency.symbol}</span>
                <span>{currency.code}</span>
                <span className="text-gray-500">- {currency.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
