
import React from 'react';
import { Input } from '@/components/ui/input';
import { Phone } from 'lucide-react';
import { FormControl, FormField, FormLabel } from '@/components/ui/form';
import { SelectCountry } from '@/components/auth/SelectCountry';

interface PhoneInputGroupProps {
  form: any;
  isSubmitting: boolean;
}

export const PhoneInputGroup: React.FC<PhoneInputGroupProps> = ({ form, isSubmitting }) => {
  return (
    <div className="space-y-2">
      <FormLabel htmlFor="signup-phone">Phone Number (Optional)</FormLabel>
      <div className="flex space-x-2">
        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <SelectCountry 
              value={field.value || '+1'} 
              onChange={field.onChange}
              disabled={isSubmitting}
              className="w-24"
            />
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <div className="relative flex-grow">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <FormControl>
                <Input 
                  id="signup-phone" 
                  type="tel" 
                  placeholder="123456789 (Optional)"
                  className="pl-10"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
            </div>
          )}
        />
      </div>
    </div>
  );
};
