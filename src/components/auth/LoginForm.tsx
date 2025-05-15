
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { SelectCountry } from '@/components/auth/SelectCountry';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormProps {
  onSubmit: (data: { email?: string; phone?: string; password: string; countryCode?: string }) => Promise<void>;
  onResetPassword: () => void;
  onResendConfirmation: () => void;
  isSubmitting: boolean;
  emailConfirmationNeeded: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onResetPassword,
  onResendConfirmation,
  isSubmitting,
  emailConfirmationNeeded
}) => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'email') {
      await onSubmit({ email, password });
    } else {
      await onSubmit({ phone, password, countryCode });
    }
  };

  return (
    <div className="space-y-6">
      {emailConfirmationNeeded && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertDescription className="text-amber-700">
            Please confirm your email before logging in.
            <Button 
              variant="link" 
              className="p-0 h-auto font-normal hover:underline text-haven-green ml-1"
              onClick={onResendConfirmation}
              disabled={isSubmitting}
            >
              Resend confirmation email
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-2 mb-4">
        <Button 
          type="button" 
          variant={loginMethod === 'email' ? "default" : "outline"}
          className={`w-1/2 ${loginMethod === 'email' ? 'bg-haven-green hover:bg-haven-green/90' : ''}`}
          onClick={() => setLoginMethod('email')}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>
        <Button 
          type="button" 
          variant={loginMethod === 'phone' ? "default" : "outline"}
          className={`w-1/2 ${loginMethod === 'phone' ? 'bg-haven-green hover:bg-haven-green/90' : ''}`}
          onClick={() => setLoginMethod('phone')}
        >
          <Phone className="mr-2 h-4 w-4" />
          Phone
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {loginMethod === 'email' ? (
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                id="login-email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="login-phone">Phone Number</Label>
            <div className="flex space-x-2">
              <SelectCountry 
                value={countryCode} 
                onChange={setCountryCode}
                disabled={isSubmitting}
                className="w-24"
              />
              <div className="relative flex-grow">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  id="login-phone" 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="123456789"
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="login-password">Password</Label>
            <button 
              type="button" 
              onClick={onResetPassword}
              className="text-sm text-haven-green hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              id="login-password" 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-haven-green hover:bg-haven-green/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};
