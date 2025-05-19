
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginLayout } from '@/components/auth/LoginLayout';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { LoginTabContent } from '@/components/auth/LoginTabContent';
import { SignupTabContent } from '@/components/auth/SignupTabContent';
import { ResetPasswordTabContent } from '@/components/auth/ResetPasswordTabContent';
import { useAuthForms } from '@/hooks/useAuthForms';

const Login = () => {
  const { user } = useAuth();
  const {
    activeTab,
    isSubmitting,
    emailConfirmationNeeded,
    passwordResetSent,
    handleTabChange,
    handleLogin,
    handleSendOtp,
    handleVerifyOtp,
    handleResendConfirmation,
    handleSignup,
    handleSocialLogin,
    handleResetPassword
  } = useAuthForms();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Using wrapper functions to convert Promise<boolean> to Promise<void>
  const handleVerifyOtpWrapper = async (phone: string, otp: string): Promise<void> => {
    await handleVerifyOtp(phone, otp);
  };
  
  const handleResetPasswordWrapper = async (email: string): Promise<void> => {
    await handleResetPassword(email);
  };

  return (
    <LoginLayout>
      <AuthTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        loginTab={
          <LoginTabContent
            onLogin={handleLogin}
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtpWrapper}
            onSocialLogin={handleSocialLogin}
            onResetPassword={() => handleTabChange('reset')}
            onResendConfirmation={handleResendConfirmation}
            onSignUp={() => handleTabChange('signup')}
            isSubmitting={isSubmitting}
            emailConfirmationNeeded={emailConfirmationNeeded}
          />
        }
        signupTab={
          <SignupTabContent
            onSignup={handleSignup}
            onLogin={() => handleTabChange('login')}
            isSubmitting={isSubmitting}
          />
        }
        resetPasswordTab={
          <ResetPasswordTabContent
            onResetPassword={handleResetPasswordWrapper}
            onLogin={() => handleTabChange('login')}
            isSubmitting={isSubmitting}
            resetSent={passwordResetSent}
          />
        }
      />
    </LoginLayout>
  );
};

export default Login;
