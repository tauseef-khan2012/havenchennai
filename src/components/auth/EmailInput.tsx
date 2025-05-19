
import React from 'react';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { FormControl } from '@/components/ui/form';

interface EmailInputProps {
  id: string;
  field: any;
  disabled: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({ id, field, disabled }) => {
  return (
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <FormControl>
        <Input 
          id={id} 
          type="email" 
          placeholder="your.email@example.com"
          className="pl-10"
          {...field}
          disabled={disabled}
        />
      </FormControl>
    </div>
  );
};
