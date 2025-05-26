
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Users, Clock, Phone, Mail, Download, Share2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface BookingDetailModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onCancel: (bookingId: string) => void;
  onModify: (bookingId: string) => void;
  type: 'stay' | 'experience';
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose,
  onCancel,
  onModify,
  type
}) => {
  if (!booking) return null;

  const formatDate = (dateString: string) => {
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
      return format(date, 'PPP');
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const isPM = hour >= 12;
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${isPM ? 'PM' : 'AM'}`;
    } catch (error) {
      return timeString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'upcoming':
      case 'Confirmed':
      case 'confirmed':
        return <Badge className="bg-haven-green">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'Pending Payment':
      case 'pending_payment':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending Payment</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canCancel = ['Confirmed', 'confirmed', 'Pending Payment', 'pending_payment'].includes(booking.booking_status);
  const canModify = ['Confirmed', 'confirmed'].includes(booking.booking_status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {type === 'stay' ? 'Stay Booking Details' : 'Experience Booking Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Actions */}
          <div className="flex items-center justify-between">
            {getStatusBadge(booking.booking_status)}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Receipt
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Property/Experience Info */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">
                {type === 'stay' 
                  ? booking.properties?.name || 'Property Name'
                  : booking.experience_instances?.experiences?.name || 'Experience Name'
                }
              </h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span>Location details</span>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h4 className="font-semibold">Booking Information</h4>
              
              {type === 'stay' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Check-in</div>
                        <div className="font-medium">{formatDate(booking.check_in_date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Check-out</div>
                        <div className="font-medium">{formatDate(booking.check_out_date)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Guests</div>
                      <div className="font-medium">{booking.number_of_guests}</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="font-medium">{formatDate(booking.experience_instances?.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Time</div>
                        <div className="font-medium">{formatTime(booking.experience_instances?.time)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Attendees</div>
                      <div className="font-medium">{booking.number_of_attendees}</div>
                    </div>
                  </div>
                </>
              )}

              <div className="text-sm text-gray-500">Booking Reference</div>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">{booking.id}</div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h4 className="font-semibold">Payment Details</h4>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-semibold">${booking.total_amount_due}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Payment Status</span>
                <span>{booking.payment_status || 'Unpaid'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <h4 className="font-semibold">Need Help?</h4>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>support@haven.com</span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            {canModify && (
              <Button 
                variant="outline" 
                onClick={() => onModify(booking.id)}
                className="flex-1"
              >
                Modify Booking
              </Button>
            )}
            {canCancel && (
              <Button 
                variant="destructive" 
                onClick={() => onCancel(booking.id)}
                className="flex-1"
              >
                Cancel Booking
              </Button>
            )}
            <Button 
              variant="outline" 
              className="flex-1"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
