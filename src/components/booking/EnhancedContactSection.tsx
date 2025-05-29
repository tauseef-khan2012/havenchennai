
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
}

interface EnhancedContactSectionProps {
  contactInfo: ContactInfo;
  onContactInfoChange: (info: ContactInfo) => void;
  errors: Record<string, string>;
  onFieldChange: (field: keyof ContactInfo, value: string) => void;
}

export const EnhancedContactSection: React.FC<EnhancedContactSectionProps> = ({
  contactInfo,
  onContactInfoChange,
  errors,
  onFieldChange
}) => {
  const { user, signUp, signIn } = useAuth();
  const { toast } = useToast();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', fullName: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await signIn({ email: loginData.email, password: loginData.password });
      setShowLoginForm(false);
      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Please check your credentials.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!signupData.email || !signupData.password || !signupData.fullName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        email: signupData.email,
        password: signupData.password,
        fullName: signupData.fullName,
        acceptTerms: true
      });
      setShowSignupForm(false);
      toast({
        title: "Welcome to Haven!",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is logged in, auto-fill their information
  React.useEffect(() => {
    if (user && user.user_metadata) {
      const newContactInfo = {
        fullName: user.user_metadata.full_name || contactInfo.fullName,
        email: user.email || contactInfo.email,
        phone: user.user_metadata.phone_number || contactInfo.phone
      };
      onContactInfoChange(newContactInfo);
    }
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-haven-teal" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user ? (
          // User is logged in - show their info
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Signed in as {user.email}</span>
            </div>
            <p className="text-sm text-green-600">
              Your contact information will be automatically used for this booking.
            </p>
          </div>
        ) : (
          // User not logged in - show login/signup options or manual entry
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Sign in for faster checkout</h4>
              <p className="text-sm text-blue-700 mb-3">
                Already have an account? Sign in to use your saved information.
              </p>
              
              {!showLoginForm && !showSignupForm ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowLoginForm(true)}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setShowSignupForm(true)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Create Account
                  </Button>
                </div>
              ) : showLoginForm ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleLogin}
                      disabled={isLoading}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                    <Button
                      onClick={() => setShowLoginForm(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      placeholder="Full Name"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                      type="password"
                      placeholder="Create Password"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSignup}
                      disabled={isLoading}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    <Button
                      onClick={() => setShowSignupForm(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Separator />
            
            <div>
              <h4 className="font-medium mb-3">Or continue as guest</h4>
              <p className="text-sm text-gray-600 mb-4">
                Enter your contact information below to proceed with your booking.
              </p>
            </div>
          </div>
        )}

        {/* Contact Information Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={contactInfo.fullName}
                onChange={(e) => onFieldChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className={errors.fullName ? 'border-red-500' : ''}
                disabled={!!user}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                placeholder="Enter your email address"
                className={errors.email ? 'border-red-500' : ''}
                disabled={!!user}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => onFieldChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className={errors.phone ? 'border-red-500' : ''}
                disabled={!!user}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {!user && (
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <strong>Booking as guest:</strong> You'll receive confirmation and booking details via email. 
            You can create an account later to manage your bookings easily.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
