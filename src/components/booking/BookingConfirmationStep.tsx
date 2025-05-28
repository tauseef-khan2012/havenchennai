
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone,
  Download,
  Share2,
  Star
} from 'lucide-react';

interface BookingConfirmationStepProps {
  bookingReference: string;
  onViewBookings: () => void;
}

export const BookingConfirmationStep: React.FC<BookingConfirmationStepProps> = ({
  bookingReference,
  onViewBookings
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-900 mb-2">Booking Confirmed!</h1>
          <p className="text-green-700 text-lg">Your lakeside retreat is secured</p>
          <Badge variant="secondary" className="mt-4 bg-green-100 text-green-800 px-4 py-2 text-lg">
            {bookingReference}
          </Badge>
        </CardContent>
      </Card>

      {/* What's Next */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-gray-600">Check your inbox for booking details and receipt</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Check-in Instructions</p>
                  <p className="text-sm text-gray-600">Receive detailed instructions 24 hours before arrival</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Enjoy Your Stay</p>
                  <p className="text-sm text-gray-600">Relax and enjoy your lakeside experience</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-green-600" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="font-medium">24/7 Support</p>
                <p className="text-sm text-gray-600">+91 98765 43210</p>
              </div>
              
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-gray-600">support@haven.com</p>
              </div>
              
              <div>
                <p className="font-medium">Emergency Contact</p>
                <p className="text-sm text-gray-600">Property manager available 24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Booking
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Add to Calendar
            </Button>
            
            <Button onClick={onViewBookings} className="bg-haven-teal hover:bg-haven-teal/90">
              View All Bookings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add to Calendar & Directions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Calendar Reminder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Don't forget your lakeside getaway! Add this booking to your calendar.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                📅 Add to Google Calendar
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                📅 Add to Apple Calendar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Location & Directions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Get directions to your lakeside accommodation.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                🗺️ Open in Google Maps
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                🧭 Get Directions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Request */}
      <Card className="bg-gradient-to-r from-haven-teal/10 to-blue-50">
        <CardContent className="p-6 text-center">
          <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold mb-2">We'd Love Your Feedback</h3>
          <p className="text-gray-600 mb-4">
            After your stay, please share your experience to help us improve and assist future guests.
          </p>
          <Button variant="outline">
            Leave a Review (After Your Stay)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
