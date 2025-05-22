
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { PaymentStatus } from '@/types/booking';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status, className }) => {
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  
  switch (status) {
    case 'Paid':
    case 'Successful':
      variant = 'default'; // Green (default)
      break;
    case 'Partially Paid':
      variant = 'secondary'; // Orange
      break;
    case 'Failed':
      variant = 'destructive'; // Red
      break;
    case 'Unpaid':
    case 'Refunded':
    default:
      variant = 'outline'; // Gray
      break;
  }
  
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
};

export default PaymentStatusBadge;
