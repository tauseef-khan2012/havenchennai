
import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const calculatePasswordStrength = (password: string): { score: number; text: string; issues: string[] } => {
  if (!password) return { score: 0, text: 'Enter a password', issues: [] };
  
  const issues: string[] = [];
  let score = 0;
  
  // Check length
  if (password.length < 8) {
    issues.push('At least 8 characters');
  } else {
    score += 1;
  }
  
  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    issues.push('One uppercase letter');
  } else {
    score += 1;
  }
  
  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    issues.push('One lowercase letter');
  } else {
    score += 1;
  }
  
  // Check for numbers
  if (!/[0-9]/.test(password)) {
    issues.push('One number');
  } else {
    score += 1;
  }
  
  // Check for special characters
  if (!/[^A-Za-z0-9]/.test(password)) {
    issues.push('One special character');
  } else {
    score += 1;
  }
  
  // Common password patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'abc123', 'letmein'];
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    score = Math.max(0, score - 2);
    issues.push('Avoid common passwords');
  }
  
  const strengthText = score === 0 ? 'Too weak' 
    : score <= 2 ? 'Weak' 
    : score <= 3 ? 'Fair' 
    : score === 4 ? 'Good' 
    : 'Strong';
  
  return { score, text: strengthText, issues };
};

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const { score, text, issues } = calculatePasswordStrength(password);

  const getColorClass = () => {
    if (score === 0) return 'w-0';
    if (score <= 2) return 'w-2/5 bg-red-500';
    if (score === 3) return 'w-3/5 bg-yellow-500';
    if (score === 4) return 'w-4/5 bg-blue-500';
    return 'w-full bg-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getColorClass()}`}
        ></div>
      </div>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Password strength: <span className={score <= 2 ? 'text-destructive' : score === 3 ? 'text-yellow-600' : 'text-green-600'}>{text}</span>
        </p>
        {issues.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Need: {issues.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};
