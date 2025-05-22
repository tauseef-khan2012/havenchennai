
import React from 'react';
import { User } from '@supabase/supabase-js';

interface AuthenticationNoticeProps {
  user: User | null;
}

const AuthenticationNotice: React.FC<AuthenticationNoticeProps> = ({ user }) => {
  if (user) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
      <p className="text-amber-800">
        <strong>Note:</strong> You need to be logged in to complete your booking. You'll be prompted to sign in before payment.
      </p>
    </div>
  );
};

export default AuthenticationNotice;
