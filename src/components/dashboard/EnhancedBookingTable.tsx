
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { BookingDetailModal } from './BookingDetailModal';
import { BookingCancellationDialog } from './BookingCancellationDialog';
import { useBookingActions } from '@/hooks/useBookingActions';

interface EnhancedBookingTableProps {
  bookings: any[];
  type: 'stay' | 'experience';
  onBookingsUpdate: () => void;
}

export const EnhancedBookingTable: React.FC<EnhancedBookingTableProps> = ({
  bookings,
  type,
  onBookingsUpdate
}) => {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const { cancelStayBooking, cancelExperienceBooking, modifyBooking, isLoading } = useBookingActions();

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
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
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setShowCancellationDialog(true);
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!bookingToCancel) return;

    const result = type === 'stay' 
      ? await cancelStayBooking(bookingToCancel, reason)
      : await cancelExperienceBooking(bookingToCancel, reason);

    if (result.success) {
      setShowCancellationDialog(false);
      setBookingToCancel(null);
      onBookingsUpdate();
    }
  };

  const handleModify = (bookingId: string) => {
    modifyBooking(bookingId, type);
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No {type} bookings found.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{type === 'stay' ? 'Property' : 'Experience'}</TableHead>
              {type === 'stay' ? (
                <>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Guests</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Attendees</TableHead>
                </>
              )}
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  {type === 'stay' 
                    ? booking.properties?.name || 'N/A'
                    : booking.experience_instances?.experiences?.name || 'N/A'
                  }
                </TableCell>
                {type === 'stay' ? (
                  <>
                    <TableCell>{formatDate(booking.check_in_date)}</TableCell>
                    <TableCell>{formatDate(booking.check_out_date)}</TableCell>
                    <TableCell>{booking.number_of_guests}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{formatDate(booking.experience_instances?.date)}</TableCell>
                    <TableCell>{formatTime(booking.experience_instances?.time)}</TableCell>
                    <TableCell>{booking.number_of_attendees}</TableCell>
                  </>
                )}
                <TableCell>{getStatusBadge(booking.booking_status)}</TableCell>
                <TableCell>${booking.total_amount_due}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(booking)}
                    >
                      Details
                    </Button>
                    {(['upcoming', 'Confirmed', 'confirmed'].includes(booking.booking_status)) && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleModify(booking.id)}
                        >
                          Modify
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleCancelClick(booking.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BookingDetailModal
        booking={selectedBooking}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onCancel={handleCancelClick}
        onModify={handleModify}
        type={type}
      />

      <BookingCancellationDialog
        isOpen={showCancellationDialog}
        onClose={() => setShowCancellationDialog(false)}
        onConfirm={handleCancelConfirm}
        isLoading={isLoading}
        bookingType={type}
      />
    </>
  );
};
