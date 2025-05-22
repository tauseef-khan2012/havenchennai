
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { CreditCard, Landmark, Wallet } from 'lucide-react';

export type PaymentMethod = 'card' | 'netbanking' | 'wallet' | 'upi';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelect
}) => {
  const handleChange = (value: string) => {
    onSelect(value as PaymentMethod);
  };

  return (
    <RadioGroup value={selectedMethod} onValueChange={handleChange} className="space-y-3">
      <div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Credit/Debit Card
          </Label>
        </div>
      </div>
      
      <div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="netbanking" id="netbanking" />
          <Label htmlFor="netbanking" className="flex items-center">
            <Landmark className="h-4 w-4 mr-2" />
            Net Banking
          </Label>
        </div>
      </div>
      
      <div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="wallet" id="wallet" />
          <Label htmlFor="wallet" className="flex items-center">
            <Wallet className="h-4 w-4 mr-2" />
            Wallet
          </Label>
        </div>
      </div>
      
      <div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="upi" id="upi" />
          <Label htmlFor="upi" className="flex items-center">
            <svg 
              className="h-4 w-4 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            UPI
          </Label>
        </div>
      </div>
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
