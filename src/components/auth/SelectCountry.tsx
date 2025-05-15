
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SelectCountryProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

type CountryCode = {
  code: string;
  name: string;
};

const countryCodes: CountryCode[] = [
  { code: '+1', name: 'US' },
  { code: '+44', name: 'UK' },
  { code: '+91', name: 'IN' },
  { code: '+61', name: 'AU' },
  { code: '+86', name: 'CN' },
  { code: '+49', name: 'DE' },
  { code: '+33', name: 'FR' },
  { code: '+81', name: 'JP' },
  { code: '+7', name: 'RU' },
  { code: '+971', name: 'AE' },
  { code: '+65', name: 'SG' },
  { code: '+55', name: 'BR' },
  { code: '+34', name: 'ES' },
  { code: '+39', name: 'IT' },
  { code: '+90', name: 'TR' },
];

export const SelectCountry: React.FC<SelectCountryProps> = ({
  value,
  onChange,
  disabled = false,
  className,
}) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-[110px]", className)}>
        <SelectValue placeholder="Country" />
      </SelectTrigger>
      <SelectContent>
        {countryCodes.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.code} {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
