
import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface TermsCheckboxProps {
  field: any;
  isSubmitting: boolean;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ field, isSubmitting }) => {
  return (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
          disabled={isSubmitting}
          id="accept-terms"
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel htmlFor="accept-terms" className="font-normal">
          I agree to the <Link to="#" className="text-haven-green hover:underline">Terms of Service</Link> and{" "}
          <Link to="#" className="text-haven-green hover:underline">Privacy Policy</Link>
        </FormLabel>
        <FormMessage />
      </div>
    </FormItem>
  );
};
