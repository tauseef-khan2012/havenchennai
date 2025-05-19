
import { useAuthLogin } from '@/hooks/auth/useAuthLogin';
import { useAuthSignup } from '@/hooks/auth/useAuthSignup';
import { useAuthVerification } from '@/hooks/auth/useAuthVerification';
import { useAuthSession } from '@/hooks/auth/useAuthSession';

export function useAuthActions(
  updateState: (state: any) => void,
  handleError: (error: any, title: string) => void,
  navigate: (path: string) => void,
  toast: any,
  refreshProfile: () => Promise<void>
) {
  const { signIn, signInWithProvider } = useAuthLogin(
    updateState,
    handleError,
    navigate,
    toast
  );

  const { signUp, resendConfirmationEmail } = useAuthSignup(
    updateState,
    handleError,
    toast
  );

  const { signInWithOtp, verifyOtp, resetPassword } = useAuthVerification(
    updateState,
    handleError,
    navigate,
    toast
  );

  const { signOut, refreshSession } = useAuthSession(
    updateState,
    handleError,
    navigate,
    toast
  );

  return {
    signIn,
    signInWithOtp,
    verifyOtp,
    signInWithProvider,
    signUp,
    signOut,
    resendConfirmationEmail,
    resetPassword,
    refreshSession
  };
}
