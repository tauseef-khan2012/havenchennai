import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { SelectCountry } from '@/components/auth/SelectCountry';
import { SignUpCredentials } from '@/types/auth';

interface SignupFormProps {
  onSubmit: (credentials: SignUpCredentials) => Promise<void>;
  isSubmitting: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  isSubmitting
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      email,
      password,
      fullName: name,
      phoneNumber: phone ? `${countryCode}${phone}` : undefined
    });
  };

  const passwordStrength = !password 
    ? 0 
    : password.length < 6 
      ? 1 
      : password.length < 10 
        ? 2 
        : 3;

  const passwordStrengthText = !password 
    ? 'Enter a password' 
    : password.length < 6 
      ? 'Password is too weak' 
      : password.length < 10 
        ? 'Password is good' 
        : 'Password is strong';

  const passwordMatch = !confirmPassword || password === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <div className="relative">
          <Input 
            id="signup-name" 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            id="signup-email" 
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
      <div className="space-y-2">
        <Label htmlFor="signup-phone">Phone Number (Optional)</Label>
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
              id="signup-phone" 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="123456789 (Optional)"
              className="pl-10"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            id="signup-password" 
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
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden mt-1">
          <div 
            className={`h-full ${
              !password 
                ? 'w-0' 
                : passwordStrength === 1
                  ? 'w-1/4 bg-red-500' 
                  : passwordStrength === 2
                    ? 'w-2/4 bg-yellow-500' 
                    : 'w-full bg-green-500'
            }`}
          ></div>
        </div>
        <p className="text-xs text-gray-500">{passwordStrengthText}</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            id="signup-confirm-password" 
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 pr-10"
            required
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {confirmPassword && !passwordMatch && (
          <p className="text-xs text-red-500">Passwords do not match</p>
        )}
      </div>
      <Button 
        type="submit" 
        className="w-full bg-haven-green hover:bg-haven-green/90"
        disabled={isSubmitting || !passwordMatch || password.length < 6}
      >
        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
      </Button>
      <p className="text-sm text-gray-600 text-center">
        By signing up, you agree to our <Link to="#" className="text-haven-green hover:underline">Terms of Service</Link> and <Link to="#" className="text-haven-green hover:underline">Privacy Policy</Link>.
      </p>
    </form>
  );
};
