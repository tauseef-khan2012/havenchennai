
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Provider } from '@supabase/supabase-js';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailConfirmationNeeded, setEmailConfirmationNeeded] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
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

  const handleLogin = async ({ email, phone, password, countryCode }: { 
    email?: string; 
    phone?: string; 
    password: string;
    countryCode?: string;
  }) => {
    if ((email && !password) || (phone && !password)) {
      toast({
        title: "Error",
        description: "Please enter both email/phone and password.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (email) {
        await signIn(email, password);
      } else if (phone && countryCode) {
        const fullPhoneNumber = `${countryCode}${phone}`;
        await signInWithPhone(fullPhoneNumber, password);
      }
    } catch (error: any) {
      // Check if the error is related to email confirmation
      if (error.message === 'Email not confirmed') {
        setEmailConfirmationNeeded(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendConfirmation = async () => {
    // Use the email from the login form or a previously stored one
    const loginEmail = document.getElementById('login-email') as HTMLInputElement;
    const email = loginEmail?.value;
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    await resendConfirmationEmail(email);
  };

  const handleSignup = async ({ name, email, password, phone, countryCode }: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    countryCode?: string;
  }) => {
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
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
      if (phone && countryCode) {
        fullPhoneNumber = `${countryCode}${phone}`;
      }
      
      await signUp(email, password, name, fullPhoneNumber);
      
      // Set login form with the email they just registered with
      // and switch to login tab
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

  const handleResetPassword = async (email: string) => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await resetPassword(email);
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
                <CardContent>
                  <LoginForm 
                    onSubmit={handleLogin}
                    onResetPassword={() => setActiveTab('reset')}
                    onResendConfirmation={handleResendConfirmation}
                    isSubmitting={isSubmitting}
                    emailConfirmationNeeded={emailConfirmationNeeded}
                  />
                  
                  <SocialLoginButtons
                    onSocialLogin={handleSocialLogin}
                    isSubmitting={isSubmitting}
                  />
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
                <CardContent>
                  <SignupForm 
                    onSubmit={handleSignup}
                    isSubmitting={isSubmitting}
                  />
                </CardContent>
                <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
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
              </Card>
            </TabsContent>

            <TabsContent value="reset">
              <Card className="border-haven-green/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Reset Password</CardTitle>
                  <CardDescription>Enter your email to receive password reset instructions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordResetForm
                    onSubmit={handleResetPassword}
                    isSubmitting={isSubmitting}
                    resetSent={passwordResetSent}
                  />
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
