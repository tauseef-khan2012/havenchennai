
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import PaymentStatusBadge from './PaymentStatusBadge';
import { formatCurrency } from '@/utils/formatters';
import { PaymentStatus } from '@/types/booking';

interface PaymentDetailsProps {
  paymentId?: string;
  transactionId?: string;
  amount?: number;
  currency?: string;
  status?: PaymentStatus;
  paymentMethod?: string;
  paymentDate?: Date | string;
  paymentGateway?: string;
  bookingReference?: string;
  onDownload?: () => void;
}

export const PaymentReceipt = ({
  paymentId,
  transactionId,
  amount,
  currency = 'INR',
  status = 'Unpaid',
  paymentMethod,
  paymentDate,
  paymentGateway,
  bookingReference,
  onDownload,
}: PaymentDetailsProps) => {
  const formattedDate = paymentDate 
    ? typeof paymentDate === 'string' 
      ? format(new Date(paymentDate), 'PPP')
      : format(paymentDate, 'PPP')
    : 'Not processed';

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Payment Receipt</CardTitle>
        {onDownload && (
          <Button variant="outline" size="sm" onClick={onDownload} className="h-8">
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookingReference && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Booking Reference</span>
              <span className="font-medium">{bookingReference}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Payment Status</span>
            <PaymentStatusBadge status={status} />
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="font-medium">{formatCurrency(amount || 0, currency)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="font-medium">{formattedDate}</span>
          </div>
          
          <Separator />
          
          {paymentMethod && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Method</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>
          )}
          
          {paymentGateway && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Gateway</span>
              <span className="font-medium">{paymentGateway}</span>
            </div>
          )}
          
          {transactionId && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Transaction ID</span>
              <span className="font-medium text-xs truncate max-w-[180px]" title={transactionId}>
                {transactionId}
              </span>
            </div>
          )}
          
          {paymentId && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payment ID</span>
              <span className="font-medium text-xs truncate max-w-[180px]" title={paymentId}>
                {paymentId}
              </span>
            </div>
          )}
          
          {status === 'Paid' && (
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Full Invoice
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
