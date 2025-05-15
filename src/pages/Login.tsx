
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, Phone, Eye, EyeOff, Google, Facebook, Microsoft } from 'lucide-react';
import { SelectCountry } from '@/components/auth/SelectCountry';
import { Provider } from '@supabase/supabase-js';

const Login = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCountryCode, setSignupCountryCode] = useState('+1');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false);
  const { toast } = useToast();
  const { 
    user, 
    signIn, 
    signInWithPhone,
    signInWithProvider, 
    signUp, 
    resendConfirmationEmail,
    resetPassword 
  } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'email') {
      if (!loginEmail || !loginPassword) {
        toast({
          title: "Error",
          description: "Please enter both email and password.",
          variant: "destructive"
        });
        return;
      }
    } else {
      if (!loginPhone || !loginPassword) {
        toast({
          title: "Error",
          description: "Please enter both phone number and password.",
          variant: "destructive"
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      if (loginMethod === 'email') {
        await signIn(loginEmail, loginPassword);
      } else {
        const fullPhoneNumber = `${countryCode}${loginPhone}`;
        await signInWithPhone(fullPhoneNumber, loginPassword);
      }
    } catch (error: any) {
      // Check if the error is related to email confirmation
      if (error.message === 'Email not confirmed') {
        setEmailConfirmationNeeded(true);
      }
      // Error handling is done in signIn function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!loginEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    await resendConfirmationEmail(loginEmail);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      let fullPhoneNumber = undefined;
      if (signupPhone) {
        fullPhoneNumber = `${signupCountryCode}${signupPhone}`;
      }
      
      await signUp(signupEmail, signupPassword, signupName, fullPhoneNumber);
      
      // Reset form and switch to login tab
      setSignupName('');
      setSignupEmail('');
      setSignupPhone('');
      setSignupPassword('');
      setSignupConfirmPassword('');
      
      // Set login form with the email they just registered with
      setLoginEmail(signupEmail);
      setActiveTab('login');
      // Show email confirmation alert
      setEmailConfirmationNeeded(true);
    } catch (error) {
      // Error handling is done in signUp function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: Provider) => {
    try {
      await signInWithProvider(provider);
    } catch (error) {
      // Error handling is done in signInWithProvider function
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await resetPassword(resetEmail);
      setPasswordResetSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="py-16 bg-haven-beige bg-opacity-10 min-h-screen" 
        style={{
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('/lovable-uploads/e4f31ab2-de64-417b-af9f-97d3d17e2f47.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}>
        <div className="container-custom max-w-md">
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="reset">Reset Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-haven-green/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Welcome Back</CardTitle>
                  <CardDescription>Log in to manage your bookings and experiences.</CardDescription>
                </CardHeader>
                {emailConfirmationNeeded && (
                  <div className="px-6">
                    <Alert className="mb-4 bg-amber-50 border-amber-200">
                      <AlertDescription className="text-amber-700">
                        Please confirm your email before logging in.
                        <Button 
                          variant="link" 
                          className="p-0 h-auto font-normal hover:underline text-haven-green ml-1"
                          onClick={handleResendConfirmation}
                          disabled={isSubmitting}
                        >
                          Resend confirmation email
                        </Button>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <CardContent className="space-y-6">
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

                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginMethod === 'email' ? (
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input 
                            id="login-email" 
                            type="email" 
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
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
                              value={loginPhone}
                              onChange={(e) => setLoginPhone(e.target.value)}
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
                          onClick={() => setActiveTab('reset')}
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
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
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
                      onClick={() => handleSocialLogin('google')}
                      disabled={isSubmitting}
                    >
                      <Google className="mr-2 h-4 w-4" />
                      Continue with Google
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleSocialLogin('facebook')}
                      disabled={isSubmitting}
                    >
                      <Facebook className="mr-2 h-4 w-4" />
                      Continue with Facebook
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleSocialLogin('azure')}
                      disabled={isSubmitting}
                    >
                      <Microsoft className="mr-2 h-4 w-4" />
                      Continue with Microsoft
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <button 
                      onClick={() => setActiveTab('signup')} 
                      className="text-haven-green font-medium hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card className="border-haven-green/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Create an Account</CardTitle>
                  <CardDescription>Sign up to book stays and experiences at Haven.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <Input 
                          id="signup-name" 
                          type="text" 
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
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
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
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
                          value={signupCountryCode} 
                          onChange={setSignupCountryCode}
                          disabled={isSubmitting}
                          className="w-24"
                        />
                        <div className="relative flex-grow">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <Input 
                            id="signup-phone" 
                            type="tel" 
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
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
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
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
                            !signupPassword 
                              ? 'w-0' 
                              : signupPassword.length < 6 
                                ? 'w-1/4 bg-red-500' 
                                : signupPassword.length < 10 
                                  ? 'w-2/4 bg-yellow-500' 
                                  : 'w-full bg-green-500'
                          }`}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {!signupPassword 
                          ? 'Enter a password' 
                          : signupPassword.length < 6 
                            ? 'Password is too weak' 
                            : signupPassword.length < 10 
                              ? 'Password is good' 
                              : 'Password is strong'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input 
                          id="signup-confirm-password" 
                          type={showConfirmPassword ? "text" : "password"}
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
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
                      {signupConfirmPassword && signupPassword !== signupConfirmPassword && (
                        <p className="text-xs text-red-500">Passwords do not match</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-haven-green hover:bg-haven-green/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                    <p className="text-sm text-gray-600 text-center">
                      By signing up, you agree to our <Link to="#" className="text-haven-green hover:underline">Terms of Service</Link> and <Link to="#" className="text-haven-green hover:underline">Privacy Policy</Link>.
                    </p>
                    <p className="text-sm text-gray-600 text-center">
                      Already have an account?{" "}
                      <button 
                        type="button"
                        onClick={() => setActiveTab('login')} 
                        className="text-haven-green font-medium hover:underline"
                      >
                        Log In
                      </button>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="reset">
              <Card className="border-haven-green/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Reset Password</CardTitle>
                  <CardDescription>Enter your email to receive password reset instructions.</CardDescription>
                </CardHeader>
                <form onSubmit={handleResetPassword}>
                  <CardContent className="space-y-4">
                    {passwordResetSent ? (
                      <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-green-700">
                          If an account with that email exists, you will receive a password reset link shortly. 
                          Please check your inbox and follow the instructions to reset your password.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <Input 
                              id="reset-email" 
                              type="email" 
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              placeholder="your.email@example.com"
                              className="pl-10"
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-haven-green hover:bg-haven-green/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                        </Button>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-600">
                      Remember your password?{" "}
                      <button 
                        type="button"
                        onClick={() => setActiveTab('login')} 
                        className="text-haven-green font-medium hover:underline"
                      >
                        Log In
                      </button>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
