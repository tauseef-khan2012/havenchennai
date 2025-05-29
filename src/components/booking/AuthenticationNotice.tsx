
import React from 'react';
import { User } from '@supabase/supabase-js';

interface AuthenticationNoticeProps {
  user: User | null;
}

const AuthenticationNotice: React.FC<AuthenticationNoticeProps> = ({ user }) => {
  // Component no longer needed - guest bookings are now supported
  return null;
};

export default AuthenticationNotice;
