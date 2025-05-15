
import React from 'react';
import { Button } from '@/components/ui/button';
import { Provider } from '@supabase/supabase-js';
import { Facebook } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { MicrosoftIcon } from '@/components/icons/MicrosoftIcon';

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: Provider) => Promise<void>;
  isSubmitting: boolean;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onSocialLogin,
  isSubmitting
}) => {
  return (
    <div className="space-y-4">
      <div className="relative flex items-center justify-center mt-6 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative px-4 text-sm bg-white text-gray-500">Or continue with</div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => onSocialLogin('google')}
          disabled={isSubmitting}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => onSocialLogin('facebook')}
          disabled={isSubmitting}
        >
          <Facebook className="mr-2 h-4 w-4" />
          Continue with Facebook
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => onSocialLogin('azure')}
          disabled={isSubmitting}
        >
          <MicrosoftIcon className="mr-2 h-4 w-4" />
          Continue with Microsoft
        </Button>
      </div>
    </div>
  );
};
