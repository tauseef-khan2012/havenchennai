
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PaymentStatus } from '@/types/booking';
import { CheckCircle, XCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
  showIcon?: boolean;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, className, showIcon = true }) => {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  let icon = null;
  
  switch (status) {
    case 'Paid':
    case 'Successful':
      variant = 'default'; // Green (default)
      icon = <CheckCircle className="h-3.5 w-3.5 mr-1" />;
      break;
    case 'Partially Paid':
      variant = 'secondary'; // Orange
      icon = <AlertCircle className="h-3.5 w-3.5 mr-1" />;
      break;
    case 'Failed':
      variant = 'destructive'; // Red
      icon = <XCircle className="h-3.5 w-3.5 mr-1" />;
      break;
    case 'Unpaid':
      variant = 'outline'; // Gray
      icon = <Clock className="h-3.5 w-3.5 mr-1" />;
      break;
    case 'Refunded':
      variant = 'outline'; // Gray
      icon = <RefreshCw className="h-3.5 w-3.5 mr-1" />;
      break;
    default:
      variant = 'outline'; // Gray
      icon = <Clock className="h-3.5 w-3.5 mr-1" />;
      break;
  }
  
  return (
    <Badge variant={variant} className={`flex items-center ${className || ''}`}>
      {showIcon && icon}
      {status}
    </Badge>
  );
};

export default PaymentStatusBadge;
