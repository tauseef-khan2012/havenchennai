
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, LogIn } from 'lucide-react';
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
  const { user, signInWithGoogle, signInWithEmail } = useAuth();
  const { toast } = useToast();
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      await signInWithGoogle();
      toast({
        title: "Signed in successfully",
        description: "Your profile information has been loaded.",
      });
      setShowLogin(false);
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please try again or continue as guest.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailSignIn = async () => {
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoggingIn(true);
      await signInWithEmail(loginEmail, loginPassword);
      toast({
        title: "Signed in successfully",
        description: "Your profile information has been loaded.",
      });
      setShowLogin(false);
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Invalid email or password. Try again or continue as guest.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Auto-fill contact info when user logs in
  React.useEffect(() => {
    if (user) {
      onContactInfoChange({
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || contactInfo.phone
      });
    }
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {user ? (
            <>
              <User className="h-5 w-5 text-green-600" />
              Welcome back, {user.user_metadata?.full_name || user.email}
            </>
          ) : (
            <>
              <Mail className="h-5 w-5 text-haven-teal" />
              Contact Information
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!user && !showLogin && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Have a Haven account?</p>
                <p className="text-sm text-blue-700">Sign in to use your saved details and earn rewards</p>
              </div>
              <Button
                onClick={() => setShowLogin(true)}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Button>
            </div>
          </div>
        )}

        {!user && showLogin && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Sign in to your account</h4>
              <Button
                onClick={() => setShowLogin(false)}
                variant="ghost"
                size="sm"
              >
                Continue as guest
              </Button>
            </div>
            
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="w-full"
              variant="outline"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoggingIn ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-gray-50 px-2 text-sm text-gray-500">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <Button
                onClick={handleEmailSignIn}
                disabled={isLoggingIn}
                className="w-full bg-haven-teal hover:bg-haven-teal/90"
              >
                {isLoggingIn ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-600">
              Don't have an account? You can sign up during checkout for a 5% discount!
            </p>
          </div>
        )}

        {(!user || showLogin) && (
          <>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={contactInfo.fullName}
                  onChange={(e) => onFieldChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => onFieldChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => onFieldChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </>
        )}

        {user && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Name:</span>
                <span className="text-sm text-green-700">{contactInfo.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Email:</span>
                <span className="text-sm text-green-700">{contactInfo.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">Phone:</span>
                <span className="text-sm text-green-700">{contactInfo.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
