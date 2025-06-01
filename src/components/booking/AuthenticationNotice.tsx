
import React from 'react';
import { User } from '@supabase/supabase-js';

interface AuthenticationNoticeProps {
  user: User | null;
}

const AuthenticationNotice: React.FC<AuthenticationNoticeProps> = ({ user }) => {
  // Component is disabled - guest bookings are now fully supported
  // No authentication notice should be shown
  return null;
};

export default AuthenticationNotice;
