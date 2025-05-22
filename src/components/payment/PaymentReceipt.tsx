
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PaymentRecord } from '@/types/booking';

interface PaymentReceiptProps {
  payment: PaymentRecord;
  showBookingDetails?: boolean;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ 
  payment,
  showBookingDetails = true
}) => {
  // Format date from ISO string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-serif">Payment Receipt</CardTitle>
        <PaymentStatusBadge status={payment.paymentStatus} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Transaction ID</p>
            <p className="font-medium">{payment.transactionId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-medium">
              {payment.amount} {payment.currency}
            </p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Payment Method</p>
          <p className="font-medium">{payment.paymentMethod || 'Not specified'}</p>
        </div>
        
        {showBookingDetails && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-medium">{payment.bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booking Type</p>
                <p className="font-medium capitalize">{payment.bookingType}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentReceipt;
