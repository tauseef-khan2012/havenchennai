
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const BookingConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingReference = searchParams.get('reference');
  const status = searchParams.get('status') || 'success';

  return (
    <>
      <Navbar />
      <main className="py-16">
        <div className="container-custom max-w-3xl">
          <Card className="bg-white shadow-md overflow-hidden">
            <CardHeader className={`py-6 ${status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
              <CardTitle className="text-2xl font-serif text-center">
                {status === 'success' ? 'Booking Confirmed!' : 'Booking Failed'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {status === 'success' ? (
                <>
                  <div className="flex justify-center">
                    <div className="rounded-full bg-green-100 p-4">
                      <svg 
                        className="h-12 w-12 text-green-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-medium">Thank you for your booking!</h2>
                    <p className="text-gray-600 mt-2">
                      Your booking reference is: <span className="font-bold">{bookingReference}</span>
                    </p>
                    <p className="text-gray-600 mt-1">
                      We've sent a confirmation email with all the details.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">What's Next?</h3>
                    <ol className="space-y-2 list-decimal pl-5">
                      <li>Review your booking details in your confirmation email</li>
                      <li>Check your dashboard for the latest updates on your booking</li>
                      <li>Prepare for your stay at Haven and we'll see you soon!</li>
                    </ol>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    <div className="rounded-full bg-red-100 p-4">
                      <svg 
                        className="h-12 w-12 text-red-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-medium">There was an issue with your booking</h2>
                    <p className="text-gray-600 mt-2">
                      {bookingReference 
                        ? `Your booking reference is: ${bookingReference}`
                        : 'No booking reference was generated.'
                      }
                    </p>
                    <p className="text-gray-600 mt-1">
                      Please try again or contact our support team for assistance.
                    </p>
                  </div>
                </>
              )}
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button asChild variant="outline">
                  <Link to="/">Return to Home</Link>
                </Button>
                
                {status === 'success' && (
                  <Button asChild>
                    <Link to="/dashboard">View in Dashboard</Link>
                  </Button>
                )}
                
                {status === 'failed' && (
                  <Button asChild>
                    <Link to="/stay">Try Again</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BookingConfirmationPage;
