
import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
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

  return (
    <>
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
    </>
  );
};
