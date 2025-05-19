
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { FormControl } from '@/components/ui/form';

interface PasswordInputProps {
  id: string;
  field: any;
  disabled: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ id, field, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <FormControl>
        <Input 
          id={id} 
          type={showPassword ? "text" : "password"}
          className="pl-10 pr-10"
          {...field}
          disabled={disabled}
        />
      </FormControl>
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};
