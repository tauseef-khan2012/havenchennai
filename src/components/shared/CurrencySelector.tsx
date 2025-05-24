
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getAvailableCurrencies } from '@/services/currencyService';

export const CurrencySelector: React.FC = () => {
  const { currentCurrency, setCurrency } = useCurrency();
  const currencies = getAvailableCurrencies();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {currentCurrency.symbol} {currentCurrency.code}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => setCurrency(currency)}
            className={currency.code === currentCurrency.code ? 'bg-gray-100' : ''}
          >
            <div className="flex justify-between items-center w-full">
              <span>{currency.symbol} {currency.code}</span>
              <span className="text-sm text-gray-500">{currency.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
